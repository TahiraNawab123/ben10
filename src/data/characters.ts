import type { Character } from '@/src/types/game'

export const CHARACTERS: Character[] = [
  {
    id: 'xlr8',
    name: 'XLR8',
    image: '/creatures/xlr8.jpg',
    color: '#00d4ff',
    strength: 35,
    velocity: 99,
    intellect: 65,
    primaryPower: 'Hyper Speed',
    abilities: ['Speed Mirages', 'Tornado Generation', 'Time Perception Shift', 'Friction Dash'],
    ability: {
      name: 'Speed Boost',
      duration: 8,
      cooldown: 30,
      description: 'Gain 2x speed for 8 seconds'
    }
  },
  {
    id: 'heatblast',
    name: 'HEATBLAST',
    image: '/creatures/heatblast.jpg',
    color: '#ff3b5c',
    strength: 70,
    velocity: 50,
    intellect: 55,
    primaryPower: 'Pyrokinesis',
    abilities: ['Fire Projection', 'Lava Generation', 'Fire Absorption', 'Supernova Burst'],
    ability: {
      name: 'Heat Shield',
      duration: 10,
      cooldown: 35,
      description: 'Block incoming obstacles with fire shield'
    }
  },
  {
    id: 'fourarms',
    name: 'FOUR ARMS',
    image: '/creatures/fourarms.jpg',
    color: '#ff3b5c',
    strength: 95,
    velocity: 30,
    intellect: 40,
    primaryPower: 'Super Strength',
    abilities: ['Shockwave Clap', 'Ground Pound', 'Enhanced Jumping', 'Quad Punch Combo'],
    ability: {
      name: 'Smash',
      duration: 1,
      cooldown: 40,
      description: 'Break through obstacles with a powerful smash'
    }
  },
  {
    id: 'diamondhead',
    name: 'DIAMONDHEAD',
    image: '/creatures/diamondhead.jpg',
    color: '#00ff88',
    strength: 80,
    velocity: 40,
    intellect: 60,
    primaryPower: 'Crystal Generation',
    abilities: ['Crystal Projectiles', 'Body Reformation', 'Light Refraction', 'Crystal Cage'],
    ability: {
      name: 'Crystal Shield',
      duration: 12,
      cooldown: 40,
      description: 'Create protective crystal barrier'
    }
  },
  {
    id: 'upgrade',
    name: 'UPGRADE',
    image: '/creatures/upgrade.jpg',
    color: '#a64dff',
    strength: 65,
    velocity: 55,
    intellect: 85,
    primaryPower: 'Tech Absorption',
    abilities: ['Machine Control', 'Tech Integration', 'Power Enhancement', 'Device Manipulation'],
    ability: {
      name: 'Tech Boost',
      duration: 6,
      cooldown: 25,
      description: 'Enhance speed and jumps temporarily'
    }
  },
  {
    id: 'graymatters',
    name: 'GRAY MATTER',
    image: '/creatures/graymatters.jpg',
    color: '#7b68ee',
    strength: 25,
    velocity: 35,
    intellect: 99,
    primaryPower: 'Genius-Level Intelligence',
    abilities: ['Advanced Science', 'Device Creation', 'Problem Solving', 'Tech Mastery'],
    ability: {
      name: 'Smart Shield',
      duration: 8,
      cooldown: 30,
      description: 'Deploy intelligent defense system'
    }
  },
  {
    id: 'ghostfreak',
    name: 'GHOSTFREAK',
    image: '/creatures/ghostfreak.jpg',
    color: '#1a1a2e',
    strength: 50,
    velocity: 75,
    intellect: 60,
    primaryPower: 'Spectral Phase',
    abilities: ['Intangibility', 'Hypnotic Vision', 'Shadow Merging', 'Spectral Flight'],
    ability: {
      name: 'Phase Through',
      duration: 4,
      cooldown: 35,
      description: 'Pass through obstacles safely'
    }
  },
  {
    id: 'fourarms-alt',
    name: 'WILDVINE',
    image: '/creatures/wildvine.jpg',
    color: '#2ecc71',
    strength: 75,
    velocity: 45,
    intellect: 50,
    primaryPower: 'Plant Manipulation',
    abilities: ['Vine Growth', 'Root Control', 'Seed Projectiles', 'Plant Regeneration'],
    ability: {
      name: 'Vine Shield',
      duration: 7,
      cooldown: 30,
      description: 'Create protective vine barrier'
    }
  },
  {
    id: 'ripjaws',
    name: 'RIPJAWS',
    image: '/creatures/ripjaws.jpg',
    color: '#3498db',
    strength: 85,
    velocity: 60,
    intellect: 45,
    primaryPower: 'Aquatic Mastery',
    abilities: ['Water Projection', 'Sonar Detection', 'Enhanced Pressure', 'Aqua Blade'],
    ability: {
      name: 'Water Dash',
      duration: 5,
      cooldown: 28,
      description: 'Dash forward with aquatic acceleration'
    }
  },
  {
    id: 'echidna',
    name: 'ECHIDNA',
    image: '/creatures/echidna.jpg',
    color: '#e74c3c',
    strength: 60,
    velocity: 70,
    intellect: 55,
    primaryPower: 'Sonic Manipulation',
    abilities: ['Sonic Boom', 'Echolocation', 'Sound Barrier', 'Sonic Quills'],
    ability: {
      name: 'Sonic Burst',
      duration: 6,
      cooldown: 32,
      description: 'Emit sonic wave to clear path'
    }
  }
]

export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(c => c.id === id)
}
