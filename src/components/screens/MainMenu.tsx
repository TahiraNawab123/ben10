'use client'

import Link from 'next/link'
import { Zap, Trophy, Settings } from 'lucide-react'

export function MainMenu() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-12 tracking-widest">
          BEN10
        </h1>

        <div className="space-y-4 mb-8 max-w-sm">
          <Link
            href="/game/select-character"
            className="block px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black text-lg rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all"
          >
            <Zap className="inline mr-2 w-5 h-5" />
            NEW GAME
          </Link>

          <Link
            href="/game/high-scores"
            className="block px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 font-black text-lg rounded-lg hover:shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all"
          >
            <Trophy className="inline mr-2 w-5 h-5" />
            HIGH SCORES
          </Link>

          <Link
            href="/game/settings"
            className="block px-8 py-4 bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold text-lg rounded-lg transform hover:scale-105 transition-all"
          >
            <Settings className="inline mr-2 w-5 h-5" />
            SETTINGS
          </Link>
        </div>

        <p className="text-gray-400 text-sm">Select your alien form and dominate the endless run</p>
      </div>
    </div>
  )
}
