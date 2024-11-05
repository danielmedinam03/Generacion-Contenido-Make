import React, { useState } from 'react';
import ContentForm from './components/ContentForm';
import PublishForm from './components/PublishForm';
import LoadingSpinner from './components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import PodcastPlayer from './components/PodcastPlayer';
import AudioPlayer from './components/AudioPlayer';
import { Mic } from 'lucide-react';

interface WebhookResponse {
  generatedContent: string;
  image?: string;
  RSValue: string;
  type?: string; // Añadir tipo para identificar si es un Podcast
  urlpodcast?: string; // Añadir urlpodcast para el caso del podcast
}

interface ContentFormData {
  type: string;
  prompt: string;
  aspectRatio?: string;
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

interface FormData {
  urls: string;
  prompt: string;
  contentType: string;
  aiLevel: number;
  generateHashtags: boolean;
  referenceFile: File | null;
  RS: string;
  RSValue: string;
}

function App() {
  const [generatedContent, setGeneratedContent] = useState<WebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customImage, setCustomImage] = useState<File | null>(null);

  const resetState = () => {
    setGeneratedContent(null);
    setCustomImage(null);
    setError(null);
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
        setGeneratedContent({
          generatedContent: parsedResult.generatedContent,
          image: parsedResult.image,
          RSValue: data.RSValue,
          type: data.type,
          urlpodcast: parsedResult.urlpodcast, // Agregar urlpodcast si existe
        });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Raw response:', result);
        setError(`Error parsing server response: ${result.slice(0, 100)}...`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let formData = new FormData();

      if (!generatedContent || !generatedContent.generatedContent) {
        setError("No hay contenido generado para publicar.");
        setIsLoading(false);
        return;
      }

      formData.append('contenido', generatedContent.generatedContent);

      if (customImage) {
        formData.append('image', customImage, customImage.name);
      } else {
        formData.append('url-image', generatedContent.image);
      }

      formData.append('RS', generatedContent.RSValue || '1');
      console.log('Publishing data with RS:', generatedContent.RSValue);

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
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Contenido Generado:</h2>
            <div className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-wrap">
              <ReactMarkdown>{generatedContent.generatedContent}</ReactMarkdown>
            </div>
            {generatedContent.type === 'Podcast' && generatedContent.urlpodcast && (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Audio del Podcast
                  </h3>
                  <AudioPlayer audioUrl={generatedContent.urlpodcast} />
                </div>
              </div>
            )}
            {generatedContent.type !== 'Podcast' && (
              <img
                src={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
                alt="Generated or Uploaded Image"
                className="w-full mb-4"
              />
            )}
            <PublishForm
              initialContent={generatedContent.generatedContent}
              initialImage={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
              onPublish={handlePublish}
              onImageUpload={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
