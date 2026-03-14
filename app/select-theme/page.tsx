"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Mountain, Snowflake, Sun, Skull, Zap } from "lucide-react"

/* ─────────────── DATA ─────────────── */

interface World {
  id: string
  name: string
  description: string
  image: string
  color: string
  gradient: string
  icon: React.ReactNode
}

interface Enemy {
  id: string
  name: string
  description: string
  image: string
  color: string
  icon: React.ReactNode
}

const worlds: World[] = [
  {
    id: "mountains",
    name: "MOUNTAINS",
    description: "Rugged peaks with rocky terrain and dramatic cliffs. A challenging landscape for the fiercest battles.",
    image: "/worlds/mountains.jpg",
    color: "#8b7355",
    gradient: "linear-gradient(180deg, #2d3436 0%, #636e72 40%, #b2bec3 70%, #2d3436 100%)",
    icon: <Mountain className="w-8 h-8" />,
  },
  {
    id: "ice",
    name: "ICE WORLD",
    description: "Frozen tundra with slippery surfaces and blinding snow storms. Extreme conditions demand extreme power.",
    image: "/worlds/ice.jpg",
    color: "#00d4ff",
    gradient: "linear-gradient(180deg, #0c2461 0%, #1e3799 40%, #4a69bd 70%, #0c2461 100%)",
    icon: <Snowflake className="w-8 h-8" />,
  },
  {
    id: "desert",
    name: "DESERT",
    description: "Endless dunes with scorching heat and hidden oases. Survival of the fittest in the harshest environment.",
    image: "/worlds/desert.jpg",
    color: "#ff9100",
    gradient: "linear-gradient(180deg, #6d4c41 0%, #a1887f 40%, #d7ccc8 70%, #6d4c41 100%)",
    icon: <Sun className="w-8 h-8" />,
  },
]

const enemies: Enemy[] = [
  {
    id: "vilgax",
    name: "VILGAX",
    description: "The most feared warlord in the galaxy. Legendary for his destructive power and ruthless tactics.",
    image: "/enemies/vilgax.png",
    color: "#ff3b5c",
    icon: <Skull className="w-6 h-6" />,
  },
  {
    id: "top10",
    name: "TOP 10 VILLAINS",
    description: "An army of the most dangerous adversaries. Each one a formidable challenge.",
    image: "/enemies/villains.png",
    color: "#9c27b0",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "hex",
    name: "HEX",
    description: "A master of dark magic and sorcery. His mystical powers are not to be underestimated.",
    image: "/enemies/hex.png",
    color: "#673ab7",
    icon: <Skull className="w-6 h-6" />,
  },
  {
    id: "insta",
    name: "DARK MIND",
    description: "A sinister entity from the Null Void. Powerful telekinetic abilities.",
    image: "/enemies/darkmind.png",
    color: "#e91e63",
    icon: <Skull className="w-6 h-6" />,
  },
  {
    id: "quora",
    name: "ALBEDO",
    description: "A hybrid mutant with the ability to copy any alien form he sees.",
    image: "/enemies/albedo.png",
    color: "#00bcd4",
    icon: <Skull className="w-6 h-6" />,
  },
]

/* ─────────────── PAGE ─────────────── */

