'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  progress?: number
  message?: string
}

export function LoadingScreen({ progress = 0, message = 'Initializing game...' }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const next = Math.min(prev + Math.random() * 30, Math.min(progress, 95))
        return next
      })
    }, 300)

    return () => clearInterval(interval)
  }, [progress])

  useEffect(() => {
    setDisplayProgress(Math.max(displayProgress, progress))
  }, [progress])

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-2 border-transparent border-t-green-400 border-r-cyan mx-auto mb-8"
        />

        <h2 className="gradient-text text-3xl font-bold font-mono mb-2">
          BEN10
        </h2>

        <p className="text-muted-foreground font-mono text-sm mb-8">
          {message}
        </p>

        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-green-400 to-cyan"
          />
        </div>

        <p className="text-cyan font-mono text-xs mt-4">
          {Math.round(displayProgress)}%
        </p>

        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
