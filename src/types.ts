export interface Alien {
  id: string;
  name: string;
  description: string;
  abilityName: string;
  abilityDesc: string;
  color: string;       // main hex for canvas color
  accentColor: string; // glow/secondary hex
  stats: {
    speed: number;    // 1 to 10
    jump: number;     // 1 to 10
    agility: number;  // 1 to 10
  };
  image?: string;
}

export interface Obstacle {
  id: string;
  lane: number;       // 0 (left), 1 (center), 2 (right)
  z: number;          // distance from player
  type: 'barrier' | 'barricade' | 'beam' | 'energyCore' | 'magnet' | 'shield' | 'enemy_drone' | 'enemy_soldier' | 'enemy_laser'; // obstacle or item or enemy/laser
  width: number;
  height: number;
  collected?: boolean;
  health?: number;    // enemies can have health!
  driftTimer?: number;
  driftDir?: number;
}

export interface PlayerState {
  lane: number;       // 0, 1, 2
  targetLane: number; // for smooth lane change transition
  y: number;          // floor jump altitude
  vy: number;         // vertical velocity
  isJumping: boolean;
  isSliding: boolean;
  slideTimer: number;
  score: number;
  energy: number;     // Collected green cores
  distance: number;
  shieldActive: boolean;
  shieldTimer: number;
  magnetActive: boolean;
  magnetTimer: number;
  multiplier: number;
}
