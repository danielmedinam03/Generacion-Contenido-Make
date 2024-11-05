import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Reset error state when URL changes
        setError(null);
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing audio:', error);
                        setError('No se pudo reproducir el audio. Verifica la URL o tu conexión.');
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleError = () => {
        setError('Error al cargar el audio. Verifica la URL o tu conexión.');
        setIsPlaying(false);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onError={handleError}
                className="hidden"
            />
            <div className="flex items-center space-x-4">
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

            {error && (
                <div className="mt-2 text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;