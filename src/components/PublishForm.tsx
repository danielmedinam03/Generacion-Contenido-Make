import React, { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface PublishFormProps {
  initialContent: string;
  initialImage: string;
  onPublish: (content: string, image: string | File) => void;
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
  const [image, setImage] = useState<string | File>(initialImage);

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
    setImage(initialImage);
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
      <div className="flex items-center space-x-4">
        <img
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
          alt="Preview"
          className="w-24 h-24 object-cover"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Cambiar imagen
          </label>
        </div>
        <button
          type="button"
          onClick={handleRemoveImage}
          className="bg-red-500 text-white p-2 rounded-md"
        >
          <X size={20} />
        </button>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 bg-black text-white rounded-md"
      >
        <Send className="w-5 h-5 mr-2" />
        Publicar Contenido
      </button>
    </form>
  );
};

export default PublishForm;
