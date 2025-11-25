
import React from 'react';
import type { Door as DoorType } from '../types';

export const Door: React.FC<Omit<DoorType, 'scenarioId'>> = ({ x, y, isFinal }) => {
    
    if (isFinal) {
        return (
            <div style={{ left: x, top: y, width: 160, height: 240 }} className="absolute">
                <style>
                    {`
                    @keyframes glow {
                        0%, 100% { filter: drop-shadow(0 0 3px #60a5fa); }
                        50% { filter: drop-shadow(0 0 8px #60a5fa); }
                    }
                    .final-door-glow {
                        animation: glow 3s infinite ease-in-out;
                    }
                    `}
                </style>
                <svg width="160" height="240" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FDE68A" />
                            <stop offset="50%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="blueGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#1e3a8a" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>

                    {/* Main Frame */}
                    <path d="M10 235 V30 C10 15 20 5 35 5 H125 C140 5 150 15 150 30 V235 H10 Z" fill="url(#goldGradient)" stroke="#422006" strokeWidth="3" />
                    <rect x="15" y="30" width="130" height="200" fill="#a16207" />
                    
                    {/* Ornate Top */}
                    <path d="M35,5 C20,5 10,15 10,30 V 40 H 150 V 30 C150,15 140,5 125,5 H 35" fill="url(#goldGradient)" />
                    <path d="M40,28 C40,15 50,8 65,8 H95 C110,8 120,15 120,28 V35 H40 V28Z" fill="#854d0e" />
                    <path d="M60 20 C 60 12 70 8 80 8 C 90 8 100 12 100 20 V25 H60 V20Z" fill="url(#goldGradient)" />
                    <circle cx="80" cy="18" r="7" fill="#3b82f6" stroke="#fde68a" strokeWidth="2" />

                    {/* Left Door Panel */}
                    <rect x="20" y="35" width="58" height="190" fill="#ca8a04" stroke="#422006" strokeWidth="1" />
                    <rect x="25" y="45" width="48" height="170" fill="url(#blueGradient)" />
                    <path d="M35 120 C 45 100, 45 70, 35 50 M 60 120 C 50 100, 50 70, 60 50 M 35 125 L 60 125 M 35 205 C 45 185, 45 155, 35 135 M 60 205 C 50 185, 50 155, 60 135" stroke="#60a5fa" strokeWidth="2" fill="none" className="final-door-glow" />

                    {/* Right Door Panel */}
                    <rect x="82" y="35" width="58" height="190" fill="#ca8a04" stroke="#422006" strokeWidth="1" />
                    <rect x="87" y="45" width="48" height="170" fill="url(#blueGradient)" />
                    <path d="M125 120 C 115 100, 115 70, 125 50 M 100 120 C 110 100, 110 70, 100 50 M 125 125 L 100 125 M 125 205 C 115 185, 115 155, 125 135 M 100 205 C 110 185, 110 155, 100 135" stroke="#60a5fa" strokeWidth="2" fill="none" className="final-door-glow" />
                    
                    {/* Side Ornaments */}
                    <path d="M10 50 C 5 55, 5 65, 10 70 V 50 Z M150 50 C 155 55, 155 65, 150 70 V 50 Z" fill="#3b82f6" stroke="#fde68a" strokeWidth="1" />
                    <path d="M10 100 C 0 105, 0 115, 10 120 V 100 Z M150 100 C 160 105, 160 115, 150 120 V 100 Z" fill="url(#goldGradient)" stroke="#422006" strokeWidth="1" />
                    <path d="M10 180 C 5 185, 5 195, 10 200 V 180 Z M150 180 C 155 185, 155 195, 150 200 V 180 Z" fill="#3b82f6" stroke="#fde68a" strokeWidth="1" />
                </svg>
            </div>
        )
    }

    return (
        <div style={{ left: x, top: y }} className="absolute w-[80px] h-[120px]">
            {/* Door Frame */}
            <div className="relative w-full h-full bg-[#A68A64] p-2">
                 {/* Door Panel */}
                <div className="w-full h-full bg-[#D4BFA4] flex flex-col items-center p-1">
                    {/* Window */}
                    <div className="w-[80%] h-[40px] bg-blue-200/50 mt-2 border-2 border-gray-500"></div>
                    {/* Handle */}
                    <div className="absolute top-[55px] right-[12px] w-[6px] h-[20px] bg-gray-400 border border-gray-600"></div>
                </div>
            </div>
        </div>
    );
};
