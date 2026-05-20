'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function SplashScreen() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1a2e 0%, #16213e 30%, #0f5f4f 60%, #1a4d3e 100%)'
    }}>
      <div className="relative z-10 text-center px-4">
        <div className="mb-6">
          <h1 
            className="text-8xl md:text-9xl font-black tracking-wider mb-2"
            style={{
              color: '#00ffff',
              textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4), 0 4px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
            BEN10
          </h1>

          <p 
            className="text-2xl md:text-3xl font-bold tracking-widest"
            style={{ color: '#00ff88' }}
          >
            ENDLESS RUNNER
          </p>
        </div>

        <p 
          className="mb-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: '#00dd88' }}
        >
          Transform into powerful aliens and survive the endless challenges
        </p>

        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Link
            href="/game/menu"
            className="inline-block px-12 py-4 rounded-lg font-bold text-xl tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#00ffaa',
              color: '#0a1a2e',
              boxShadow: '0 0 20px rgba(0, 255, 170, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 170, 0.8), 0 4px 16px rgba(0, 0, 0, 0.4)'
              e.currentTarget.style.backgroundColor = '#00ffcc'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 170, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
              e.currentTarget.style.backgroundColor = '#00ffaa'
            }}
          >
            START GAME
          </Link>
        </div>
      </div>
    </div>
  )
}
