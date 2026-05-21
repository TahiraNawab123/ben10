import { Alien } from './types';

export const ALIENS: Alien[] = [
  {
    id: 'heatblast',
    name: 'Heatblast',
    description: 'A magma-based life form with extreme heat generation and flame blasting powers.',
    abilityName: 'Pyrokinesis',
    abilityDesc: 'Press "F" or "Enter" to launch Fireballs that melt oncoming obstacles and enemies!',
    color: '#FF4D00',
    accentColor: '#FFD700',
    stats: { speed: 7, jump: 8, agility: 6 },
    image: '/creatures/heatblast.jpg'
  },
  {
    id: 'xlr8',
    name: 'XLR8',
    description: 'A sleek, semi-armored speedster capable of reaching velocities over 500 mph in seconds.',
    abilityName: 'Tailwind Dash',
    abilityDesc: 'Press "F" or "Enter" to enter Hyper-Dash mode, instantly smashing obstacles in your lane!',
    color: '#00F0FF',
    accentColor: '#1A1A1A',
    stats: { speed: 10, jump: 7, agility: 10 },
    image: '/creatures/xlr8.jpg'
  },
  {
    id: 'diamondhead',
    name: 'Diamondhead',
    description: 'Composed of ultra-dense silicon crystals, making him virtually indestructible.',
    abilityName: 'Crystal Shards',
    abilityDesc: 'Press "F" or "Enter" to fire sharp Diamond spikes that shatter barriers and Vilgax drones!',
    color: '#00FFA3',
    accentColor: '#E0FFFF',
    stats: { speed: 6, jump: 6, agility: 5 },
    image: '/creatures/diamondhead.jpg'
  },
  {
    id: 'fourarms',
    name: 'Four Arms',
    description: 'A muscle-bound red colossus with outstanding raw physical strength and endurance.',
    abilityName: 'Seismic Clap',
    abilityDesc: 'Press "F" or "Enter" to release a massive seismic blast, clearing everything in your lane!',
    color: '#FF1E27',
    accentColor: '#F1C40F',
    stats: { speed: 5, jump: 10, agility: 4 },
    image: '/creatures/fourarms.jpg'
  },
  {
    id: 'upgrade',
    name: 'Upgrade',
    description: 'A biomechanical organism made of nano-technological liquid metal wireframe.',
    abilityName: 'Plasma Laser',
    abilityDesc: 'Press "F" or "Enter" to shoot high-voltage plasma laser beams that penetrate hazards!',
    color: '#32CD32',
    accentColor: '#0D0D0D',
    stats: { speed: 8, jump: 7, agility: 8 },
    image: '/creatures/upgrade.jpg'
  },
  {
    id: 'cannonbolt',
    name: 'Cannonbolt',
    description: 'A bulky Arburian Pelarota that can curl into a virtually indestructible sphere for high-speed impact.',
    abilityName: 'Wrecking Ball',
    abilityDesc: 'Press "F" or "Enter" to bowl over all obstacles and enemies in your path with unstoppable force!',
    color: '#F5F5DC',
    accentColor: '#FBB034',
    stats: { speed: 9, jump: 5, agility: 7 },
    image: '/creatures/cannonbolt.jpg'
  },
  {
    id: 'ghostfreak',
    name: 'Ghostfreak',
    description: 'A shadowy Ectonurite capable of phasing through solid matter and becoming completely invisible.',
    abilityName: 'Phase Shift',
    abilityDesc: 'Press "F" or "Enter" to become intangible, passing through all hazards and enemies unharmed!',
    color: '#C0C0C0',
    accentColor: '#800080',
    stats: { speed: 6, jump: 8, agility: 9 },
    image: '/creatures/ghostfreak.jpg'
  },
  {
    id: 'ripjaws',
    name: 'Ripjaws',
    description: 'A formidable Piscciss Volann equipped with crushing jaws and sharp claws for aquatic combat.',
    abilityName: 'Hydro Bite',
    abilityDesc: 'Press "F" or "Enter" to unleash a devastating bite that shatters even the toughest robotic enemies!',
    color: '#4682B4',
    accentColor: '#FFFFFF',
    stats: { speed: 7, jump: 6, agility: 8 },
    image: '/creatures/ripjaws.jpg'
  },
  {
    id: 'wildmutt',
    name: 'Wildmutt',
    description: 'A Vulpimancer with superhuman athletic abilities and extraordinary thermal-sensing tracking.',
    abilityName: 'Sensory Pounce',
    abilityDesc: 'Press "F" or "Enter" to leap forward with primal fury, shredding all obstacles with razor claws!',
    color: '#FF8C00',
    accentColor: '#FFFFFF',
    stats: { speed: 8, jump: 9, agility: 10 },
    image: '/creatures/wildmutt.jpg'
  },
  {
    id: 'stinkfly',
    name: 'Stinkfly',
    description: 'An insectoid specimen combining high-speed aerial flight with corrosive goo secretion.',
    abilityName: 'Slime Glob',
    abilityDesc: 'Press "F" or "Enter" to launch sticky acid slime spit that melts down hazards!',
    color: '#709D00',
    accentColor: '#EEFF41',
    stats: { speed: 7, jump: 9, agility: 8 },
    image: '/creatures/stinkfly.jpg'
  }
];
