'use client'

import { LANE_POSITIONS } from '@/src/types/game'

interface LaneIndicatorProps {
  currentLane: 0 | 1 | 2
  onLaneChange: (lane: 0 | 1 | 2) => void
}

export function LaneIndicator({ currentLane, onLaneChange }: LaneIndicatorProps) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex gap-6 bg-slate-900 bg-opacity-80 backdrop-blur-sm border-2 border-cyan-500 rounded-full px-8 py-4">
        {LANE_POSITIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => onLaneChange(index as 0 | 1 | 2)}
            className={`w-4 h-4 rounded-full transition-all transform ${
              currentLane === index
                ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50'
                : 'bg-slate-600 hover:bg-slate-500 cursor-pointer'
            }`}
            aria-label={`Lane ${index + 1}`}
          />
        ))}
      </div>
      <div className="text-center mt-2 text-xs text-gray-400">
        {currentLane === 0 ? 'LEFT' : currentLane === 1 ? 'CENTER' : 'RIGHT'}
      </div>
    </div>
  )
}
