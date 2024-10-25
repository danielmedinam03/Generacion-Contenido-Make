import React, { useState } from 'react';
import ContentForm from './components/ContentForm';
import PublishForm from './components/PublishForm';
import LoadingSpinner from './components/LoadingSpinner'; // Importar el nuevo componente

interface WebhookResponse {
  generatedContent: string;
  image: string;
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
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetchWithRetry('https://hook.us2.make.com/ddlsk4bgarw0xeha9wpor0pylc77orhx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Response from server:', result);

      try {
        const parsedResult: WebhookResponse = JSON.parse(result);
        setGeneratedContent({
          content: parsedResult.generatedContent,
          image: parsedResult.image
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

  const handlePublish = async (content: string, image: string | File) => {
    setIsLoading(true);
    setError(null);

    try {
      let formData = new FormData();
      formData.append('content', content);

      if (typeof image === 'string') {
        formData.append('image', image);
      } else {
        formData.append('image', image, image.name);
      }

      const response = await fetch('https://hook.us2.make.com/6snp8m9ht2ordlmr85i8atlm3pdp6wkx', {
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

  const handleImageChange = async (file: File) => {
    setIsLoading(true);
    setError(null);

    // Verifica si hay contenido generado antes de hacer la solicitud
    if (!generatedContent || !generatedContent.content) {
      setError("No hay contenido generado para enviar.");
      setIsLoading(false);
      return;
    }

    let formData = new FormData();
    formData.append('image', file);
    formData.append('name-file', file.name);

    // Envía el contenido generado en lugar del texto fijo
    formData.append('contenido', generatedContent.content);

    try {
      const response = await fetch('https://hook.eu2.make.com/7vsk8585ljuj1wud1xpibx3g6gbshtgd', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Image Change response:', result);
      setCustomImage(URL.createObjectURL(file)); // Muestra la nueva imagen subida
    } catch (err) {
      console.error('Image change error:', err);
      if (err instanceof Error) {
        setError(`Error al cambiar la imagen: ${err.message}`);
      } else {
        setError('Ocurrió un error desconocido al cambiar la imagen.');
      }
    } finally {
      setIsLoading(false);
    }
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
            <LoadingSpinner /> {/* Mostrar el loading spinner cuando esté cargando */}
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
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p>{generatedContent.content}</p>
            </div>
            <img
              src={customImage || generatedContent.image}
              alt="Generated or Uploaded Image"
              className="w-full mb-4"
            />
            <PublishForm
              initialContent={generatedContent.content}
              initialImage={customImage || generatedContent.image}
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