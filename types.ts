
export interface PlayerState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    onGround: boolean;
    direction: 'left' | 'right';
}

export type CharacterType = 'pedro' | 'sandra';

export interface Platform {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Door {
    id: number;
    x: number;
    y: number;
    scenarioId?: number;
    isFinal?: boolean;
}

export interface Option {
    text: string;
    trustChange: number; // percentage points
    outcome?: string; // Optional fixed outcome message
}

export interface Scenario {
    id: number;
    title: string;
    prompt: string;
    options: Option[];
}

export interface Level {
    id: number;
    platforms: Platform[];
    doors: Door[];
    scenarios: Scenario[];
    backgroundColor: string;
    windowFrameColor: string;
    skyColors: {
        stop1: string;
        stop2: string;
    };
    floorStyle: 'grid' | 'checkerboard';
    floorColors: {
        tile1: string;
        tile2: string;
    };
}
