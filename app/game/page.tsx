"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import 3D scene to avoid SSR issues
const Game3DScene = dynamic(
  () => import("@/components/game/Game3DScene").then(mod => mod.default || mod),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary font-mono text-sm">Loading 3D Environment...</p>
        </div>
      </div>
    )
  }
)

import { 
  ArrowLeft, 
  Zap, 
  Shield, 
  Flame, 
  Gem, 
  Cpu, 
  Ghost, 
  Bug, 
  Dog, 
  Circle, 
  Droplets,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Swords,
  Skull,
  Sparkles,
  Menu,
  X,
  Watch,
  Footprints,
  Target,
  Crosshair,
  Activity,
  Wind,
  Snowflake,
  Sun,
  Mountain,
  Camera,
  RotateCw
} from "lucide-react"

/* ─────────────── DATA ─────────────── */

interface Creature {
  id: string
  name: string
  image: string
  color: string
  icon: React.ReactNode
  description: string
  primaryPower: string
  abilities: string[]
}

const creatures: Creature[] = [
  {
    id: "heatblast",
    name: "HEATBLAST",
    image: "/creatures/heatblast.jpg",
    color: "#ff3b5c",
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A being composed of living molten rock with pyrokinesis abilities.",
    primaryPower: "Pyrokinesis",
    abilities: ["Fire Projection", "Lava Generation", "Fire Absorption", "Supernova Burst"],
  },
  {
    id: "fourarms",
    name: "FOUR ARMS",
    image: "/creatures/fourarms.jpg",
    color: "#ff3b5c",
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A colossal Tetramand warrior with incredible physical strength.",
    primaryPower: "Super Strength",
    abilities: ["Shockwave Clap", "Ground Pound", "Enhanced Jumping", "Quad Punch Combo"],
  },
  {
    id: "xlr8",
    name: "XLR8",
    image: "/creatures/xlr8.jpg",
    color: "#00d4ff",
    icon: <Gauge className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A Kineceleran that can accelerate to speeds exceeding 500 mph.",
    primaryPower: "Hyper Speed",
    abilities: ["Speed Mirages", "Tornado Generation", "Time Perception Shift", "Friction Dash"],
  },
  {
    id: "diamondhead",
    name: "DIAMONDHEAD",
    image: "/creatures/diamondhead.jpg",
    color: "#00ff88",
    icon: <Gem className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A Petrosapien with a body of extremely durable crystal compound.",
    primaryPower: "Crystal Generation",
    abilities: ["Crystal Projectiles", "Body Reformation", "Light Refraction", "Crystal Cage"],
  },
  {
    id: "upgrade",
    name: "UPGRADE",
    image: "/creatures/upgrade.jpg",
    color: "#00ff88",
    icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A Mechamorph that can merge with and enhance any technology.",
    primaryPower: "Techno-Merge",
    abilities: ["Machine Fusion", "Tech Enhancement", "Optic Beam", "Liquid Metal Shift"],
  },
  {
    id: "ghostfreak",
    name: "GHOSTFREAK",
    image: "/creatures/ghostfreak.jpg",
    color: "#b388ff",
    icon: <Ghost className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "An Ectonurite that exists partially in another dimension.",
    primaryPower: "Intangibility",
    abilities: ["Invisibility", "Possession", "Telekinesis", "Shadow Tendrils"],
  },
  {
    id: "stinkfly",
    name: "STINKFLY",
    image: "/creatures/stinkfly.jpg",
    color: "#76ff03",
    icon: <Bug className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "An insectoid alien capable of sustained flight with four powerful wings.",
    primaryPower: "Aerial Combat",
    abilities: ["Slime Projection", "Toxic Gas", "360 Vision", "Wing Blade Attack"],
  },
  {
    id: "wildmutt",
    name: "WILDMUTT",
    image: "/creatures/wildmutt.jpg",
    color: "#ff9100",
    icon: <Dog className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A Vulpimancer with no eyes but extreme sensory perception.",
    primaryPower: "Sensory Tracking",
    abilities: ["Thermal Vision", "Sonic Detection", "Razor Claws", "Pounce Attack"],
  },
  {
    id: "cannonbolt",
    name: "CANNONBOLT",
    image: "/creatures/cannonbolt.jpg",
    color: "#ffd600",
    icon: <Circle className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "An Arburian Pelarota that can curl into a near-indestructible sphere.",
    primaryPower: "Rolling Impact",
    abilities: ["Sphere Mode", "Ricochet Strike", "Armor Deflection", "Seismic Roll"],
  },
  {
    id: "ripjaws",
    name: "RIPJAWS",
    image: "/creatures/ripjaws.jpg",
    color: "#00bcd4",
    icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />,
    description: "A Piscciss Volann with jaws strong enough to bite through steel.",
    primaryPower: "Aquatic Combat",
    abilities: ["Steel-Bite Jaws", "Deep Dive", "Tail Whip", "Aqua Jet Dash"],
  },
]

interface Enemy {
  id: string
  name: string
  health: number
  maxHealth: number
  position: { x: number; y: number }
  isMoving: boolean
  moveDirection: number
  isHit: boolean
}

