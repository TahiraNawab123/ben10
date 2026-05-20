'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050a0f]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image 
              src="/assets/ben10-logo.png" 
              alt="Ben 10 Logo" 
              width={300} 
              height={150} 
              className="mb-8 mx-auto lg:mx-0 drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]"
            />
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
              Endless <span className="text-primary text-glow-green">3D Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform into your favorite aliens, master the Omnitrix, and race through 
              dynamic 3D worlds in this ultimate endless runner experience!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="/game" 
                className="group relative px-8 py-4 bg-primary text-background font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 neon-glow"
              >
                <span className="relative z-10">START RUNNING</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              
              <button className="px-8 py-4 bg-transparent border-2 border-primary/50 text-white font-bold text-lg rounded-full hover:bg-primary/10 transition-all">
                LEARN MORE
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-glow-pulse" />
            <Image 
              src="/assets/ben10-hero.png" 
              alt="Ben 10 Hero" 
              width={800} 
              height={800} 
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.3)] animate-float"
            />
            
            {/* Geometric accents */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border-t-4 border-r-4 border-primary/30 rounded-tr-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-4 border-l-4 border-secondary/30 rounded-bl-3xl" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-primary/50 text-xs font-bold tracking-widest uppercase">Scroll Down</span>
        <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full opacity-50" />
      </motion.div>
    </section>
  )
}
