'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function SplashScreen() {
  const [isHovered, setIsHovered] = useState<number | null>(null)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" style={{
      backgroundImage: 'linear-gradient(to right, rgba(15, 95, 79, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 95, 79, 0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

      <header className="relative z-20 flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ff88' }} />
          <span className="text-lg font-bold tracking-widest font-mono" style={{ color: '#00ff88' }}>
            BEN10
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <a href="#" className="text-xs font-mono tracking-widest transition-colors" style={{ color: '#666', opacity: 0.7 }}>
            CHALLENGES
          </a>
          <a href="#" className="text-xs font-mono tracking-widest transition-colors" style={{ color: '#666', opacity: 0.7 }}>
            LEADERBOARD
          </a>
          <div className="px-3 py-1 border rounded" style={{ borderColor: '#00ff88', color: '#00ff88' }}>
            <span className="text-xs font-mono tracking-widest">READY</span>
          </div>
        </nav>
      </header>

      <div className="relative z-10 h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <div className="mb-4 text-center">
            <div className="px-4 py-2 border rounded inline-block mb-6" style={{ borderColor: '#00ff88', color: '#00ff88' }}>
              <span className="text-xs font-mono tracking-widest">SYSTEM ACTIVE</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-wider mb-2 font-mono" style={{ color: '#ffffff' }}>
            OMNITRIX
            <span style={{ color: '#00ff88', marginLeft: '1rem' }}>INITIALIZED</span>
          </h1>

          <p className="text-sm md:text-base text-center font-mono" style={{ color: '#999' }}>
            Prepare your alien form and survive the endless runner
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl">
          {['Four Arms', 'Heatblast', 'XLR8', 'Diamondhead', 'Upgrade'].map((name, idx) => (
            <div
              key={idx}
              className="relative h-48 rounded border transition-all duration-300 cursor-pointer group"
              style={{
                borderColor: isHovered === idx ? '#00ff88' : 'rgba(0, 255, 136, 0.3)',
                backgroundColor: 'rgba(10, 26, 46, 0.5)',
                boxShadow: isHovered === idx ? '0 0 20px rgba(0, 255, 136, 0.4)' : 'none'
              }}
              onMouseEnter={() => setIsHovered(idx)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded flex flex-col items-center justify-end p-4">
                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: '#00ff88' }} />
                <h3 className="text-sm font-mono font-bold text-center" style={{ color: '#00ff88' }}>
                  {name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 text-center">
          <Link
            href="/game/menu"
            className="inline-flex flex-col items-center gap-2 px-8 py-4 bg-gradient-to-r rounded transition-all duration-300 font-mono font-bold tracking-widest"
            style={{
              backgroundColor: '#00ff88',
              color: '#0a1a2e',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8)'
              e.currentTarget.style.backgroundColor = '#00ffaa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)'
              e.currentTarget.style.backgroundColor = '#00ff88'
            }}
          >
            <span>START INITIALIZATION</span>
          </Link>

          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-xs font-mono tracking-widest" style={{ color: '#00ff88' }}>
              CLICK TO CONTINUE
            </span>
            <ChevronDown size={20} style={{ color: '#00ff88', animation: 'bounce 2s infinite' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  )
}
