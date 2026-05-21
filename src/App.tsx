import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALIENS } from './data';
import { Alien } from './types';
import { OmnitrixSelector } from './components/OmnitrixSelector';
import { GameRunner } from './components/GameRunner';
import { sfx } from './utils/audio';
import { Volume2, VolumeX, Shield, Zap, Cpu, Award } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'selector' | 'game'>('landing');
  const [selectedAlien, setSelectedAlien] = useState<Alien>(ALIENS[0]);
  const [muted, setMuted] = useState(false);

  // Sync mute state on startup and save as preference
  useEffect(() => {
    const savedMute = localStorage.getItem('ben10_game_muted');
    if (savedMute === 'true') {
      setMuted(true);
      sfx.setMute(true);
    }
  }, []);

  const toggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      sfx.setMute(next);
      localStorage.setItem('ben10_game_muted', next.toString());
      return next;
    });
  };

  const playSfx = (type: any) => {
    sfx.play(type);
  };

  const handleStartBoot = () => {
    playSfx('transform');
    setScreen('selector');
  };

  const handleAlienSelection = (alien: Alien) => {
    setSelectedAlien(alien);
    setScreen('game');
  };

  const handleQuitToMain = () => {
    playSfx('click');
    setScreen('selector');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff00] flex flex-col justify-between overflow-x-hidden font-sans select-none dna-grid relative">
      
      {/* Decorative Scanline Overlay */}
      <div className="scan-line pointer-events-none z-50"></div>

      {/* Dynamic Animated Core Background Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,0,0.12)_0%,rgba(0,0,0,0)_75%)] pointer-events-none z-0"></div>

      {/* Primary Header/Console Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-black/85 border-b border-[#00ff00]/25 z-10 relative">
        <div className="flex items-center gap-3">
          {/* Hourglass glowing vector icon */}
          <div className="w-9 h-9 rounded-full bg-[#050505] border-2 border-[#00ff00] flex items-center justify-center omnitrix-glow">
            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#00ff00] animate-pulse">
              <path d="M20,20 L80,20 L50,50 Z" />
              <path d="M20,80 L80,80 L50,50 Z" />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#00ff00]/60">PROJECT CODENAME</span>
            <h1 className="text-sm font-black tracking-widest text-[#00ff00] uppercase font-mono text-glow-green">
              OMNI-SELECT V.4
            </h1>
          </div>
        </div>

        {/* Diagnostic Status indicators from modern design spec */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff00] animate-ping" />
            <span className="bg-[#00ff00] text-black px-2 py-0.5 font-bold rounded-sm text-[10px]">CONNECTED</span>
          </div>
          <span className="border border-[#00ff00]/40 text-[#00ff00]/80 px-2 py-0.5 rounded-sm text-[10px]">LATENCY: 14MS</span>
        </div>

        {/* Global mute toggle */}
        <button
          id="global-mute-btn"
          onClick={toggleMuted}
          className="p-2 ml-4 sm:ml-0 bg-[#050505] border border-[#00ff00]/30 rounded-xl hover:bg-[#00ff00]/10 hover:text-white text-[#00ff00] transition-colors cursor-pointer omnitrix-glow"
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-red-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#00ff00]" />}
        </button>
      </header>

      {/* Router Views Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: IMMERSIVE LANDING PAGE */}
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-xl text-center flex flex-col items-center hologram-effect p-8 sm:p-12 rounded-2xl border border-[#00ff00]/30 shadow-[0_0_50px_rgba(0,255,0,0.05)]"
            >
              {/* Spinning circular hologram watch face emblem */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-dashed border-[#00ff00]/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-dashed border-[#00ff00]/40"
                />
                
                {/* Visual Hourglass Core */}
                <div className="w-36 h-36 rounded-full bg-[#050505] border-[3px] border-[#00ff00]/40 shadow-[0_0_40px_rgba(0,255,0,0.3)] flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 fill-[#00ff00] opacity-80 animate-pulse">
                    <path d="M20,20 L80,20 L50,50 Z" />
                    <path d="M20,80 L80,80 L50,50 Z" />
                  </svg>
                  {/* Glowing vertical lines */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00ff00]/15 to-transparent pointer-events-none animate-scan line"></div>
                </div>
              </div>

              {/* Title Typography pairings */}
              <h2 className="text-[#00ff00]/80 font-mono text-xs uppercase tracking-[0.3em] mb-3 text-glow-green">
                SYSTEM CALIBRATING : GENESIS ACTIVE
              </h2>
              <h1 className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white mb-4 uppercase">
                OMNITRIX <span className="text-[#00ff00] text-glow-green">RUNNER</span>
              </h1>
              
              <p className="text-gray-400 text-xs sm:text-sm max-w-sm mb-10 leading-relaxed font-mono">
                The world is being digitized into dynamic grid rails. Choose your alien forms directly inside the watch Selection deck to escape the simulation barriers.
              </p>

              {/* Enter Button */}
              <button
                id="landing-enter-btn"
                onClick={handleStartBoot}
                className="group relative px-10 py-4 rounded-xl bg-[#00ff00] text-black font-black uppercase tracking-[0.15em] text-xs transition-all transform hover:scale-105 active:scale-95 omnitrix-glow cursor-pointer hover:brightness-110"
              >
                ACCESS OMNITRIX DIAL
              </button>
            </motion.div>
          )}

          {/* SCREEN 2: GRAPHICAL OMNITRIX SELECTION SYSTEM */}
          {screen === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <OmnitrixSelector
                onSelect={handleAlienSelection}
                muted={muted}
                toggleMuted={toggleMuted}
                playSfx={playSfx}
              />
            </motion.div>
          )}

          {/* SCREEN 3: HIGH PERFORMANCE SUBWAY SURFER GAMEPLAY */}
          {screen === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full flex justify-center"
            >
              <GameRunner
                selectedAlien={selectedAlien}
                onExit={handleQuitToMain}
                muted={muted}
                toggleMuted={toggleMuted}
                playSfx={playSfx}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Technical Console Footing */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#00ff00]/50 border-t border-[#00ff00]/15 z-10 relative bg-black/40 font-mono gap-2">
        <div>
          PROJECT ALIEN BIO SYSTEMS • NULL-VOID SECTOR
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-[#00ff00]/75">
            <Cpu className="w-3.5 h-3.5" /> VITE ENGINE
          </span>
          <span className="flex items-center gap-1.5 text-[#00ff00]/75">
            <Zap className="w-3.5 h-3.5" /> HTML5 CANVAS
          </span>
        </div>
      </footer>

    </div>
  );
}
