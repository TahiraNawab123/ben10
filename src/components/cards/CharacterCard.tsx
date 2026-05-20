'use client'

import Image from 'next/image'
import { Character } from '@/src/types/game'

interface CharacterCardProps {
  character: Character
  isSelected?: boolean
  onClick?: () => void
}

export function CharacterCard({ character, isSelected = false, onClick }: CharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 group h-64 flex flex-col`}
      style={{
        border: isSelected ? '2px solid #00ff66' : '1px solid rgba(0, 255, 102, 0.3)',
        backgroundColor: 'rgba(10, 20, 35, 0.6)',
        boxShadow: isSelected ? '0 0 20px rgba(0, 255, 102, 0.6), inset 0 0 20px rgba(0, 255, 102, 0.1)' : '0 0 10px rgba(0, 255, 102, 0.2)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.4)'
          e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.6)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 102, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
        }
      }}
    >
      {/* Image Container */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
      </div>

      {/* Info Container */}
      <div className="p-3 flex flex-col justify-end bg-gradient-to-t from-dark-bg to-dark-bg/50">
        <h3 className="font-bold text-center text-sm" style={{ color: '#00ff66' }}>
          {character.name}
        </h3>
        <p className="text-gray-500 text-xs text-center mt-1">{character.ability.name}</p>
      </div>
    </div>
  )
}
