import { sound } from '../audio/soundSystem';

export class PortalTransitionOverlay {
  private overlayEl: HTMLElement;

  constructor() {
    this.overlayEl = document.createElement('div');
    this.overlayEl.id = 'portal-warp-overlay';
    this.overlayEl.className = 'portal-warp-overlay';
    this.overlayEl.innerHTML = `
      <div class="portal-vortex">
        <div class="vortex-rings"></div>
        <div class="portal-gate-frame">
          <div class="door-leaf door-left"></div>
          <div class="door-leaf door-right"></div>
        </div>
      </div>
      <div class="portal-loading-card">
        <div class="portal-badge" id="portal-target-badge">WORLD TELEPORT</div>
        <h2 class="portal-status-text" id="portal-status-title">Entering Freshers Block...</h2>
        <p class="portal-subtext" id="portal-subtext">Loading voxel chunks, room inventory & mess schedule...</p>
        
        <div class="mc-xp-bar-container">
          <div class="mc-xp-label">CHUNKS LOADED</div>
          <div class="mc-xp-track">
            <div class="mc-xp-fill" id="portal-xp-fill" style="width: 0%;"></div>
          </div>
          <div class="mc-xp-level-number" id="portal-xp-val">0%</div>
        </div>
      </div>
      <div class="portal-pixel-particles" id="portal-particles"></div>
    `;
    document.body.appendChild(this.overlayEl);
  }

  public warp(
    title: string,
    subtext: string,
    portalType: 'student' | 'parent' | 'admin',
    onComplete: () => void
  ) {
    const titleEl = document.getElementById('portal-status-title');
    const subtextEl = document.getElementById('portal-subtext');
    const badgeEl = document.getElementById('portal-target-badge');
    const fillEl = document.getElementById('portal-xp-fill');
    const valEl = document.getElementById('portal-xp-val');
    const particlesContainer = document.getElementById('portal-particles');

    if (titleEl) titleEl.textContent = title;
    if (subtextEl) subtextEl.textContent = subtext;
    if (badgeEl) {
      badgeEl.textContent = portalType === 'student' ? '🎓 NETHER PORTAL' : (portalType === 'parent' ? '👨‍👩‍👦 COTTAGE GATEWAY' : '🏢 COMMAND VAULT');
    }

    // Play portal / door sound
    if (portalType === 'student') {
      sound.playPortalWarp();
    } else if (portalType === 'parent') {
      sound.playDoor(true);
    } else {
      sound.playPortalWarp();
      sound.playAlarm();
    }

    // Spawn floating pixel particles
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      const colors = portalType === 'student' 
        ? ['#a855f7', '#7c3aed', '#c084fc', '#55ff55']
        : (portalType === 'parent' ? ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6'] : ['#ef4444', '#f97316', '#dc2626', '#facc15']);
      
      for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'pixel-dust';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * 0.4}s`;
        p.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
        particlesContainer.appendChild(p);
      }
    }

    this.overlayEl.classList.add('active', `type-${portalType}`);

    // Animate XP bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (fillEl) fillEl.style.width = '100%';
        if (valEl) valEl.textContent = '100%';
        sound.playXpGain();

        setTimeout(() => {
          this.overlayEl.classList.remove('active', 'type-student', 'type-parent', 'type-admin');
          onComplete();
        }, 320);
      } else {
        if (fillEl) fillEl.style.width = `${progress}%`;
        if (valEl) valEl.textContent = `${progress}%`;
      }
    }, 45);
  }
}
