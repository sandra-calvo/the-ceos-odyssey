
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './components/Player';
import { Platform } from './components/Platform';
import { Door } from './components/Door';
import { DecisionModal } from './components/DecisionModal';
import { getDecisionOutcome } from './services/geminiService';
import { LEVELS, KEY_TAKEAWAYS, GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, GRAVITY, JUMP_STRENGTH, INITIAL_BOARD_TRUST } from './constants';
import type { PlayerState, Scenario, Door as DoorType, Level, Option, CharacterType } from './types';

// Reliable retro game music URL to fix "no supported sources" error
const MUSIC_URL = "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"; 

const StartScreenImage: React.FC = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto my-4">
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
        </defs>

        {/* Background Window */}
        <rect x="50" y="20" width="300" height="180" fill="url(#skyGradient)" stroke="#334155" strokeWidth="4" />
        {/* Cityscape */}
        <rect x="80" y="100" width="30" height="100" fill="#94a3b8" />
        <rect x="120" y="80" width="40" height="120" fill="#cbd5e1" />
        <rect x="220" y="110" width="35" height="90" fill="#94a3b8" />
        <rect x="260" y="60" width="40" height="140" fill="#cbd5e1" />
        {/* Clouds */}
        <ellipse cx="100" cy="50" rx="30" ry="10" fill="white" opacity="0.8" />
        <ellipse cx="280" cy="40" rx="40" ry="12" fill="white" opacity="0.8" />

        {/* Floor */}
        <rect x="0" y="200" width="400" height="100" fill="#1e293b" />
        
        {/* Chair Back */}
        <rect x="170" y="100" width="60" height="100" rx="5" fill="#111827" stroke="#000" strokeWidth="2" />

        {/* CEO Female Figure */}
        {/* Hair */}
        <path d="M185 90 C 185 80, 215 80, 215 90 V 120 H 185 V 90" fill="#2d1b0e" /> 
        <rect x="180" y="90" width="40" height="35" rx="10" fill="#2d1b0e" />
        {/* Face */}
        <rect x="190" y="95" width="20" height="25" fill="#f2d3ab" />
        {/* Suit Body */}
        <path d="M175 130 Q 200 130 225 130 L 230 190 H 170 Z" fill="#374151" />
        {/* White Shirt V */}
        <path d="M195 130 L 200 145 L 205 130 Z" fill="white" />
        
        {/* The Desk */}
        <path d="M40 190 L 360 190 L 340 280 L 60 280 Z" fill="url(#deskGradient)" stroke="#271c19" strokeWidth="2" />
        
        {/* Laptop/Monitor on desk */}
        <rect x="250" y="170" width="60" height="40" fill="#334155" stroke="#000" strokeWidth="2" />
        <rect x="270" y="210" width="20" height="10" fill="#1e293b" />
        <path d="M260 220 L 300 220 L 310 230 L 250 230 Z" fill="#94a3b8" /> {/* Keyboard area */}

        {/* Nameplate */}
        <rect x="80" y="210" width="60" height="20" fill="#fcd34d" stroke="#b45309" />
        <rect x="75" y="230" width="70" height="5" fill="#78350f" />
        <text x="110" y="224" fontSize="8" textAnchor="middle" fill="#78350f" fontFamily="monospace" fontWeight="bold">CEO</text>

    </svg>
);

