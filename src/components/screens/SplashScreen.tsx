'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function SplashScreen() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-green-900 to-slate-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      <div className={`relative z-10 text-center transform transition-all duration-1000 ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="mb-8">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 tracking-widest mb-2 drop-shadow-lg">
            BEN10
          </h1>
          <p className="text-2xl text-green-300 font-bold tracking-widest">ENDLESS RUNNER</p>
        </div>

        <p className="text-gray-300 mb-12 text-lg max-w-md mx-auto">
          Transform into powerful aliens and survive the endless challenges
        </p>

        <Link
          href="/game/menu"
          className="inline-block px-12 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black text-xl rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
        >
          START GAME
        </Link>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
