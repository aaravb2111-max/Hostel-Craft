/**
 * Procedural Web Audio Sound Synthesizer
 * Provides authentic 8-bit / Minecraft-inspired audio effects
 * with zero external asset dependencies.
 */
class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private fanOscillator: OscillatorNode | null = null;
  private fanGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.fanGain) {
      this.fanGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Minecraft-style block placement sound (wooden/stone pop and thud)
   */
  public playBlockPlace(pitchModifier = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Low-frequency impact thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 * pitchModifier, t);
    osc.frequency.exponentialRampToValueAtTime(35 * pitchModifier, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);

    // High snap click (block locking into grid)
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(450 * pitchModifier, t);
    snapOsc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

    snapGain.gain.setValueAtTime(0.18, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.04);
  }

  /**
   * Quick block break / reverse scroll pop
   */
  public playBlockPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * UI Click / Hotbar selection
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  /**
   * Minecraft XP Orb pickup chime
   */
  public playXpGain() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * Level up / Milestone achievement chime (Minecraft XP orb style)
   */
  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  /**
   * Fluorescent tube light switch click with authentic buzzer flicker
   */
  public playTubeLightFlicker() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Switch mechanical clack
    const clack = this.ctx.createOscillator();
    const clackGain = this.ctx.createGain();
    clack.type = 'square';
    clack.frequency.setValueAtTime(120, t);
    clackGain.gain.setValueAtTime(0.3, t);
    clackGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    clack.connect(clackGain);
    clackGain.connect(this.ctx.destination);
    clack.start(t);
    clack.stop(t + 0.05);

    // Choke ballast buzz flickers
    const buzzTimes = [0.08, 0.14, 0.22];
    buzzTimes.forEach(delay => {
      const buzz = this.ctx!.createOscillator();
      const buzzGain = this.ctx!.createGain();
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(100, t + delay); // 50Hz harmonic
      buzzGain.gain.setValueAtTime(0.15, t + delay);
      buzzGain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.04);
      buzz.connect(buzzGain);
      buzzGain.connect(this.ctx!.destination);
      buzz.start(t + delay);
      buzz.stop(t + delay + 0.04);
    });
  }

  /**
   * Ceiling fan continuous hum
   */
  public setFanSpeed(speed: number) {
    if (this.isMuted || speed === 0) {
      if (this.fanGain) {
        this.fanGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
      }
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    if (!this.fanOscillator) {
      this.fanOscillator = this.ctx.createOscillator();
      this.fanGain = this.ctx.createGain();

      this.fanOscillator.type = 'sine';
      this.fanOscillator.frequency.setValueAtTime(45, t);
      this.fanGain.gain.setValueAtTime(0.08, t);

      this.fanOscillator.connect(this.fanGain);
      this.fanGain.connect(this.ctx.destination);
      this.fanOscillator.start();
    }

    const freq = 35 + speed * 15;
    const vol = Math.min(0.12, 0.04 + speed * 0.025);
    this.fanOscillator.frequency.setTargetAtTime(freq, t, 0.2);
    this.fanGain!.gain.setTargetAtTime(vol, t, 0.2);
  }

  /**
   * Maggi bubbling / Electric Kettle sizzle
   */
  public playMaggiSizzle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Synthesize bubbling noise using white noise buffer
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 1.2);
    filter.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 1.5);
  }

  /**
   * Warden Whistle / Raid Emergency Siren
   */
  public playWardenAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'triangle';
    whistle.frequency.setValueAtTime(2200, t);
    whistle.frequency.linearRampToValueAtTime(2800, t + 0.15);
    whistle.frequency.linearRampToValueAtTime(2100, t + 0.35);

    whistleGain.gain.setValueAtTime(0.35, t);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistle.start(t);
    whistle.stop(t + 0.45);
  }

  /**
   * Stainless Steel Mess Thali slamming onto table with a metallic clang
   */
  public playThaliClang() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Metallic chime ringing
    [980, 1420, 2100].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const dur = 0.3 + idx * 0.1;
      gain.gain.setValueAtTime(0.25 - idx * 0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + dur);
    });

    // Heavy table slam thud
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    thudGain.gain.setValueAtTime(0.4, t);
    thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(t);
    thud.stop(t + 0.15);
  }

  /**
   * 8:00 PM Mess Opening Bell / Gong
   */
  public playMessBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [520, 1040, 1560].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  /**
   * Water Cooler Dispenser sound
   */
  public playWaterPour() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(300, t + 0.3);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  /**
   * Minecraft Nether Portal / Warp Sound
   */
  public playPortalWarp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [110, 165, 220, 330].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + 0.8);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 1.4);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12 - i * 0.02, t + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 1.4);
    });
  }

  /**
   * Mechanical Stone / Wood Pressure Plate Click (Attendance Checkpoint)
   */
  public playPressurePlate() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);

    // Followed by XP chime
    setTimeout(() => {
      this.playXpGain();
    }, 80);
  }

  /**
   * Wooden / Iron Door Creak & Slam
   */
  public playDoor(isOpen = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const startFreq = isOpen ? 120 : 360;
    const endFreq = isOpen ? 340 : 100;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.linearRampToValueAtTime(endFreq, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * Chest Opening Squeak
   */
  public playChest() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(520, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  /**
   * Eating Food Crunch
   */
  public playEatingCrunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [0, 0.08, 0.16].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180 + Math.random() * 80, t + offset);
      osc.frequency.exponentialRampToValueAtTime(40, t + offset + 0.05);

      gain.gain.setValueAtTime(0.2, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + offset);
      osc.stop(t + offset + 0.05);
    });
  }

  /**
   * Curfew Redstone Alarm Siren
   */
  public playAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(900, t + 0.2);
    osc.frequency.linearRampToValueAtTime(600, t + 0.4);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }
}

export const sound = new SoundSystem();