interface PowerEffect {
  id: string
  name: string
  active: boolean
  x: number
  y: number
  color: string
  type: "attack" | "hit"
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBG-STYLE REALISTIC ENVIRONMENTS
   Multi-layered parallax backgrounds with atmospheric effects
═══════════════════════════════════════════════════════════════════════════ */

function MountainsEnvironment() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Sky - Dynamic sky with clouds */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300">
        {/* Clouds layer */}
        <div className="absolute top-10 left-10 w-32 h-12 bg-white/60 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-20 right-1/4 w-40 h-16 bg-white/50 rounded-full blur-2xl" />
        <div className="absolute top-5 left-1/3 w-24 h-10 bg-white/40 rounded-full blur-lg" />
        <div className="absolute top-32 right-10 w-28 h-12 bg-white/55 rounded-full blur-xl" />
      </div>
      
      {/* Layer 2: Far mountains - Blue/purple atmospheric distance */}
      <div className="absolute bottom-[30%] left-0 right-0">
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountainFarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#2d3748" />
              <stop offset="100%" stopColor="#1a202c" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#mountainFarGrad)" 
            d="M0,400 L0,200 Q200,100 400,180 Q600,50 800,150 Q1000,80 1200,160 Q1400,100 1440,180 L1440,400 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 3: Mid mountains - More definition */}
      <div className="absolute bottom-[22%] left-0 right-0">
        <svg viewBox="0 0 1440 350" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountainMidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5d4a" />
              <stop offset="100%" stopColor="#2f3f2f" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#mountainMidGrad)" 
            d="M0,350 L0,220 Q150,150 300,200 Q450,80 600,180 Q750,100 900,170 Q1050,90 1200,160 Q1350,120 1440,190 L1440,350 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 4: Near hills with trees - More detail */}
      <div className="absolute bottom-[8%] left-0 right-0">
        <svg viewBox="0 0 1440 200" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hillNearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d4d3d" />
              <stop offset="100%" stopColor="#1f2f1f" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#hillNearGrad)" 
            d="M0,200 Q200,140 400,160 Q600,120 800,150 Q1000,110 1200,140 Q1350,130 1440,160 L1440,200 L0,200 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 5: Foreground terrain details */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Large rocks */}
        <div className="absolute bottom-2 left-[5%] w-16 h-10 bg-gray-700 rounded-lg" />
        <div className="absolute bottom-3 left-[12%] w-12 h-8 bg-gray-600 rounded-lg" />
        <div className="absolute bottom-2 right-[15%] w-20 h-12 bg-gray-700 rounded-lg" />
        <div className="absolute bottom-4 right-[25%] w-14 h-9 bg-gray-600 rounded-lg" />
        
        {/* Trees - detailed pine trees */}
        {[8, 18, 35, 55, 72, 88].map((left, i) => (
          <div key={i} className="absolute bottom-12" style={{ left: `${left}%` }}>
            {/* Tree trunk */}
            <div className="w-3 h-8 bg-amber-900 rounded-sm mx-auto" />
            {/* Tree foliage - layered triangles */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="w-8 h-10 bg-green-900 rounded-t-full" style={{ opacity: 0.9 - i * 0.05 }} />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-12 bg-green-800 rounded-t-full" style={{ opacity: 0.85 - i * 0.05 }} />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-14 bg-green-700 rounded-t-full" style={{ opacity: 0.8 - i * 0.05 }} />
            </div>
          </div>
        ))}
        
        {/* Ground texture */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-800 to-amber-700">
          {/* Grass tufts */}
          <div className="absolute bottom-12 left-[3%] text-amber-600 opacity-60">⿿</div>
          <div className="absolute bottom-14 left-[8%] text-amber-600 opacity-50">⿿</div>
          <div className="absolute bottom-10 left-[45%] text-amber-600 opacity-40">⿿</div>
          <div className="absolute bottom-13 left-[78%] text-amber-600 opacity-55">⿿</div>
          <div className="absolute bottom-11 left-[92%] text-amber-600 opacity-45">⿿</div>
        </div>
      </div>
      
      {/* Atmospheric fog layers */}
      <div className="absolute bottom-[20%] left-0 right-0 h-32 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-[35%] left-0 right-0 h-24 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
      
      {/* Dust particles */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
    </div>
  )
}

function IceEnvironment() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Arctic sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200">
        {/* Aurora borealis effect */}
        <div className="absolute top-10 left-0 right-0 h-40">
          <div className="absolute top-0 left-1/4 w-64 h-32 bg-gradient-to-r from-green-400/30 via-cyan-400/20 to-green-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-5 left-1/2 w-48 h-24 bg-gradient-to-r from-purple-400/20 via-cyan-300/20 to-purple-400/20 rounded-full blur-2xl" />
        </div>
      </div>
      
      {/* Layer 2: Far ice mountains - glacial */}
      <div className="absolute bottom-[35%] left-0 right-0">
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="iceMountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a8c8d8" />
              <stop offset="50%" stopColor="#88b0c8" />
              <stop offset="100%" stopColor="#6898a8" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#iceMountainFar)" 
            d="M0,400 L0,180 Q200,80 400,160 Q600,40 800,140 Q1000,60 1200,130 Q1400,90 1440,150 L1440,400 Z" 
          />
        </svg>
        {/* Ice sparkle effects */}
        <div className="absolute top-20 left-[20%] w-4 h-4 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-32 left-[45%] w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-15 left-[70%] w-5 h-5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Layer 3: Mid ice formations */}
      <div className="absolute bottom-[25%] left-0 right-0">
        <svg viewBox="0 0 1440 300" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="iceMountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c8dce8" />
              <stop offset="100%" stopColor="#98b8c8" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#iceMountainMid)" 
            d="M0,300 L0,200 Q150,120 300,170 Q450,80 600,150 Q750,90 900,140 Q1050,70 1200,130 Q1350,100 1440,160 L1440,300 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 4: Near ice chunks */}
      <div className="absolute bottom-[8%] left-0 right-0">
        <svg viewBox="0 0 1440 150" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="iceGround" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8f0f8" />
              <stop offset="100%" stopColor="#c8dce8" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#iceGround)" 
            d="M0,150 Q200,120 400,130 Q600,100 800,120 Q1000,90 1200,115 Q1350,105 1440,125 L1440,150 L0,150 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 5: Foreground ice details */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Ice blocks - crystalline shapes */}
        {[5, 15, 35, 50, 70, 85, 95].map((left, i) => (
          <div 
            key={i}
            className="absolute bg-gradient-to-b from-cyan-100 to-cyan-200"
            style={{ 
              left: `${left}%`, 
              bottom: '2%',
              width: `${20 + i * 5}px`,
              height: `${35 + i * 10}px`,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              opacity: 0.7 + i * 0.03,
              transform: `rotate(${i * 15 - 45}deg)`
            }}
          />
        ))}
        
        {/* Snow ground */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-100 to-white">
          {/* Snow texture */}
          <div className="absolute bottom-2 left-[10%] w-3 h-2 bg-white rounded-full" />
          <div className="absolute bottom-4 left-[30%] w-2 h-1 bg-white rounded-full" />
          <div className="absolute bottom-3 left-[60%] w-4 h-2 bg-white rounded-full" />
          <div className="absolute bottom-5 left-[85%] w-2 h-1 bg-white rounded-full" />
        </div>
      </div>
      
      {/* Snow falling particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.4,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Cold mist overlay */}
      <div className="absolute bottom-[15%] left-0 right-0 h-24 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
    </div>
  )
}

function DesertEnvironment() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Hot desert sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200">
        {/* Harsh sun */}
        <div className="absolute top-8 right-16 w-24 h-24 bg-yellow-100 rounded-full opacity-90">
          <div className="absolute inset-2 bg-yellow-200 rounded-full opacity-60" />
          <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-40" />
        </div>
        {/* Heat haze effect at horizon */}
        <div className="absolute top-1/3 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-orange-300/30 blur-sm" />
      </div>
      
