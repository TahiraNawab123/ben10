"use client"

import { useState, useRef, useCallback, memo } from "react"
import Image from "next/image"
import {
  Zap,
  Shield,
  Brain,
  Gauge,
  ChevronDown,
  ArrowRight,
  Settings,
  Flame,
  Gem,
  Cpu,
  Ghost,
  Bug,
  Dog,
  Circle,
  Droplets,
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
  durability: string
  strength: number
  velocity: number
  intellect: number
  abilities: string[]
}

const creatures: Creature[] = [
  {
    id: "heatblast",
    name: "HEATBLAST",
    image: "/creatures/heatblast.jpg",
    color: "#ff3b5c",
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A being composed of living molten rock. Heatblast can generate temperatures rivaling the surface of a star. His body acts as a geothermal reactor, capable of causing eruptions and melting through the toughest terrestrial alloys.",
    primaryPower: "Pyrokinesis",
    durability: "Heat Immunity",
    strength: 70,
    velocity: 50,
    intellect: 55,
    abilities: ["Fire Projection", "Lava Generation", "Fire Absorption", "Supernova Burst"],
  },
  {
    id: "fourarms",
    name: "FOUR ARMS",
    image: "/creatures/fourarms.jpg",
    color: "#ff3b5c",
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A colossal Tetramand warrior from the planet Khoros. Four Arms possesses incredible physical strength surpassing most known species. Each of his four arms can lift several tons independently, making him a living siege engine.",
    primaryPower: "Super Strength",
    durability: "Enhanced Armor",
    strength: 95,
    velocity: 30,
    intellect: 40,
    abilities: ["Shockwave Clap", "Ground Pound", "Enhanced Jumping", "Quad Punch Combo"],
  },
  {
    id: "xlr8",
    name: "XLR8",
    image: "/creatures/xlr8.jpg",
    color: "#00d4ff",
    icon: <Gauge className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Kineceleran from the planet Kinet. XLR8 can accelerate to speeds exceeding 500 mph in seconds. His unique wheel-like feet and aerodynamic body allow near-frictionless movement across any surface.",
    primaryPower: "Hyper Speed",
    durability: "Kinetic Shield",
    strength: 35,
    velocity: 99,
    intellect: 65,
    abilities: ["Speed Mirages", "Tornado Generation", "Time Perception Shift", "Friction Dash"],
  },
  {
    id: "diamondhead",
    name: "DIAMONDHEAD",
    image: "/creatures/diamondhead.jpg",
    color: "#00ff88",
    icon: <Gem className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Petrosapien from the planet Petropia. Diamondhead's body is composed of an extremely durable crystal compound. He can reshape his crystalline structure at will, forming weapons, shields, and projectiles.",
    primaryPower: "Crystal Generation",
    durability: "Diamond Body",
    strength: 80,
    velocity: 40,
    intellect: 60,
    abilities: ["Crystal Projectiles", "Body Reformation", "Light Refraction", "Crystal Cage"],
  },
  {
    id: "upgrade",
    name: "UPGRADE",
    image: "/creatures/upgrade.jpg",
    color: "#00ff88",
    icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Mechamorph from Galvan B. Upgrade is a living techno-organic entity that can merge with and enhance any technology. His liquid-metal form allows him to interface with machines at a molecular level.",
    primaryPower: "Techno-Merge",
    durability: "Adaptive Form",
    strength: 50,
    velocity: 55,
    intellect: 95,
    abilities: ["Machine Fusion", "Tech Enhancement", "Optic Beam", "Liquid Metal Shift"],
  },
  {
    id: "ghostfreak",
    name: "GHOSTFREAK",
    image: "/creatures/ghostfreak.jpg",
    color: "#b388ff",
    icon: <Ghost className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "An Ectonurite from Anur Phaetos. Ghostfreak exists partially in another dimension, allowing him to phase through solid matter. His terrifying presence can instill fear in even the bravest warriors.",
    primaryPower: "Intangibility",
    durability: "Phase Defense",
    strength: 30,
    velocity: 60,
    intellect: 80,
    abilities: ["Invisibility", "Possession", "Telekinesis", "Shadow Tendrils"],
  },
  {
    id: "stinkfly",
    name: "STINKFLY",
    image: "/creatures/stinkfly.jpg",
    color: "#76ff03",
    icon: <Bug className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Lepidopterran from Lepidopterra. Stinkfly is an insectoid alien capable of sustained flight with four powerful wings. He can secrete a potent adhesive slime and toxic gas from his eye stalks.",
    primaryPower: "Aerial Combat",
    durability: "Exoskeleton",
    strength: 45,
    velocity: 75,
    intellect: 50,
    abilities: ["Slime Projection", "Toxic Gas", "360 Vision", "Wing Blade Attack"],
  },
  {
    id: "wildmutt",
    name: "WILDMUTT",
    image: "/creatures/wildmutt.jpg",
    color: "#ff9100",
    icon: <Dog className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Vulpimancer from Vulpin. Despite having no eyes, Wildmutt perceives the world through gill-like nostrils that detect thermal signatures, vibrations, and chemical traces with extreme precision.",
    primaryPower: "Sensory Tracking",
    durability: "Thick Hide",
    strength: 75,
    velocity: 70,
    intellect: 35,
    abilities: ["Thermal Vision", "Sonic Detection", "Razor Claws", "Pounce Attack"],
  },
  {
    id: "cannonbolt",
    name: "CANNONBOLT",
    image: "/creatures/cannonbolt.jpg",
    color: "#ffd600",
    icon: <Circle className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "An Arburian Pelarota from Arburia. Cannonbolt can curl into a near-indestructible sphere, rolling at tremendous speeds. His armored shell can withstand atmospheric re-entry temperatures.",
    primaryPower: "Rolling Impact",
    durability: "Shell Armor",
    strength: 85,
    velocity: 65,
    intellect: 30,
    abilities: ["Sphere Mode", "Ricochet Strike", "Armor Deflection", "Seismic Roll"],
  },
  {
    id: "ripjaws",
    name: "RIPJAWS",
    image: "/creatures/ripjaws.jpg",
    color: "#00bcd4",
    icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />,
    description:
      "A Piscciss Volann from Piscciss. Ripjaws is an aquatic predator with jaws strong enough to bite through steel. His body is perfectly adapted for deep-sea combat and extreme underwater pressure.",
    primaryPower: "Aquatic Combat",
    durability: "Pressure Resist",
    strength: 70,
    velocity: 80,
    intellect: 45,
    abilities: ["Steel-Bite Jaws", "Deep Dive", "Tail Whip", "Aqua Jet Dash"],
  },
]

