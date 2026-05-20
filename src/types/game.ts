export interface Character {
  id: string
  name: string
  image: string
  color: string
  strength: number
  velocity: number
  intellect: number
  primaryPower: string
  abilities: string[]
  ability: {
    name: string
    duration: number
    cooldown: number
    description: string
  }
}

export interface GameState {
  character: Character | null
  worldType: 'mountains' | 'ice' | 'desert'
  score: number
  distance: number
  health: number
  isGameActive: boolean
  isPaused: boolean
  lane: 0 | 1 | 2
  collectibles: number
  multiplier: number
  timeElapsed: number
}

export interface Obstacle {
  id: string
  type: 'drone' | 'barrier' | 'hazard'
  lane: 0 | 1 | 2
  position: { x: number; z: number }
  width: number
  depth: number
}

export interface Collectible {
  id: string
  type: 'energy' | 'shield' | 'speedboost'
  lane: 0 | 1 | 2
  position: { x: number; z: number }
  value: number
}

export interface PowerUp {
  id: string
  name: string
  type: 'speedboost' | 'shield' | 'magnetism' | 'slowtime'
  duration: number
  cooldown: number
  active: boolean
  startTime: number
}

export interface HighScore {
  id: string
  characterName: string
  score: number
  distance: number
  timestamp: number
  worldType: string
}

export const LANE_POSITIONS = [-5, 0, 5]
export const GAME_SPEED = 0.35
export const LANE_WIDTH = 4
