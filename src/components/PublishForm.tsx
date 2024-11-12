import React, { useState, useEffect } from 'react';
import { Send, X, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PublishFormProps {
  initialContent: string;
  initialImage: string | File | null;
  onPublish: (content: string, image: string | File | null) => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
}

const PublishForm: React.FC<PublishFormProps> = ({
  initialContent,
  initialImage,
  onPublish,
  onImageUpload,
  onRemoveImage
}) => {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<string | File | null>(initialImage);

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(content, image);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onRemoveImage();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
        rows={6}
      />
      
      {/* Sección de imagen */}
      <div className="space-y-4">
        {/* Vista previa de la imagen y botón de eliminar */}
        {image && (
          <div className="flex flex-col space-y-4">
            {/* Imagen más grande para mejor previsualización */}
            <div className="relative w-full max-w-2xl mx-auto">
              <img
                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[500px]"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-md"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Botón para subir/cambiar imagen - siempre visible */}
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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

      {/* Botón de publicar */}
      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md"
      >
        <Send className="w-5 h-5 mr-2" />
        Publicar Contenido
      </button>
    </form>
  );
};

export default PublishForm;
