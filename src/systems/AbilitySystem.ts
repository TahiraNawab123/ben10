import type { Character, PowerUp } from '@/src/types/game'

interface ActiveAbility {
  characterId: string
  name: string
  startTime: number
  duration: number
  cooldownStartTime: number
  cooldownDuration: number
}

export class AbilitySystem {
  private activeAbility: ActiveAbility | null = null
  private cooldownStartTime: number = 0

  getCurrentAbility(character: Character | null, currentTime: number): ActiveAbility | null {
    if (!this.activeAbility) return null

    const elapsedTime = currentTime - this.activeAbility.startTime
    if (elapsedTime >= this.activeAbility.duration) {
      this.activeAbility = null
      this.cooldownStartTime = currentTime
      return null
    }

    return this.activeAbility
  }

  isOnCooldown(character: Character | null, currentTime: number): boolean {
    if (!character) return false
    if (this.activeAbility) return true

    const timeSinceCooldown = currentTime - this.cooldownStartTime
    return timeSinceCooldown < character.ability.cooldown * 1000
  }

  getRemainingCooldown(character: Character | null, currentTime: number): number {
    if (!character) return 0
    if (this.activeAbility) {
      return (
        character.ability.cooldown -
        Math.min(character.ability.cooldown, (currentTime - this.activeAbility.startTime) / 1000)
      )
    }

    const timeSinceCooldown = (currentTime - this.cooldownStartTime) / 1000
    const remaining = character.ability.cooldown - timeSinceCooldown
    return Math.max(0, remaining)
  }

  activateAbility(character: Character, currentTime: number): boolean {
    if (this.isOnCooldown(character, currentTime)) {
      return false
    }

    this.activeAbility = {
      characterId: character.id,
      name: character.ability.name,
      startTime: currentTime,
      duration: character.ability.duration * 1000,
      cooldownStartTime: currentTime,
      cooldownDuration: character.ability.cooldown * 1000,
    }

    return true
  }

  deactivateAbility() {
    if (this.activeAbility) {
      this.cooldownStartTime = Date.now()
      this.activeAbility = null
    }
  }

  reset() {
    this.activeAbility = null
    this.cooldownStartTime = 0
  }

  getAbilityEffect(character: Character | null): { speedMultiplier: number; shieldActive: boolean } {
    if (!this.activeAbility || !character) {
      return { speedMultiplier: 1, shieldActive: false }
    }

    const abilityName = character.ability.name.toLowerCase()

    if (abilityName.includes('speed')) {
      return { speedMultiplier: 2, shieldActive: false }
    }

    if (abilityName.includes('shield') || abilityName.includes('through') || abilityName.includes('smash')) {
      return { speedMultiplier: 1, shieldActive: true }
    }

    return { speedMultiplier: 1, shieldActive: false }
  }
}

export const abilitySystem = new AbilitySystem()
