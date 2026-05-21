import React, { useEffect, useRef, useState } from 'react';
import { Alien, Obstacle, PlayerState } from '../types';
import { ALIENS } from '../data';
import { Volume2, VolumeX, RotateCcw, Home, Play, Pause, Zap, Flame, Shield, Award } from 'lucide-react';

interface Props {
  selectedAlien: Alien;
  onExit: () => void;
  muted: boolean;
  toggleMuted: () => void;
  playSfx: (type: 'beep' | 'transform' | 'click' | 'jump' | 'slide' | 'coin' | 'crash' | 'powerup') => void;
}

const COLLISION_PLANE_Z = 35;

export const GameRunner: React.FC<Props> = ({ selectedAlien, onExit, muted, toggleMuted, playSfx }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Highscore state persisted in localstorage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('ben10_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'paused' | 'gameover'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [player, setPlayer] = useState<PlayerState>({
    lane: 1,
    targetLane: 1,
    y: 0,
    vy: 0,
    isJumping: false,
    isSliding: false,
    slideTimer: 0,
    score: 0,
    energy: 50, // Starts at 50% Omnitrix capacity
    distance: 0,
    shieldActive: selectedAlien.id === 'diamondhead', // Diamonhead starts with active shield
    shieldTimer: selectedAlien.id === 'diamondhead' ? 999999 : 0,
    magnetActive: false,
    magnetTimer: 0,
    multiplier: 1
  });

  // Keep player state in ref to avoid react re-render delay inside animation frame
  const playerRef = useRef<PlayerState>({ ...player });
  playerRef.current = player;

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  obstaclesRef.current = obstacles;

  // Track animation parameters
  const trackSpeedRef = useRef<number>(10);
  const trackOffsetRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const transformFlashRef = useRef<number>(12); // start with high neon flash duration
  const particlesRef = useRef<Array<{ x: number, y: number, vx: number, vy: number, color: string, size: number, alpha: number }>>([]);
  const textPopupsRef = useRef<Array<{ text: string, x: number, y: number, color: string, timer: number }>>([]);

  // Active player projectile list
  const playerProjectilesRef = useRef<Array<{
    id: string;
    lane: number;
    z: number;
    type: 'fireball' | 'crystal' | 'plasma' | 'slime' | 'acid' | 'lightning' | 'shockwave';
    width: number;
    height: number;
    color: string;
  }>>([]);
  const abilityCooldownRef = useRef<number>(0);
  const tempInvincibleRef = useRef<number>(0);

  // Swipe controls tracking
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  // Setup game over high score saving
  const checkAndSaveHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('ben10_high_score', score.toString());
      } catch (e) {
        console.error("Failed to write highscore to local storage", e);
      }
    }
  };

  // Trigger Combat ability moves
  const triggerCombatAbility = () => {
    if (gameState !== 'playing') return;
    if (abilityCooldownRef.current > 0) return;
    
    abilityCooldownRef.current = 14; // cooldown frames
    const id = selectedAlien.id;

    if (id === 'alien_x') {
      playSfx('transform');
      screenShakeRef.current = 28;
      transformFlashRef.current = 15;

      let count = 0;
      obstaclesRef.current.forEach(obs => {
        if (obs.z > 35 && obs.type !== 'energyCore' && obs.type !== 'shield' && obs.type !== 'magnet') {
          obs.collected = true;
          count++;
          for (let k = 0; k < 6; k++) {
            particlesRef.current.push({
              x: (obs.lane - 1) * 110 + (Math.random() - 0.5) * 40,
              y: (Math.random() - 0.5) * 30 + 15,
              vx: (Math.random() - 0.5) * 6,
              vy: Math.random() * 5 + 1,
              color: '#FFFFFF',
              size: Math.random() * 4 + 2,
              alpha: 1
            });
          }
        }
      });

      if (count > 0) {
        setPlayer(prev => ({ ...prev, score: prev.score + count * 150 }));
        createTextPopup(`REALITY EXTINGUISH! +${count * 150}`, 1, 40, '#00FF00');
      } else {
        createTextPopup("COSMIC SENSE Active", 1, 40, '#FFFFFF');
      }
    } else if (id === 'xlr8') {
      playSfx('jump');
      tempInvincibleRef.current = 90; // 1.5 seconds hyper-dash
      createTextPopup("HYPER CYCLONE DASH!", playerRef.current.lane, 25, '#00F0FF');
      createParticles(playerRef.current.lane, 15, '#00F0FF', 18);
    } else if (id === 'fourarms') {
      playSfx('crash');
      screenShakeRef.current = 14;
      createTextPopup("SEISMIC CLAP!", playerRef.current.lane, 20, '#FF1E27');
      createParticles(playerRef.current.lane, 15, '#FF1E27', 20);

      obstaclesRef.current.forEach(obs => {
        if (obs.lane === playerRef.current.lane && obs.z > 35 && obs.type !== 'energyCore' && obs.type !== 'shield' && obs.type !== 'magnet') {
          obs.collected = true;
          setPlayer(prev => ({ ...prev, score: prev.score + 100 }));
          for (let k = 0; k < 8; k++) {
            particlesRef.current.push({
              x: (obs.lane - 1) * 110 + (Math.random() - 0.5) * 30,
              y: (Math.random() - 0.5) * 15,
              vx: (Math.random() - 0.5) * 5,
              vy: Math.random() * 4 + 1,
              color: '#D35400',
              size: Math.random() * 3 + 2,
              alpha: 0.9
            });
          }
        }
      });
    } else if (id === 'rath') {
      playSfx('jump');
      tempInvincibleRef.current = 65; // 1 second tiger claws dash
      createTextPopup("SHRED REIGN!", playerRef.current.lane, 35, '#E65C00');
      createParticles(playerRef.current.lane, 15, '#E65C00', 16);
    } else {
      // Create and project custom bullet projectiles
      playSfx('click');
      let type: 'fireball' | 'crystal' | 'plasma' | 'slime' | 'acid' | 'lightning' = 'plasma';
      let color = '#32CD32';

      if (id === 'heatblast') { type = 'fireball'; color = '#FF4D00'; }
      else if (id === 'diamondhead') { type = 'crystal'; color = '#00FFA3'; }
      else if (id === 'stinkfly') { type = 'slime'; color = '#EEFF41'; }
      else if (id === 'goop') { type = 'acid'; color = '#00FF64'; }
      else if (id === 'ampfibian') { type = 'lightning'; color = '#00D1FF'; }

      playerProjectilesRef.current.push({
        id: Math.random().toString(),
        lane: playerRef.current.lane,
        z: COLLISION_PLANE_Z + 5,
        type,
        width: 15,
        height: 15,
        color
      });

      // Show small charge flash
      createParticles(playerRef.current.lane, playerRef.current.y + 15, color, 4);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        const nextLane = Math.max(0, playerRef.current.lane - 1);
        if (nextLane !== playerRef.current.lane) {
          playSfx('click');
          setPlayer(prev => ({ ...prev, lane: nextLane, targetLane: nextLane }));
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const nextLane = Math.min(2, playerRef.current.lane + 1);
        if (nextLane !== playerRef.current.lane) {
          playSfx('click');
          setPlayer(prev => ({ ...prev, lane: nextLane, targetLane: nextLane }));
        }
      } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !playerRef.current.isJumping && !playerRef.current.isSliding) {
        playSfx('jump');
        // Apply special stats (Four Arms gets bonus jump height)
        const jumpImpulse = selectedAlien.id === 'fourarms' ? 17 : 14;
        setPlayer(prev => ({
          ...prev,
          isJumping: true,
          vy: jumpImpulse
        }));
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && !playerRef.current.isJumping) {
        playSfx('slide');
        setPlayer(prev => ({
          ...prev,
          isSliding: true,
          slideTimer: 25 // frames duration
        }));
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'Enter') {
        triggerCombatAbility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedAlien]);

  // Handle Touch Swipes for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    
    // Set direct swap threshold (in pixels)
    const threshold = 35;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > threshold) {
        // Swipe Right
        const nextLane = Math.min(2, playerRef.current.lane + 1);
        if (nextLane !== playerRef.current.lane) {
          playSfx('click');
          setPlayer(prev => ({ ...prev, lane: nextLane, targetLane: nextLane }));
        }
      } else if (dx < -threshold) {
        // Swipe Left
        const nextLane = Math.max(0, playerRef.current.lane - 1);
        if (nextLane !== playerRef.current.lane) {
          playSfx('click');
          setPlayer(prev => ({ ...prev, lane: nextLane, targetLane: nextLane }));
        }
      }
    } else {
      // Vertical swipe
      if (dy > threshold && !playerRef.current.isJumping) {
        // Swipe Down (Slide)
        playSfx('slide');
        setPlayer(prev => ({
          ...prev,
          isSliding: true,
          slideTimer: 25
        }));
      } else if (dy < -threshold && !playerRef.current.isJumping && !playerRef.current.isSliding) {
        // Swipe Up (Jump)
        playSfx('jump');
        const jumpImpulse = selectedAlien.id === 'fourarms' ? 17 : 14;
        setPlayer(prev => ({
          ...prev,
          isJumping: true,
          vy: jumpImpulse
        }));
      }
    }
    touchStartRef.current = null;
  };

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('playing');
          playSfx('beep');
          return 0;
        }
        playSfx('beep');
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Obstacle generator & game physics loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let frameId: number;
    let spawnCounter = 0;
    let localDistance = 0;

    // Speeds and scale controls
    const MAX_WORLD_Z = 600;
    const TRACK_SEGMENT_LENGTH = 15;

    // Power-ups spawn rates
    const spawnObstacle = () => {
      const typeRand = Math.random();
      let type: Obstacle['type'] = 'barricade';

      if (typeRand < 0.38) {
        type = Math.random() < 0.5 ? 'barrier' : 'barricade';
      } else if (typeRand < 0.50) {
        type = 'beam'; // requires slide
      } else if (typeRand < 0.68) {
        // Spawning oncoming enemies
        type = Math.random() < 0.65 ? 'enemy_drone' : 'enemy_soldier';
      } else if (typeRand < 0.82) {
        type = 'energyCore'; // green capsule loading Omnitrix
      } else {
        type = Math.random() < 0.5 ? 'magnet' : 'shield';
      }

      // Generate in custom randomly selected lane
      const lane = Math.floor(Math.random() * 3);

      const isEnemy = type === 'enemy_drone' || type === 'enemy_soldier';
      const enemyHealth = type === 'enemy_drone' ? 1 : 2;

      const newObstacle: Obstacle = {
        id: Math.random().toString(),
        lane,
        z: MAX_WORLD_Z,
        type,
        width: type === 'energyCore' || type === 'magnet' || type === 'shield' ? 24 : (type === 'enemy_soldier' ? 45 : (type === 'enemy_drone' ? 38 : 50)),
        height: type === 'beam' ? 45 : (type === 'barrier' ? 24 : (type === 'enemy_soldier' ? 55 : (type === 'enemy_drone' ? 38 : 55))),
        collected: false,
        health: isEnemy ? enemyHealth : undefined,
        driftTimer: isEnemy ? Math.floor(Math.random() * 60) : undefined,
        driftDir: isEnemy ? (Math.random() < 0.5 ? -1 : 1) : undefined
      };

      setObstacles(prev => [...prev, newObstacle]);
    };

    const loop = () => {
      // Update combat ticker elements
      if (abilityCooldownRef.current > 0) abilityCooldownRef.current--;
      if (tempInvincibleRef.current > 0) tempInvincibleRef.current--;

      // 1. Progress track offset for lines animation
      trackOffsetRef.current = (trackOffsetRef.current + trackSpeedRef.current) % (TRACK_SEGMENT_LENGTH * 4);

      // Increase speed slightly over time
      trackSpeedRef.current = Math.min(22, 10 + Math.floor(localDistance / 1000) * 1.5);

      // 2. Spawn manager
      spawnCounter += trackSpeedRef.current;
      // Adjust balance according to Grey Matter intelligence
      const spawnCoeff = selectedAlien.id === 'grey_matter' ? 240 : 320;
      if (spawnCounter > spawnCoeff) {
        spawnObstacle();
        spawnCounter = 0;
      }

      // 3. Update player jumping & sliding state
      let p = { ...playerRef.current };

      if (p.isJumping) {
        p.y += p.vy;
        p.vy -= 0.8; // gravity force
        if (p.y <= 0) {
          p.y = 0;
          p.vy = 0;
          p.isJumping = false;
        }
      }

      if (p.isSliding) {
        p.slideTimer--;
        if (p.slideTimer <= 0) {
          p.isSliding = false;
        }
      }

      // Update active Timers & decay powerups
      if (p.shieldActive && selectedAlien.id !== 'diamondhead') {
        p.shieldTimer -= 1;
        if (p.shieldTimer <= 0) {
          p.shieldActive = false;
        }
      }
      if (p.magnetActive) {
        p.magnetTimer -= 1;
        if (p.magnetTimer <= 0) {
          p.magnetActive = false;
        }
      }

      // XLR8 runs faster, score multiplier doubles
      const distanceGain = (trackSpeedRef.current / 10) * (selectedAlien.id === 'xlr8' ? 1.5 : 1);
      localDistance += distanceGain;
      p.distance = Math.floor(localDistance);

      // Custom active scores calculations (XLR8 triples coefficient)
      const baseMultiplier = selectedAlien.id === 'xlr8' ? 3 : 1;
      p.score = Math.floor(p.distance * baseMultiplier) + (p.energy * 10);

      // 3.5 Update active player combat projectiles and hit registration
      const nextProjectiles: typeof playerProjectilesRef.current = [];
      for (let pProj of playerProjectilesRef.current) {
        pProj.z += 25; // advance forward along path
        
        // Projectile glowing trails
        particlesRef.current.push({
          x: (pProj.lane - 1) * 110 + (Math.random() - 0.5) * 12,
          y: playerRef.current.y + 15 + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: pProj.color,
          size: Math.random() * 3.5 + 1.5,
          alpha: 0.8
        });

        if (pProj.z > MAX_WORLD_Z) continue;

        let hitSomething = false;

        for (let obs of obstaclesRef.current) {
          if (obs.collected) continue;

          // Target matches lane & is near in depth
          if (obs.lane === pProj.lane && Math.abs(obs.z - pProj.z) < 25) {
            const isPowerup = obs.type === 'energyCore' || obs.type === 'shield' || obs.type === 'magnet';
            if (isPowerup) continue;

            hitSomething = true;
            obs.health = obs.health ? obs.health - 1 : 0;

            playSfx('coin'); // impact trigger sound
            createParticles(obs.lane, 25, pProj.color, 12);

            if (obs.health <= 0) {
              obs.collected = true;
              let points = 50;
              let label = "DESTROYED!";

              if (obs.type === 'enemy_drone') {
                points = 150;
                label = "DRONE BLASTED! +150";
                playSfx('powerup');
              } else if (obs.type === 'enemy_soldier') {
                points = 250;
                label = "CYBER GUARD SMASHED! +250";
                playSfx('powerup');
              } else if (obs.type === 'enemy_laser') {
                points = 20;
                label = "CHARGE DEFLECTED!";
              }

              p.score += points;
              createTextPopup(label, obs.lane, 35, pProj.color);
            } else {
              createTextPopup("GUARD REINFORCED!", obs.lane, 35, '#FFFFFF');
            }
            break;
          }
        }

        if (!hitSomething) {
          nextProjectiles.push(pProj);
        }
      }
      playerProjectilesRef.current = nextProjectiles;

      // 4. Update existing obstacles positioning & perform Collision checks
      const nextObstacles: Obstacle[] = [];
      const COLLISION_PLANE_Z = 35; // depth where human player runs

      for (let obs of obstaclesRef.current) {
        // Handle projectile laser speed ratios
        if (obs.type === 'enemy_laser') {
          obs.z -= trackSpeedRef.current * 1.5; // moves exceptionally fast!
        } else {
          obs.z -= trackSpeedRef.current;
        }

        // Oncoming mobile drones / soldiers intelligence controls
        if (!obs.collected && obs.z > 150 && obs.z < 500) {
          const isEnemy = obs.type === 'enemy_drone' || obs.type === 'enemy_soldier';
          if (isEnemy && obs.driftTimer !== undefined && obs.driftDir !== undefined) {
            obs.driftTimer--;
            if (obs.driftTimer <= 0) {
              obs.driftDir = -obs.driftDir;
              obs.driftTimer = Math.floor(Math.random() * 80) + 40;
            }
            // Slowly drift lane
            obs.lane += obs.driftDir * 0.018 * (trackSpeedRef.current / 10);
            obs.lane = Math.max(0, Math.min(2, obs.lane));

            // Enemy shoots firing lasers!
            if (Math.random() < 0.0075) {
              const enemyLaneRounded = Math.min(2, Math.max(0, Math.round(obs.lane)));
              const newLaser: Obstacle = {
                id: Math.random().toString(),
                lane: enemyLaneRounded,
                z: obs.z - 8,
                type: 'enemy_laser',
                width: 14,
                height: 14,
                collected: false
              };
              nextObstacles.push(newLaser);
              createParticles(enemyLaneRounded, 25, '#FF00FF', 3);
            }
          }
        }

        // Skip if finished passing behind player
        if (obs.z < 10) {
          continue;
        }

        let keeps = true;

        // Magnet ability: pulls coins/energy cores closer to player lane if magnetActive
        const isMagnetizable = obs.type === 'energyCore' || obs.type === 'shield' || obs.type === 'magnet';
        if (isMagnetizable && p.magnetActive && obs.z < 300) {
          // Slowly adjust obstacle lane to match player
          if (obs.lane < p.lane) obs.lane += 0.08;
          if (obs.lane > p.lane) obs.lane -= 0.08;
        }

        // Check proximity collision details
        if (!obs.collected && Math.abs(obs.z - COLLISION_PLANE_Z) < 20) {
          // Must match current lane (round lane bounds due to magnet pulling offsets)
          if (Math.round(obs.lane) === p.lane) {
            
            if (obs.type === 'energyCore') {
              obs.collected = true;
              p.energy = Math.min(100, p.energy + (selectedAlien.id === 'grey_matter' ? 8 : 5));
              playSfx('coin');
              
              // Spawn beautiful coin particles
              createParticles(p.lane, p.y, '#00ff00', 8);
              createTextPopup("+CORE", p.lane, p.y, '#00ff00');
              keeps = false;
            } else if (obs.type === 'magnet') {
              obs.collected = true;
              p.magnetActive = true;
              // Upgrade tech lets magnet last 50% longer (600 frames instead of 400)
              p.magnetTimer = selectedAlien.id === 'upgrade' ? 600 : 400;
              playSfx('powerup');
              createParticles(p.lane, p.y, '#00F0FF', 10);
              createTextPopup("MAGNET", p.lane, p.y, '#00F0FF');
              keeps = false;
            } else if (obs.type === 'shield') {
              obs.collected = true;
              p.shieldActive = true;
              p.shieldTimer = selectedAlien.id === 'upgrade' ? 600 : 400;
              playSfx('powerup');
              createParticles(p.lane, p.y, '#FFD700', 10);
              createTextPopup("SHIELD", p.lane, p.y, '#FFD700');
              keeps = false;
            } else {
              // Hit hazardous obstacles (barricades, high beams, low barriers)
              let didEvade = false;

              // Rath & XLR8 absolute auto-shredding capability!
              if (tempInvincibleRef.current > 0) {
                didEvade = true;
                obs.collected = true;
                playSfx('crash');
                createTextPopup("SHREDDED! +100", p.lane, p.y, selectedAlien.color);
                createParticles(p.lane, p.y, selectedAlien.color, 15);
                p.score += 100;
                keeps = false;
              }

              if (!didEvade && obs.type === 'beam' && p.isSliding) {
                // Dodged barrier successfully by sliding
                didEvade = true;
              } else if (!didEvade && obs.type === 'barrier' && p.isJumping) {
                // Dodged barrier successfully by jumping
                didEvade = true;
              }

              // Special alien evasions
              // 1. Goop slips under lasers with ease
              if (!didEvade && selectedAlien.id === 'goop' && obs.type === 'beam') {
                didEvade = true;
                createTextPopup("ACID SLIP!", p.lane, p.y, '#00FF64');
                createParticles(p.lane, p.y, '#00FF64', 8);
              }

              // 2. Heatblast incinerates barriers automatically
              if (!didEvade && selectedAlien.id === 'heatblast' && obs.type === 'barrier') {
                didEvade = true;
                createTextPopup("BURNED!", p.lane, p.y, '#FF4D00');
                createParticles(p.lane, p.y, '#FF4D00', 12);
              }

              if (!didEvade) {
                // If shield is active, block collision block
                if (p.shieldActive) {
                  p.shieldActive = false;
                  p.shieldTimer = 0;
                  obs.collected = true;
                  playSfx('powerup');
                  screenShakeRef.current = 10;
                  createTextPopup("SHIELD CAVED!", p.lane, p.y, '#FF1E27');
                  createParticles(p.lane, p.y, '#FFF', 15);
                  keeps = false;
                } else {
                  // Hit and Game Over
                  playSfx('crash');
                  screenShakeRef.current = 24;
                  setGameState('gameover');
                  checkAndSaveHighScore(p.score);
                  return; // absolute stop
                }
              }
            }
          }
        }

        if (keeps) {
          nextObstacles.push(obs);
        }
      }

      // Update refs
      setPlayer(p);
      setObstacles(nextObstacles);

      // Decays animation highlights
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.85;
      if (transformFlashRef.current > 0) transformFlashRef.current -= 0.5;

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, selectedAlien]);

  // Main Canvas Multi-Layer Graphic Artist
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Clean canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw gorgeous cosmic dark space background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#020502');
      skyGrad.addColorStop(0.5, '#000000');
      skyGrad.addColorStop(1, '#050505');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw background fast-moving grid stars to simulate high speed
      ctx.fillStyle = 'rgba(0, 255, 0, 0.18)';
      for (let i = 0; i < 30; i++) {
        const starX = (Math.sin(i * 4325.54) * 0.5 + 0.5) * width;
        const starSpeed = (Math.cos(i * 1234.56) * 0.5 + 0.5) * 5 + 2;
        const starY = ((Date.now() / 20 * starSpeed) + (i * 25)) % height;
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Apply screen shake offset matrices
      ctx.save();
      if (screenShakeRef.current > 0.5) {
        const dx = (Math.random() - 0.5) * screenShakeRef.current;
        const dy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(dx, dy);
      }

      // 3D vanishing points parameters
      const centerX = width / 2;
      const centerY = height * 0.35; // horizon
      const maxZ = 600;

      // Project logic helper (relative road width and depth parameters)
      const projectPoint = (worldX: number, worldY: number, worldZ: number) => {
        const scale = 360 / Math.max(1, worldZ);
        return {
          x: centerX + worldX * scale,
          y: centerY + (height * 0.38 - worldY) * scale,
          scale
        };
      };

      // Draw side fence towers & matrix walls (3D vanishing lines)
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.12)';
      ctx.lineWidth = 1;
      
      const horizonLine = projectPoint(-1000, 0, maxZ);
      const bottomLine = projectPoint(-1000, 0, 20);
      
      // Draw outer fences neon lanes
      const trackWidth = 240; // total width span
      const laneWidth = trackWidth / 3;

      const borderL_horizon = projectPoint(-trackWidth, 0, maxZ);
      const borderL_near = projectPoint(-trackWidth, 0, 15);
      const borderR_horizon = projectPoint(trackWidth, 0, maxZ);
      const borderR_near = projectPoint(trackWidth, 0, 15);

      // Neon highway side guards
      ctx.beginPath();
      ctx.moveTo(borderL_horizon.x, borderL_horizon.y);
      ctx.lineTo(borderL_near.x, borderL_near.y);
      ctx.moveTo(borderR_horizon.x, borderR_horizon.y);
      ctx.lineTo(borderR_near.x, borderR_near.y);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.65)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Draw horizontal rail track sleepers (ties) moving down the perspective
      ctx.strokeStyle = '#2d332f';
      ctx.lineWidth = 2.5;
      
      const segmentCount = 20;
      for (let i = 0; i < segmentCount; i++) {
        const stepZ = ((i * (maxZ / segmentCount)) - trackOffsetRef.current + maxZ) % maxZ;
        if (stepZ < 15) continue;

        const leftPoint = projectPoint(-trackWidth, 0, stepZ);
        const rightPoint = projectPoint(trackWidth, 0, stepZ);

        // draw ties
        ctx.beginPath();
        ctx.moveTo(leftPoint.x, leftPoint.y);
        ctx.lineTo(rightPoint.x, rightPoint.y);
        // glowing ties every 4 elements
        if (i % 4 === 0) {
          ctx.strokeStyle = 'rgba(50, 255, 50, 0.25)';
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = '#1e2421';
          ctx.lineWidth = 1.5;
        }
        ctx.stroke();
      }

      // Draw the 3 lane separators (lanes 0, 1, 2)
      ctx.strokeStyle = 'rgba(50, 205, 50, 0.15)';
      ctx.lineWidth = 1.5;
      for (let l = 1; l < 3; l++) {
        const rx = -trackWidth + l * laneWidth * 2;
        const topSep = projectPoint(rx, 0, maxZ);
        const botSep = projectPoint(rx, 0, 15);
        ctx.beginPath();
        ctx.moveTo(topSep.x, topSep.y);
        ctx.lineTo(botSep.x, botSep.y);
        ctx.stroke();
      }

      // Draw active dynamic indicators on track floor highlighting the lanes
      for (let l = 0; l < 3; l++) {
        const rx = -trackWidth + (l + 0.5) * laneWidth * 2;
        const testP = projectPoint(rx, 0, 40);
        
        ctx.fillStyle = l === playerRef.current.lane ? 'rgba(50, 255, 50, 0.08)' : 'rgba(255, 255, 255, 0.01)';
        ctx.beginPath();
        const p1 = projectPoint(rx - laneWidth + 5, 0, 70);
        const p2 = projectPoint(rx + laneWidth - 5, 0, 70);
        const p3 = projectPoint(rx + laneWidth - 25, 0, 25);
        const p4 = projectPoint(rx - laneWidth + 25, 0, 25);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
      }

      // DRAW OBSTACLES (Render sorted from back to front, horizon to near)
      const sortedObstacles = [...obstaclesRef.current].sort((a, b) => b.z - a.z);

      for (const obs of sortedObstacles) {
        if (obs.collected) continue;

        const rx = -trackWidth + (obs.lane + 0.5) * laneWidth * 2;
        
        // Offset elements vertically to sit directly on ground
        const bottomY = 0;
        const proj = projectPoint(rx, bottomY, obs.z);

        // size coordinates mapping
        const scaleWidth = obs.width * proj.scale;
        const scaleHeight = obs.height * proj.scale;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        if (obs.type === 'energyCore') {
          // Draw Omnitrix glowing green energy capsules
          ctx.shadowColor = '#32cd32';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#0a0d0a';
          ctx.strokeStyle = '#32cd32';
          ctx.lineWidth = 2;
          
          // Capsule pill outline
          ctx.beginPath();
          ctx.roundRect(-scaleWidth / 2, -scaleHeight - Math.sin(Date.now() / 150 + obs.z) * 6, scaleWidth, scaleHeight, 12);
          ctx.fill();
          ctx.stroke();

          // Green power core center symbol
          ctx.fillStyle = '#32cd32';
          ctx.beginPath();
          ctx.arc(0, -scaleHeight / 2 - Math.sin(Date.now() / 150 + obs.z) * 6, scaleWidth / 3, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (obs.type === 'magnet') {
          // Visual design for magnetic horseshoe
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 10;
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, -scaleHeight / 2 - Math.sin(Date.now() / 100) * 4, scaleWidth / 2.2, Math.PI, 0, true);
          ctx.stroke();
          // Red magnet poles
          ctx.fillStyle = '#FF1E27';
          ctx.fillRect(-scaleWidth / 2, -scaleHeight / 2 - Math.sin(Date.now() / 100) * 4, 6, 8);
          ctx.fillRect(scaleWidth / 2 - 6, -scaleHeight / 2 - Math.sin(Date.now() / 100) * 4, 6, 8);
        }
        else if (obs.type === 'shield') {
          // Diamondhead shaped crystalline shield core
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 12;
          ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, -scaleHeight - Math.sin(Date.now() / 200) * 5);
          ctx.lineTo(scaleWidth / 2, -scaleHeight / 2 - Math.sin(Date.now() / 200) * 5);
          ctx.lineTo(0, - Math.sin(Date.now() / 200) * 5);
          ctx.lineTo(-scaleWidth / 2, -scaleHeight / 2 - Math.sin(Date.now() / 200) * 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        else if (obs.type === 'beam') {
          // Yellow lasers / glowing beams (player must slide under)
          ctx.fillStyle = '#FF8C00';
          ctx.shadowColor = '#FF8C00';
          ctx.shadowBlur = 15;
          
          // Left and Right structural barricade pillars
          ctx.fillRect(-scaleWidth - 5, -scaleHeight, 8 * proj.scale, scaleHeight);
          ctx.fillRect(scaleWidth - 3, -scaleHeight, 8 * proj.scale, scaleHeight);

          // Glowing cross suspension wirebeam
          const beamY = -scaleHeight + 12 * proj.scale;
          ctx.fillStyle = 'rgba(255, 140, 0, 0.8)';
          ctx.fillRect(-scaleWidth, beamY, scaleWidth * 2, 7 * proj.scale);

          // Digital danger glyph
          ctx.fillStyle = '#111';
          ctx.font = `bold ${Math.max(6, 12 * proj.scale)}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText("DANGER LEVEL-2", 0, beamY - 4);
        } 
        else if (obs.type === 'barrier') {
          // Jump hazard barriers
          ctx.fillStyle = '#1E2528';
          ctx.strokeStyle = '#FF1E27';
          ctx.lineWidth = 1.5;
          // Outer metal frame
          ctx.beginPath();
          ctx.rect(-scaleWidth / 2, -scaleHeight, scaleWidth, scaleHeight);
          ctx.fill();
          ctx.stroke();

          // Hazard diagonal stripe textures
          ctx.fillStyle = '#FF1E27';
          ctx.beginPath();
          for (let s = -scaleWidth / 2.5; s < scaleWidth / 2.5; s += 16 * proj.scale) {
            ctx.rect(s, -scaleHeight + 2, 6 * proj.scale, scaleHeight - 4);
          }
          ctx.fill();
        } 
        else if (obs.type === 'barricade') {
          // Full solid tall barricades (dodges left/right)
          ctx.fillStyle = '#101416';
          ctx.strokeStyle = '#52c41a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-scaleWidth / 2, -scaleHeight, scaleWidth, scaleHeight, 4);
          ctx.fill();
          ctx.stroke();

          // Glow alien center logo decoration
          ctx.fillStyle = 'rgba(82, 196, 26, 0.1)';
          ctx.beginPath();
          ctx.arc(0, -scaleHeight / 2, scaleWidth / 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Hazard stripes
          ctx.strokeStyle = '#52c41a';
          ctx.lineWidth = 2 * proj.scale;
          ctx.beginPath();
          ctx.moveTo(-scaleWidth / 3, -scaleHeight / 1.3);
          ctx.lineTo(scaleWidth / 3, -scaleHeight / 4);
          ctx.moveTo(-scaleWidth / 3, -scaleHeight / 4);
          ctx.lineTo(scaleWidth / 3, -scaleHeight / 1.3);
          ctx.stroke();
        }
        else if (obs.type === 'enemy_drone') {
          // Metal alien round flying hover drones
          ctx.shadowColor = '#FF1E27';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#1C1F22';
          ctx.strokeStyle = '#FF3E3E';
          ctx.lineWidth = 2;

          const dY = -scaleHeight / 1.8 - Math.sin(Date.now() / 80 + obs.z) * 8;

          ctx.beginPath();
          ctx.arc(0, dY, scaleWidth / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Outer cyber wings
          ctx.beginPath();
          ctx.moveTo(-scaleWidth / 2, dY);
          ctx.lineTo(-scaleWidth * 0.9, dY - 2);
          ctx.lineTo(-scaleWidth / 2, dY + 5);
          ctx.fillStyle = '#2C2F32';
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(scaleWidth / 2, dY);
          ctx.lineTo(scaleWidth * 0.9, dY - 2);
          ctx.lineTo(scaleWidth / 2, dY + 5);
          ctx.fill();
          ctx.stroke();

          // Glowing glowing red cyclops eye
          ctx.fillStyle = '#FF1E27';
          ctx.beginPath();
          ctx.arc(Math.sin(Date.now() / 150) * 3, dY, scaleWidth / 7, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (obs.type === 'enemy_soldier') {
          // Vilgax alien combat infantry biped robot
          ctx.shadowColor = '#8D44AD';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#2C2433';
          ctx.strokeStyle = '#9B59B6';
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.moveTo(-scaleWidth / 2.2, -scaleHeight);
          ctx.lineTo(scaleWidth / 2.2, -scaleHeight);
          ctx.lineTo(scaleWidth / 2, -scaleHeight * 0.2);
          ctx.lineTo(scaleWidth / 3.5, 0);
          ctx.lineTo(-scaleWidth / 3.5, 0);
          ctx.lineTo(-scaleWidth / 2, -scaleHeight * 0.2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Angry futuristic visors
          ctx.fillStyle = '#AF7AC5';
          ctx.fillRect(-scaleWidth / 4, -scaleHeight + 12, scaleWidth / 2, 5);

          // Heavy gun blaster hand
          ctx.fillStyle = '#1D1324';
          ctx.fillRect(-scaleWidth / 1.5, -scaleHeight * 0.65, scaleWidth / 4, scaleHeight * 0.35);
          ctx.strokeStyle = '#AF7AC5';
          ctx.strokeRect(-scaleWidth / 1.5, -scaleHeight * 0.65, scaleWidth / 4, scaleHeight * 0.35);

          // laser tip muzzle
          ctx.fillStyle = '#FF1E27';
          ctx.fillRect(-scaleWidth / 1.5 - 2, -scaleHeight * 0.52, 2, 4);
        }
        else if (obs.type === 'enemy_laser') {
          // Energy charges fired by Vilgax guards
          ctx.fillStyle = '#FF00FF';
          ctx.shadowColor = '#FF00FF';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.ellipse(0, -scaleHeight / 2 - 5, scaleWidth / 1.8, scaleHeight / 1.8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(0, -scaleHeight / 2 - 5, scaleWidth / 4, scaleHeight / 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        ctx.shadowBlur = 0; // reset
      }

      // DRAW ACTIVE PLAYER PROJECTILES ON 3D SCREEN
      for (const pProj of playerProjectilesRef.current) {
        const rx = -trackWidth + (pProj.lane + 0.5) * laneWidth * 2;
        const proj = projectPoint(rx, playerRef.current.y + 12, pProj.z);

        const scaleWidth = pProj.width * proj.scale;
        const scaleHeight = pProj.height * proj.scale;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        ctx.shadowColor = pProj.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = pProj.color;

        if (pProj.type === 'fireball') {
          ctx.beginPath();
          ctx.arc(0, 0, scaleWidth / 1.4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FF5D00';
          ctx.beginPath();
          ctx.moveTo(-scaleWidth / 2, 0);
          ctx.lineTo(-scaleWidth * 1.2, -scaleHeight / 4);
          ctx.lineTo(-scaleWidth * 1.2, scaleHeight / 4);
          ctx.closePath();
          ctx.fill();
        }
        else if (pProj.type === 'crystal') {
          ctx.fillStyle = '#F0FFFF';
          ctx.strokeStyle = pProj.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-scaleWidth * 1.2, 0);
          ctx.lineTo(0, -scaleHeight / 3);
          ctx.lineTo(scaleWidth * 1.2, 0);
          ctx.lineTo(0, scaleHeight / 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        else if (pProj.type === 'lightning') {
          ctx.strokeStyle = pProj.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-scaleWidth, -scaleHeight / 2);
          ctx.lineTo(0, scaleHeight / 2);
          ctx.lineTo(scaleWidth, -scaleHeight / 2);
          ctx.stroke();
        }
        else if (pProj.type === 'slime') {
          ctx.beginPath();
          ctx.ellipse(0, 0, scaleWidth / 1.4, scaleHeight / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (pProj.type === 'acid') {
          ctx.beginPath();
          ctx.ellipse(0, 0, scaleWidth * 1.2, scaleHeight / 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        else {
          ctx.beginPath();
          ctx.arc(0, 0, scaleWidth / 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, scaleWidth / 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // DRAW PLAYER ALIEN RENDER AGENT
      const playerLaneX = -trackWidth + (playerRef.current.lane + 0.5) * laneWidth * 2;
      
      // Interpolate smooth horizontal transition curves
      const playerProj = projectPoint(playerLaneX, playerRef.current.y, COLLISION_PLANE_Z);

      ctx.save();
      ctx.translate(playerProj.x, playerProj.y);

      // Character dimension limits
      const pWidth = 32 * playerProj.scale;
      const pHeight = (playerRef.current.isSliding ? 18 : 45) * playerProj.scale;

      // Draw custom visual speed/spark trails matching chosen alien colors!
      drawPlayerTrails(ctx, pWidth, pHeight);

      // Render actual stylized active alien avatar body on canvas 2D
      drawActiveAlienBody(ctx, selectedAlien, pWidth, pHeight);

      // Render glowing active shield bubble around player
      if (playerRef.current.shieldActive) {
        ctx.strokeStyle = selectedAlien.id === 'diamondhead' ? '#00FFA3' : '#FFD700';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 2.5 * playerProj.scale;
        
        ctx.beginPath();
        // Shift shield circle center higher
        ctx.arc(0, -pHeight / 2, pWidth * 1.1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = selectedAlien.id === 'diamondhead' ? 'rgba(0, 255, 163, 0.08)' : 'rgba(255, 215, 0, 0.05)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Magnet pull-radius glowing visual aura ring when active
      if (playerRef.current.magnetActive) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, pWidth * 1.8, pWidth * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // clear
      }

      ctx.restore();

      // Render flying core particles
      updateAndDrawParticles(ctx);

      // Render dynamic popup floating warning text labels
      updateAndDrawTextPopups(ctx);

      // Draw active fullscreen green transformation strobe flash
      if (transformFlashRef.current > 0.1) {
        ctx.fillStyle = `rgba(50, 255, 50, ${transformFlashRef.current / 12 * 0.45})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore(); // end shake matrix layout

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, selectedAlien]);

  // Particle manager logic
  const createParticles = (lane: number, y: number, color: string, count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.35;
    const trackWidth = 240;
    const laneWidth = trackWidth / 3;
    const playerLaneX = -trackWidth + (lane + 0.5) * laneWidth * 2;
    const pProj = {
      x: centerX + playerLaneX * (360 / 35),
      y: centerY + (canvas.height * 0.38 - y) * (360 / 35)
    };

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: pProj.x,
        y: pProj.y - 20,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1.0
      });
    }
  };

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
    const nextArr = [];
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // mild gravity fall
      p.alpha -= 0.025;

      if (p.alpha > 0) {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        nextArr.push(p);
      }
    }
    particlesRef.current = nextArr;
  };

  // Flying floating warning popup labels manager
  const createTextPopup = (text: string, lane: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.35;
    const trackWidth = 240;
    const laneWidth = trackWidth / 3;
    const playerLaneX = -trackWidth + (lane + 0.5) * laneWidth * 2;
    const pProj = {
      x: centerX + playerLaneX * (360 / 35),
      y: centerY + (canvas.height * 0.38 - y) * (360 / 35)
    };

    textPopupsRef.current.push({
      text,
      x: pProj.x,
      y: pProj.y - 40,
      color,
      timer: 30 // frames lifetime
    });
  };

  const updateAndDrawTextPopups = (ctx: CanvasRenderingContext2D) => {
    const nextArr = [];
    for (const item of textPopupsRef.current) {
      item.y -= 1.2; // float up
      item.timer -= 1;

      if (item.timer > 0) {
        ctx.save();
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 8;
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();
        nextArr.push(item);
      }
    }
    textPopupsRef.current = nextArr;
  };

  // Helper drawing customized active trails (Fires, electrical streaks, shadows)
  const drawPlayerTrails = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const id = selectedAlien.id;
    ctx.save();

    if (id === 'heatblast') {
      // Fire sparks trailing back from heels
      ctx.fillStyle = 'rgba(255, 77, 0, 0.45)';
      ctx.beginPath();
      ctx.arc(-w/4, -3, Math.random() * 8 + 4, 0, Math.PI*2);
      ctx.arc(w/4, -3, Math.random() * 8 + 4, 0, Math.PI*2);
      ctx.fill();
    } else if (id === 'xlr8') {
      // Sleek cyan trail line streams
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-w/3, -h/2);
      ctx.lineTo(-w*1.5, -h/3);
      ctx.moveTo(w/3, -h/2);
      ctx.lineTo(w*1.5, -h/3);
      ctx.stroke();
    } else if (id === 'upgrade') {
      // Glowing matrices circuit block streams
      ctx.fillStyle = 'rgba(50, 205, 50, 0.5)';
      ctx.fillRect(-w/2, -h + Math.sin(Date.now()/50)*5, 4, 4);
      ctx.fillRect(w/2 - 4, -h + Math.cos(Date.now()/50)*5, 4, 4);
    } else if (id === 'fourarms') {
      // Ground friction dust puffs on step
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(-w/2, 0, 6, 0, Math.PI*2);
      ctx.arc(w/2, 0, 6, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Drawing actual active alien geometry blocks on the screen
  const drawActiveAlienBody = (ctx: CanvasRenderingContext2D, alien: Alien, w: number, h: number) => {
    ctx.save();
    
    // Core glowing accent colors
    ctx.fillStyle = alien.color;
    ctx.strokeStyle = alien.accentColor;
    ctx.lineWidth = 2.5;

    // Head base position offset
    const headRadius = w / 3.8;

    switch (alien.id) {
      case 'heatblast':
        // Flame body base
        ctx.beginPath();
        ctx.moveTo(-w/2, 0);
        ctx.lineTo(-w/3, -h/1.4);
        ctx.lineTo(0, -h);
        ctx.lineTo(w/3, -h/1.4);
        ctx.lineTo(w/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // High heat glowing yellow mask segment
        ctx.fillStyle = '#FFF700';
        ctx.beginPath();
        ctx.arc(0, -h/1.3, headRadius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'xlr8':
        // Sleek blue velocity runner body
        ctx.beginPath();
        ctx.moveTo(-w/2, 0);
        ctx.lineTo(-w/4, -h);
        ctx.lineTo(w/4, -h);
        ctx.lineTo(w/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // High velocity visor line
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-w/3.5, -h/1.35);
        ctx.lineTo(w/3.5, -h/1.35);
        ctx.stroke();
        break;

      case 'diamondhead':
        // Crystalline jagged polygon blocks
        ctx.fillStyle = '#005E3C';
        ctx.beginPath();
        ctx.moveTo(-w/2, 0);
        ctx.lineTo(-w/3, -h/2);
        ctx.lineTo(0, -h);
        ctx.lineTo(w/3, -h/2);
        ctx.lineTo(w/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing crystal spikes
        ctx.fillStyle = '#00FFA3';
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(-w/4, -h * 1.25);
        ctx.lineTo(w/4, -h * 1.25);
        ctx.closePath();
        ctx.fill();
        break;

      case 'fourarms':
        // Extremely bulky red block torso
        ctx.fillStyle = '#C0392B';
        ctx.beginPath();
        ctx.roundRect(-w*0.8, -h, w*1.6, h, 8);
        ctx.fill();
        ctx.stroke();

        // Four active extra muscles arms outline
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(-w * 1.05, -h*0.8, w * 0.35, h * 0.5);
        ctx.fillRect(w * 0.7, -h*0.8, w * 0.35, h * 0.5);
        break;

      case 'upgrade':
        // Liquid sci-fi cyberware fluid shape
        ctx.fillStyle = '#0A0A0A';
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-w/2, -h, w, h, 14);
        ctx.fill();
        ctx.stroke();

        // Single scanning green visor core eye
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(0, -h/1.5, 5, 0, Math.PI*2);
        ctx.fill();
        break;

      default:
        // Generic customized alien runner geometry base
        ctx.beginPath();
        ctx.roundRect(-w/2, -h, w, h, 6);
        ctx.fill();
        ctx.stroke();

        // Head
        ctx.fillStyle = alien.accentColor;
        ctx.beginPath();
        ctx.arc(0, -h/1.25, headRadius, 0, Math.PI*2);
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none p-2 animate-fade-in">
      
      {/* Top HUD Panel */}
      <div className="w-full flex justify-between items-center p-4 bg-black/95 border border-[#00ff00]/25 rounded-2xl mb-4 gap-4 hologram-effect shadow-[0_0_20px_rgba(0,255,0,0.05)]">
        
        {/* Left Stats Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#00ff00]/30 flex items-center justify-center">
            {selectedAlien.id === 'heatblast' && <Flame className="w-6 h-6 text-red-500 animate-pulse" />}
            {selectedAlien.id === 'xlr8' && <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />}
            {selectedAlien.id === 'diamondhead' && <Shield className="w-6 h-6 text-[#00ff00] animate-pulse" />}
            {!['heatblast', 'xlr8', 'diamondhead'].includes(selectedAlien.id) && <Zap className="w-6 h-6 text-[#00ff00]" />}
          </div>
          <div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wider flex items-center gap-2">
              {selectedAlien.name}
              <span className="text-[10px] font-mono text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/30 px-1 py-0.5 rounded">
                ACTIVE
              </span>
            </h3>
            <p className="text-gray-400 font-mono text-xs">
              Score Multiplier: <span className="text-[#00ff00] font-bold">x{player.multiplier + (selectedAlien.id === 'xlr8' ? 2 : 0)}</span>
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="flex-1 max-w-xs px-4 hidden md:block">
          {/* Energy core recovery progression bar */}
          <div className="flex justify-between text-xs font-mono text-[#00ff00]/70 mb-1">
            <span>OMNITRIX POWER CORE</span>
            <span className="text-[#00ff00] font-bold">{player.energy}%</span>
          </div>
          <div className="h-2 bg-black rounded-full overflow-hidden p-0.5 border border-[#00ff00]/20">
            <div
              className="h-full bg-gradient-to-r from-[#00ff00] to-[#00ff00]/60 rounded-full transition-all duration-300 shadow-[0_0_8px_#00ff00]"
              style={{ width: `${player.energy}%` }}
            />
          </div>
        </div>

        {/* Right Score section */}
        <div className="text-right flex items-center gap-6">
          <div>
            <div className="text-[#00ff00]/60 font-mono text-[10px] uppercase">SCORE</div>
            <div className="text-2xl font-black font-mono text-[#00ff00] tracking-wider text-glow-green">
              {player.score.toLocaleString()}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[#00ff00]/60 font-mono text-[10px] uppercase flex items-center gap-1 justify-end">
              <Award className="w-3 h-3 text-yellow-500" /> HIGHSCORE
            </div>
            <div className="text-lg font-bold font-mono text-gray-300">
              {highScore.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="game-mute-btn"
              onClick={toggleMuted}
              className="p-2 bg-black border border-[#00ff00]/25 rounded-xl hover:bg-[#00ff00]/10 text-[#00ff00] transition-all"
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#00ff00]" />}
            </button>
            {gameState === 'playing' && (
              <button
                id="game-pause-btn"
                onClick={() => setGameState('paused')}
                className="p-2 bg-black border border-[#00ff00]/25 rounded-xl hover:bg-[#00ff00]/10 text-gray-400 hover:text-white transition-all"
              >
                <Pause className="w-4 h-4 text-[#00ff00]" />
              </button>
            )}
            {gameState === 'paused' && (
              <button
                id="game-play-btn"
                onClick={() => setGameState('playing')}
                className="p-2 bg-black border border-[#00ff00]/30 rounded-xl hover:bg-[#00ff00]/20 text-[#00ff00] transition-all"
              >
                <Play className="w-4 h-4 text-[#00ff00]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Runner Stage Viewport Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-black rounded-3xl overflow-hidden border border-[#00ff00]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        
        <canvas
          ref={canvasRef}
          width={1024}
          height={576}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Floating Combat Strike button overlay for touch/mouse */}
        {gameState === 'playing' && (
          <div className="absolute bottom-6 right-6 flex flex-col items-center gap-1 z-10 select-none animate-fade-in pointer-events-auto">
            <button
              id="combat-strike-btn"
              onClick={triggerCombatAbility}
              className="w-16 h-16 rounded-full bg-black border-2 border-[#00ff00] hover:bg-[#00ff00]/25 flex flex-col items-center justify-center text-glow-green shadow-[0_0_22px_rgba(0,255,0,0.35)] active:scale-95 transition-all text-[#00ff00] font-black cursor-pointer uppercase font-mono tracking-tighter"
              style={{ minWidth: '64px', minHeight: '64px' }}
            >
              <span className="text-[9px] leading-3 text-[#00ff00]/60">PRESS [F]</span>
              <span className="text-[12px] font-black">STRIKE</span>
            </button>
          </div>
        )}

        {/* Dynamic Countdown Screen Layer */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center animate-fade-in select-none tracking-widest font-mono border border-[#00ff00]/30">
            <div className="text-[#00ff00] text-[11px] uppercase mb-4 text-glow-green animate-pulse">
              OMNITRIX MATRIX CALIBRATION COMPLETE // V4
            </div>
            <h1 className="text-8xl font-black text-[#00ff00] text-glow-green animate-bounce">
              {countdown}
            </h1>
            <p className="text-gray-500 text-[10px] mt-6 text-center">
              PREPARING {selectedAlien.name.toUpperCase()} DATA SEED FOR INGESTION...
            </p>
          </div>
        )}

        {/* Paused Screen Layer */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center border border-[#00ff00]/30">
            <div className="w-16 h-16 rounded-full bg-black border-2 border-[#00ff00] flex items-center justify-center text-[#00ff00] mb-4 omnitrix-glow">
              <Pause className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-widest uppercase font-sans text-glow-green">STANDBY MODE</h2>
            <p className="text-gray-400 text-xs mb-6 max-w-sm text-center font-mono">
              Omnitrix sequence temporarily suspended. All bio-metrics locked.
            </p>
            <div className="flex gap-4">
              <button
                id="resume-btn"
                onClick={() => setGameState('playing')}
                className="bg-[#00ff00] hover:brightness-110 text-black py-2.5 px-6 font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer omnitrix-glow"
              >
                RESUME RUN
              </button>
              <button
                id="quit-btn"
                onClick={onExit}
                className="bg-black border border-[#00ff00]/30 hover:bg-[#00ff00]/10 text-[#00ff00] py-2.5 px-6 font-bold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer"
              >
                QUIT TO BASE
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen Layer */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center px-4 border border-[#00ff00]/30">
            
            <div className="text-red-500 font-mono text-[11px] font-bold uppercase tracking-[0.25em] mb-3 animate-pulse">
              ● OMNITRIX POWER FAULT - CRITICAL DISCONNECT
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#00ff00] mb-6 uppercase tracking-tight text-center text-glow-green">
              Bio-link Fragmented!
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md w-full bg-black p-5 rounded-2xl border border-[#00ff00]/25 mb-8 font-mono">
              <div className="text-center p-2">
                <div className="text-gray-400 text-[10px] uppercase mb-1">SCORE</div>
                <div className="text-xl font-bold text-[#00ff00] text-glow-green">{player.score.toLocaleString()}</div>
              </div>
              <div className="text-center p-2 border-l border-[#00ff00]/15">
                <div className="text-gray-400 text-[10px] uppercase mb-1">DISTANCE</div>
                <div className="text-xl font-bold text-white">{player.distance}m</div>
              </div>
              <div className="text-center p-2 col-span-2 md:col-span-1 border-t md:border-t-0 border-[#00ff00]/15 md:border-l">
                <div className="text-gray-400 text-[10px] uppercase mb-1">ENERGY CORES</div>
                <div className="text-xl font-bold text-[#00ff00]">{player.energy}%</div>
              </div>
            </div>

            {player.score >= highScore && player.score > 0 && (
              <div className="mb-6 bg-yellow-950/40 border border-yellow-700/50 px-4 py-2 rounded-xl text-yellow-400 font-mono text-xs flex items-center gap-2 animate-bounce">
                ★ NEW PLATFORM RECORD UNLOCKED ★
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
              <button
                id="retry-btn"
                onClick={() => {
                  setPlayer({
                    lane: 1,
                    targetLane: 1,
                    y: 0,
                    vy: 0,
                    isJumping: false,
                    isSliding: false,
                    slideTimer: 0,
                    score: 0,
                    energy: 50,
                    distance: 0,
                    shieldActive: selectedAlien.id === 'diamondhead',
                    shieldTimer: selectedAlien.id === 'diamondhead' ? 999999 : 0,
                    magnetActive: false,
                    magnetTimer: 0,
                    multiplier: 1
                  });
                  setObstacles([]);
                  setCountdown(3);
                  setGameState('countdown');
                }}
                className="flex-1 bg-[#00ff00] hover:brightness-110 text-black py-3 px-4 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer omnitrix-glow"
              >
                <RotateCcw className="w-4 h-4 text-black" /> REBOOT & RETRY
              </button>
              <button
                id="change-alien-btn"
                onClick={onExit}
                className="flex-1 bg-black hover:bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] py-3 px-4 font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" /> SWAP ALIEN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ground Keyboard Controls Info Board */}
      <div className="w-full mt-2 p-3.5 bg-black/95 border border-[#00ff00]/20 rounded-xl flex flex-wrap justify-between items-center text-[11px] text-[#00ff00]/70 gap-3 font-mono hologram-effect">
        <div className="flex items-center gap-3">
          <span className="text-[#00ff00] font-bold uppercase select-none text-glow-green">Controls:</span>
          <span><kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">◀</kbd> <kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">▶</kbd> Lanes</span>
          <span><kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">▲</kbd> Jump</span>
          <span><kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">▼</kbd> Slide</span>
          <span><kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">F</kbd> / <kbd className="bg-black border border-[#00ff00]/25 text-[#00ff00] px-1.5 py-0.5 rounded">Enter</kbd> Strike</span>
        </div>
        <div className="text-[#00ff00]/50 text-[10px]">
          Mobile: Tap the glowing 'STRIKE' button to activate battle strikes!
        </div>
      </div>
    </div>
  );
};
