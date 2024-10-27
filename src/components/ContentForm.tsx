import React, { useState } from 'react';
import { Send, FileText, Image, Video, Mic, FileEdit, Facebook, Instagram, Twitter, Linkedin, Music } from 'lucide-react';

interface FormData {
  urls: string;
  prompt: string;
  contentType: string;
  aiLevel: number;
  generateHashtags: boolean;
  referenceFile: File | null;
}

interface ContentFormProps {
  onSubmit: (data: FormData & { RS: string, RSValue: string }) => void; // Asegura que onSubmit reciba también "RS" y "RSValue"
}

const contentTypes = [
  { name: 'Post', icon: FileText },
  { name: 'Imagen', icon: Image },
  { name: 'Video', icon: Video },
  { name: 'Podcast', icon: Mic },
  { name: 'Artículo', icon: FileEdit },
];

const socialPlatforms = [
  { name: 'LinkedIn', icon: Linkedin, value: '1' },
  { name: 'Facebook', icon: Facebook, value: '2' },
  { name: 'Instagram', icon: Instagram, value: '3' },
  { name: 'Twitter', icon: Twitter, value: '4' },
  { name: 'TikTok', icon: Music, value: '5' },
];

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    urls: '',
    prompt: '',
    contentType: 'Post',
    aiLevel: 0.5,
    generateHashtags: false,
    referenceFile: null,
  });
  const [selectedPlatform, setSelectedPlatform] = useState<{ name: string, value: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, contentType: type }));
  };

  const handlePlatformSelect = (platform: string, value: string) => {
    console.log('Platform selected:', platform, 'Value:', value); // Verifica selección de plataforma
    setSelectedPlatform({ name: platform, value: value });
  };


  const handleAILevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, aiLevel: parseFloat(e.target.value) }));
  };

  const handleHashtagToggle = () => {
    setFormData(prev => ({ ...prev, generateHashtags: !prev.generateHashtags }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, referenceFile: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with platform:', selectedPlatform); // Verifica envío de datos
    onSubmit({
      ...formData,
      RS: selectedPlatform?.name || '',
      RSValue: selectedPlatform?.value || ''
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-1">URLs de referencia</label>
        <input
          type="text"
          id="urls"
          name="urls"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ingresa una o más URLs separadas por comas"
          value={formData.urls}
          onChange={handleInputChange}
        />
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
        ></textarea>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Plataformas</label>
        <div className="flex space-x-2">
          {socialPlatforms.map(({ name, icon: Icon, value }) => (
            <button
              key={name}
              type="button"
              className={`flex items-center p-2 rounded-md ${selectedPlatform?.name === name ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() => handlePlatformSelect(name, value)}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Referencia Adicional (Opcional)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center items-center py-2 px-4 bg-black text-white rounded-md"
        >
          <Send className="w-5 h-5 mr-2" />
          Generar Contenido
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
