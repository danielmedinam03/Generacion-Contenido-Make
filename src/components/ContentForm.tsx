import React, { useState } from 'react';
import { Send, FileText, Image, Video, Mic, FileEdit, Facebook, Instagram, Twitter, Linkedin, Music } from 'lucide-react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

interface FormData {
  urls: string;
  prompt: string;
  contentType: string;
  platforms: string[];
  aiLevel: number;
  generateHashtags: boolean;
  referenceFile: File | null;
  aspectRatio?: string;
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

const aspectRatios = [
  { 
    id: '1:1', 
    label: 'Cuadrado (1:1)', 
    dimensions: '1080x1080',
    description: 'Ideal para posts de Instagram y redes sociales'
  },
  { 
    id: '16:9', 
    label: 'Panorámico (16:9)', 
    dimensions: '1920x1080',
    description: 'Estándar para videos y presentaciones HD'
  },
  { 
    id: '21:9', 
    label: 'Ultra-Wide (21:9)', 
    dimensions: '2560x1080',
    description: 'Formato cinematográfico y monitores ultrawide'
  },
  { 
    id: '3:2', 
    label: 'Fotografía (3:2)', 
    dimensions: '1620x1080',
    description: 'Estándar fotográfico profesional'
  },
  { 
    id: '2:3', 
    label: 'Retrato (2:3)', 
    dimensions: '1080x1620',
    description: 'Formato vertical para fotografía'
  },
  { 
    id: '4:5', 
    label: 'Instagram Vertical (4:5)', 
    dimensions: '1080x1350',
    description: 'Ideal para posts verticales de Instagram'
  },
  { 
    id: '5:4', 
    label: 'Clásico (5:4)', 
    dimensions: '1350x1080',
    description: 'Formato tradicional de impresión'
  },
  { 
    id: '3:4', 
    label: 'Vertical (3:4)', 
    dimensions: '1080x1440',
    description: 'Ideal para dispositivos móviles'
  },
  { 
    id: '4:3', 
    label: 'TV Clásica (4:3)', 
    dimensions: '1440x1080',
    description: 'Formato tradicional de televisión'
  },
  { 
    id: '9:16', 
    label: 'Stories/Reels (9:16)', 
    dimensions: '1080x1920',
    description: 'Para Stories, Reels y TikTok'
  },
  { 
    id: '9:21', 
    label: 'Ultra Vertical (9:21)', 
    dimensions: '1080x2520',
    description: 'Formato vertical extendido'
  }
];

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    urls: '',
    prompt: '',
    contentType: 'Post',
    platforms: [],
    aiLevel: 0.5,
    generateHashtags: false,
    referenceFile: null,
    aspectRatio: '1:1',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, referenceFile: file }));
  };

  const handleAspectRatioChange = (ratio: string) => {
    setFormData(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              className={`flex flex-col items-center p-2 rounded-md ${
                formData.contentType === name ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
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
                  className={`flex items-center p-2 rounded-md ${
                    formData.platforms.includes(name) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handlePlatformToggle(name)}
                >
                  <Icon className="w-5 h-5 mr-1" />
                  <span className="text-xs">{name}</span>
                </button>
              ))}
            </div>
          </div>
          {(formData.contentType === 'Imagen' || formData.contentType === 'Post') && (
        <div className="mb-4">
          <Listbox value={formData.aspectRatio} onChange={handleAspectRatioChange}>
            <div className="relative mt-1">
              <Listbox.Label className="block text-gray-700 text-sm font-bold mb-2">
                Formato de imagen
              </Listbox.Label>
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300">
                <span className="block truncate text-sm">
                  {aspectRatios.find(ratio => ratio.id === formData.aspectRatio)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {aspectRatios.map((ratio) => (
                    <Listbox.Option
                      key={ratio.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                          active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                        }`
                      }
                      value={ratio.id}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex flex-col">
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {ratio.label}
                            </span>
                            <span className="block truncate text-xs text-gray-500">
                              {ratio.dimensions} - {ratio.description}
                            </span>
                          </div>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      )}
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
