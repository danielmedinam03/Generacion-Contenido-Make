import React, { useState, useEffect } from 'react';
import ContentForm from './components/ContentForm';
import LoadingSpinner from './components/LoadingSpinner';
import AudioPlayer from './components/AudioPlayer';
import PublishForm from './components/PublishForm'; // Añadido para manejar la publicación del contenido
import { X, Upload, Send } from 'lucide-react';

interface WebhookResponse {
  generatedContent: string;
  image?: string;
  RSValue: string;
  type?: string;
  urlpodcast?: string;
}

interface ContentFormData {
  type: string;
  prompt: string;
  aspectRatio?: string;
  platforms: string[];
}

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

function App() {
  const [generatedContent, setGeneratedContent] = useState<WebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');

  useEffect(() => {
    if (generatedContent) {
      setEditableContent(generatedContent.generatedContent);
    }
  }, [generatedContent]);

  const resetState = () => {
    setGeneratedContent(null);
    setError(null);
    setCustomImage(null);
  };

  const handleSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    resetState();

    console.log('Submitting data to generate content:', data);

    try {
      const response = await fetchWithRetry('https://hook.eu2.make.com/blfvti9q0tzsljhnbglt1aimbaac1m8a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          aspectRatio: data.aspectRatio || '1:1',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Response from server:', result);

      try {
        const parsedResult: WebhookResponse = JSON.parse(result);
        console.log('Parsed result:', parsedResult);
        console.log('Resultado URL Podcast:', parsedResult.urlpodcast);

        let adjustedUrl = parsedResult.urlpodcast;
        if (adjustedUrl && adjustedUrl.includes('www.dropbox.com')) {
          adjustedUrl = adjustedUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
          adjustedUrl = adjustedUrl.replace('?dl=1', ''); // Eliminar el parámetro de descarga
        }

        setGeneratedContent({
          ...parsedResult,
          urlpodcast: adjustedUrl,
        });

      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setError(`Error parsing server response: ${result.slice(0, 100)}...`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? `An error occurred: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let formData = new FormData();

      if (!editableContent) {
        setError("No hay contenido generado para publicar.");
        setIsLoading(false);
        return;
      }

      formData.append('contenido', editableContent);

      if (customImage) {
        formData.append('image', customImage, customImage.name);
      } else {
        formData.append('url-image', generatedContent?.image || '');
      }

      formData.append('RS', generatedContent?.RSValue || '1');
      console.log('RSValue being sent:', generatedContent?.RSValue);

      const response = await fetch('https://hook.eu2.make.com/7vsk8585ljuj1wud1xpibx3g6gbshtgd', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Publish response:', result);
    } catch (err) {
      console.error('Publish error:', err);
      if (err instanceof Error) {
        setError(`Error al publicar: ${err.message}`);
      } else {
        setError('Ocurrió un error desconocido al publicar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File) => {
    setCustomImage(file);
  };

  const handleRemoveImage = () => {
    setCustomImage(null);
  };

  const handleEditableContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Generador de Contenido AI para Redes Sociales</h1>
        <ContentForm onSubmit={handleSubmit} />
        {isLoading && (
          <div className="mt-4 text-center">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-red-600">Error:</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <p>{error}</p>
            </div>
          </div>
        )}
        {generatedContent && (
          <div className="mt-6 space-y-4">
            {generatedContent.type === 'Podcast' && generatedContent.urlpodcast ? (
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  Escucha el Podcast
                </h3>
                <AudioPlayer
                  audioUrl={generatedContent.urlpodcast}
                  title="Podcast de MoraBanc"
                  description="Escucha el contenido financiero generado sobre las mejores opciones de MoraBanc."
                  isPodcast={true}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-2">Contenido Generado:</h2>
                <div className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-wrap">
                  {generatedContent.generatedContent}
                </div>
                <textarea
                  value={editableContent}
                  onChange={handleEditableContentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={6}
                />
                {generatedContent.image && (
                        <img
                          src={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
                          alt="Generated Content"
                          className="w-full mb-4"
                        />
                      )}
                <div className="mt-4 space-y-4">
                  {(customImage || generatedContent.image) && (
                    <div className="flex items-center space-x-4">
                      <img
                        src={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      <Upload size={20} />
                      <span>Cambiar imagen</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={handlePublish}
                className="w-full flex justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                Publicar Contenido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