const CharacterSelectionScreen: React.FC<{ 
    onSelect: (char: CharacterType) => void, 
    selected: CharacterType, 
    onConfirm: () => void 
}> = ({ onSelect, selected, onConfirm }) => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#202020] text-black font-['Press_Start_2P'] p-8">
            <div className="w-full max-w-[1200px] h-[650px] border-4 border-black flex flex-row bg-[#e6e6e6] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.5)] relative">
                
                {/* Header Tape */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 border-2 border-black px-4 py-2 transform -rotate-1 z-10 shadow-md">
                   <h2 className="text-xl md:text-2xl text-black">THE CEO'S ODYSSEY</h2>
                </div>

                {/* --- LEFT COL: Character Selection --- */}
                <div className="w-1/4 flex flex-col items-center justify-center border-r-4 border-black p-4 space-y-6 bg-[#d4d4d4]">
                    <h3 className="text-xs md:text-sm mb-2 text-center underline decoration-2 underline-offset-4">SELECT CEO</h3>
                    
                    {/* Pedro Option */}
                    <div 
                        onClick={() => onSelect('pedro')}
                        className={`group cursor-pointer relative p-4 border-4 transition-all duration-200 ${selected === 'pedro' ? 'border-blue-600 bg-white scale-105 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]' : 'border-gray-500 bg-gray-200 hover:bg-gray-100 hover:border-gray-600'}`}
                    >
                        <div className="w-[80px] h-[100px] flex items-center justify-center relative overflow-hidden">
                             {/* Large Portrait Pedro */}
                             <svg width="60" height="80" viewBox="0 0 60 80">
                                <rect x="10" y="10" width="40" height="40" fill="#f5d0a9" stroke="black" strokeWidth="2" /> {/* Head */}
                                <rect x="15" y="25" width="12" height="8" fill="black" opacity="0.8" /> {/* Glasses L */}
                                <rect x="33" y="25" width="12" height="8" fill="black" opacity="0.8" /> {/* Glasses R */}
                                <line x1="27" y1="29" x2="33" y2="29" stroke="black" strokeWidth="2" /> {/* Bridge */}
                                <rect x="10" y="50" width="40" height="30" fill="#333" stroke="black" strokeWidth="2" /> {/* Body */}
                                <path d="M 30 50 L 35 65 L 25 65 Z" fill="#c0392b" /> {/* Tie */}
                                <line x1="10" y1="20" x2="6" y2="25" stroke="black" strokeWidth="2" /> {/* Ear L */}
                                <line x1="50" y1="20" x2="54" y2="25" stroke="black" strokeWidth="2" /> {/* Ear R */}
                             </svg>
                        </div>
                        <p className="text-center mt-2 text-[10px] md:text-xs font-bold">PEDRO</p>
                        {selected === 'pedro' && <div className="absolute -right-2 -top-2 w-4 h-4 bg-blue-600 border-2 border-white animate-bounce" />}
                    </div>

                    {/* Sandra Option */}
                    <div 
                        onClick={() => onSelect('sandra')}
                        className={`group cursor-pointer relative p-4 border-4 transition-all duration-200 ${selected === 'sandra' ? 'border-blue-600 bg-white scale-105 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]' : 'border-gray-500 bg-gray-200 hover:bg-gray-100 hover:border-gray-600'}`}
                    >
                        <div className="w-[80px] h-[100px] flex items-center justify-center relative overflow-hidden">
                            {/* Large Portrait Sandra */}
                            <svg width="60" height="80" viewBox="0 0 60 80">
                                <path d="M 5 10 H 55 V 60 H 50 V 20 H 10 V 60 H 5 Z" fill="#5D4037" stroke="black" strokeWidth="1" /> {/* Hair Back */}
                                <rect x="10" y="15" width="40" height="40" fill="#f5d0a9" stroke="black" strokeWidth="2" /> {/* Face */}
                                <rect x="15" y="30" width="12" height="8" fill="black" opacity="0.8" /> {/* Glasses L */}
                                <rect x="33" y="30" width="12" height="8" fill="black" opacity="0.8" /> {/* Glasses R */}
                                <line x1="27" y1="34" x2="33" y2="34" stroke="black" strokeWidth="2" /> {/* Bridge */}
                                <rect x="10" y="55" width="40" height="25" fill="#333" stroke="black" strokeWidth="2" /> {/* Body */}
                                <path d="M 30 55 L 35 70 L 25 70 Z" fill="#c0392b" /> {/* Tie/Necklace */}
                            </svg>
                        </div>
                        <p className="text-center mt-2 text-[10px] md:text-xs font-bold">SANDRA</p>
                        {selected === 'sandra' && <div className="absolute -right-2 -top-2 w-4 h-4 bg-blue-600 border-2 border-white animate-bounce" />}
                    </div>
                </div>

                {/* --- CENTER COL: Agreement --- */}
                <div className="flex-1 p-8 bg-[#fdfbf7] flex flex-col relative overflow-hidden">
                     {/* Paper Texture Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}}></div>
                    
                    <div className="border-4 border-black p-6 w-full h-full bg-white shadow-lg flex flex-col relative">
                        {/* Stamp */}
                        <div className="absolute top-20 right-8 border-4 border-red-700 p-2 transform -rotate-12 opacity-70 pointer-events-none mix-blend-multiply" style={{ borderStyle: 'double', borderWidth: '6px' }}>
                             <p className="text-red-700 text-center font-black text-xs md:text-sm tracking-widest uppercase leading-tight font-sans">
                                CONFIDENTIAL<br/>
                                <span className="text-lg md:text-xl block mt-1">TOP SECRET</span>
                            </p>
                        </div>

                        <h3 className="text-center text-lg md:text-xl font-bold mb-6 font-serif border-b-2 border-black pb-2">EMPLOYMENT AGREEMENT</h3>
                        
                        <div className="flex-1 space-y-4 text-[10px] md:text-xs leading-5 md:leading-6 text-gray-800 font-mono">
                            <div className="flex justify-between">
                                <span><strong>DATE:</strong> TODAY</span>
                                <span><strong>REF:</strong> #CEO-001</span>
                            </div>
                            <p><strong>PARTIES:</strong></p>
                            <p>1. The Board of Directors ("Overlords")</p>
                            <p>2. {selected === 'pedro' ? 'Pedro' : 'Sandra'} ("The Talent")</p>
                            
                            <div className="my-2 border-t border-dashed border-gray-400"></div>

                            <div className="space-y-3">
                                <p className="font-bold">The seat is yours. For now.</p>
                                <p>You are taking over a company at a crossroads. We expect results, and we expect them fast.</p>
                                <p>Navigate the daily crises of corporate life. You will be presented with difficult scenarios. Choose wisely. Your choices will ripple through the company.</p>
                                <p className="font-bold text-red-800">If you lose the Board's support, your odyssey ends here.</p>
                                <p className="italic mt-2">Do you accept the challenge?</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 flex flex-col items-center justify-end bg-gray-50 border-t-2 border-black">
                            <p className="text-[10px] mb-2 text-gray-500 font-sans uppercase tracking-widest">Digital Signature Required</p>
                            <button 
                                onClick={onConfirm}
                                className="group relative bg-yellow-400 text-black border-4 border-black px-8 py-4 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all hover:bg-yellow-300"
                            >
                                <span className="absolute -left-2 -top-2 text-red-600 text-xl opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                                [ SIGN HERE ]
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COL: Building --- */}
                <div className="w-1/4 border-l-4 border-black bg-gradient-to-b from-blue-300 to-blue-500 relative overflow-hidden flex flex-col justify-end">
                    
                    {/* Clouds */}
                    <div className="absolute top-10 left-4 w-12 h-6 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-20 right-8 w-16 h-8 bg-white rounded-full opacity-80"></div>

                    {/* The Building SVG */}
                    <svg width="100%" height="80%" viewBox="0 0 100 200" preserveAspectRatio="none">
                        {/* Main Tower */}
                        <rect x="15" y="20" width="70" height="180" fill="#475569" stroke="black" strokeWidth="2" />
                        
                        {/* Top Antenna */}
                        <line x1="50" y1="20" x2="50" y2="0" stroke="black" strokeWidth="2" />
                        <circle cx="50" cy="0" r="2" fill="red" className="animate-pulse" />

                        {/* Windows Grid - Retro Style */}
                        {/* Row 1 - Triangles */}
                         <polygon points="25,40 35,30 45,40" fill="#fef08a" stroke="black" strokeWidth="1" />
                         <polygon points="55,40 65,30 75,40" fill="#fef08a" stroke="black" strokeWidth="1" />
                        
                        {/* Row 2 - Circles */}
                        <circle cx="35" cy="60" r="6" fill="#bfdbfe" stroke="black" strokeWidth="1" />
                        <circle cx="65" cy="60" r="6" fill="#bfdbfe" stroke="black" strokeWidth="1" />

                        {/* Row 3 - Squares */}
                        <rect x="28" y="80" width="14" height="14" fill="#fef08a" stroke="black" strokeWidth="1" />
                        <rect x="58" y="80" width="14" height="14" fill="#bfdbfe" stroke="black" strokeWidth="1" />

                        {/* Row 4 - Triangles Inverted */}
                        <polygon points="25,110 35,120 45,110" fill="#bfdbfe" stroke="black" strokeWidth="1" />
                        <polygon points="55,110 65,120 75,110" fill="#fef08a" stroke="black" strokeWidth="1" />

                         {/* Row 5 - Large Window */}
                         <rect x="25" y="135" width="50" height="20" fill="#e2e8f0" stroke="black" strokeWidth="1" />
                         <line x1="25" y1="145" x2="75" y2="145" stroke="black" strokeWidth="1" />
                         <line x1="50" y1="135" x2="50" y2="155" stroke="black" strokeWidth="1" />

                        {/* Entrance */}
                        <rect x="35" y="170" width="30" height="30" fill="#1e293b" />
                        <line x1="50" y1="170" x2="50" y2="200" stroke="#475569" strokeWidth="1" />
                        
                        {/* Canopy */}
                        <path d="M 30 170 L 70 170 L 75 180 L 25 180 Z" fill="#b91c1c" stroke="black" strokeWidth="1" />
                    </svg>

                    {/* Little shrubs */}
                    <div className="absolute bottom-0 left-0 w-4 h-8 bg-green-700 border border-black rounded-t-full"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-8 bg-green-700 border border-black rounded-t-full"></div>
                </div>
            </div>
        </div>
    );
};

