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
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <motion.h1
            className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 tracking-widest mb-2 drop-shadow-2xl font-mono"
            initial={{ opacity: 0, scale: 0.8, y: -40 }}
            animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            BEN10
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-cyan font-bold tracking-widest font-mono"
            initial={{ opacity: 0, y: -20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ENDLESS RUNNER
          </motion.p>
        </div>

        <motion.p
          className="text-muted-foreground mb-12 text-base md:text-lg max-w-md mx-auto font-mono"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Transform into powerful aliens and survive the endless challenges
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/game/menu"
            className="inline-block px-12 py-4 bg-gradient-to-r from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80 text-dark-bg font-black text-xl rounded-lg transition-all duration-300 group neon-glow-strong hover:neon-glow-dual ripple-button font-mono"
          >
            <span className="block group-hover:scale-110 transition-transform">
              START GAME
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
