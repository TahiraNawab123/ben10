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
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply opacity-20 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply opacity-20 blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan to-green-400 mb-4 tracking-widest font-mono">
          BEN10
        </h1>

        <p className="text-cyan text-sm md:text-base font-mono tracking-wider mb-10">
          ENDLESS RUNNER
        </p>

        <div className="space-y-3 mb-10 max-w-sm mx-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
              >
                <Link
                  href={item.href}
                  className={`
                    block px-6 py-3 bg-gradient-to-r ${item.className}
                    text-dark-bg font-bold font-mono text-base rounded-lg
                    transition-all duration-300
                  `}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon size={18} />
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <p className="text-muted-foreground font-mono text-xs md:text-sm">
          Select your alien and survive
        </p>
      </motion.div>
    </div>
  )
}
