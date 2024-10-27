import React, { useState } from 'react';
import ContentForm from './components/ContentForm';
import PublishForm from './components/PublishForm';
import LoadingSpinner from './components/LoadingSpinner'; // Importar el nuevo componente
import ReactMarkdown from 'react-markdown'; // Agregar este import al inicio

interface WebhookResponse {
  generatedContent: string;  // Cambiar de 'content' a 'generatedContent'
  image: string;
  RSValue: string;
}

// Función para intentar realizar la solicitud con reintentos
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
  const [customImage, setCustomImage] = useState<File | null>(null); // Imagen personalizada subida

  // Función para restablecer el estado y limpiar la caché
  const resetState = () => {
    setGeneratedContent(null);  // Limpiar contenido generado
    setCustomImage(null);       // Limpiar imagen personalizada
    setError(null);             // Limpiar cualquier mensaje de error
  };

  // Función para manejar la generación de contenido
  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    resetState();  // Limpiar todo al generar nuevo contenido

    console.log('Submitting data to generate content:', data); // Verifica recepción de datos en App

    try {
      // Aquí imprimimos el valor que recibimos del formulario
      console.log('RSValue recibido del formulario:', data.RSValue);

      const response = await fetchWithRetry('https://hook.eu2.make.com/adb51s8yo1ir4e5y1bnue37uyg3duyoo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          RS: data.RSValue, // Usamos directamente RSValue como RS
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
          content: parsedResult.generatedContent, // Usar generatedContent en lugar de content
          image: parsedResult.image,
          RSValue: data.RSValue
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

  // Publicación de contenido generado automatizado
  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let formData = new FormData();

      // Verificar si hay contenido generado antes de hacer la solicitud
      if (!generatedContent || !generatedContent.content) {
        setError("No hay contenido generado para publicar.");
        setIsLoading(false);
        return;
      }

      // Agregar el contenido generado automáticamente
      formData.append('contenido', generatedContent.content);

      // Agregar la URL de la imagen generada o la imagen personalizada seleccionada
      if (customImage) {
        formData.append('image', customImage, customImage.name); // Si hay una imagen personalizada, envíala
      } else {
        formData.append('url-image', generatedContent.image); // Si no hay imagen personalizada, usa la generada automáticamente
      }

      // Agregar el nuevo parámetro "RS" al formData
      formData.append('RS', generatedContent.RSValue || '1'); // Usar el valor numérico de la red social
      console.log('Publishing data with RS:', generatedContent.RSValue); // Verifica valor de RS al publicar

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

  // Función para manejar la subida de imagen personalizada sin enviar automáticamente la publicación
  const handleImageChange = (file: File) => {
    setCustomImage(file); // Guardar la imagen personalizada en el estado para usarla luego en la publicación
  };

  // Función para limpiar la imagen personalizada
  const handleRemoveImage = () => {
    setCustomImage(null); // Limpiar la imagen personalizada
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
            <div className="bg-gray-100 p-4 rounded-md mb-4 whitespace-pre-wrap">
              <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
            </div>
            <img
              src={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
              alt="Generated or Uploaded Image"
              className="w-full mb-4"
            />
            <PublishForm
              initialContent={generatedContent.content}
              initialImage={customImage ? URL.createObjectURL(customImage) : generatedContent.image}
              onPublish={handlePublish}  // Publicación cuando se presiona el botón
              onImageUpload={handleImageChange}  // Guardar la imagen sin enviar automáticamente
              onRemoveImage={handleRemoveImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
