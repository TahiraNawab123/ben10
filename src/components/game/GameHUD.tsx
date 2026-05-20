'use client'

import type { GameState } from '@/src/types/game'
import { Zap, Heart, Pause, Play } from 'lucide-react'

interface GameHUDProps {
  gameState: GameState
  onPause: () => void
}

export function GameHUD({ gameState, onPause }: GameHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex justify-between items-start p-6 pointer-events-auto">
        <div className="space-y-4">
          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-cyan-500 rounded-lg px-6 py-3">
            <p className="text-gray-400 text-xs font-bold mb-1">SCORE</p>
            <p className="text-cyan-400 font-black text-3xl">{gameState.score}</p>
          </div>

          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-green-500 rounded-lg px-6 py-3">
            <p className="text-gray-400 text-xs font-bold mb-1">DISTANCE</p>
            <p className="text-green-400 font-black text-2xl">{gameState.distance.toFixed(0)}m</p>
          </div>

          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-yellow-500 rounded-lg px-6 py-3">
            <p className="text-gray-400 text-xs font-bold mb-1">MULTIPLIER</p>
            <p className="text-yellow-400 font-black text-2xl">x{gameState.multiplier}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-red-500 rounded-lg px-6 py-3">
            <p className="text-gray-400 text-xs font-bold mb-2">HEALTH</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-8 rounded ${
                    (i + 1) * 20 <= gameState.health
                      ? 'bg-gradient-to-t from-red-500 to-red-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-orange-500 rounded-lg px-6 py-3">
            <p className="text-gray-400 text-xs font-bold mb-1">COLLECTIBLES</p>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <p className="text-orange-400 font-black text-xl">{gameState.collectibles}</p>
            </div>
          </div>

          <button
            onClick={onPause}
            className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-purple-500 rounded-lg px-4 py-3 hover:bg-opacity-100 transition-all pointer-events-auto"
          >
            {gameState.isPaused ? (
              <Play className="w-5 h-5 text-purple-400" />
            ) : (
              <Pause className="w-5 h-5 text-purple-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
