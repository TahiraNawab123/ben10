import type { GameState, Character, HighScore } from '@/src/types/game'

class GameStore {
  private gameState: GameState = {
    character: null,
    worldType: 'mountains',
    score: 0,
    distance: 0,
    health: 100,
    isGameActive: false,
    isPaused: false,
    lane: 1,
    collectibles: 0,
    multiplier: 1,
    timeElapsed: 0
  }

  private highScores: HighScore[] = []

  constructor() {
    this.loadHighScores()
  }

  getState(): GameState {
    return { ...this.gameState }
  }

  setState(newState: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...newState }
  }

  initGame(character: Character, worldType: 'mountains' | 'ice' | 'desert') {
    this.gameState = {
      character,
      worldType,
      score: 0,
      distance: 0,
      health: 100,
      isGameActive: true,
      isPaused: false,
      lane: 1,
      collectibles: 0,
      multiplier: 1,
      timeElapsed: 0
    }
  }

  resetGame() {
    this.gameState = {
      character: null,
      worldType: 'mountains',
      score: 0,
      distance: 0,
      health: 100,
      isGameActive: false,
      isPaused: false,
      lane: 1,
      collectibles: 0,
      multiplier: 1,
      timeElapsed: 0
    }
  }

  updateScore(points: number) {
    const bonusPoints = points * this.gameState.multiplier
    this.gameState.score += bonusPoints
  }

  updateDistance(amount: number) {
    this.gameState.distance += amount
    this.updateMultiplier()
  }

  updateMultiplier() {
    const distanceMultiplier = Math.floor(this.gameState.distance / 1000) + 1
    this.gameState.multiplier = Math.min(distanceMultiplier, 5)
  }

  addCollectible() {
    this.gameState.collectibles += 1
    this.updateScore(100)
  }

  damagePlayer(amount: number) {
    this.gameState.health = Math.max(0, this.gameState.health - amount)
  }

  healPlayer(amount: number) {
    this.gameState.health = Math.min(100, this.gameState.health + amount)
  }

  changeLane(lane: 0 | 1 | 2) {
    this.gameState.lane = lane
  }

  togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused
  }

  endGame() {
    this.gameState.isGameActive = false
    this.saveHighScore()
  }

  saveHighScore() {
    if (!this.gameState.character) return

    const newScore: HighScore = {
      id: `${Date.now()}-${Math.random()}`,
      characterName: this.gameState.character.name,
      score: this.gameState.score,
      distance: this.gameState.distance,
      timestamp: Date.now(),
      worldType: this.gameState.worldType
    }

    this.highScores.unshift(newScore)
    this.highScores = this.highScores.slice(0, 50)
    this.persistHighScores()
  }

  getHighScores(): HighScore[] {
    return [...this.highScores]
  }

  private persistHighScores() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ben10-high-scores', JSON.stringify(this.highScores))
    }
  }

  private loadHighScores() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ben10-high-scores')
      if (saved) {
        try {
          this.highScores = JSON.parse(saved)
        } catch {
          this.highScores = []
        }
      }
    }
  }
}

export const gameStore = new GameStore()
