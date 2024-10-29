import React, { useState } from 'react';
import { Send, FileText, Image, Video, Mic, FileEdit, Facebook, Instagram, Twitter, Linkedin, Music, Plus, X } from 'lucide-react';

interface FormData {
  urls: string[];
  prompt: string;
  contentType: string;
  platforms: string[];
  aiLevel: number;
  generateHashtags: boolean;
}

interface ContentFormProps {
  onSubmit: (data: FormData) => void;
}

const contentTypes = [
  { name: 'Post', icon: FileText },
  { name: 'Imagen', icon: Image },
  { name: 'Video', icon: Video },
  { name: 'Podcast', icon: Mic },
  { name: 'Artículo', icon: FileEdit },
];

const socialPlatforms = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'Twitter', icon: Twitter },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'TikTok', icon: Music },
];

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit }) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlList, setUrlList] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    urls: [],
    prompt: '',
    contentType: 'Post',
    platforms: [],
    aiLevel: 0.5,
    generateHashtags: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const addUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      try {
        new URL(urlInput); // Validar que sea una URL válida
        const newUrl = urlInput.trim();
        setUrlList(prev => [...prev, newUrl]);
        setFormData(prev => ({
          ...prev,
          urls: [...prev.urls, newUrl]
        }));
        setUrlInput('');
      } catch {
        alert('Por favor, ingresa una URL válida');
      }
    }
  };

  const removeUrl = (indexToRemove: number) => {
    setUrlList(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleContentTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, contentType: type }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleAILevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, aiLevel: parseFloat(e.target.value) }));
  };

  const handleHashtagToggle = () => {
    setFormData(prev => ({ ...prev, generateHashtags: !prev.generateHashtags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">URLs de referencia</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="https://ejemplo.com"
          />
          <button
            type="button"
            onClick={addUrl}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {urlList.length > 0 && (
          <div className="mt-2 space-y-2">
            {urlList.map((url, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                <span className="flex-1 text-sm truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Tu idea o Prompt</label>
        <textarea
          id="prompt"
          name="prompt"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ingresa tu idea de contenido o prompt aquí..."
          value={formData.prompt}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contenido</label>
        <div className="flex space-x-2">
          {contentTypes.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              className={`flex flex-col items-center p-2 rounded-md ${formData.contentType === name ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() => handleContentTypeChange(name)}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parámetros de Contenido</label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Plataformas</label>
            <div className="flex space-x-2">
              {socialPlatforms.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className={`flex items-center p-2 rounded-md ${formData.platforms.includes(name) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  onClick={() => handlePlatformToggle(name)}
                >
                  <Icon className="w-5 h-5 mr-1" />
                  <span className="text-xs">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Nivel de Creatividad AI</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.aiLevel}
              onChange={handleAILevelChange}
              className="w-full appearance-none h-2 bg-gray-200 rounded-full"
              style={{
                background: `linear-gradient(to right, black 0%, black ${formData.aiLevel * 100}%, #e5e7eb ${formData.aiLevel * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Conservador</span>
              <span>Balanceado</span>
              <span>Creativo</span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="generateHashtags"
              checked={formData.generateHashtags}
              onChange={handleHashtagToggle}
              className="mr-2 appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200"
            />
            <label htmlFor="generateHashtags" className="text-sm text-gray-700">Generar hashtags relevantes</label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 bg-black text-white rounded-md"
      >
        <Send className="w-5 h-5 mr-2" />
        Generar Contenido
      </button>
    </form>
  );
};

export default ContentForm;