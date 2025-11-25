import React from 'react';

interface PlatformProps {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    colors?: {
        tile1: string;
        tile2: string;
    };
    style?: 'grid' | 'checkerboard';
}

export const Platform: React.FC<PlatformProps> = ({ x, y, width, height, colors, style }) => {
    
    let backgroundStyles: React.CSSProperties = {
        backgroundColor: '#CED4DA' // Fallback color
    };

    if (colors && style === 'checkerboard') {
        backgroundStyles = {
            backgroundColor: colors.tile1,
            backgroundImage: `
                linear-gradient(45deg, ${colors.tile2} 25%, transparent 25%, transparent 75%, ${colors.tile2} 75%),
                linear-gradient(45deg, ${colors.tile2} 25%, transparent 25%, transparent 75%, ${colors.tile2} 75%)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0, 40px 40px',
        };
    } else if (colors && style === 'grid') {
        backgroundStyles = {
            backgroundColor: colors.tile1,
            backgroundImage: `
                linear-gradient(to right, ${colors.tile2} 1px, transparent 1px),
                linear-gradient(to bottom, ${colors.tile2} 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
        };
    }

    return (
        <div
            style={{ 
                left: x, 
                top: y, 
                width, 
                height,
                ...backgroundStyles
            }}
            className="absolute"
        >
        </div>
    );
};
