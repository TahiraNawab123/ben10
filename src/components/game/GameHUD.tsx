'use client'

import { motion } from 'framer-motion'
import type { GameState } from '@/src/types/game'
import { Zap, Heart, Pause, Play } from 'lucide-react'

interface GameHUDProps {
  gameState: GameState
  onPause: () => void
}

export function GameHUD({ gameState, onPause }: GameHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex flex-col md:flex-row justify-between items-start p-3 md:p-6 pointer-events-auto gap-3 md:gap-0">
        <div className="space-y-2 md:space-y-4 w-full md:w-auto">
          <HUDCard label="SCORE" value={gameState.score} color="cyan" />
          <HUDCard
            label="DISTANCE"
            value={`${gameState.distance.toFixed(0)}m`}
            color="green"
          />
          <HUDCard label="MULTIPLIER" value={`x${gameState.multiplier}`} color="amber" />
        </div>

        <div className="space-y-2 md:space-y-4 w-full md:w-auto">
          <div className="bg-dark-bg/80 backdrop-blur-sm border border-red-500/50 rounded-lg px-4 md:px-6 py-2 md:py-3 neon-glow">
            <p className="text-muted-foreground text-xs font-bold mb-1">HEALTH</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: (i + 1) * 20 <= gameState.health ? 1 : 0.3,
                  }}
                  className={`w-2 md:w-3 h-6 md:h-8 rounded ${
                    (i + 1) * 20 <= gameState.health
                      ? 'bg-gradient-to-t from-red-500 to-red-400'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-dark-bg/80 backdrop-blur-sm border border-amber-500/50 rounded-lg px-4 md:px-6 py-2 md:py-3 neon-glow">
            <p className="text-muted-foreground text-xs font-bold mb-1">COLLECTIBLES</p>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              <p className="text-amber-400 font-black text-lg md:text-xl">{gameState.collectibles}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-full md:w-auto bg-dark-bg/80 backdrop-blur-sm border border-purple-500/50 rounded-lg px-4 md:px-6 py-2 md:py-3 hover:border-purple-400 transition-all pointer-events-auto neon-glow group"
          >
            {gameState.isPaused ? (
              <Play className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-125 transition-transform" />
            ) : (
              <Pause className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-125 transition-transform" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function HUDCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: 'cyan' | 'green' | 'amber'
}) {
  const colorClasses = {
    cyan: { border: 'border-cyan/50', text: 'text-cyan', glow: 'neon-glow-cyan' },
    green: { border: 'border-green-400/50', text: 'text-green-400', glow: 'neon-glow' },
    amber: { border: 'border-amber-400/50', text: 'text-amber-400', glow: 'neon-glow' },
  }

  const { border, text, glow } = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-dark-bg/80 backdrop-blur-sm border ${border} rounded-lg px-4 md:px-6 py-2 md:py-3 ${glow}`}
    >
      <p className="text-muted-foreground text-xs font-bold mb-1">{label}</p>
      <motion.p
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${text} font-black text-xl md:text-3xl`}
      >
        {value}
      </motion.p>
    </motion.div>
  )
}
