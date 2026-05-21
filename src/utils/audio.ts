// Web Audio API custom synthesizer code for zero-latency instant loading SFX, fully compliant with browser security contexts
class SFXSyntheticEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public play(type: 'beep' | 'transform' | 'click' | 'jump' | 'slide' | 'coin' | 'crash' | 'powerup') {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const dest = this.ctx.destination;
      const now = this.ctx.currentTime;

      switch (type) {
        case 'click': {
          // Sharp short technical clock click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'beep': {
          // Digital high pitch count indicator
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now); // A5 note

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }

        case 'transform': {
          // Heavy neon alien morphing hum swoosh
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(60, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.45);

          osc2.type = 'square';
          osc2.frequency.setValueAtTime(120, now);
          osc2.frequency.exponentialRampToValueAtTime(520, now + 0.45);

          filter.type = 'lowpass';
          filter.Q.setValueAtTime(10, now);
          filter.frequency.setValueAtTime(200, now);
          filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.5);
          osc2.stop(now + 0.5);
          break;
        }

        case 'jump': {
          // Fast upward slide spring
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(450, now + 0.16);

          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case 'slide': {
          // Whoosh low-pass slide
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          // Noise emulation via square math
          const osc = this.ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.22);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);
          filter.frequency.exponentialRampToValueAtTime(100, now + 0.22);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'coin': {
          // Double sparkling crystal core bells
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5 note
          osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6 note

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1975.53, now + 0.08); // High harmonic

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(dest);

          osc.start(now);
          osc.stop(now + 0.25);
          osc2.start(now + 0.08);
          osc2.stop(now + 0.25);
          break;
        }

        case 'crash': {
          // White noise synth explosion
          const osc = this.ctx.createOscillator();
          const noiseGrid = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

          noiseGrid.type = 'sawtooth';
          noiseGrid.frequency.setValueAtTime(120, now);
          noiseGrid.frequency.setValueAtTime(300, now + 0.1);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(350, now);
          filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

          osc.connect(filter);
          noiseGrid.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(now);
          noiseGrid.start(now);
          osc.stop(now + 0.65);
          noiseGrid.stop(now + 0.65);
          break;
        }

        case 'powerup': {
          // Beautiful positive science scale chord progression
          const notes = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.08, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

            osc.connect(gain);
            gain.connect(dest);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.25);
          });
          break;
        }
      }
    } catch (e) {
      console.warn("Synthesis audio blocked or unavailable by browser standards", e);
    }
  }
}

export const sfx = new SFXSyntheticEngine();