/* ─────────────── PAGE ─────────────── */

export default function OmnidexPage() {
  const [selected, setSelected] = useState<Creature | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const [animateKey, setAnimateKey] = useState(0)

  const handleSelect = useCallback(
    (creature: Creature) => {
      if (selected?.id === creature.id) return
      setIsTransitioning(true)
      setTimeout(() => {
        setSelected(creature)
        setAnimateKey((k) => k + 1)
        setIsTransitioning(false)
        setTimeout(() => {
          detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }, 200)
    },
    [selected]
  )

  return (
    <div className="min-h-screen bg-background grid-bg relative scanline-effect">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="font-mono text-base sm:text-xl tracking-[0.2em]">
              <span className="text-foreground font-bold">OMNI</span>
              <span className="text-primary font-bold text-glow-green">DEX</span>
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hidden md:block font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              DATABASE
            </span>
            <span className="hidden md:block font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              SIMULATIONS
            </span>
            <button className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-primary border border-primary/60 px-3 sm:px-4 py-1 sm:py-1.5 rounded hover:bg-primary/10 transition-all cursor-pointer">
              CONNECTED
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-16 sm:pt-24">
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
          {/* System Active Badge */}
          <div className="inline-block mb-4 sm:mb-6">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-primary border border-primary/40 px-3 sm:px-5 py-1.5 sm:py-2 rounded bg-primary/5">
              SYSTEM ACTIVE
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.05em] mb-3 sm:mb-4 text-balance">
            <span className="text-foreground">SELECT DNA </span>
            <span className="text-primary text-glow-green italic">SAMPLE</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Browse the Omnidex database to initialize transformation sequence.
          </p>

          {/* Creature Carousel */}
          <div
            ref={scrollRef}
            className="scroll-container flex gap-3 sm:gap-6 overflow-x-auto pb-4 sm:pb-6 px-1 sm:px-2 snap-x snap-mandatory"
          >
            {creatures.map((c, i) => (
              <CreatureCard
                key={c.id}
                creature={c}
                isSelected={selected?.id === c.id}
                onSelect={handleSelect}
                priority={i < 4}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center gap-1.5 sm:gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
              <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] uppercase">Scroll to initiate</span>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
          </div>
        </section>

        {/* DETAIL SECTION */}
        {selected && (
          <section
            ref={detailRef}
            key={animateKey}
            className={`max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 sm:pb-20 animate-fade-in-up ${isTransitioning ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
          >
            <div className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Image */}
                <div className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-auto lg:h-[600px] border-b lg:border-b-0 lg:border-r border-border">
                  <div className="absolute inset-3 sm:inset-4 lg:inset-6 rounded-xl overflow-hidden bg-gradient-to-b from-card to-background">
                    <Image
                      src={selected.image}
                      alt={`Detailed view of ${selected.name}, a powerful alien creature`}
                      fill
                      className="object-contain p-4 sm:p-6 lg:p-8"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    {/* Green line accent at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary neon-glow" />
                  </div>
                </div>

                {/* Right: Info */}
                <div className="p-4 sm:p-6 md:p-10 flex flex-col gap-5 sm:gap-8">
                  {/* Name */}
                  <div>
                    <h2
                      className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-wide text-balance"
                      style={{ color: selected.color, textShadow: `0 0 20px ${selected.color}40, 0 0 40px ${selected.color}20` }}
                    >
                      {selected.name}
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="border-l-2 border-muted-foreground/30 pl-4 sm:pl-5">
                    <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                      {selected.description}
                    </p>
                  </div>

                  {/* Power + Durability Cards */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="border border-border rounded-lg p-3 sm:p-5 bg-secondary/30">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-1.5 sm:mb-2" />
                      <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.15em] text-muted-foreground mb-0.5 sm:mb-1">
                        PRIMARY POWER
                      </p>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-foreground">
                        {selected.primaryPower}
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-3 sm:p-5 bg-secondary/30">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-1.5 sm:mb-2" />
                      <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.15em] text-muted-foreground mb-0.5 sm:mb-1">
                        DURABILITY
                      </p>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-foreground">
                        {selected.durability}
                      </p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] text-muted-foreground mb-3 sm:mb-5">
                      PERFORMANCE METRICS
                    </p>
                    <MetricBar label="STRENGTH" value={selected.strength} color="#ff3b5c" animKey={animateKey} />
                    <MetricBar label="VELOCITY" value={selected.velocity} color="#00d4ff" animKey={animateKey} />
                    <MetricBar label="INTELLECT" value={selected.intellect} color="#b388ff" animKey={animateKey} />
                  </div>

                  {/* Abilities */}
                  <div>
                    <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] text-muted-foreground mb-2 sm:mb-3">
                      SPECIAL ABILITIES
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {selected.abilities.map((a) => (
                        <span
                          key={a}
                          className="font-mono text-[8px] sm:text-[10px] tracking-wider border border-border px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-secondary/50 text-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      className="self-start font-mono text-[10px] sm:text-xs tracking-[0.15em] border border-primary/60 text-primary px-5 sm:px-8 py-2.5 sm:py-3.5 rounded flex items-center gap-2 sm:gap-3 hover:bg-primary/10 hover:neon-glow transition-all cursor-pointer active:scale-95"
                    >
                      INITIATE SEQUENCE
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => window.location.href = '/select-theme'}
                      className="self-start font-mono text-[10px] sm:text-xs tracking-[0.15em] bg-primary text-primary-foreground px-5 sm:px-8 py-2.5 sm:py-3.5 rounded flex items-center gap-2 sm:gap-3 hover:bg-primary/90 hover:neon-glow-strong transition-all cursor-pointer active:scale-95"
                    >
                      LAUNCH GAME
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 gap-2 sm:gap-3">
          <p className="font-sans text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            {"© 2026 Omnidex System. Typography: "}
            <span className="italic text-foreground/60">Orbitron</span>
            {" (Headers) & "}
            <span className="italic text-foreground/60">Exo 2</span>
            {" (Body)."}
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

/* ─────────────── CREATURE CARD (memoized) ─────────────── */

const CreatureCard = memo(function CreatureCard({
  creature,
  isSelected,
  onSelect,
  priority,
}: {
  creature: Creature
  isSelected: boolean
  onSelect: (c: Creature) => void
  priority: boolean
}) {
  return (
    <button
      onClick={() => onSelect(creature)}
      className={`group relative flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-center rounded-xl border-2 overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected ? "border-primary neon-glow-strong scale-[1.02]" : "border-border/50 hover:border-primary/60 hover:neon-glow hover:scale-[1.01]"}
      `}
    >
      {/* Image Container - Optimized for transparent PNGs */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] bg-gradient-to-b from-card/80 to-background flex items-center justify-center p-2">
        <Image
          src={creature.image}
          alt={`${creature.name} preview`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105 p-1"
          sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>

      {/* Info overlay */}
      <div className="bg-card/90 backdrop-blur-sm p-2 sm:p-3 flex flex-col items-center gap-1.5">
        {/* Icon circle */}
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center bg-background/80 transition-colors duration-300"
          style={{
            borderColor: isSelected ? creature.color : "rgba(255,255,255,0.1)",
            color: creature.color,
          }}
        >
          {creature.icon}
        </div>
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.1em] text-foreground font-bold">
          {creature.name}
        </span>
      </div>
    </button>
  )
})

/* ─────────────── METRIC BAR (memoized) ─────────────── */

const MetricBar = memo(function MetricBar({
  label,
  value,
  color,
  animKey,
}: {
  label: string
  value: number
  color: string
  animKey: number
}) {
  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] font-bold" style={{ color }}>
          {label}
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-foreground">{value}%</span>
      </div>
      <div className="w-full h-1.5 sm:h-2 rounded-full bg-border/50 overflow-hidden">
        <div
          key={`${label}-${animKey}`}
          className="h-full rounded-full animate-fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
})
