'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono">Back</span>
          </button>
          <h1 className="gradient-text text-3xl md:text-5xl font-bold font-mono">
            SELECT YOUR ALIEN
          </h1>
          <div className="w-20" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-center mb-12 font-mono text-sm md:text-base max-w-2xl mx-auto"
        >
          Choose your transformation and master its unique abilities
        </motion.p>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
        >
          {CHARACTERS.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CharacterCard
                character={character}
                isSelected={selectedCharacterId === character.id}
                onClick={() => handleSelectCharacter(character.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCharacter && (
            <motion.div
              key={selectedCharacter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="pt-8 border-t border-muted"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h2 className="gradient-text text-2xl md:text-3xl font-bold font-mono mb-4">
                    {selectedCharacter.name}
                  </h2>
                  <p className="text-foreground mb-6 leading-relaxed">
                    {selectedCharacter.description}
                  </p>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-muted/30 rounded-lg border border-muted"
                    >
                      <p className="text-cyan text-xs font-mono font-semibold mb-1">
                        PRIMARY ABILITY
                      </p>
                      <p className="text-green-400 font-mono font-bold mb-2">
                        {selectedCharacter.ability.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {selectedCharacter.ability.description}
                      </p>
                      <div className="flex gap-6 mt-4 text-xs font-mono">
                        <div>
                          <p className="text-muted-foreground mb-1">Duration</p>
                          <p className="text-green-400 font-bold">
                            {selectedCharacter.ability.duration}s
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Cooldown</p>
                          <p className="text-green-400 font-bold">
                            {selectedCharacter.ability.cooldown}s
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-mono font-bold text-green-400">STATS</h3>
                    <StatLine
                      label="Strength"
                      value={selectedCharacter.stats.strength}
                      delay={0.2}
                    />
                    <StatLine
                      label="Velocity"
                      value={selectedCharacter.stats.velocity}
                      delay={0.3}
                    />
                    <StatLine
                      label="Intellect"
                      value={selectedCharacter.stats.intellect}
                      delay={0.4}
                    />
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleContinue}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-cyan hover:from-green-300 hover:to-cyan/80 text-dark-bg font-bold font-mono rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group neon-glow-strong hover:neon-glow-dual ripple-button mt-8"
                  >
                    <span>Continue to Theme Selection</span>
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatLine({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground font-mono text-sm">{label}</span>
        <span className="text-green-400 font-mono font-bold">{value}/10</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-green-400 to-cyan"
        />
      </div>
    </motion.div>
  )
}
