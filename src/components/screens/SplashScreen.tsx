'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function SplashScreen() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-screen bg-dark-bg flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply opacity-20 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply opacity-20 blur-2xl" />
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <motion.h1
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 tracking-widest mb-2 font-mono"
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            BEN10
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-cyan font-bold tracking-widest font-mono"
            initial={{ opacity: 0, y: -15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ENDLESS RUNNER
          </motion.p>
        </div>

        <motion.p
          className="text-muted-foreground mb-12 text-base md:text-lg max-w-md mx-auto font-mono"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Transform into powerful aliens and survive
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/game/menu"
            className="inline-block px-10 py-3 bg-gradient-to-r from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80 text-dark-bg font-bold text-lg rounded-lg transition-all duration-300 neon-glow font-mono"
          >
            START GAME
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
