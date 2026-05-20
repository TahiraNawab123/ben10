'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/assets/ben10-logo.png" 
            alt="Ben 10" 
            width={120} 
            height={60} 
            className="group-hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all"
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {['Game', 'Aliens', 'Features', 'Leaderboard'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/game" 
            className="hidden sm:block px-6 py-2 bg-primary text-background font-black text-sm rounded-lg hover:scale-105 active:scale-95 transition-all text-glow-green"
          >
            PLAY NOW
          </Link>
          <button className="md:hidden text-white hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
