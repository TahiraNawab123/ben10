'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { CHARACTERS } from '@/src/data/characters'
import { gameStore } from '@/src/store/gameStore'
import { CharacterCard } from '@/src/components/cards/CharacterCard'

interface CharacterSelectorProps {
  onSelect?: (characterId: string) => void
}

export function CharacterSelector({ onSelect }: CharacterSelectorProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('')
  const router = useRouter()

  const selectedCharacter = CHARACTERS.find((c) => c.id === selectedCharacterId)

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId)
    const character = CHARACTERS.find((c) => c.id === characterId)
    if (character) {
      gameStore.setState({ character })
    }
  }

  const handleContinue = () => {
    if (selectedCharacterId && selectedCharacter) {
      onSelect?.(selectedCharacterId)
      router.push('/game/select-theme')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-mono text-sm">Back</span>
          </button>
          <h1 className="gradient-text text-3xl md:text-4xl font-bold font-mono">
            SELECT ALIEN
          </h1>
          <div className="w-12" />
        </div>

        <p className="text-muted-foreground text-center mb-10 font-mono text-xs md:text-sm">
          Choose your transformation
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {CHARACTERS.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={selectedCharacterId === character.id}
              onClick={() => handleSelectCharacter(character.id)}
            />
          ))}
        </div>

        {selectedCharacter && (
          <div className="pt-8 border-t border-muted">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h2 className="gradient-text text-2xl md:text-3xl font-bold font-mono mb-3">
                  {selectedCharacter.name}
                </h2>
                <p className="text-foreground text-sm mb-4">
                  {selectedCharacter.description}
                </p>

                <div className="p-3 bg-muted/30 rounded-lg border border-muted text-sm">
                  <p className="text-cyan text-xs font-mono font-semibold mb-1">
                    ABILITY: {selectedCharacter.ability.name}
                  </p>
                  <p className="text-muted-foreground text-xs mb-2">
                    {selectedCharacter.ability.description}
                  </p>
                  <div className="flex gap-4 font-mono text-xs">
                    <span>Duration: <span className="text-green-400">{selectedCharacter.ability.duration}s</span></span>
                    <span>Cooldown: <span className="text-green-400">{selectedCharacter.ability.cooldown}s</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-mono font-bold text-green-400">STATS</h3>
                  <StatLine label="Strength" value={selectedCharacter.stats.strength} />
                  <StatLine label="Velocity" value={selectedCharacter.stats.velocity} />
                  <StatLine label="Intellect" value={selectedCharacter.stats.intellect} />
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80 text-dark-bg font-bold font-mono text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 neon-glow mt-6"
                >
                  <span>Continue</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted-foreground font-mono text-xs">{label}</span>
        <span className="text-green-400 font-mono text-xs">{value}/10</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-cyan"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}
