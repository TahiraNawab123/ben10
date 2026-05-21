import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALIENS } from '../data';
import { Alien } from '../types';
import { AlienAvatar } from './AlienAvatar';
import { Volume2, VolumeX, Shield, Zap, Flame, Move, AlertOctagon } from 'lucide-react';

interface Props {
  onSelect: (alien: Alien) => void;
  muted: boolean;
  toggleMuted: () => void;
  playSfx: (type: 'beep' | 'transform' | 'click') => void;
}

export const OmnitrixSelector: React.FC<Props> = ({ onSelect, muted, toggleMuted, playSfx }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const currentAlien = ALIENS[currentIndex];

  const handleNext = () => {
    playSfx('click');
    setCurrentIndex((prev) => (prev + 1) % ALIENS.length);
    setRotation((prev) => prev + 36); // rotate outer bezel slightly
  };

  const handlePrev = () => {
    playSfx('click');
    setCurrentIndex((prev) => (prev - 1 + ALIENS.length) % ALIENS.length);
    setRotation((prev) => prev - 36);
  };

  const selectCharacter = () => {
    playSfx('transform');
    onSelect(currentAlien);
  };

  // Icon mapping helper for visual candy
  const getAbilityIcon = (id: string) => {
    switch (id) {
      case 'heatblast': return <Flame className="w-4 h-4 text-orange-500 mr-2" />;
      case 'xlr8': return <Zap className="w-4 h-4 text-cyan-500 mr-2" />;
      case 'diamondhead': return <Shield className="w-4 h-4 text-emerald-500 mr-2" />;
      case 'fourarms': return <Move className="w-4 h-4 text-red-500 mr-2" />;
      case 'cannonbolt': return <AlertOctagon className="w-4 h-4 text-yellow-500 mr-2" />;
      case 'ghostfreak': return <Shield className="w-4 h-4 text-purple-500 mr-2" />;
      case 'ripjaws': return <Zap className="w-4 h-4 text-blue-500 mr-2" />;
      case 'wildmutt': return <Move className="w-4 h-4 text-orange-500 mr-2" />;
      default: return <Zap className="w-4 h-4 text-green-500 mr-2" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 gap-8 select-none">
      
      {/* LEFT: Complete Interactive 3D Omnitrix Watch Console */}
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[#00ff00]/80 font-mono text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2 text-glow-green">
          <span className="animate-ping block w-2 h-2 rounded-full bg-[#00ff00]"></span>
          OMNITRIX CALIBRATOR // SEC.NULL
        </h2>
 
        {/* Outer Circular Control Deck */}
        <div className="relative w-80 h-80 rounded-full bg-black border-4 border-[#00ff00]/25 shadow-[0_0_40px_rgba(0,255,0,0.15)] flex items-center justify-center">
          
          {/* Static Watch Straps Behind the Watch */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-24 bg-[#0a0f0a] rounded-l-md border-y-2 border-l-2 border-[#00ff00]/20 flex flex-col justify-between p-2">
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-24 bg-[#0a0f0a] rounded-r-md border-y-2 border-r-2 border-[#00ff00]/20 flex flex-col justify-between p-2">
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
            <div className="w-full h-1 bg-[#00ff00]/20 rounded"></div>
          </div>
 
          {/* Rotating Heavy Metal Bezel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="absolute w-72 h-72 rounded-full bg-gradient-to-b from-[#141d14] to-[#040804] border-4 border-[#00ff00]/30 shadow-inner flex items-center justify-center cursor-pointer"
            onClick={handleNext}
          >
            {/* Outer Bezel Heavy Teeth / Markers */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-8 bg-[#00ff00]/25 rounded-sm"
                style={{
                  transform: `rotate(${i * 36}deg) translateY(-132px)`,
                  boxShadow: '0 2px 4px rgba(0,255,0,0.2)'
                }}
              />
            ))}
 
            {/* Inner Glow Trim */}
            <div className="absolute w-60 h-60 rounded-full border border-[#00ff00]/30 shadow-[inset_0_0_20px_rgba(0,255,0,0.25)]"></div>
 
            {/* Micro Green Indicators */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00]"
                style={{
                  transform: `rotate(${i * 90 + 45}deg) translateY(-105px)`
                }}
              />
            ))}
          </motion.div>
 
          {/* Center Hourglass Core Display */}
          <div className="absolute w-44 h-44 rounded-full bg-[#030703] border-4 border-[#00ff00]/45 shadow-[0_0_25px_rgba(0,255,0,0.4)] flex items-center justify-center overflow-hidden">
            {/* Green glowing hourglass graphics */}
            <div className="absolute inset-0 flex flex-col justify-between items-center opacity-70 scale-95 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#00ff00]" strokeWidth="3">
                {/* Triangular hourglass frames */}
                <path d="M15,15 L85,15 L50,50 Z" fill="rgba(0, 255, 0, 0.18)" stroke="#00ff00" />
                <path d="M15,85 L85,85 L50,50 Z" fill="rgba(0, 255, 0, 0.18)" stroke="#00ff00" strokeWidth="3" />
                <circle cx="50" cy="50" r="10" stroke="#00ff00" fill="#000" />
                {/* Outer ring */}
                <circle cx="50" cy="50" r="46" stroke="#00ff00" strokeWidth="1.5" strokeDasharray="5 3" />
              </svg>
            </div>
 
            {/* Active Holographic Avatar Projecting Over the Hourglass */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAlien.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 0.95, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <AlienAvatar id={currentAlien.id} imageUrl={currentAlien.image} className="w-32 h-32" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
 
          {/* Mechanical Dial Outer Trigger Buttons */}
          <button
            id="omnitrix-prev-btn"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#050505] hover:bg-[#00ff00] border-2 border-[#00ff00]/40 text-[#00ff00] hover:text-black font-black flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 z-20"
            title="Previous Alien"
          >
            ◀
          </button>
          <button
            id="omnitrix-next-btn"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#050505] hover:bg-[#00ff00] border-2 border-[#00ff00]/40 text-[#00ff00] hover:text-black font-black flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 z-20"
            title="Next Alien"
          >
            ▶
          </button>
        </div>
 
        {/* Helper instruction */}
        <p className="text-[#00ff00]/60 text-[10px] font-mono mt-4 text-center">
          Tap <kbd className="bg-black/90 border border-[#00ff00]/20 px-1.5 py-0.5 rounded text-[#00ff00]">NEXT</kbd>/<kbd className="bg-black/90 border border-[#00ff00]/20 px-1.5 py-0.5 rounded text-[#00ff00]">PREV</kbd> to cycle dial • Click watch to spin
        </p>
      </div>
 
      {/* RIGHT: High Tech Alien Information Dashboard */}
      <div className="flex-1 hologram-effect rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
        
        {/* Glowing Matrix Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00ff00]/50 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00ff00]/50 rounded-br-xl pointer-events-none"></div>
 
        {/* General Audio and Index Badging */}
        <div className="flex justify-between items-center border-b border-[#00ff00]/15 pb-3 mb-4">
          <div className="font-mono text-[10px] text-[#00ff00]/70">
            SYSTEM STATUS: <span className="text-[#00ff00] font-bold text-glow-green">READY TO TRANSLATE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[#00ff00] font-bold bg-[#00ff00]/10 px-2 py-0.5 rounded border border-[#00ff00]/30 text-[10px]">
              ALIEN {currentIndex + 1} / 10
            </span>
            <button
              onClick={toggleMuted}
              className="text-[#00ff00]/75 hover:text-[#00ff00] transition-colors p-1 hover:bg-[#00ff00]/10 rounded border border-transparent hover:border-[#00ff00]/25"
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#00ff00]" />}
            </button>
          </div>
        </div>
 
        {/* Info panel animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlien.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="mb-6">
              <h1
                className="text-3xl font-black tracking-wider uppercase mb-2 font-sans text-glow-green"
                style={{ color: currentAlien.color }}
              >
                {currentAlien.name}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 min-h-[48px] font-mono">
                {currentAlien.description}
              </p>
 
              {/* Alien Unique Ability Badge */}
              <div
                className="p-3 bg-black/60 rounded-lg border flex items-start"
                style={{ borderColor: `${currentAlien.color}40` }}
              >
                {getAbilityIcon(currentAlien.id)}
                <div>
                  <h4 className="text-xs font-mono uppercase font-black mb-0.5" style={{ color: currentAlien.color }}>
                    Ability: {currentAlien.abilityName}
                  </h4>
                  <p className="text-gray-400 text-xs font-mono">{currentAlien.abilityDesc}</p>
                </div>
              </div>
            </div>
 
            {/* Glowing Attribute Skill-Towers */}
            <div className="space-y-3 mb-6 font-mono">
              {/* SPEED BAR */}
              <div>
                <div className="flex justify-between text-xs text-[#00ff00]/75 mb-1">
                  <span>VELOCITY (SPEED)</span>
                  <span style={{ color: currentAlien.color }}>{currentAlien.stats.speed}/10</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentAlien.stats.speed * 10}%` }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${currentAlien.color}, ${currentAlien.accentColor || '#00ff00'})`,
                      boxShadow: `0 0 8px ${currentAlien.color}aa`
                    }}
                  />
                </div>
              </div>
 
              {/* JUMP BAR */}
              <div>
                <div className="flex justify-between text-xs text-[#00ff00]/75 mb-1">
                  <span>GRAVITATIONAL EXPULSION (JUMP)</span>
                  <span style={{ color: currentAlien.color }}>{currentAlien.stats.jump}/10</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentAlien.stats.jump * 10}%` }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${currentAlien.color}, ${currentAlien.accentColor || '#00ff00'})`,
                      boxShadow: `0 0 8px ${currentAlien.color}aa`
                    }}
                  />
                </div>
              </div>
 
              {/* AGILITY BAR */}
              <div>
                <div className="flex justify-between text-xs text-[#00ff00]/75 mb-1">
                  <span>TACTICAL AGILITY</span>
                  <span style={{ color: currentAlien.color }}>{currentAlien.stats.agility}/10</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentAlien.stats.agility * 10}%` }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${currentAlien.color}, ${currentAlien.accentColor || '#00ff00'})`,
                      boxShadow: `0 0 8px ${currentAlien.color}aa`
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
 
        {/* Lock Selection & Play Module */}
        <div className="pt-2 border-t border-[#00ff00]/15 mt-2 flex flex-col sm:flex-row gap-3">
          <button
            id="select-alien-btn"
            onClick={selectCharacter}
            className="flex-1 bg-[#00ff00] hover:brightness-110 text-black font-black uppercase tracking-[0.15em] py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 text-center cursor-pointer omnitrix-glow text-xs"
          >
            INITIATE TRANSFORMATION • START GAME
          </button>
        </div>
      </div>
 
    </div>
  );
};