const OfficeBackground: React.FC<{ levelData: Level }> = ({ levelData }) => {
    const skyGradientId = `skyGradient-level-${levelData.id}`;
    const nebulaGradientId = `nebulaGradient-level-${levelData.id}`;
    return (
        <svg width="100%" height="100%" viewBox="0 0 1400 768" preserveAspectRatio="none" className="absolute inset-0">
            {/* Window Background Gradient */}
            <defs>
                <linearGradient id={skyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: levelData.skyColors.stop1, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: levelData.skyColors.stop2, stopOpacity: 1 }} />
                </linearGradient>
                {levelData.id === 4 && (
                    <radialGradient id={nebulaGradientId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d382ff" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#8155ff" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#2c2d5a" stopOpacity="0.2" />
                    </radialGradient>
                )}
            </defs>
            <rect width="1400" height="768" fill={levelData.backgroundColor} />
            
            {/* Window Frame */}
            <rect x="100" y="50" width="1200" height="500" fill={levelData.windowFrameColor} />
            <rect x="120" y="70" width="1160" height="460" fill={`url(#${skyGradientId})`} />
            
             {/* Level Text on the window frame */}
             <text 
                x="700" 
                y="105"
                fontFamily="'Press Start 2P', cursive"
                fontSize="24" 
                fill="#E2E8F0" 
                textAnchor="middle"
                style={{textShadow: '2px 2px #1a202c'}}
            >
                {levelData.id === 4 ? "LAST LEVEL" : `LEVEL ${levelData.id}`}
            </text>

            {/* Window Panes */}
            <rect x="120" y="299" width="1160" height="10" fill={levelData.windowFrameColor} />
            <rect x="496" y="70" width="10" height="460" fill={levelData.windowFrameColor} />
            <rect x="896" y="70" width="10" height="460" fill={levelData.windowFrameColor} />

            {/* Conditional Content based on level - VISUAL SWAP APPLIED FOR MORNING/AFTERNOON/NIGHT PROGRESSION */}
            {levelData.id === 1 && (
                 <>
                    {/* Morning (Previously Level 3 Assets) */}
                    {/* Clouds */}
                    <path d="M 250 200 C 200 200, 200 160, 250 160 H 400 C 450 160, 450 200, 400 200 Z" fill="#FFFFFF" opacity="0.9" />
                    <path d="M 500 250 C 460 250, 460 220, 500 220 H 620 C 660 220, 660 250, 620 250 Z" fill="#F0F8FF" opacity="0.8" />
                    <path d="M 850 180 C 800 180, 800 140, 850 140 H 1050 C 1100 140, 1100 180, 1050 180 Z" fill="#FFFFFF" opacity="0.95" />
                    <path d="M 1100 240 C 1060 240, 1060 210, 1100 210 H 1200 C 1240 210, 1240 240, 1200 240 Z" fill="#F0F8FF" opacity="0.85" />
                    
                    {/* City Buildings (Daytime) */}
                    <path d="M 120 530 V 420 H 220 V 530 Z" fill="#D1D5DB" />
                    <path d="M 230 530 V 350 H 310 V 530 Z" fill="#E5E7EB" />
                    <path d="M 320 530 V 460 H 450 V 530 Z" fill="#D1D5DB" />
                    <path d="M 460 530 V 320 L 500 290 L 540 320 V 530 Z" fill="#E5E7EB" />
                    <path d="M 550 530 V 380 H 680 V 530 Z" fill="#D1D5DB" />
                    <path d="M 690 530 V 430 H 770 V 530 Z" fill="#E5E7EB" />
                    <path d="M 780 530 V 370 H 870 V 530 Z" fill="#D1D5DB" />
                    <path d="M 880 530 V 340 H 980 V 530 Z" fill="#E5E7EB" />
                    <path d="M 990 530 V 400 H 1080 V 530 Z" fill="#D1D5DB" />
                    <path d="M 1090 530 V 440 H 1180 V 530 Z" fill="#E5E7EB" />
                    <path d="M 1185 530 V 410 L 1195 400 L 1205 410 V 530 Z" fill="#D1D5DB" />
                    <path d="M 1210 530 V 470 H 1280 V 530 Z" fill="#E5E7EB" />
                </>
            )}

            {levelData.id === 2 && (
                <>
                    {/* Afternoon (Previously Level 1 Assets) */}
                    {/* Simplified City Buildings */}
                    <path d="M 150 530 L 150 400 L 250 400 L 250 530 Z" fill="#A0AEC0" />
                    <path d="M 260 530 L 260 350 L 340 350 L 340 530 Z" fill="#CBD5E0" />
                    <path d="M 350 530 L 350 450 L 480 450 L 480 530 Z" fill="#A0AEC0" />
                    <path d="M 520 530 L 520 300 L 650 300 L 650 530 Z" fill="#CBD5E0" />
                    <path d="M 660 530 L 660 380 L 780 380 L 780 530 Z" fill="#E2E8F0" />
                    <path d="M 790 530 L 790 420 L 880 420 L 880 530 Z" fill="#A0AEC0" />
                    <path d="M 920 530 L 920 320 L 1050 320 L 1050 530 Z" fill="#CBD5E0" />
                    <path d="M 1060 530 L 1060 400 L 1150 400 L 1150 530 Z" fill="#E2E8F0" />
                    <path d="M 1160 530 L 1160 460 L 1250 460 L 1250 530 Z" fill="#A0AEC0" />
                </>
            )}

            {levelData.id === 3 && (
                 <>
                    {/* Night (Previously Level 2 Assets) */}
                    {/* Stars */}
                    <circle cx="250" cy="180" r="1.5" fill="#F7FAFC" opacity="0.8" />
                    <circle cx="340" cy="220" r="1" fill="#F7FAFC" opacity="0.6" />
                    <circle cx="480" cy="160" r="1.5" fill="#F7FAFC" opacity="0.9" />
                    <circle cx="600" cy="250" r="1" fill="#F7FAFC" opacity="0.7" />
                    <circle cx="750" cy="140" r="2" fill="#F7FAFC" opacity="0.8" />
                    <circle cx="950" cy="190" r="1.5" fill="#F7FAFC" opacity="0.9" />
                    <circle cx="1080" cy="240" r="1" fill="#F7FAFC" opacity="0.6" />
                    <circle cx="1150" cy="170" r="1.5" fill="#F7FAFC" opacity="0.8" />

                    {/* Clouds */}
                    <path d="M 280 280 C 230 280, 230 240, 280 240 H 450 C 500 240, 500 280, 450 280 Z" fill="#B0C4DE" opacity="0.5" />
                    <path d="M 900 260 C 850 260, 850 220, 900 220 H 1100 C 1150 220, 1150 260, 1100 260 Z" fill="#B0C4DE" opacity="0.4" />
                    
                    {/* City Silhouette */}
                    <path d="M 120 530 V 450 H 220 V 530 Z" fill="#1A202C" />
                    <path d="M 230 530 V 380 H 310 V 530 Z" fill="#2D3748" />
                    <path d="M 320 530 V 480 H 450 V 530 Z" fill="#1A202C" />
                    <path d="M 460 530 V 350 L 500 320 L 540 350 V 530 Z" fill="#2D3748" />
                    <path d="M 550 530 V 400 H 680 V 530 Z" fill="#1A202C" />
                    <path d="M 690 530 V 450 H 770 V 530 Z" fill="#2D3748" />
                    <path d="M 780 530 V 390 H 870 V 530 Z" fill="#1A202C" />
                    <path d="M 880 530 V 360 H 980 V 530 Z" fill="#2D3748" />
                    <path d="M 990 530 V 420 H 1080 V 530 Z" fill="#1A202C" />
                    <path d="M 1090 530 V 460 H 1180 V 530 Z" fill="#2D3748" />
                    <path d="M 1185 530 V 430 L 1195 400 L 1205 430 V 530 Z" fill="#1A202C" />
                    <path d="M 1210 530 V 480 H 1280 V 530 Z" fill="#2D3748" />
                </>
            )}
             {levelData.id === 4 && (
                <>
                    {/* Nebula */}
                    <ellipse cx="600" cy="280" rx="400" ry="200" fill={`url(#${nebulaGradientId})`} opacity="0.6" filter="url(#glow)" />
                    
                    {/* Stars - A simple loop can't be used in JSX, so we generate them here */}
                    {Array.from({ length: 150 }).map((_, i) => (
                        <circle 
                            key={i}
                            cx={120 + Math.random() * 1160} 
                            cy={70 + Math.random() * 460} 
                            r={Math.random() * 1.5 + 0.5} 
                            fill="#FFFFFF" 
                            opacity={Math.random() * 0.5 + 0.5} 
                        />
                    ))}
                </>
            )}
        </svg>
    );
};