      {/* Layer 2: Far desert mountains */}
      <div className="absolute bottom-[30%] left-0 right-0">
        <svg viewBox="0 0 1440 350" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="desertMountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a67c52" />
              <stop offset="100%" stopColor="#8b6042" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#desertMountainFar)" 
            d="M0,350 L0,200 Q200,120 400,180 Q600,100 800,160 Q1000,80 1200,150 Q1400,110 1440,170 L1440,350 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 3: Mid sand dunes */}
      <div className="absolute bottom-[22%] left-0 right-0">
        <svg viewBox="0 0 1440 280" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sandDuneMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c9a066" />
              <stop offset="100%" stopColor="#a8864c" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#sandDuneMid)" 
            d="M0,280 Q200,200 400,230 Q600,180 800,220 Q1000,170 1200,210 Q1350,190 1440,230 L1440,280 L0,280 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 4: Near sand dunes */}
      <div className="absolute bottom-[8%] left-0 right-0">
        <svg viewBox="0 0 1440 150" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sandDuneNear" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4a96a" />
              <stop offset="100%" stopColor="#b8895a" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#sandDuneNear)" 
            d="M0,150 Q300,110 600,135 Q900,100 1200,130 Q1380,120 1440,140 L1440,150 L0,150 Z" 
          />
        </svg>
      </div>
      
