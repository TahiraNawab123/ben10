'use client'

import { useRouter } from 'next/navigation'
import { gameStore } from '@/src/store/gameStore'
import { ArrowLeft, Trophy } from 'lucide-react'

export function HighScoresScreen() {
  const router = useRouter()
  const highScores = gameStore.getHighScores()

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/game/menu')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
            HIGH SCORES
          </h1>
          <p className="text-gray-300">Top 50 all-time best performances</p>
        </div>

        {highScores.length === 0 ? (
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No high scores yet</p>
            <p className="text-gray-500 text-sm mt-2">Play a game to get on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {highScores.map((score, index) => (
              <div
                key={score.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-l-4 transition-all ${
                  index === 0
                    ? 'bg-yellow-900 bg-opacity-30 border-l-yellow-400 border-r border-r-yellow-400'
                    : index === 1
                      ? 'bg-gray-400 bg-opacity-10 border-l-gray-300'
                      : index === 2
                        ? 'bg-orange-900 bg-opacity-20 border-l-orange-400'
                        : 'bg-slate-800 border-l-slate-600'
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {index === 0 && <Trophy className="w-6 h-6 text-yellow-400" />}
                  {index === 1 && <Trophy className="w-6 h-6 text-gray-300" />}
                  {index === 2 && <Trophy className="w-6 h-6 text-orange-400" />}
                  {index > 2 && <span className="font-black text-gray-400 text-lg">#{index + 1}</span>}
                </div>

                <div className="flex-grow">
                  <p className="font-black text-green-300">{score.characterName}</p>
                  <p className="text-xs text-gray-400">{score.worldType} • {new Date(score.timestamp).toLocaleDateString()}</p>
                </div>

                <div className="text-right">
                  <p className="font-black text-2xl text-yellow-300">{score.score}</p>
                  <p className="text-xs text-gray-400">{score.distance.toFixed(0)}m</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push('/game/menu')}
          className="w-full mt-12 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  )
}
