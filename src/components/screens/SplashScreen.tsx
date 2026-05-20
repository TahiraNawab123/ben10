'use client'

import { useState, useEffect } from 'react'
import { LandingHero } from '../sections/LandingHero'
import { Features } from '../sections/Features'
import { Characters } from '../sections/Characters'
import { Navbar } from '../layout/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground scroll-smooth">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050a0f]"
          >
            <div className="absolute inset-0 grid-bg opacity-10" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.2
              }}
              className="relative z-10"
            >
              <Image 
                src="/assets/ben10-logo.png" 
                alt="Ben 10 Loading" 
                width={400} 
                height={200} 
                className="drop-shadow-[0_0_30px_rgba(0,255,65,0.6)]"
              />
            </motion.div>
            
            <motion.div 
              className="mt-12 h-1 w-64 bg-border rounded-full overflow-hidden relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
            <p className="mt-4 text-primary text-xs font-bold tracking-[0.5em] uppercase animate-pulse">Initializing Omnitrix...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      
      <main>
        <LandingHero />
        <div id="features">
          <Features />
        </div>
        <div id="aliens">
          <Characters />
        </div>
        
        {/* Additional CTA Section */}
        <section className="py-24 bg-primary/10 relative overflow-hidden backdrop-blur-sm border-y border-primary/20">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">
              Ready to <span className="text-primary text-glow-green">save the world?</span>
            </h2>
            <button className="px-12 py-6 bg-primary text-background font-black text-2xl rounded-2xl hover:scale-105 active:scale-95 transition-all neon-glow-strong">
              PLAY NOW FOR FREE
            </button>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
        </section>
      </main>

      <footer className="py-12 bg-background border-t border-border/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image 
              src="/assets/ben10-logo.png" 
              alt="Ben 10" 
              width={100} 
              height={50} 
              className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            />
            <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
              The ultimate 3D Ben10 experience. Built with passion for true fans.
            </p>
          </div>
          
          <div className="flex gap-12 text-sm font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-4">
              <span className="text-white">Community</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Discord</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white">Legal</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            © 2026 BEN10 ENDLESS RUNNER. CARTOON NETWORK & ALL RELATED CHARACTERS ARE PROPERTY OF WARNER BROS.
          </p>
        </div>
      </footer>
    </div>
  )
}