export default function SelectThemePage() {
  const router = useRouter()
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)
  const [step, setStep] = useState<"world" | "enemy">("world")

  const handleWorldSelect = (world: World) => {
    setSelectedWorld(world)
  }

  const handleEnemySelect = (enemy: Enemy) => {
    setSelectedEnemy(enemy)
  }

  const handleContinue = () => {
    if (step === "world" && selectedWorld) {
      setStep("enemy")
    } else if (step === "enemy" && selectedWorld && selectedEnemy) {
      sessionStorage.setItem("selectedWorld", JSON.stringify(selectedWorld))
      sessionStorage.setItem("selectedEnemy", JSON.stringify(selectedEnemy))
      router.push("/select-characters")
    }
  }

  const handleBack = () => {
    if (step === "enemy") {
      setStep("world")
    } else {
      router.push("/")
    }
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
            <div className={`flex items-center gap-2 ${step === "world" ? "text-primary" : "text-primary/50"}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs ${step === "world" ? "border-primary bg-primary/10" : "border-primary/50"}`}>
                1
              </div>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em]">WORLD</span>
            </div>
            <div className="w-12 sm:w-20 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === "enemy" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs ${step === "enemy" ? "border-primary bg-primary/10" : "border-border"}`}>
                2
              </div>
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em]">ENEMY</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.05em] mb-3 sm:mb-4">
              <span className="text-foreground">
                {step === "world" ? "SELECT BATTLEFIELD" : "SELECT ENEMY"}
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              {step === "world" 
                ? "Choose your arena for the upcoming battle." 
                : "Choose your opponent for this mission."}
            </p>
          </div>

          {/* World Selection */}
          {step === "world" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {worlds.map((world) => (
                <button
                  key={world.id}
                  onClick={() => handleWorldSelect(world)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer text-left
                    ${selectedWorld?.id === world.id 
                      ? "border-primary neon-glow-strong scale-[1.02]" 
                      : "border-border/50 hover:border-primary/60 hover:neon-glow hover:scale-[1.01]"}
                  `}
                >
                  {/* World Preview with Gradient Background */}
                  <div 
                    className="relative h-40 sm:h-48 md:h-56 overflow-hidden"
                    style={{ background: world.gradient }}
                  >
                    {/* World Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm"
                          style={{ 
                            backgroundColor: `${world.color}30`,
                            color: world.color 
                          }}
                        >
                          {world.icon}
                        </div>
                        <h3 
                          className="font-mono text-lg sm:text-xl font-bold tracking-wider text-white drop-shadow-lg"
                        >
                          {world.name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Selected Indicator */}
                    {selectedWorld?.id === world.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center neon-glow-strong">
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Corner accents */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-white/50" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-white/50" />
                  </div>

                  {/* Description */}
                  <div className="p-4 sm:p-5 bg-card/90 backdrop-blur-sm border-t border-border">
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                      {world.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Enemy Selection */}
          {step === "enemy" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {enemies.map((enemy) => (
                <button
                  key={enemy.id}
                  onClick={() => handleEnemySelect(enemy)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer text-center
                    ${selectedEnemy?.id === enemy.id 
                      ? "border-destructive neon-glow-strong scale-[1.02] bg-destructive/10" 
                      : "border-border/50 hover:border-destructive/60 hover:bg-destructive/5"}
                  `}
                >
                  {/* Enemy Image Placeholder */}
                  <div 
                    className="relative h-32 sm:h-40 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, ${enemy.color}20 0%, ${enemy.color}10 100%)`,
                    }}
                  >
                    {/* Enemy Silhouette/Icon */}
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${enemy.color}30`,
                        border: `2px solid ${enemy.color}50`,
                      }}
                    >
                      <div style={{ color: enemy.color }}>
                        {enemy.icon}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedEnemy?.id === enemy.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-destructive flex items-center justify-center animate-pulse">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Enemy Info */}
                  <div className="p-3 sm:p-4 bg-card/90 backdrop-blur-sm border-t border-border">
                    <h3 
                      className="font-mono text-sm sm:text-base font-bold tracking-wider mb-1"
                      style={{ color: enemy.color }}
                    >
                      {enemy.name}
                    </h3>
                    <p className="font-sans text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {enemy.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-10 sm:mt-14">
            <button
              onClick={handleContinue}
              disabled={(step === "world" && !selectedWorld) || (step === "enemy" && !selectedEnemy)}
              className={`font-mono text-xs sm:text-sm tracking-[0.15em] px-8 sm:px-12 py-3 sm:py-4 rounded flex items-center gap-3 transition-all cursor-pointer
                ${(step === "world" && selectedWorld) || (step === "enemy" && selectedEnemy)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:neon-glow-strong active:scale-95" 
                  : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"}
              `}
            >
              {step === "world" ? "SELECT ENEMY" : "CONTINUE"}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Selected Summary */}
          {selectedWorld && (
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: selectedWorld.gradient }}
                >
                  <div style={{ color: selectedWorld.color }}>
                    {selectedWorld.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">SELECTED WORLD</p>
                  <p className="font-mono text-sm font-bold" style={{ color: selectedWorld.color }}>{selectedWorld.name}</p>
                </div>
                {selectedEnemy && (
                  <>
                    <div className="w-px h-12 bg-border" />
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedEnemy.color}20` }}
                    >
                      <div style={{ color: selectedEnemy.color }}>
                        {selectedEnemy.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">SELECTED ENEMY</p>
                      <p className="font-mono text-sm font-bold" style={{ color: selectedEnemy.color }}>{selectedEnemy.name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-2 sm:gap-3">
          <p className="font-sans text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            {"© 2026 Omnidex System. Phase 2: Battle Selection"}
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

