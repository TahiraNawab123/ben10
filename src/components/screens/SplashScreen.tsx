'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, Settings, Volume2, Trophy, Zap } from 'lucide-react'
import { CHARACTERS } from '@/src/data/characters'
import { gameStore } from '@/src/store/gameStore'

const MenuButton = memo(({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-500/10 transition-colors duration-200 text-left">
    <Icon size={18} style={{ color: '#00ff88' }} />
    <span className="font-mono text-sm">{label}</span>
  </button>
))
MenuButton.displayName = 'MenuButton'

const CharacterCardMemo = memo(({ character, isSelected, onSelect }: any) => (
  <button
    onClick={onSelect}
    className="relative group cursor-pointer transition-all duration-200"
  >
    <div className={`relative h-32 md:h-40 rounded-lg overflow-hidden border-2 transition-all ${
      isSelected ? 'border-cyan-400 shadow-lg' : 'border-gray-700 hover:border-green-400/50'
    }`}
    style={{
      boxShadow: isSelected ? '0 0 20px rgba(0, 212, 255, 0.5)' : 'none'
    }}>
      <Image
        src={character.image}
        alt={character.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-200"
        sizes="(max-width: 768px) 100vw, 200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
    <div className="mt-2 text-center">
      <p className="font-mono font-bold text-sm" style={{ color: '#00ff88' }}>{character.name}</p>
      <p className="text-xs text-gray-500">{character.ability.name}</p>
    </div>
  </button>
))
CharacterCardMemo.displayName = 'CharacterCard'

export function SplashScreen() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(CHARACTERS[0].id)
  const router = useRouter()

  const selected = CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0]

  const handleSelectCharacter = (id: string) => {
    const char = CHARACTERS.find(c => c.id === id)
    if (char) {
      setSelectedId(id)
      gameStore.setState({ character: char })
    }
  }

  const handleStartGame = () => {
    router.push('/game/play')
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden" style={{
      backgroundImage: 'linear-gradient(to right, rgba(15, 95, 79, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 95, 79, 0.08) 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b" style={{ borderColor: 'rgba(0, 255, 136, 0.15)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00ff88' }} />
          <span className="text-sm md:text-lg font-bold tracking-widest font-mono" style={{ color: '#00ff88' }}>BEN10</span>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-green-500/10 rounded transition-colors">
          {menuOpen ? <X size={24} style={{ color: '#00ff88' }} /> : <Menu size={24} style={{ color: '#00ff88' }} />}
        </button>
      </header>

      {/* Hamburger Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-0 w-64 bg-black/95 border-l border-b" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}>
          <MenuButton label="Settings" icon={Settings} onClick={() => setMenuOpen(false)} />
          <MenuButton label="Volume" icon={Volume2} onClick={() => setMenuOpen(false)} />
          <MenuButton label="High Scores" icon={Trophy} onClick={() => setMenuOpen(false)} />
          <MenuButton label="Daily Missions" icon={Zap} onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-6 md:pt-8 pb-8 px-4 md:px-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="mb-3 inline-block px-3 py-1.5 border rounded" style={{ borderColor: '#00ff88', color: '#00ff88' }}>
            <span className="text-xs font-mono tracking-widest">SYSTEM ACTIVE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-wider font-mono mb-2" style={{ color: '#ffffff' }}>
            SELECT YOUR <span style={{ color: '#00ff88' }}>ALIEN</span>
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm">Choose your transformation and start the endless challenge</p>
        </div>

        {/* Character Grid */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {CHARACTERS.map(char => (
              <CharacterCardMemo
                key={char.id}
                character={char}
                isSelected={selectedId === char.id}
                onSelect={() => handleSelectCharacter(char.id)}
              />
            ))}
          </div>
        </div>

        {/* Selected Alien Info & Play Button */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Info Panel */}
            <div className="bg-black/50 border rounded-lg p-4 md:p-6" style={{ borderColor: 'rgba(0, 255, 136, 0.2)' }}>
              <h2 className="text-xl md:text-2xl font-bold mb-2 font-mono" style={{ color: '#00ff88' }}>{selected.name}</h2>
              <p className="text-sm text-gray-300 mb-4">{selected.description}</p>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span style={{ color: '#888' }}>Power</span>
                  <span style={{ color: '#00ff88' }}>{selected.stats.strength}/100</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${selected.stats.strength}%` }} />
                </div>

                <div className="flex justify-between mt-3">
                  <span style={{ color: '#888' }}>Speed</span>
                  <span style={{ color: '#00d4ff' }}>{selected.stats.velocity}/100</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${selected.stats.velocity}%` }} />
                </div>

                <div className="flex justify-between mt-3">
                  <span style={{ color: '#888' }}>Intellect</span>
                  <span style={{ color: '#00ff88' }}>{selected.stats.intellect}/100</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${selected.stats.intellect}%` }} />
                </div>
              </div>

              <div className="p-3 bg-gray-900/50 border rounded text-xs font-mono" style={{ borderColor: 'rgba(0, 255, 136, 0.1)' }}>
                <p className="text-gray-500 mb-1">ABILITY: {selected.ability.name}</p>
                <p className="text-gray-400 text-xs">{selected.ability.description}</p>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleStartGame}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-300 hover:to-cyan-300 text-black font-bold font-mono text-lg rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                START GAME
              </button>
              <p className="text-xs text-gray-500 text-center font-mono">Ready to begin the endless challenge?</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
