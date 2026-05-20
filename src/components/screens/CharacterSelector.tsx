'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CHARACTERS } from '@/src/data/characters'
import { gameStore } from '@/src/store/gameStore'
import { ChevronRight, BarChart3 } from 'lucide-react'

interface CharacterSelectorProps {
  onSelect?: (characterId: string) => void
}

export function CharacterSelector({ onSelect }: CharacterSelectorProps) {
  const [selected, setSelected] = useState<string>('')
  const [showStats, setShowStats] = useState(false)
  const router = useRouter()

  const selectedChar = CHARACTERS.find(c => c.id === selected)

  const handleStart = () => {
    if (selected && selectedChar) {
      gameStore.initGame(selectedChar, 'mountains')
      onSelect?.(selected)
      router.push('/game/select-theme')
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-12 text-center">
          SELECT YOUR ALIEN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CHARACTERS.map(char => (
                <div
                  key={char.id}
                  onClick={() => {
                    setSelected(char.id)
                    setShowStats(true)
                  }}
                  className={`cursor-pointer group relative overflow-hidden rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selected === char.id
                      ? 'border-green-400 shadow-2xl shadow-green-500/50 bg-slate-700'
                      : 'border-slate-600 hover:border-cyan-400'
                  }`}
                >
                  <div className="relative w-full aspect-square bg-slate-800">
                    {char.image && (
                      <Image
                        src={char.image}
                        alt={char.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="p-3 bg-slate-900 bg-opacity-90">
                    <p className="font-black text-sm text-green-300">{char.name}</p>
                    <p className="text-xs text-gray-400">{char.primaryPower}</p>
                  </div>

                  {selected === char.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {selected && selectedChar && (
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border-2 border-green-500 rounded-lg p-6 sticky top-6">
                <div className="aspect-square relative mb-6 rounded-lg overflow-hidden border border-green-400">
                  {selectedChar.image && (
                    <Image
                      src={selectedChar.image}
                      alt={selectedChar.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                      }}
                    />
                  )}
                </div>

                <h2 className="text-2xl font-black text-green-300 mb-2">{selectedChar.name}</h2>
                <p className="text-sm text-gray-300 mb-4">{selectedChar.primaryPower}</p>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">STRENGTH</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-sm ${i < selectedChar.strength / 10 ? 'bg-red-500' : 'bg-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">VELOCITY</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-sm ${i < selectedChar.velocity / 10 ? 'bg-blue-500' : 'bg-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">INTELLECT</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-sm ${i < selectedChar.intellect / 10 ? 'bg-purple-500' : 'bg-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2 font-bold">SPECIAL ABILITY</p>
                  <p className="text-sm text-green-300 mb-2">{selectedChar.ability.name}</p>
                  <p className="text-xs text-gray-400">{selectedChar.ability.description}</p>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  START
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
