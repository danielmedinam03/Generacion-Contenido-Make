import React, { useState } from 'react';
import ContentForm from './components/ContentForm';
import PublishForm from './components/PublishForm';

interface WebhookResponse {
  image: string;
  content: string;
}

function App() {
  const [generatedContent, setGeneratedContent] = useState<WebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('Form data submitted:', data);
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetchWithRetry('https://hook.us2.make.com/i7ufohn9sulsfhle5eskjjrdxv91s5o9', {
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
        setGeneratedContent(parsedResult);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setError('Error parsing server response');
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

  const handlePublish = async (content: string, image: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://hook.us2.make.com/ddlsk4bgarw0xeha9wpor0pylc77orhx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, image }),
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Generador de Contenido AI para Redes Sociales</h1>
        <ContentForm onSubmit={handleSubmit} />
        {isLoading && <p className="mt-4 text-center">Cargando...</p>}
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
            <PublishForm 
              initialContent={generatedContent.content} 
              initialImage={generatedContent.image}
              onPublish={handlePublish} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
