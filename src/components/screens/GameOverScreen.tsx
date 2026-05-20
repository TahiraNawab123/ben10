'use client'

import { useRouter } from 'next/navigation'
import { gameStore } from '@/src/store/gameStore'
import type { GameState } from '@/src/types/game'
import { Home, RotateCcw } from 'lucide-react'

interface GameOverScreenProps {
  gameState: GameState
  onRestart?: () => void
}

export function GameOverScreen({ gameState, onRestart }: GameOverScreenProps) {
  const router = useRouter()

  const handleRestart = () => {
    onRestart?.()
    router.push('/game/select-character')
  }

  const handleHome = () => {
    gameStore.resetGame()
    router.push('/game/menu')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-20 blur-3xl rounded-lg" />

        <div className="relative bg-slate-900 border-2 border-red-500 rounded-lg p-8 md:p-12 max-w-md mx-auto text-center">
          <h1 className="text-5xl font-black text-red-400 mb-2">GAME OVER</h1>
          <p className="text-gray-300 mb-8">Better luck next time!</p>

          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">CHARACTER</p>
                <p className="text-lg font-black text-green-300">{gameState.character?.name || 'UNKNOWN'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">DISTANCE</p>
                <p className="text-lg font-black text-cyan-300">{gameState.distance.toFixed(0)}m</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">FINAL SCORE</p>
                <p className="text-3xl font-black text-yellow-300">{gameState.score}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              PLAY AGAIN
            </button>

            <button
              onClick={handleHome}
              className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              MAIN MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
