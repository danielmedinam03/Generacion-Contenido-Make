import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Mic, AudioWaveform } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
    title?: string;
    description?: string;
    isPodcast?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
    audioUrl,
    title = "Audio",
    description,
    isPodcast = false
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Reset error state when URL changes
        setError(null);
        console.log('URL del audio cargado:', audioUrl);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load(); // Reset audio element when URL changes
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Reproducción iniciada con éxito.');
                            setIsPlaying(true);
                        })
                        .catch(error => {
                            console.error('Error al intentar reproducir el audio:', error);
                            setError('No se pudo reproducir el audio. Verifica la URL o tu conexión.');
                        });
                }
            }
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleError = () => {
        console.error('Error al cargar el audio.');
        setError('Error al cargar el audio. Verifica la URL o tu conexión.');
        setIsPlaying(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 my-4">
            <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-full ${isPodcast ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-black'}`}>
                    {isPodcast ? <Mic className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{title}</h3>
                    {description && <p className="text-gray-600 text-sm">{description}</p>}
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={togglePlay}
                            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                            disabled={!!error}
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                            disabled={!!error}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onError={handleError}
                    className="w-full"
                    controls
                />

                {error && (
                    <div className="mt-4 text-red-600 text-sm flex items-center bg-red-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioPlayer;
