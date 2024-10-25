import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-gray-100 z-50">
            <div className="w-16 h-16 rounded-full border-8 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-blue-500 border-l-purple-600 animate-spin"
                style={{
                    borderTopColor: 'transparent', // Parte transparente del aro
                    borderRightColor: '#3b82f6', // Azul para el lado derecho
                    borderLeftColor: '#9333ea', // Morado para el lado izquierdo
                }}>
            </div>
        </div>
    );
};



export default LoadingSpinner;
