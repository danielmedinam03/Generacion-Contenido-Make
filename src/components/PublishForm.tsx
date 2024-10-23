import React, { useState } from 'react';

interface PublishFormProps {
  initialContent: string;
  initialImage: string;
  onPublish: (content: string, image: string) => Promise<void>;
}

const PublishForm: React.FC<PublishFormProps> = ({ initialContent, initialImage, onPublish }) => {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onPublish(content, image);
      alert('Contenido publicado con éxito!');
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar el contenido. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Contenido generado
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edita el contenido generado aquí..."
        />
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Imagen
        </label>
        {image && (
          <img src={image} alt="Preview" className="mb-2 max-w-full h-auto" />
        )}
        <input
          type="text"
          id="image"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="URL de la imagen"
        />
      </div>
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
};

export default PublishForm;
