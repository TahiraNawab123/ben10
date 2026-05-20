'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Character } from '@/src/types/game'
import { Play } from 'lucide-react'

interface PreGameScreenProps {
  character: Character
  theme: 'mountains' | 'ice' | 'desert'
  onStart: () => void
}

export function PreGameScreen({ character, theme, onStart }: PreGameScreenProps) {
  const themeData = {
    mountains: { label: 'Mountain', gradient: 'from-slate-600 to-slate-800' },
    ice: { label: 'Frozen', gradient: 'from-cyan-600 to-blue-800' },
    desert: { label: 'Desert', gradient: 'from-amber-600 to-orange-800' },
  }

  const data = themeData[theme]

  return (
    <div className="relative w-full min-h-screen bg-dark-bg overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 bg-gradient-to-b ${data.gradient} opacity-20 pointer-events-none`}
      />

      <div className="relative z-10 h-screen flex flex-col items-center justify-between p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-8"
        >
          <p className="text-cyan font-mono text-sm mb-2">STAGE: {data.label.toUpperCase()}</p>
          <h2 className="gradient-text text-2xl md:text-3xl font-bold font-mono">
            GET READY
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-full h-full"
            >
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 65, 0.3)',
                  '0 0 40px rgba(0, 255, 65, 0.6)',
                  '0 0 20px rgba(0, 255, 65, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full pointer-events-none"
            />
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="gradient-text text-3xl md:text-4xl font-bold font-mono mb-2"
          >
            {character.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-green-400 font-mono text-sm md:text-base"
          >
            {character.ability.name}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-6 w-full max-w-sm"
        >
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80 text-dark-bg font-bold font-mono text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group neon-glow-strong ripple-button"
          >
            <Play size={24} className="group-hover:translate-x-1 transition-transform" />
            START GAME
          </motion.button>

          <motion.div
            className="space-y-2 text-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-muted-foreground font-mono text-xs">CONTROLS</p>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-cyan">
              <div>← / A - Left</div>
              <div>↓ / S - Center</div>
              <div>→ / D - Right</div>
            </div>
            <p className="text-muted-foreground text-xs mt-2">SPACE - Pause | E - Ability</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-green-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
