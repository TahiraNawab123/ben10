'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Snowflake, Wind, ArrowLeft } from 'lucide-react'
import { gameStore } from '@/src/store/gameStore'

interface Theme {
  id: 'mountains' | 'ice' | 'desert'
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgGradient: string
}

const THEMES: Theme[] = [
  {
    id: 'mountains',
    name: 'MOUNTAINS',
    description: 'Rocky peaks and challenging terrain',
    icon: <Mountain className="w-16 h-16" />,
    color: 'from-amber-600 to-amber-900',
    bgGradient: 'from-amber-900/20 to-transparent',
  },
  {
    id: 'ice',
    name: 'ICE WORLD',
    description: 'Slippery slopes and frozen hazards',
    icon: <Snowflake className="w-16 h-16" />,
    color: 'from-blue-400 to-cyan-600',
    bgGradient: 'from-blue-900/20 to-transparent',
  },
  {
    id: 'desert',
    name: 'DESERT',
    description: 'Scorching sands and sandstorms',
    icon: <Wind className="w-16 h-16" />,
    color: 'from-yellow-500 to-orange-600',
    bgGradient: 'from-yellow-900/20 to-transparent',
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
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <motion.button
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono">Back</span>
      </motion.button>

      <motion.div
        className="relative z-10 max-w-5xl text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 mb-4 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          SELECT YOUR ARENA
        </motion.h1>

        <motion.p
          className="text-muted-foreground font-mono text-sm md:text-base mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Choose the environment where you will test your abilities
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
        >
          {THEMES.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(theme.id)}
              className={`
                group relative overflow-hidden rounded-lg border border-muted
                hover:border-green-400 p-8 bg-gradient-to-br
                transition-all duration-300 neon-glow
                hover:neon-glow-strong ripple-button
              `}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} group-hover:opacity-100 opacity-50 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.color} mb-4 group-hover:scale-125 transition-transform`}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {theme.icon}
                </motion.div>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan mb-2 font-mono">
                  {theme.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 font-mono">
                  {theme.description}
                </p>

                <motion.div
                  className={`px-6 py-2 bg-gradient-to-r ${theme.color} text-dark-bg font-bold rounded font-mono text-sm`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  SELECT
                </motion.div>
              </div>

              <motion.div
                className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          className="text-muted-foreground text-xs md:text-sm mt-12 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          Different environments offer unique challenges and obstacles
        </motion.p>
      </motion.div>
    </div>
  )
}
