'use client'

import type { Character } from '@/src/types/game'
import { Zap } from 'lucide-react'

interface AbilityIndicatorProps {
  character: Character | null
  isActive: boolean
  cooldownPercent: number
  onActivate: () => void
}

export function AbilityIndicator({ character, isActive, cooldownPercent, onActivate }: AbilityIndicatorProps) {
  if (!character) return null

  return (
    <div className="fixed top-40 right-6 z-40">
      <button
        onClick={onActivate}
        disabled={cooldownPercent > 0 || isActive}
        className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
          isActive
            ? 'bg-gradient-to-br from-green-500 to-cyan-500 border-green-300 shadow-lg shadow-green-500/50'
            : cooldownPercent > 0
              ? 'bg-slate-700 border-slate-600 shadow-none'
              : 'bg-slate-800 border-purple-500 hover:shadow-lg hover:shadow-purple-500/50'
        }`}
      >
        {cooldownPercent > 0 ? (
          <>
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="rgba(139, 92, 246, 0.5)"
                strokeWidth="2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray={`${(cooldownPercent / 100) * 2 * Math.PI * 0.4} ${2 * Math.PI * 0.4}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white font-black text-sm z-10">{Math.ceil(cooldownPercent / 100 * character.ability.cooldown)}s</span>
          </>
        ) : (
          <>
            <Zap className={`w-8 h-8 ${isActive ? 'text-slate-900' : 'text-purple-400'}`} />
            {isActive && <div className="absolute inset-1 border border-slate-900 rounded-md animate-pulse" />}
          </>
        )}
      </button>

      <div className="mt-3 bg-slate-900 bg-opacity-90 border border-purple-500 rounded-lg p-3 w-32">
        <p className="text-xs font-black text-purple-300 mb-1">{character.ability.name.toUpperCase()}</p>
        <p className="text-xs text-gray-400 leading-tight">{character.ability.description}</p>
        {isActive && <p className="text-xs text-green-400 mt-2 font-bold">ACTIVE</p>}
      </div>
    </div>
  )
}
