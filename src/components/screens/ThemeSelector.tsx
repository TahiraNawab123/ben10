'use client'

import { useRouter } from 'next/navigation'
import { Mountain, Snowflake, Wind, ArrowLeft } from 'lucide-react'
import { gameStore } from '@/src/store/gameStore'

interface Theme {
  id: 'mountains' | 'ice' | 'desert'
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

const THEMES: Theme[] = [
  {
    id: 'mountains',
    name: 'MOUNTAINS',
    description: 'Rocky peaks and challenging terrain',
    icon: <Mountain className="w-12 h-12" />,
    color: 'from-amber-600 to-amber-900',
  },
  {
    id: 'ice',
    name: 'ICE WORLD',
    description: 'Slippery slopes and frozen hazards',
    icon: <Snowflake className="w-12 h-12" />,
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'desert',
    name: 'DESERT',
    description: 'Scorching sands and sandstorms',
    icon: <Wind className="w-12 h-12" />,
    color: 'from-yellow-500 to-orange-600',
  },
]

export function ThemeSelector() {
  const router = useRouter()

  const handleSelect = (themeId: 'mountains' | 'ice' | 'desert') => {
    const state = gameStore.getState()
    gameStore.setState({ ...state, worldType: themeId })
    router.push('/game/play')
  }

  return (
    <div className="relative w-full min-h-screen bg-dark-bg overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />

      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors z-20"
      >
        <ArrowLeft size={18} />
        <span className="font-mono text-sm">Back</span>
      </button>

      <div className="relative z-10 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 mb-3 font-mono">
          SELECT YOUR ARENA
        </h1>

        <p className="text-muted-foreground font-mono text-sm md:text-base mb-10">
          Choose your environment
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              className={`group relative p-6 rounded-lg border-2 border-muted hover:border-green-400 bg-muted/10 hover:bg-muted/20 transition-all duration-300 text-center`}
            >
              <div className="flex justify-center mb-3 text-green-400 group-hover:scale-110 transition-transform">
                {theme.icon}
              </div>
              <h2 className="font-bold font-mono text-lg mb-1 text-green-400">
                {theme.name}
              </h2>
              <p className="text-muted-foreground text-xs font-mono">
                {theme.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
