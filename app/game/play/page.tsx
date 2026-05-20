'use client'

import { useGame } from '@/src/hooks/useGame'
import { gameStore } from '@/src/store/gameStore'
import { GameScene } from '@/src/components/game/GameScene'
import { GameHUD } from '@/src/components/game/GameHUD'
import { LaneIndicator } from '@/src/components/game/LaneIndicator'
import { AbilityIndicator } from '@/src/components/game/AbilityIndicator'
import { GameOverScreen } from '@/src/components/screens/GameOverScreen'
import { useEffect } from 'react'

export default function PlayPage() {
  const { gameState, obstacles, collectibles, abilityActive, abilityCooldown, handleLaneChange, togglePause, endGame, activateAbility } =
    useGame()

  useEffect(() => {
    const state = gameStore.getState()
    if (!state.isGameActive && !state.character) {
      window.location.href = '/game/menu'
    } else if (!state.character) {
      window.location.href = '/game/select-character'
    }
  }, [])

  useEffect(() => {
    if (gameState.health <= 0) {
      endGame()
    }
  }, [gameState.health, endGame])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') handleLaneChange(0)
      if (e.key === 'ArrowDown' || e.key === 's') handleLaneChange(1)
      if (e.key === 'ArrowRight' || e.key === 'd') handleLaneChange(2)
      if (e.key === ' ') {
        e.preventDefault()
        togglePause()
      }
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        activateAbility()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleLaneChange, togglePause, activateAbility])

  if (!gameState.character) {
    return null
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-slate-900">
      <GameScene
        gameState={gameState}
        obstacles={obstacles}
        collectibles={collectibles}
      />

      <GameHUD gameState={gameState} onPause={togglePause} />

      <AbilityIndicator 
        character={gameState.character} 
        isActive={abilityActive}
        cooldownPercent={abilityCooldown}
        onActivate={activateAbility}
      />

      {!gameState.isPaused && <LaneIndicator currentLane={gameState.lane} onLaneChange={handleLaneChange} />}

      {!gameState.isGameActive && gameState.health <= 0 && (
        <GameOverScreen gameState={gameState} onRestart={() => {}} />
      )}

      {gameState.isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-5xl font-black text-cyan-400 mb-4">PAUSED</h2>
            <p className="text-gray-300 text-lg mb-8">Press SPACE to resume</p>
          </div>
        </div>
      )}
    </div>
  )
}
