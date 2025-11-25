
import React, { useState, useEffect, useMemo } from 'react';
import type { PlayerState, CharacterType } from '../types';

interface PlayerProps {
    player: PlayerState;
    character?: CharacterType;
}

export const Player: React.FC<PlayerProps> = ({ player, character = 'pedro' }) => {
    const [walkFrame, setWalkFrame] = useState(0);
    
    const isWalking = useMemo(() => player.vx !== 0 && player.onGround, [player.vx, player.onGround]);

    useEffect(() => {
        if (isWalking) {
            const timer = setInterval(() => {
                setWalkFrame(frame => (frame + 1) % 4); // 4 frames for smoother animation
            }, 100);
            return () => clearInterval(timer);
        } else {
            setWalkFrame(0);
        }
    }, [isWalking]);

    const scaleX = player.direction === 'right' ? 'scaleX(1)' : 'scaleX(-1)';

    // Skin colors
    const skinColor = "#f5d0a9";
    const shadeColor = "#e0b080";

    return (
        <div
            style={{
                left: player.x,
                top: player.y,
                transform: scaleX,
                transition: 'top 0.05s linear',
                width: '40px',
                height: '60px',
                position: 'absolute'
            }}
        >
            <div className="relative w-full h-full">
                
                {/* --- HEAD --- */}
                <div className="absolute left-[8px] top-0 w-[24px] h-[24px] z-10">
                    {/* Sandra's Back Hair */}
                    {character === 'sandra' && (
                        <div className="absolute -left-[2px] -top-[2px] w-[28px] h-[28px] bg-[#5D4037] rounded-sm"></div>
                    )}

                    {/* Face Base */}
                    <div className="absolute left-0 top-0 w-full h-full bg-[#f5d0a9] border-2 border-black rounded-sm overflow-hidden">
                        {/* Shading */}
                        <div className="absolute right-0 top-0 w-[4px] h-full bg-[#e0b080] opacity-50"></div>
                    </div>

                    {/* Glasses (Shared) */}
                    <div className="absolute top-[8px] left-[2px] w-[20px] h-[6px] z-20">
                         <div className="absolute left-0 top-0 w-[8px] h-[6px] border-2 border-black bg-blue-100 opacity-80"></div>
                         <div className="absolute right-0 top-0 w-[8px] h-[6px] border-2 border-black bg-blue-100 opacity-80"></div>
                         <div className="absolute left-[8px] top-[2px] w-[4px] h-[2px] bg-black"></div>
                    </div>
                    
                    {/* Eyes */}
                     <div className="absolute top-[10px] left-[4px] w-[2px] h-[2px] bg-black z-20"></div>
                     <div className="absolute top-[10px] right-[4px] w-[2px] h-[2px] bg-black z-20"></div>

                    {/* Sandra Specifics (Front Hair) */}
                    {character === 'sandra' && (
                        <>
                            <div className="absolute -top-[2px] -left-[2px] w-[10px] h-[6px] bg-[#5D4037] z-30"></div>
                            <div className="absolute top-0 -left-[2px] w-[4px] h-[20px] bg-[#5D4037] z-30"></div>
                            <div className="absolute top-0 -right-[1px] w-[6px] h-[24px] bg-[#5D4037] z-10"></div>
                        </>
                    )}

                    {/* Pedro Specifics */}
                    {character === 'pedro' && (
                        <>
                            {/* Shiny bald head reflection */}
                            <div className="absolute top-[2px] left-[4px] w-[6px] h-[2px] bg-white opacity-40 z-20"></div>
                            {/* Side hair/stubble */}
                            <div className="absolute top-[12px] -left-[1px] w-[2px] h-[6px] bg-[#a0a0a0] z-10"></div>
                            <div className="absolute top-[12px] right-[0px] w-[2px] h-[6px] bg-[#a0a0a0] z-10"></div>
                        </>
                    )}
                </div>

                {/* --- BODY --- */}
                <div className="absolute left-0 top-[24px] w-[40px] h-[26px] z-10">
                    {/* Suit Jacket */}
                    <div className="w-full h-full bg-[#1F2937] border-2 border-black rounded-sm relative overflow-hidden">
                        {/* Collar/Shirt area */}
                        <div className="absolute left-[12px] top-0 w-[12px] h-[12px] bg-white transform rotate-45 border border-gray-300"></div>
                        
                        {/* Tie */}
                        <div className="absolute left-[15px] top-[4px] w-[6px] h-[18px] bg-[#B91C1C] border-x border-black z-10"></div>
                        
                        {/* Jacket Lapels */}
                        <div className="absolute left-[8px] top-[4px] w-[10px] h-[20px] bg-[#1F2937] border-r border-gray-600 transform -skew-x-12"></div>
                        <div className="absolute right-[8px] top-[4px] w-[10px] h-[20px] bg-[#1F2937] border-l border-gray-600 transform skew-x-12"></div>

                        {/* Pocket */}
                        {character === 'pedro' && (
                            <div className="absolute left-[4px] top-[14px] w-[8px] h-[2px] bg-black opacity-50"></div>
                        )}
                        {character === 'sandra' && (
                             <div className="absolute left-[4px] top-[10px] w-[8px] h-[8px] border-b-2 border-r-2 border-gray-600 rounded-br-lg opacity-30"></div>
                        )}
                    </div>
                    
                    {/* Arms (Static for now, could animate) */}
                    <div className="absolute -left-[2px] top-[2px] w-[8px] h-[20px] bg-[#1F2937] border border-black rounded-sm"></div>
                    <div className="absolute -right-[2px] top-[2px] w-[8px] h-[20px] bg-[#1F2937] border border-black rounded-sm"></div>
                    {/* Briefcase (Right hand) */}
                    <div className="absolute -right-[2px] top-[18px] w-[10px] h-[8px] bg-[#451a03] border border-black z-0"></div>
                </div>

                {/* --- LEGS --- */}
                <div className="absolute top-[50px] left-0 w-full h-[10px]">
                     {/* Leg 1 */}
                    <div 
                        className="absolute left-[6px] w-[10px] h-[10px] bg-[#111827] border-x border-b border-black"
                        style={{ 
                            height: isWalking && (walkFrame === 0 || walkFrame === 2) ? '8px' : '10px',
                            transform: isWalking && walkFrame === 1 ? 'translateY(-2px)' : 'none'
                        }}
                    ></div>
                    {/* Leg 2 */}
                    <div 
                        className="absolute right-[6px] w-[10px] h-[10px] bg-[#111827] border-x border-b border-black"
                        style={{ 
                            height: isWalking && (walkFrame === 1 || walkFrame === 3) ? '8px' : '10px',
                            transform: isWalking && walkFrame === 3 ? 'translateY(-2px)' : 'none'
                        }}
                    ></div>
                </div>

            </div>
        </div>
    );
};