const MuteButton = ({ isMuted, toggleMute }: { isMuted: boolean, toggleMute: () => void }) => (
    <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black border-2 border-yellow-400 px-3 py-2 text-yellow-400 font-['Press_Start_2P'] text-[10px] md:text-xs shadow-lg hover:bg-gray-900 transition-all cursor-pointer opacity-90 hover:opacity-100"
    >
        <span>{isMuted ? "OFF" : "ON"}</span>
        <span className="text-xl">{isMuted ? "🔇" : "🎵"}</span>
    </button>
);


const App: React.FC = () => {
    const initialPlayerState: PlayerState = {
        x: 100,
        y: GAME_HEIGHT - 80 - 60, // Start on the ground platform
        vx: 0,
        vy: 0,
        onGround: true,
        direction: 'right'
    };

    const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
    const [decisionOutcome, setDecisionOutcome] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Game Phases: 'start' -> 'selection' -> 'playing' -> 'performanceReview' -> 'keyTakeaways' -> 'thankYou'
    const [showInstructions, setShowInstructions] = useState(true);
    const [showCharacterSelect, setShowCharacterSelect] = useState(false);
    
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('sandra');

    const [boardTrust, setBoardTrust] = useState(INITIAL_BOARD_TRUST);

    const [currentLevel, setCurrentLevel] = useState(1);
    const [targetDoorIndex, setTargetDoorIndex] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'performanceReview' | 'keyTakeaways' | 'thankYou'>('playing');

    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentLevelData = LEVELS[currentLevel];

    // Added " " (space) to keys ref
    const keys = useRef<{ [key: string]: boolean }>({ ArrowLeft: false, ArrowRight: false, ArrowUp: false, " ": false });
    const gameLoopRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number | undefined>(undefined);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (keys.current.hasOwnProperty(e.key)) {
            e.preventDefault();
            keys.current[e.key] = true;
        }
    }, []);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (keys.current.hasOwnProperty(e.key)) {
            e.preventDefault();
            keys.current[e.key] = false;
        }
    }, []);

    // --- AUDIO EFFECT ---
    useEffect(() => {
        // Initialize audio instance
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;
        
        // Error handler to log issues but prevents crashing
        const handleError = (e: ErrorEvent) => {
            console.error("Audio error:", e);
        };
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('error', handleError);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;
        
        if (isMuted) {
            audioRef.current.pause();
        } else {
             // Only attempt to play if we are past the start screen (interaction occurred)
             if (!showInstructions) {
                 const playPromise = audioRef.current.play();
                 if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        // Suppress "The element has no supported sources" or Autoplay errors in console to avoid clutter
                        console.log("Audio playback deferred or failed:", e.message);
                    });
                 }
             }
        }
    }, [isMuted, showInstructions]);


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const gameLoop = useCallback((time: number) => {
        if (isModalOpen || showInstructions || showCharacterSelect || gameState !== 'playing') {
            lastTimeRef.current = time; // Prevents large deltaTime after pause
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        if (lastTimeRef.current === undefined) {
            lastTimeRef.current = time;
        }
        const deltaTime = (time - lastTimeRef.current) / 16.67; // Normalize to 60fps

        setPlayer(p => {
            let newVx = 0;
            let newDirection = p.direction;

            // --- HORIZONTAL MOVEMENT ---
            if (keys.current.ArrowLeft) newVx = -PLAYER_SPEED;
            if (keys.current.ArrowRight) newVx = PLAYER_SPEED;
            
            let newX = p.x + newVx * deltaTime;
            
            if (newVx > 0) newDirection = 'right';
            if (newVx < 0) newDirection = 'left';

            // --- VERTICAL MOVEMENT & PHYSICS ---
            let newVy = p.vy + GRAVITY * deltaTime;

            // Check for ArrowUp or Space (" ") for jumping
            if ((keys.current.ArrowUp || keys.current[" "]) && p.onGround) {
                newVy = -JUMP_STRENGTH;
            }

            let newY = p.y + newVy * deltaTime;
            let onGround = false;

            // --- COLLISION DETECTION & RESOLUTION ---
            const playerFeetY = newY + 60;

            // Find the highest platform (ground) beneath the player
            let groundY = GAME_HEIGHT;
            for (const plat of currentLevelData.platforms) {
                // Check horizontal overlap and that player is coming from above
                if (
                    newX + 40 > plat.x && // player right edge > platform left edge
                    newX < plat.x + plat.width && // player left edge < platform right edge
                    p.y + 60 <= plat.y + 1 // player was above platform (with tolerance)
                ) {
                    // Is this platform higher than the current ground we found?
                    if (plat.y < groundY) {
                        groundY = plat.y;
                    }
                }
            }
            
            // Ground collision
            if (playerFeetY >= groundY) {
                newY = groundY - 60;
                newVy = 0;
                onGround = true;
            }
            
            // World boundary checks
            if (newX < 0) newX = 0;
            if (newX > GAME_WIDTH - 40) newX = GAME_WIDTH - 40;

            // Door interaction
            if (targetDoorIndex < currentLevelData.doors.length) {
                const targetDoor = currentLevelData.doors[targetDoorIndex];
                const doorWidth = targetDoor.isFinal ? 160 : 80;
                const doorHeight = targetDoor.isFinal ? 240 : 120;
                 if (newX < targetDoor.x + doorWidth && newX + 40 > targetDoor.x && newY < targetDoor.y + doorHeight && newY + 60 > targetDoor.y) {
                    handleEnterDoor(targetDoor);
                }
            }

            return { x: newX, y: newY, vx: newVx, vy: newVy, onGround, direction: newDirection };
        });

        lastTimeRef.current = time;
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [isModalOpen, showInstructions, showCharacterSelect, gameState, targetDoorIndex, currentLevelData]);



    useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameLoop]);

    const handleEnterDoor = (door: DoorType) => {
        if(isModalOpen) return;
        
        if (door.scenarioId) {
            const scenario = currentLevelData.scenarios.find(s => s.id === door.scenarioId);
            if (scenario) {
                setCurrentScenario(scenario);
                setIsModalOpen(true);
            }
        }
    };

    const handleSelectOption = async (option: Option) => {
        if (!currentScenario) return;

        // Update stats immediately
        setBoardTrust(t => Math.max(0, Math.min(100, t + option.trustChange)));

        setIsLoading(true);
        setDecisionOutcome(null);
        
        // Ensure at least 3 seconds of loading time
        const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));

        try {
            // Determine outcome text: fixed if available, otherwise AI generated
            let text = "";
            if (option.outcome) {
                text = option.outcome;
            } else {
                text = await getDecisionOutcome(currentScenario.prompt, option.text);
            }
            
            // Wait for the delay to finish before showing the result
            await delayPromise;
            setDecisionOutcome(text);
        } catch (error) {
            console.error("Error getting decision outcome:", error);
            await delayPromise;
            setDecisionOutcome("An unexpected error occurred. The market is volatile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        const exitedDoor = currentLevelData.doors[targetDoorIndex];
        const doorWidth = exitedDoor.isFinal ? 160 : 80;
        const newPlayerX = exitedDoor.x + doorWidth + 10;

        setPlayer(p => ({
            ...p,
            x: newPlayerX,
            vx: 0, // Stop any horizontal movement
        }));
        
        setIsModalOpen(false);
        setCurrentScenario(null);
        setDecisionOutcome(null);
        
        const nextDoorIndex = targetDoorIndex + 1;
        const doorsInLevel = currentLevelData.doors.length;

        if (currentLevel === 1 && nextDoorIndex >= doorsInLevel) {
            setCurrentLevel(2);
            setTargetDoorIndex(0);
            setPlayer(initialPlayerState); // Reset player for new level
        } else if (currentLevel === 2 && nextDoorIndex >= doorsInLevel) {
            setCurrentLevel(3);
            setTargetDoorIndex(0);
            setPlayer(initialPlayerState);
        } else if (currentLevel === 3 && nextDoorIndex >= doorsInLevel) {
            setCurrentLevel(4);
            setTargetDoorIndex(0);
            setPlayer(initialPlayerState);
        } else if (currentLevel === 4 && nextDoorIndex >= doorsInLevel) {
            setGameState('performanceReview');
        } else {
            setTargetDoorIndex(nextDoorIndex);
        }
    };

    const restartGame = () => {
        setPlayer(initialPlayerState);
        setTargetDoorIndex(0);
        setCurrentLevel(1);
        setGameState('playing');
        setBoardTrust(INITIAL_BOARD_TRUST);
        setShowInstructions(true); // Go back to start screen
        setShowCharacterSelect(false);
        keys.current = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, " ": false };
        setIsMuted(false); // Reset audio state
    };

    const handlePressStart = () => {
        setShowInstructions(false);
        setShowCharacterSelect(true);
        // Attempt to play audio on first user interaction
        if (audioRef.current && !isMuted) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("Init audio play failed", e));
            }
        }
    };

    const handleCharacterConfirm = () => {
        setShowCharacterSelect(false);
        // Game starts
    };

    const getBoardMessage = (trust: number) => {
        if (trust < 35) {
            return "Your tenure as CEO has concluded. You consistently failed to make the necessary Trade-Offs, confusing generic Resources for Distinctive Capabilities. Your decisions created chaos, eroded Stakeholder Trust, and left our SBUs strategically 'Stuck in the Middle.' The Board has lost confidence in your ability to define a Long-Term Direction. Effective immediately, your access codes are revoked. Please clean out your desk.";
        } else if (trust <= 70) {
            return "You have secured a tentative majority. Your analysis of the External Environment and several Portfolio decisions were sound. However, your failures in Organisational Fit and Capital Allocation show gaps in execution. You avoided the catastrophic error of being 'Stuck in the Middle,' but your lack of Stakeholder Trust is a major liability. Your contract is approved for 12 months, pending immediate, demonstrable improvement in all execution metrics. You are on probation. Do not fail us again.";
        } else {
            return "Your performance is exemplary. You demonstrated a superior strategic capability, correctly navigating every pitfall from Inflexion Points to the Portfolio Matrix. You successfully enforced the principle of Parenting Advantage and made the difficult Trade-Offs required to secure our competitive future. Aalto Industries has a clear Long-Term Direction and a set of Distinctive Capabilities ready for the next decade. Your contract is approved. Congratulations, the Board is pleased.";
        }
    };

    const renderGameContent = () => {
        if (showInstructions) {
            return (
                <div className="w-full h-screen flex items-center justify-center bg-[#0c0a1a] text-white p-4">
                    <div className="w-full max-w-2xl bg-[#1e223b] border-4 border-white p-8 text-center flex flex-col items-center">
                        <h1 className="text-4xl text-yellow-400 mb-2 font-bold tracking-widest uppercase">The CEO's Odyssey</h1>
                        <p className="text-lg text-gray-300 mb-4 tracking-wider">Trust is your currency</p>
                        
                        <StartScreenImage />
                        
                        <button 
                            onClick={handlePressStart}
                            className="mt-6 text-2xl text-green-400 hover:text-green-300 animate-blink transition-colors duration-200"
                        >
                            &gt; PRESS START &lt;
                        </button>

                        <p className="mt-8 text-xs text-gray-500">@2025 Sandra Calvo</p>
                    </div>
                </div>
            );
        }

        if (showCharacterSelect) {
            return (
                <CharacterSelectionScreen 
                    selected={selectedCharacter}
                    onSelect={setSelectedCharacter}
                    onConfirm={handleCharacterConfirm}
                />
            );
        }

        if (gameState === 'performanceReview') {
            return (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-2xl bg-[#1e223b] text-white border-4 border-white p-6 shadow-lg">
                        <h2 className="text-2xl mb-4 text-yellow-400">The CEO's Odyssey: Performance Review</h2>
                        
                        <div className="text-xl my-4">
                            <p>Board Trust: <span className={`font-bold ${boardTrust < 35 ? 'text-red-500' : boardTrust <= 70 ? 'text-yellow-400' : 'text-green-500'}`}>{boardTrust}%</span></p>
                        </div>
                        
                        <div className="border-t border-b border-white py-6 my-6">
                            <p className="text-xs md:text-sm leading-loose text-center text-gray-200">
                                "{getBoardMessage(boardTrust)}"
                            </p>
                        </div>

                        <button 
                            onClick={() => setGameState('keyTakeaways')}
                            className="w-full mt-4 bg-green-500 text-gray-900 px-6 py-3 border-2 border-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>
            );
        }

        if (gameState === 'keyTakeaways') {
             return (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-4xl bg-[#1e223b] text-white border-4 border-white p-6 shadow-lg h-[80vh] flex flex-col">
                        <h2 className="text-2xl mb-6 text-yellow-400 uppercase text-center border-b-2 border-white pb-2">10 Strategic Takeaways</h2>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {KEY_TAKEAWAYS.map((item, index) => (
                                <div key={index} className="bg-transparent p-4 border-l-4 border-white hover:bg-white/5 transition-colors">
                                    <h3 className="text-xs md:text-sm text-yellow-400 mb-2 leading-relaxed">{index + 1}. {item.title}</h3>
                                    <p className="text-[10px] md:text-xs text-gray-300 leading-loose">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white">
                            <button 
                                onClick={() => setGameState('thankYou')}
                                className="w-full bg-green-500 text-gray-900 px-6 py-3 border-2 border-green-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (gameState === 'thankYou') {
            return (
               <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                   <div className="w-full max-w-2xl bg-[#1e223b] text-white border-4 border-white p-6 shadow-lg text-center flex flex-col items-center">
                       <h1 className="text-2xl md:text-3xl text-yellow-400 mb-8 uppercase tracking-widest leading-relaxed">
                           Thank you for playing<br/>The CEO's Odyssey.
                       </h1>
                       
                       <button 
                           onClick={restartGame}
                           className="mt-4 bg-transparent text-white px-8 py-4 border-2 border-white hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200 animate-pulse"
                       >
                           &gt; Play again &lt;
                       </button>

                       <p className="mt-12 text-xs text-gray-400 font-mono">@2025 Sandra Calvo</p>
                   </div>
               </div>
           );
       }

        const finalDoor = currentLevelData.id === 4 ? currentLevelData.doors.find(d => d.isFinal) : null;
        const platformY = currentLevelData.platforms[0].y;
        const reflectionStyle: React.CSSProperties = {
            position: 'absolute',
            transform: 'scaleY(-1)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 70%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 70%)',
        };

        return (
            <div className="w-full h-screen flex items-center justify-center bg-black">
                <div
                    style={{ 
                        width: GAME_WIDTH, 
                        height: GAME_HEIGHT,
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                    className="relative overflow-hidden border-4 border-black"
                >
                    <OfficeBackground levelData={currentLevelData} />
                    
                    <div className="absolute top-4 left-4 text-white text-2xl tracking-wide" style={{ textShadow: '2px 2px #000' }}>
                        <p>TRUST: {boardTrust}%</p>
                    </div>

                    <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl text-white tracking-widest uppercase" style={{textShadow: '3px 3px #1a202c'}}>The CEO's Odyssey</h1>

                    {currentLevelData.platforms.map(p => (
                        <Platform key={p.id} {...p} colors={currentLevelData.floorColors} style={currentLevelData.floorStyle} />
                    ))}
                    {currentLevelData.doors.map((d) => (
                        <Door key={d.id} {...d} />
                    ))}
                    <Player player={player} character={selectedCharacter} />
                    
                    {currentLevel === 4 && (
                        <>
                            {/* Player Reflection */}
                            <div style={{...reflectionStyle, left: player.x, top: platformY}}>
                            <div className="w-[40px] h-[60px]">
                                <Player player={{...player, y: 0}} character={selectedCharacter} />
                            </div>
                            </div>
                            {/* Door Reflection */}
                            {finalDoor && (
                                <div style={{...reflectionStyle, left: finalDoor.x, top: platformY}}>
                                <div className="w-[160px] h-[240px]">
                                    <Door {...finalDoor} y={0} />
                                </div>
                                </div>
                            )}
                        </>
                    )}


                    {isModalOpen && currentScenario && (
                        <DecisionModal
                            scenario={currentScenario}
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onSelectOption={handleSelectOption}
                            outcome={decisionOutcome}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <MuteButton isMuted={isMuted} toggleMute={() => setIsMuted(!isMuted)} />
            {renderGameContent()}
        </>
    );
};

export default App;
