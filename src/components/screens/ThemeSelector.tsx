'use client'

import { useRouter } from 'next/navigation'
import { gameStore } from '@/src/store/gameStore'
import { Mountain, Snowflake, Wind } from 'lucide-react'

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
    color: 'from-amber-600 to-amber-900'
  },
  {
    id: 'ice',
    name: 'ICE WORLD',
    description: 'Slippery slopes and frozen hazards',
    icon: <Snowflake className="w-12 h-12" />,
    color: 'from-blue-400 to-cyan-600'
  },
  {
    id: 'desert',
    name: 'DESERT',
    description: 'Scorching sands and sandstorms',
    icon: <Wind className="w-12 h-12" />,
    color: 'from-yellow-500 to-orange-600'
  }
]

export function ThemeSelector() {
  const router = useRouter()

  const handleSelect = (themeId: 'mountains' | 'ice' | 'desert') => {
    const state = gameStore.getState()
    gameStore.setState({ ...state, worldType: themeId })
    router.push('/game/play')
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl text-center">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-4">
          SELECT YOUR ARENA
        </h1>
        <p className="text-gray-300 mb-12">Choose the environment where you'll test your abilities</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              className="group relative overflow-hidden rounded-lg border-2 border-slate-600 hover:border-green-400 p-8 bg-slate-800 hover:bg-slate-700 transition-all transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

              <div className="relative z-10">
                <div className="text-green-400 mb-4 flex justify-center">
                  {theme.icon}
                </div>

                <h2 className="text-2xl font-black text-green-300 mb-2">{theme.name}</h2>
                <p className="text-gray-400 text-sm mb-6">{theme.description}</p>

                <div className="px-6 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-bold rounded inline-block">
                  SELECT
                </div>
              </div>

              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-12">
          Different environments offer unique challenges and opportunities
        </p>
      </div>
    </div>
  )
}
