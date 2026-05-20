'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Character } from '@/src/types/game'

interface CharacterCardProps {
  character: Character
  isSelected?: boolean
  onClick?: () => void
}

export function CharacterCard({ character, isSelected = false, onClick }: CharacterCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-lg overflow-hidden
        transition-all duration-300
        ${isSelected 
          ? 'neon-glow-dual ring-2 ring-green-400' 
          : 'neon-glow border border-muted hover:border-green-500'
        }
        bg-gradient-to-br from-card to-dark-bg/50
        p-4 group
      `}
    >
      <div className="relative h-48 mb-4 rounded overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
      </div>

      <h3 className="gradient-text font-mono text-lg font-bold mb-2">
        {character.name}
      </h3>

      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {character.description}
      </p>

      <div className="space-y-2 mb-4">
        <StatBar label="Strength" value={character.stats.strength} />
        <StatBar label="Speed" value={character.stats.velocity} />
        <StatBar label="Intelligence" value={character.stats.intellect} />
      </div>

      <div className="pt-2 border-t border-muted">
        <p className="text-cyan text-xs font-mono font-semibold">
          {character.ability.name}
        </p>
      </div>

      {isSelected && (
        <motion.div
          layoutId="selectedBorder"
          className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-green-400 to-cyan"
        />
      </div>
      <span className="text-green-400 text-xs font-mono w-5">{value}/10</span>
    </div>
  )
}
