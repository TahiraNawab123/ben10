'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { CHARACTERS } from '@/src/data/characters'
import { gameStore } from '@/src/store/gameStore'
import { CharacterCard } from '@/src/components/cards/CharacterCard'

export function CharacterSelector() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(CHARACTERS[0].id)
  const [scrollPosition, setScrollPosition] = useState(0)
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
    router.push('/game/select-theme')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #0a1a2e 0%, #16213e 30%, #0f4d3e 70%, #0a1a2e 100%)'
    }}>
      {/* Header */}
      <header className="border-b" style={{ 
        borderColor: 'rgba(0, 255, 102, 0.2)',
        backgroundColor: 'rgba(10, 20, 35, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/game/menu" className="flex items-center gap-2 text-green-400 hover:text-cyan transition-colors">
            <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>⬅ BEN10</span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm tracking-wide">DATABASE</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm tracking-wide">STATS</a>
          </nav>

          <div className="flex items-center gap-2 px-3 py-1 rounded border" style={{
            borderColor: '#00ff66',
            color: '#00ff66'
          }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest">READY</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12">
          <div className="mb-4 inline-block px-4 py-1 rounded border" style={{
            borderColor: 'rgba(0, 255, 102, 0.5)',
            color: '#00ff66'
          }}>
            <span className="text-xs font-mono tracking-widest font-bold">SYSTEM ACTIVE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-2" style={{
            color: '#ffffff',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
          }}>
            SELECT YOUR <span style={{ color: '#00ff66' }}>ALIEN</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-4 tracking-wide">
            Browse the alien database to initialize transformation sequence
          </p>
        </div>

        {/* Character Grid */}
        <div className="max-w-7xl w-full mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CHARACTERS.map((character) => (
              <div
                key={character.id}
                onClick={() => handleSelectCharacter(character.id)}
                className="relative cursor-pointer"
              >
                <CharacterCard
                  character={character}
                  isSelected={selectedCharacterId === character.id}
                  onClick={() => handleSelectCharacter(character.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Character Details */}
        {selectedCharacter && (
          <div className="max-w-7xl w-full mt-8 pt-8 border-t" style={{
            borderColor: 'rgba(0, 255, 102, 0.2)'
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-4" style={{
                  color: '#00ff66',
                  textShadow: '0 0 20px rgba(0, 255, 102, 0.5)'
                }}>
                  {selectedCharacter.name}
                </h2>

                <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                  {selectedCharacter.description}
                </p>

                <div className="bg-dark-bg/40 backdrop-blur p-4 rounded border" style={{
                  borderColor: 'rgba(0, 212, 255, 0.3)'
                }}>
                  <p className="text-cyan text-xs font-mono font-bold tracking-widest mb-2">PRIMARY ABILITY</p>
                  <h3 className="text-xl font-bold text-green-400 mb-2">{selectedCharacter.ability.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{selectedCharacter.ability.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <p className="text-gray-500">DURATION</p>
                      <p className="text-green-400 font-bold">{selectedCharacter.ability.duration}s</p>
                    </div>
                    <div>
                      <p className="text-gray-500">COOLDOWN</p>
                      <p className="text-green-400 font-bold">{selectedCharacter.ability.cooldown}s</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-dark-bg/40 backdrop-blur p-6 rounded border" style={{
                  borderColor: 'rgba(0, 255, 102, 0.3)'
                }}>
                  <h3 className="text-lg font-bold text-green-400 mb-6 tracking-widest">STATS</h3>
                  
                  <div className="space-y-4">
                    <StatBar label="Strength" value={selectedCharacter.stats.strength} />
                    <StatBar label="Velocity" value={selectedCharacter.stats.velocity} />
                    <StatBar label="Intellect" value={selectedCharacter.stats.intellect} />
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="mt-6 px-8 py-4 font-bold text-lg tracking-widest rounded flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #00ff66 0%, #00ffaa 100%)',
                    color: '#0a1a2e',
                    boxShadow: '0 0 20px rgba(0, 255, 102, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 102, 0.7)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 102, 0.4)'
                  }}
                >
                  <span>CONTINUE</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-xs font-mono tracking-widest">CLICK TO SELECT • SCROLL TO BROWSE</p>
        </div>
      </div>
    </div>
  )
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-mono">{label}</span>
        <span className="text-green-400 font-mono font-bold text-sm">{value}/10</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 255, 102, 0.1)' }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${(value / 10) * 100}%`,
            background: 'linear-gradient(90deg, #00ff66 0%, #00ffaa 100%)',
            boxShadow: '0 0 10px rgba(0, 255, 102, 0.5)'
          }}
        />
      </div>
    </div>
  )
}