      {/* Layer 5: Foreground desert details */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Cacti - realistic saguaro style */}
        {[12, 42, 78].map((left, i) => (
          <div key={i} className="absolute bottom-14" style={{ left: `${left}%` }}>
            {/* Main trunk */}
            <div className="w-4 h-20 bg-gradient-to-r from-green-700 to-green-600 rounded-t-full" />
            {/* Arms */}
            <div className="absolute top-6 -left-5 w-8 h-3 bg-green-600 rounded-l-full" />
            <div className="absolute top-6 -left-5 w-3 h-8 bg-green-600 rounded-t-full" />
            <div className="absolute top-10 -right-5 w-6 h-3 bg-green-600 rounded-r-full" />
<div className="absolute top-12 -right-5 w-3 h-6 bg-green-600 rounded-t-full" />
            {/* Ribs/texture */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-20 bg-green-800/30" />
          </div>
        ))}
        
        {/* Rocks */}
        {[20, 55, 88].map((left, i) => (
          <div 
            key={i}
            className="absolute bg-gradient-to-b from-amber-700 to-amber-800"
            style={{ 
              left: `${left}%`, 
              bottom: '3%',
              width: `${25 + i * 10}px`,
              height: `${15 + i * 5}px`,
              borderRadius: '40% 60% 50% 50%'
            }}
          />
        ))}
        
        {/* Dead trees */}
        {[65].map((left) => (
          <div key={left} className="absolute bottom-16" style={{ left: `${left}%` }}>
            <div className="w-2 h-12 bg-amber-900 rounded-sm" />
            <div className="absolute top-2 -left-2 w-4 h-1 bg-amber-800 rounded-sm rotate-[-30deg]" />
            <div className="absolute top-4 left-2 w-3 h-1 bg-amber-800 rounded-sm rotate-[30deg]" />
            <div className="absolute top-1 -left-1 w-1 h-4 bg-amber-800 rounded-sm" />
          </div>
        ))}
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-amber-600 to-amber-700">
          {/* Sand ripples */}
          <div className="absolute bottom-8 left-[5%] w-20 h-0.5 bg-amber-800/30 rotate-[-5deg]" />
          <div className="absolute bottom-10 left-[25%] w-16 h-0.5 bg-amber-800/20 rotate-[3deg]" />
          <div className="absolute bottom-7 left-[55%] w-24 h-0.5 bg-amber-800/25 rotate-[-2deg]" />
          <div className="absolute bottom-9 left-[80%] w-18 h-0.5 bg-amber-800/30 rotate-[5deg]" />
        </div>
      </div>
      
      {/* Heat shimmer effect */}
      <div className="absolute bottom-[20%] left-0 right-0 h-40 bg-gradient-to-t from-transparent via-orange-300/10 to-transparent animate-pulse" />
      
      {/* Dust/sand particles */}
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: `radial-gradient(circle, rgba(210,180,140,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export default function GamePage() {
  const router = useRouter()
  const gameAreaRef = useRef<HTMLDivElement>(null)
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [showPowerSelector, setShowPowerSelector] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  // Player state
  const [selectedTeam, setSelectedTeam] = useState<Creature[]>([])
  const [currentCreatureIndex, setCurrentCreatureIndex] = useState(0)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 70 })
  const [playerDirection, setPlayerDirection] = useState<"left" | "right">("right")
  const [isMoving, setIsMoving] = useState(false)
  const [playerMovingPart, setPlayerMovingPart] = useState(false)
  const [movementSpeed, setMovementSpeed] = useState(0)
  
  // Combat state
  const [selectedWorld, setSelectedWorld] = useState<any>(null)
  const [selectedEnemy, setSelectedEnemy] = useState<any>(null)
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [powerEffects, setPowerEffects] = useState<PowerEffect[]>([])
  const [playerHealth, setPlayerHealth] = useState(100)
  const [score, setScore] = useState(0)
  const [isAttacking, setIsAttacking] = useState(false)
  const [attackAnimation, setAttackAnimation] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  
  // 3D Camera state
  const [cameraEnabled, setCameraEnabled] = useState(false)
  
  // Convert 2D position to 3D world position
  const convertTo3DPosition = useCallback((x: number, y: number): [number, number, number] => {
    // Convert percentage-based 2D position to 3D world coordinates
    // X: -15 to 15 (from left: 5% to 95%)
    // Y: represents height in 3D
    // Z: -10 to 10 (depth, from top: 25% to bottom: 75%)
    const worldX = ((x - 50) / 50) * 15
    const worldZ = ((y - 50) / 50) * 10
    return [worldX, 0, worldZ]
  }, [])

  // Movement keys
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})

  // Load game data
  useEffect(() => {
    const team = sessionStorage.getItem("selectedCharacters")
    const world = sessionStorage.getItem("selectedWorld")
    const enemy = sessionStorage.getItem("selectedEnemy")
    
    if (team) setSelectedTeam(JSON.parse(team))
    if (world) setSelectedWorld(JSON.parse(world))
    if (enemy) setSelectedEnemy(JSON.parse(enemy))
  }, [])

  // Spawn enemies - spawn from environment-appropriate positions
  useEffect(() => {
    if (gameStarted && !gamePaused) {
      const spawnEnemy = () => {
        // Spawn based on world type for realistic positioning
        const worldType = selectedWorld?.id || "mountains"
        let spawnArea: { minX: number; maxX: number; minY: number; maxY: number }
        
        switch (worldType) {
          case "ice":
            spawnArea = { minX: 15, maxX: 85, minY: 8, maxY: 25 }
            break
          case "desert":
            spawnArea = { minX: 20, maxX: 80, minY: 10, maxY: 28 }
            break
          default: // mountains
            spawnArea = { minX: 10, maxX: 90, minY: 12, maxY: 30 }
        }
        
        const newEnemy: Enemy = {
          id: `enemy-${Date.now()}`,
          name: selectedEnemy?.name || "Enemy",
          health: 100,
          maxHealth: 100,
          position: {
            x: Math.random() * (spawnArea.maxX - spawnArea.minX) + spawnArea.minX,
            y: Math.random() * (spawnArea.maxY - spawnArea.minY) + spawnArea.minY,
          },
          isMoving: true,
          moveDirection: Math.random() > 0.5 ? 1 : -1,
          isHit: false,
        }
        setEnemies((prev) => [...prev.slice(-4), newEnemy])
      }

      const interval = setInterval(spawnEnemy, 4000)
      return () => clearInterval(interval)
    }
  }, [gameStarted, gamePaused, selectedEnemy, selectedWorld])

  // Enemy movement - more realistic patrol behavior
  useEffect(() => {
    if (!gameStarted || gamePaused) return

    const moveInterval = setInterval(() => {
      setEnemies((prev) => 
        prev.map((enemy) => ({
          ...enemy,
          position: {
            x: Math.max(8, Math.min(92, enemy.position.x + enemy.moveDirection * 0.4)),
            y: Math.max(8, Math.min(35, enemy.position.y + (Math.random() - 0.5) * 0.2))
          }
        }))
      )
    }, 100)

    return () => clearInterval(moveInterval)
  }, [gameStarted, gamePaused])

  // Player movement - smooth acceleration/deceleration
  useEffect(() => {
    if (!gameStarted || gamePaused || !showControls) return

    const moveInterval = setInterval(() => {
      let targetSpeed = 0
      const acceleration = 0.15
      const deceleration = 0.1
      
      if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
        targetSpeed = 1
      }
      if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
        targetSpeed = -1
      }
      
      // Smooth acceleration
      const newSpeed = targetSpeed !== 0 
        ? movementSpeed + (targetSpeed - movementSpeed) * acceleration
        : movementSpeed > 0 
          ? Math.max(0, movementSpeed - deceleration)
          : Math.min(0, movementSpeed + deceleration)
      
      setMovementSpeed(newSpeed)
      
      setPlayerPosition((prev) => {
        let newX = prev.x
        let newY = prev.y
        let moving = Math.abs(newSpeed) > 0.05
        const moveAmount = 0.7

        if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
          newX = Math.max(5, prev.x - moveAmount)
          setPlayerDirection("left")
          moving = true
        }
        if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
          newX = Math.min(95, prev.x + moveAmount)
          setPlayerDirection("right")
          moving = true
        }
        if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
          newY = Math.max(25, prev.y - moveAmount)
          moving = true
        }
        if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
          newY = Math.min(75, prev.y + moveAmount)
          moving = true
        }

        setIsMoving(moving)
        if (moving) {
          setPlayerMovingPart(!playerMovingPart)
        }

        return { x: newX, y: newY }
      })
    }, 30)

    return () => clearInterval(moveInterval)
  }, [keys, gameStarted, gamePaused, showControls, playerMovingPart, movementSpeed])

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPowerSelector(false)
      }
      if (e.key === " " && gameStarted && !gamePaused) {
        e.preventDefault()
        handleAttack()
      }
      // Watch key for power switching
      if ((e.key === "q" || e.key === "Q") && gameStarted && !gamePaused) {
        setShowPowerSelector(!showPowerSelector)
      }
      // Camera toggle key
      if ((e.key === "c" || e.key === "C") && gameStarted) {
        setCameraEnabled(prev => !prev)
      }
      setKeys((prev) => ({ ...prev, [e.key]: true }))
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted, gamePaused, currentCreatureIndex, selectedTeam, showPowerSelector])

  const currentCreature = selectedTeam[currentCreatureIndex]

  const handleAttack = useCallback(() => {
    if (!currentCreature || gamePaused) return
    
    setIsAttacking(true)
    setAttackAnimation(true)
    setScreenShake(true)
    
    // Screen shake timeout
    setTimeout(() => setScreenShake(false), 200)
    
    // Create dramatic power attack effect
    const effect: PowerEffect = {
      id: `effect-${Date.now()}`,
      name: currentCreature.abilities[0],
      active: true,
      x: playerDirection === "right" ? playerPosition.x + 18 : playerPosition.x - 18,
      y: playerPosition.y,
      color: currentCreature.color,
      type: "attack",
    }
    setPowerEffects((prev) => [...prev, effect])
    
    // Damage enemies in range with hit effect
    setEnemies((prev) => {
      return prev.map((enemy) => {
        const distance = Math.sqrt(
          Math.pow(enemy.position.x - playerPosition.x, 2) +
          Math.pow(enemy.position.y - playerPosition.y, 2)
        )
        if (distance < 22) {
          const newHealth = Math.max(0, enemy.health - 25)
          if (newHealth === 0) {
            setScore((s) => s + 150)
          }
          // Add hit effect
          return { ...enemy, health: newHealth, isHit: true }
        }
        return enemy
      }).filter((e) => e.health > 0)
    })

    setTimeout(() => {
      setIsAttacking(false)
      setAttackAnimation(false)
      setPowerEffects((prev) => prev.slice(1))
    }, 700)
  }, [currentCreature, gamePaused, playerPosition, playerDirection])

  const handleSwitchCreature = (index: number) => {
    setCurrentCreatureIndex(index)
    setShowPowerSelector(false)
  }

  const handleStartGame = () => {
    setGameStarted(true)
    setPlayerPosition({ x: 50, y: 65 })
  }

  const handlePauseGame = () => {
    setGamePaused(!gamePaused)
  }

  const handleRestartGame = () => {
    setGameStarted(false)
    setGamePaused(false)
    setEnemies([])
    setPowerEffects([])
    setPlayerHealth(100)
    setScore(0)
    setPlayerPosition({ x: 50, y: 65 })
    setMovementSpeed(0)
  }

  const handleBack = () => {
    router.push("/select-characters")
  }

  // Get world gradient for HUD
  const getWorldGradient = () => {
    if (!selectedWorld) {
      return "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    }
    switch (selectedWorld.id) {
      case "mountains":
        return "linear-gradient(180deg, #4a5568 0%, #2d3748 40%, #1a202c 60%, #4a5568 100%)"
      case "ice":
        return "linear-gradient(180deg, #4299e1 0%, #3182ce 30%, #63b3ed 60%, #4299e1 100%)"
      case "desert":
        return "linear-gradient(180deg, #c9a066 0%, #a67c52 30%, #d4a96a 60%, #c9a066 100%)"
      default:
        return "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    }
  }

  const getEnvironment = () => {
    if (!selectedWorld) return null
    switch (selectedWorld.id) {
      case "mountains": return <MountainsEnvironment />
      case "ice": return <IceEnvironment />
      case "desert": return <DesertEnvironment />
      default: return null
    }
  }

  const getWorldIcon = () => {
    if (!selectedWorld) return <Target className="w-5 h-5" />
    switch (selectedWorld.id) {
      case "mountains": return <Mountain className="w-5 h-5" />
      case "ice": return <Snowflake className="w-5 h-5" />
      case "desert": return <Sun className="w-5 h-5" />
      default: return <Target className="w-5 h-5" />
    }
  }

  // Pre-game setup screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background grid-bg relative scanline-effect">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </button>
              <span className="font-mono text-base sm:text-xl tracking-[0.2em]">
                <span className="text-foreground font-bold">OMNI</span>
                <span className="text-primary font-bold text-glow-green">DEX</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-destructive">
                BATTLE MODE
              </span>
            </div>
          </div>
        </nav>

        <main className="pt-24 sm:pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.05em] mb-4">
                <span className="text-foreground">READY TO </span>
                <span className="text-primary text-glow-green">FIGHT</span>
              </h1>
              <p className="font-sans text-sm text-muted-foreground max-w-lg mx-auto">
                Configure your battle settings before entering the arena.
              </p>
            </div>

            {/* Game Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Character Selection */}
              <div className="border border-border rounded-xl p-6 bg-card/50 backdrop-blur-sm">
                <h2 className="font-mono text-sm tracking-[0.15em] text-primary mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  YOUR CREATURES
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {selectedTeam.map((creature, index) => (
                    <button
                      key={creature.id}
                      onClick={() => setCurrentCreatureIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                        ${index === currentCreatureIndex 
                          ? "border-primary neon-glow scale-105" 
                          : "border-border hover:border-primary/50"}
                      `}
                    >
                      <Image
                        src={creature.image}
                        alt={creature.name}
                        fill
                        className="object-contain p-1"
                      />
                      {index === currentCreatureIndex && (
                        <div className="absolute inset-0 bg-primary/20" />
                      )}
                    </button>
                  ))}
                </div>
                {currentCreature && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                    <p className="font-mono text-xs text-primary mb-1">{currentCreature.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{currentCreature.primaryPower}</p>
                  </div>
                )}
              </div>

              {/* Battlefield Preview */}
              <div className="border border-border rounded-xl p-6 bg-card/50 backdrop-blur-sm">
                <h2 className="font-mono text-sm tracking-[0.15em] text-primary mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  BATTLEFIELD
                </h2>
                <div 
                  className="h-48 rounded-lg overflow-hidden mb-4 relative"
                  style={{ background: getWorldGradient() }}
                >
                  {getEnvironment()}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-mono text-2xl font-bold text-white drop-shadow-lg">
                        {selectedWorld?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Skull className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground">ENEMY</p>
                    <p className="font-mono text-sm text-destructive">{selectedEnemy?.name || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartGame}
                className="font-mono text-sm sm:text-base tracking-[0.15em] bg-primary text-primary-foreground px-12 py-5 rounded flex items-center gap-3 hover:bg-primary/90 hover:neon-glow-strong active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5" />
                ENTER BATTLE
              </button>
            </div>

            {/* Controls Info */}
            <div className="mt-8 p-6 border border-border/50 rounded-xl bg-card/30">
              <h3 className="font-mono text-xs tracking-[0.15em] text-muted-foreground mb-4 text-center">CONTROLS</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-mono text-[10px] text-muted-foreground mb-1">MOVE</p>
                  <div className="flex justify-center gap-1">
                    <kbd className="px-2 py-1 bg-background rounded text-xs">W</kbd>
                    <kbd className="px-2 py-1 bg-background rounded text-xs">A</kbd>
                    <kbd className="px-2 py-1 bg-background rounded text-xs">S</kbd>
                    <kbd className="px-2 py-1 bg-background rounded text-xs">D</kbd>
                  </div>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-mono text-[10px] text-muted-foreground mb-1">ATTACK</p>
                  <kbd className="px-3 py-1 bg-background rounded text-xs">SPACE</kbd>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-mono text-[10px] text-muted-foreground mb-1">SWITCH POWER</p>
                  <kbd className="px-2 py-1 bg-background rounded text-xs">Q</kbd>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="font-mono text-[10px] text-muted-foreground mb-1">PAUSE</p>
                  <kbd className="px-3 py-1 bg-background rounded text-xs">ESC</kbd>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Game Area with optional screen shake */}
      <div 
        ref={gameAreaRef}
        className={`h-full w-full relative transition-transform duration-100 ${screenShake ? 'translate-x-1 translate-y-0.5' : ''}`}
      >
        {/* 3D Environment - Full 3D Battle Area */}
        {gameStarted && selectedWorld && (
          <div className="absolute inset-0">
            <Game3DScene 
              worldType={selectedWorld.id}
              playerPosition={convertTo3DPosition(playerPosition.x, playerPosition.y)}
              playerDirection={playerDirection}
              isPlayerMoving={isMoving}
              playerColor={currentCreature?.color || "#00ff00"}
              enemies={enemies.map(enemy => ({
                id: enemy.id,
                position: convertTo3DPosition(enemy.position.x, enemy.position.y),
                health: enemy.health,
                maxHealth: enemy.maxHealth,
                isHit: enemy.isHit
              }))}
              attackEffect={powerEffects.length > 0 ? {
                position: convertTo3DPosition(powerEffects[0].x, powerEffects[0].y),
                color: powerEffects[0].color
              } : null}
              cameraEnabled={cameraEnabled}
            />
          </div>
        )}

        {/* Fallback to 2D environment if 3D is not ready or before game starts */}
        {(!gameStarted || !selectedWorld) && (
          <div className="absolute inset-0" style={{ background: getWorldGradient() }}>
            {getEnvironment()}
          </div>
        )}

        {/* Atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* HUD - Top */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
          {/* Left: Score & Health */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-primary/30">
              <p className="font-mono text-[10px] text-primary tracking-[0.1em]">SCORE</p>
              <p className="font-mono text-lg text-primary font-bold">{score}</p>
            </div>
            <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-green-500/30">
              <p className="font-mono text-[10px] text-green-400 tracking-[0.1em]">HP</p>
              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden mt-0.5">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${playerHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Game Status & World */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/20 flex items-center gap-2">
              {getWorldIcon()}
              <span className="font-mono text-xs text-white">{selectedWorld?.name}</span>
            </div>
            {gamePaused && (
              <div className="px-3 py-1.5 bg-destructive/90 rounded-lg backdrop-blur-sm">
                <p className="font-mono text-xs text-white tracking-[0.1em]">PAUSED</p>
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Camera Toggle */}
            <button 
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={`p-2 backdrop-blur-sm rounded-lg border transition-colors cursor-pointer ${
                cameraEnabled 
                  ? "bg-cyan-500/30 border-cyan-400 text-cyan-400" 
                  : "bg-black/70 border-border hover:border-primary/50"
              }`}
              title={cameraEnabled ? "Camera: ON - Drag to rotate" : "Camera: OFF"}
            >
              {cameraEnabled ? <RotateCw className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowControls(!showControls)}
              className="p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <button 
              onClick={handlePauseGame}
              className="p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              {gamePaused ? <Play className="w-5 h-5 text-primary" /> : <Pause className="w-5 h-5 text-primary" />}
            </button>
            <button 
              onClick={handleRestartGame}
              className="p-2 bg-black/70 backdrop-blur-sm rounded-lg border border-border hover:border-destructive/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        {/* HUD - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/90 to-black/60">
          <div className="flex items-end justify-between">
            {/* Player Info */}
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-xl border-2 border-primary overflow-hidden bg-card neon-glow">
                {currentCreature && (
                  <Image
                    src={currentCreature.image}
                    alt={currentCreature.name}
                    fill
                    className="object-contain p-1"
                  />
                )}
              </div>
              <div>
                <p className="font-mono text-xs text-primary mb-0.5">{currentCreature?.name}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{currentCreature?.primaryPower}</p>
                <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${playerHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Watch/Power Selector Button - Enhanced */}
            <button
              onClick={() => setShowPowerSelector(!showPowerSelector)}
              className="relative group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400 flex items-center justify-center hover:neon-glow-strong transition-all cursor-pointer animate-pulse">
                <Watch className="w-7 h-7 text-cyan-400" />
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[7px] text-cyan-400 whitespace-nowrap tracking-wider">
                TRANSFORM (Q)
              </span>
            </button>

            {/* Enemy Info */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-mono text-[10px] text-destructive mb-0.5">TARGET</p>
                <div className="w-28 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${enemies[0]?.health || 0}%` }}
                  />
                </div>
                <p className="font-mono text-[8px] text-muted-foreground mt-0.5">
                  {enemies.length > 0 ? `${enemies.length} ACTIVE` : "NO TARGET"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl border-2 border-destructive overflow-hidden bg-card">
                <div className="w-full h-full flex items-center justify-center bg-destructive/20">
                  <Skull className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Power Selector Modal - Enhanced UI */}
        {showPowerSelector && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-cyan-500/50 rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[70vh] overflow-y-auto neon-glow">
              {/* Watch-style header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400 flex items-center justify-center">
                    <Watch className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg text-cyan-400 tracking-[0.1em]">SELECT TRANSFORMATION</h3>
                    <p className="font-mono text-[10px] text-muted-foreground">Choose your alien form</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPowerSelector(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              {/* Creature grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {selectedTeam.map((creature, index) => (
                  <button
                    key={creature.id}
                    onClick={() => handleSwitchCreature(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer
                      ${index === currentCreatureIndex 
                        ? "border-cyan-400 neon-glow-strong scale-105 bg-cyan-500/10" 
                        : "border-border hover:border-cyan-400/50 hover:bg-cyan-500/5"}
                    `}
                  >
                    <Image
                      src={creature.image}
                      alt={creature.name}
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/95 p-1.5">
                      <p className="font-mono text-[7px] text-center text-white truncate">{creature.name}</p>
                      <p className="font-mono text-[6px] text-center" style={{ color: creature.color }}>{creature.primaryPower}</p>
                    </div>
                    {index === currentCreatureIndex && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Current selection info */}
              {currentCreature && (
                <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-400/50">
                      <Image
                        src={currentCreature.image}
                        alt={currentCreature.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-cyan-400">{currentCreature.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">Ability: {currentCreature.abilities[0]}</p>
                    </div>
                    <div className="flex gap-1">
                      {currentCreature.abilities.slice(1, 4).map((ability, i) => (
                        <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCreature.color, opacity: 0.5 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Movement Controls (Mobile) */}
        {showControls && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 sm:hidden">
            <div className="grid grid-cols-3 gap-2">
              <div />
              <button
                onMouseDown={() => setKeys((prev) => ({ ...prev, ArrowUp: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, ArrowUp: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, ArrowUp: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, ArrowUp: false }))}
                className="w-14 h-14 bg-black/70 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center active:bg-primary/30"
              >
                <ChevronUp className="w-7 h-7 text-primary" />
              </button>
              <div />
              <button
                onMouseDown={() => setKeys((prev) => ({ ...prev, ArrowLeft: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, ArrowLeft: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, ArrowLeft: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, ArrowLeft: false }))}
                className="w-14 h-14 bg-black/70 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center active:bg-primary/30"
              >
                <ChevronLeft className="w-7 h-7 text-primary" />
              </button>
              <button
                onMouseDown={() => setKeys((prev) => ({ ...prev, ArrowDown: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, ArrowDown: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, ArrowDown: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, ArrowDown: false }))}
                className="w-14 h-14 bg-black/70 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center active:bg-primary/30"
              >
                <ChevronDown className="w-7 h-7 text-primary" />
              </button>
              <button
                onMouseDown={() => setKeys((prev) => ({ ...prev, ArrowRight: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, ArrowRight: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, ArrowRight: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, ArrowRight: false }))}
                className="w-14 h-14 bg-black/70 backdrop-blur-sm rounded-lg border border-primary/30 flex items-center justify-center active:bg-primary/30"
              >
                <ChevronRight className="w-7 h-7 text-primary" />
              </button>
            </div>
            
            {/* Attack Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAttack}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-red-500 flex items-center justify-center hover:from-red-500 hover:to-red-700 active:scale-95 transition-all shadow-lg shadow-red-500/30"
              >
                <Swords className="w-10 h-10 text-white" />
              </button>
            </div>
            
            {/* Camera Toggle Info */}
            {cameraEnabled && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32">
                <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/50">
                  <p className="text-cyan-400 font-mono text-xs text-center">
                    Drag to rotate camera
                  </p>
                  <p className="text-cyan-400/60 font-mono text-[10px] text-center">
                    Press C or click to disable
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Player Character - Only show when not in 3D mode */}
        {!cameraEnabled && (
        <div
          className="absolute z-10 transition-transform duration-75"
          style={{
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
            transform: `translate(-50%, -50%) scaleX(${playerDirection === "left" ? -1 : 1})`,
          }}
        >
          {/* Character container */}
          <div className={`relative ${isMoving ? "animate-bounce-subtle" : ""} ${attackAnimation ? "scale-110" : "scale-100"} transition-all duration-150`}>
            {/* Main character */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative">
              {currentCreature && (
                <>
                  {/* Glow effect behind character */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ 
                      background: `radial-gradient(circle, ${currentCreature.color}40 0%, transparent 70%)`
                    }}
                  />
                  <Image
                    src={currentCreature.image}
                    alt={currentCreature.name}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </>
              )}
              
              {/* Attack Effect - Dramatic */}
              {attackAnimation && currentCreature && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-28 h-28 flex items-center"
                  style={{
                    filter: `drop-shadow(0 0 40px ${currentCreature.color})`,
                  }}
                >
                  {/* Multiple sparkle layers */}
                  <Sparkles 
                    className="w-20 h-20 animate-ping" 
                    style={{ color: currentCreature.color }}
                  />
                  <div 
                    className="absolute right-4 w-16 h-16 rounded-full animate-pulse"
                    style={{ 
                      background: `radial-gradient(circle, ${currentCreature.color}80 0%, transparent 70%)`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Character shadow - dynamic based on position */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-black/50 rounded-full blur-md transition-all duration-300"
              style={{ 
                transform: `translateX(-50%) scaleX(${isMoving ? 1.2 : 1})`,
                opacity: isMoving ? 0.3 : 0.5
              }}
            />
            
            {/* Movement dust effect */}
            {isMoving && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <div className="w-8 h-2 bg-white/20 rounded-full animate-ping" />
              </div>
            )}
          </div>
        </div>
        )}

        {/* Enemies - Only show when not in 3D mode */}
        {!cameraEnabled && enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="absolute z-10"
            style={{
              left: `${enemy.position.x}%`,
              top: `${enemy.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className={`relative transition-all duration-200 ${enemy.isHit ? "animate-hit-shake" : ""}`}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
                {/* Enemy glow */}
                <div className="absolute inset-0 rounded-full blur-lg opacity-40 bg-red-500" />
                
                {/* Main enemy body */}
                <div 
                  className={`w-full h-full rounded-full flex items-center justify-center border-2 ${enemy.isHit ? "animate-pulse bg-red-500/50" : "animate-pulse"}`}
                  style={{ 
                    backgroundColor: enemy.isHit ? 'rgba(255, 59, 92, 0.4)' : 'rgba(255, 59, 92, 0.2)',
                    borderColor: enemy.isHit ? '#ff3b5c' : '#ff3b5c',
                  }}
                >
                  <Skull className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                </div>
                
                {/* Health bar */}
                <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Hit effect particles */}
              {enemy.isHit && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-red-500 rounded-full animate-ping opacity-50" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Power Effects - Dramatic attack visuals */}
        {powerEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute pointer-events-none z-15"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              {/* Main effect */}
              <Sparkles 
                className="w-24 h-24 animate-spin" 
                style={{ 
                  color: effect.color,
                  filter: `drop-shadow(0 0 50px ${effect.color})`
                }} 
              />
              {/* Glow ring */}
              <div 
                className="absolute inset-0 w-24 h-24 rounded-full border-2 animate-ping"
                style={{ borderColor: effect.color, opacity: 0.5 }}
              />
              {/* Effect name */}
              <p 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap font-bold"
                style={{ 
                  color: effect.color,
                  textShadow: `0 0 10px ${effect.color}`
                }}
              >
                {effect.name}
              </p>
            </div>
          </div>
        ))}

        {/* Game Paused Overlay */}
        {gamePaused && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center bg-card p-8 rounded-xl border border-primary/30 neon-glow">
              <h2 className="font-mono text-4xl text-primary mb-4 tracking-[0.2em]">PAUSED</h2>
              <button
                onClick={handlePauseGame}
                className="font-mono text-sm tracking-[0.15em] bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-primary/90 transition-colors cursor-pointer"
              >
                RESUME
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.3s ease-in-out;
        }
        
        @keyframes hit-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-hit-shake {
          animation: hit-shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  )
}


