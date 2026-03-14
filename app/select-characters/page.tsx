"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Check, Zap, Shield, Brain, Gauge, Flame, Gem, Cpu, Ghost, Bug, Dog, Circle, Droplets } from "lucide-react"

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

/* ─────────────── PAGE ─────────────── */

export default function SelectCharactersPage() {
  const router = useRouter()
  const [selectedCharacters, setSelectedCharacters] = useState<Creature[]>([])
  const [selectedWorld, setSelectedWorld] = useState<any>(null)
  const [selectedEnemy, setSelectedEnemy] = useState<any>(null)

  useEffect(() => {
    // Load selections from sessionStorage
    const world = sessionStorage.getItem("selectedWorld")
    const enemy = sessionStorage.getItem("selectedEnemy")
    if (world) setSelectedWorld(JSON.parse(world))
    if (enemy) setSelectedEnemy(JSON.parse(enemy))
  }, [])

  const handleCharacterToggle = (creature: Creature) => {
    setSelectedCharacters((prev) => {
      const isSelected = prev.some((c) => c.id === creature.id)
      if (isSelected) {
        return prev.filter((c) => c.id !== creature.id)
      } else if (prev.length < 5) {
        return [...prev, creature]
      }
      return prev
    })
  }

  const handleStartGame = () => {
    if (selectedCharacters.length >= 4) {
      sessionStorage.setItem("selectedCharacters", JSON.stringify(selectedCharacters))
      router.push("/game")
    }
  }

  const handleBack = () => {
    router.push("/select-theme")
  }

  return (
    <div className="min-h-screen bg-background grid-bg relative scanline-effect">
      {/* NAVBAR */}
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
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-muted-foreground">
              PHASE 2
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-20 sm:pt-28 pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <div className="flex items-center gap-2 text-primary/50">
              <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center font-mono text-xs">
                1
              </div>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em]">WORLD</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-2 text-primary/50">
              <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center font-mono text-xs">
                2
              </div>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em]">ENEMY</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-border" />
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center font-mono text-xs">
                3
              </div>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em]">TEAM</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.05em] mb-3 sm:mb-4">
              <span className="text-foreground">SELECT YOUR </span>
              <span className="text-primary text-glow-green">SQUAD</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              Choose 4-5 creatures for your team. Each creature brings unique powers to the battle.
            </p>
          </div>

          {/* Selection Counter */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground">
                SELECTED:
              </span>
              <span className={`font-mono text-lg font-bold ${selectedCharacters.length >= 4 ? "text-primary" : "text-destructive"}`}>
                {selectedCharacters.length}/5
              </span>
            </div>
            {selectedCharacters.length < 4 && (
              <span className="font-mono text-[10px] text-destructive">
                (Minimum 4 required)
              </span>
            )}
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {creatures.map((creature) => {
              const isSelected = selectedCharacters.some((c) => c.id === creature.id)
              return (
                <button
                  key={creature.id}
                  onClick={() => handleCharacterToggle(creature)}
                  disabled={!isSelected && selectedCharacters.length >= 5}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
                    ${isSelected 
                      ? "border-primary neon-glow-strong scale-[1.02]" 
                      : "border-border/50 hover:border-primary/60 hover:neon-glow"}
                    ${!isSelected && selectedCharacters.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center neon-glow-strong">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative aspect-square bg-gradient-to-b from-card/80 to-background flex items-center justify-center p-2">
                    <Image
                      src={creature.image}
                      alt={creature.name}
                      fill
                      className="object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-2 sm:p-3 bg-card/90 backdrop-blur-sm border-t border-border">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${creature.color}20`,
                          color: creature.color,
                        }}
                      >
                        {creature.icon}
                      </div>
                    </div>
                    <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.1em] text-foreground font-bold text-center line-clamp-1">
                      {creature.name}
                    </p>
                    <p className="font-mono text-[7px] sm:text-[8px] text-muted-foreground text-center mt-0.5 line-clamp-1">
                      {creature.primaryPower}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Characters Preview */}
          {selectedCharacters.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-muted-foreground text-center mb-4">
                YOUR TEAM
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {selectedCharacters.map((creature, index) => (
                  <div
                    key={creature.id}
                    className="relative group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-primary neon-glow bg-card p-1">
                      <Image
                        src={creature.image}
                        alt={creature.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-mono flex items-center justify-center">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => handleCharacterToggle(creature)}
                      className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Info Summary */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {selectedWorld && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${selectedWorld.color}20`, color: selectedWorld.color }}
                  >
                    {/* Using a simple icon fallback */}
                    <span className="font-mono text-xs">🌍</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">BATTLEFIELD</p>
                    <p className="font-mono text-sm font-bold" style={{ color: selectedWorld.color }}>{selectedWorld.name}</p>
                  </div>
                </div>
              )}
              {selectedEnemy && (
                <>
                  <div className="hidden sm:block w-px h-10 bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/20 text-destructive">
                      <span className="font-mono text-xs">👹</span>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">ENEMY</p>
                      <p className="font-mono text-sm font-bold text-destructive">{selectedEnemy.name}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-10 sm:mt-14">
            <button
              onClick={handleStartGame}
              disabled={selectedCharacters.length < 4}
              className={`font-mono text-sm sm:text-base tracking-[0.15em] px-12 sm:px-16 py-4 sm:py-5 rounded flex items-center gap-3 transition-all cursor-pointer
                ${selectedCharacters.length >= 4
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:neon-glow-strong active:scale-95" 
                  : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"}
              `}
            >
              <Zap className="w-5 h-5" />
              START GAME
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-2 sm:gap-3">
          <p className="font-sans text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            {"© 2026 Omnidex System. Phase 2: Team Selection"}
          </p>
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary inline-block" />
            MADE BY <span className="text-foreground font-bold">TAHIRA</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

