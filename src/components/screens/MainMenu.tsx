'use client'

import Link from 'next/link'
import { Zap, Trophy, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export function MainMenu() {
  const menuItems = [
    {
      href: '/game/select-character',
      label: 'NEW GAME',
      icon: Zap,
      className: 'from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80',
    },
    {
      href: '/game/high-scores',
      label: 'HIGH SCORES',
      icon: Trophy,
      className: 'from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400',
    },
    {
      href: '/game/settings',
      label: 'SETTINGS',
      icon: Settings,
      className: 'from-muted to-muted/60 hover:from-muted/80 hover:to-muted/40',
    },
  ]

  return (
    <div className="relative w-full h-screen bg-dark-bg overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 mb-4 tracking-widest font-mono"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          BEN10
        </motion.h1>

        <motion.p
          className="text-cyan text-sm md:text-base font-mono tracking-wider mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          ENDLESS RUNNER
        </motion.p>

        <motion.div
          className="space-y-3 mb-12 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`
                    block px-8 py-4 bg-gradient-to-r ${item.className}
                    text-dark-bg font-bold font-mono text-lg rounded-lg
                    transition-all duration-300 group
                    hover:neon-glow-strong neon-glow
                    ripple-button
                  `}
                >
                  <span className="flex items-center justify-center gap-3">
                    <Icon size={20} className="group-hover:scale-125 transition-transform" />
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          className="text-muted-foreground font-mono text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Select your alien form and survive the endless run
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {[0, 1, 2, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: ['4px', '20px', '4px'],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1 bg-gradient-to-t from-green-400 to-cyan rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
