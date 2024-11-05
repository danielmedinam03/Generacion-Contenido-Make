import React from 'react';

interface PodcastPlayerProps {
    audioUrl: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ audioUrl }) => {
    // Cambiar la URL de Google Drive para hacerla reproducible
    const directAudioUrl = audioUrl.replace("/view?usp=drivesdk", "/preview");

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Escuchar Podcast:</h3>
            <audio controls className="w-full">
                <source src={directAudioUrl} type="audio/mpeg" />
                Tu navegador no soporta el reproductor de audio.
            </audio>
        </div>
    );
};

export default PodcastPlayer;