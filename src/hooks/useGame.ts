import { useState, useCallback, useEffect, useRef } from 'react'
import { gameStore } from '@/src/store/gameStore'
import { abilitySystem } from '@/src/systems/AbilitySystem'
import type { Character, Obstacle, Collectible } from '@/src/types/game'

export function useGame() {
  const [gameState, setGameState] = useState(gameStore.getState())
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [collectibles, setCollectibles] = useState<Collectible[]>([])
  const [abilityActive, setAbilityActive] = useState(false)
  const [abilityCooldown, setAbilityCooldown] = useState(0)
  const frameRef = useRef(0)
  const gameLoopRef = useRef<number | null>(null)
  const obstacleCounterRef = useRef(0)
  const collectibleCounterRef = useRef(0)

  const initGame = useCallback((character: Character, worldType: 'mountains' | 'ice' | 'desert') => {
    gameStore.initGame(character, worldType)
    setGameState(gameStore.getState())
    setObstacles([])
    setCollectibles([])
    frameRef.current = 0
    obstacleCounterRef.current = 0
    collectibleCounterRef.current = 0
  }, [])

  const updateGameState = useCallback(() => {
    setGameState(gameStore.getState())
  }, [])

  const handleCollision = useCallback((laneHit: 0 | 1 | 2) => {
    const state = gameStore.getState()
    if (state.lane === laneHit) {
      gameStore.damagePlayer(25)
      updateGameState()
    }
  }, [updateGameState])

  const handleCollectible = useCallback((id: string) => {
    gameStore.addCollectible()
    setCollectibles(prev => prev.filter(c => c.id !== id))
    updateGameState()
  }, [updateGameState])

  const handleLaneChange = useCallback((lane: 0 | 1 | 2) => {
    gameStore.changeLane(lane)
    updateGameState()
  }, [updateGameState])

  const togglePause = useCallback(() => {
    gameStore.togglePause()
    updateGameState()
  }, [updateGameState])

  const endGame = useCallback(() => {
    gameStore.endGame()
    updateGameState()
  }, [updateGameState])

  const activateAbility = useCallback(() => {
    const state = gameStore.getState()
    if (state.character && abilitySystem.activateAbility(state.character, Date.now())) {
      setAbilityActive(true)
      const duration = state.character.ability.duration * 1000
      setTimeout(() => {
        setAbilityActive(false)
      }, duration)
    }
  }, [updateGameState])

  const spawnObstacle = useCallback(() => {
    const lanes = [0, 1, 2] as const
    const randomLane = lanes[Math.floor(Math.random() * 3)]
    const id = `obstacle-${frameRef.current}`
    
    const newObstacle: Obstacle = {
      id,
      type: 'drone',
      lane: randomLane,
      position: { x: 0, z: 50 },
      width: 2,
      depth: 2
    }
    
    setObstacles(prev => [...prev, newObstacle])
  }, [])

  const spawnCollectible = useCallback(() => {
    const lanes = [0, 1, 2] as const
    const randomLane = lanes[Math.floor(Math.random() * 3)]
    const id = `collectible-${frameRef.current}`
    
    const newCollectible: Collectible = {
      id,
      type: 'energy',
      lane: randomLane,
      position: { x: 0, z: 40 },
      value: 100
    }
    
    setCollectibles(prev => [...prev, newCollectible])
  }, [])

  useEffect(() => {
    const state = gameStore.getState()
    if (!state.isGameActive) return

    gameLoopRef.current = requestAnimationFrame(() => {
      frameRef.current += 1
      
      gameStore.updateDistance(0.01)
      updateGameState()

      if (frameRef.current % 120 === 0) {
        spawnObstacle()
      }

      if (frameRef.current % 150 === 0) {
        spawnCollectible()
      }

      if (frameRef.current % 300 === 0) {
        gameStore.updateScore(50)
        updateGameState()
      }

      setObstacles(prev => 
        prev
          .map(obs => ({ ...obs, position: { ...obs.position, z: obs.position.z - 0.5 } }))
          .filter(obs => obs.position.z > -30)
      )

      setCollectibles(prev =>
        prev
          .map(coll => ({ ...coll, position: { ...coll.position, z: coll.position.z - 0.5 } }))
          .filter(coll => coll.position.z > -30)
      )
    })

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.isGameActive, spawnObstacle, spawnCollectible, updateGameState])

  return {
    gameState,
    obstacles,
    collectibles,
    abilityActive,
    abilityCooldown,
    initGame,
    updateGameState,
    handleCollision,
    handleCollectible,
    handleLaneChange,
    togglePause,
    endGame,
    activateAbility
  }
}
