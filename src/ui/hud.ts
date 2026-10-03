import { HOTBAR_ITEMS, STORY_CHAPTERS } from '../data/storyData';
import type { HostelLoreItem } from '../data/storyData';
import { sound } from '../audio/soundSystem';
import confetti from 'canvas-confetti';

export class HudManager {
  private container: HTMLElement;
  private onSelectHotbarItem?: (item: HostelLoreItem) => void;
  private onToggleCameraMode?: (mode: 'story' | 'free') => void;
  private onToggleNightMode?: (isNight: boolean) => void;
  private onToggleFan?: () => void;
  private onToggleTubeLight?: () => void;

  private currentChapterId: string = '';
  private unlockedItemsCount: number = 1;
  private isNight: boolean = false;
  private cameraMode: 'story' | 'free' = 'story';
  private fanSpeed: number = 2;
  private hasCelebratedEnd: boolean = false;

  // DOM Elements
  private xpFillEl!: HTMLElement;
  private xpLevelEl!: HTMLElement;
  private hotbarSlots: HTMLElement[] = [];
  private modalEl!: HTMLElement;
  private manifestoModalEl!: HTMLElement;
  private toastContainerEl!: HTMLElement;

  constructor(
    container: HTMLElement,
    callbacks: {
      onSelectHotbarItem?: (item: HostelLoreItem) => void;
      onToggleCameraMode?: (mode: 'story' | 'free') => void;
      onToggleNightMode?: (isNight: boolean) => void;
      onToggleFan?: () => void;
      onToggleTubeLight?: () => void;
    }
  ) {
    this.container = container;
    this.onSelectHotbarItem = callbacks.onSelectHotbarItem;
    this.onToggleCameraMode = callbacks.onToggleCameraMode;
    this.onToggleNightMode = callbacks.onToggleNightMode;
    this.onToggleFan = callbacks.onToggleFan;
    this.onToggleTubeLight = callbacks.onToggleTubeLight;

    this.render();
    this.initEvents();
  }

  private render() {
    this.container.innerHTML = `
      <!-- TOP HUD: BOSS BAR & QUICK CONTROLS -->
      <header class="hud-top-bar">
        <div class="boss-bar-container">
          <div class="boss-bar-title">
            <span class="pixel-badge">HOSTEL QUEST</span>
            <span id="boss-chapter-name">YEAR 1: DAY 1 - BARE ROOM 204</span>
          </div>
          <div class="boss-bar-track">
            <div id="boss-bar-fill" class="boss-bar-fill" style="width: 5%;"></div>
          </div>
        </div>

        <div class="quick-controls">
          <button id="btn-camera" class="mc-btn" title="Toggle 3D Orbit Mode">
            🎥 <span class="btn-label">Story Scroll</span>
          </button>
          <button id="btn-night" class="mc-btn" title="Toggle 2 AM Night Cramming">
            ☀️ <span class="btn-label">Day</span>
          </button>
          <button id="btn-fan" class="mc-btn" title="Cycle Fan Speed">
            🌀 <span class="btn-label">Fan: 2</span>
          </button>
          <button id="btn-tubelight" class="mc-btn" title="Tube Light Switch">
            💡 <span class="btn-label">Light</span>
          </button>
          <button id="btn-sound" class="mc-btn" title="Toggle 8-bit Audio">
            🔊 <span class="btn-label">Sound</span>
          </button>
          <button id="btn-warden" class="mc-btn mc-btn-danger" title="Simulate Warden Inspection">
            🚨 <span class="btn-label">Warden Raid!</span>
          </button>
          <button id="btn-manifesto" class="mc-btn mc-btn-gold" title="Open Hostel Life Manifesto">
            📜 <span class="btn-label">Manifesto</span>
          </button>
        </div>
      </header>

      <!-- ACTIVE STORY CHAPTER POPUP CARD (Scroll Driven) -->
      <aside id="story-card" class="story-chapter-card">
        <div class="chapter-meta">
          <span id="chapter-year" class="chapter-year-tag">YEAR 1 • SEM 1</span>
          <span class="chapter-live-indicator">LIVE PROGRESSION</span>
        </div>
        <h2 id="chapter-title" class="chapter-title">The Bare Shell</h2>
        <p id="chapter-subtitle" class="chapter-subtitle">Mummy packed 5kg laddoos. The room is echoing empty.</p>
        <blockquote id="chapter-quote" class="chapter-quote">"Bhai, AC switch kaha hai?"</blockquote>
      </aside>

      <!-- RIGHT TIMELINE & SCROLL STEPPER -->
      <aside class="hud-right-nav">
        <nav class="year-timeline" id="year-timeline">
          <div class="timeline-title">YEARS</div>
          <button class="timeline-node active" data-progress="0.05" title="Year 1: Bare Room (0%)">
            <span class="node-badge">R204</span>
            <span class="node-label">Bare</span>
          </button>
          <button class="timeline-node" data-progress="0.22" title="Year 1: Cots & Gaddas (22%)">
            <span class="node-badge">R204</span>
            <span class="node-label">Cots</span>
          </button>
          <button class="timeline-node" data-progress="0.42" title="Year 2: Contraband Haven (42%)">
            <span class="node-badge">R204</span>
            <span class="node-label">Haven</span>
          </button>
          <button class="timeline-node" data-progress="0.60" title="8:00 PM: Central Mess Hall (60%)">
            <span class="node-badge">MESS</span>
            <span class="node-label">Hall</span>
          </button>
          <button class="timeline-node" data-progress="0.78" title="Dinner: Steel Thalis & Watery Dal (78%)">
            <span class="node-badge">MESS</span>
            <span class="node-label">Thali</span>
          </button>
          <button class="timeline-node" data-progress="0.96" title="Sunday Special: Shahi Paneer War (96%)">
            <span class="node-badge">MESS</span>
            <span class="node-label">Paneer</span>
          </button>
        </nav>

        <div class="scroll-steppers">
          <button id="btn-scroll-up" class="mc-btn stepper-btn" title="Scroll Up (Arrow Up)">▲ UP</button>
          <button id="btn-scroll-down" class="mc-btn mc-btn-primary stepper-btn" title="Scroll Down (Arrow Down)">▼ DOWN</button>
        </div>
      </aside>

      <!-- SCROLL HINT (Clickable or scrollable) -->
      <div id="scroll-hint" class="scroll-indicator" title="Click here or scroll down to build Room 204">
        <div class="scroll-mouse-icon"></div>
        <span class="pixel-text">SCROLL OR CLICK TO BUILD</span>
        <span class="scroll-subtext">↓ Click here or use Mouse Wheel / Arrow Keys ↓</span>
      </div>

      <!-- BOTTOM HUD: MINECRAFT HOTBAR & XP BAR -->
      <footer class="hud-bottom-bar">
        <!-- XP Progress Bar -->
        <div class="xp-container">
          <span id="xp-level" class="xp-level-number">1</span>
          <div class="xp-bar-track">
            <div id="xp-fill" class="xp-bar-fill" style="width: 5%;"></div>
          </div>
        </div>

        <!-- 9-Slot Minecraft Inventory Hotbar -->
        <div class="mc-hotbar">
          ${HOTBAR_ITEMS.map((item, index) => `
            <div class="hotbar-slot ${index === 0 ? 'unlocked active' : 'locked'}" data-index="${index}" title="${item.name}">
              <span class="slot-key">${index + 1}</span>
              <span class="slot-emoji">${item.emoji}</span>
              <span class="slot-lock">🔒</span>
            </div>
          `).join('')}
        </div>
        <div class="hotbar-hint">Press 1-9 or click item to inspect hostel lore</div>
      </footer>

      <!-- WARDEN RAID FULL-SCREEN ALARM OVERLAY -->
      <div id="warden-overlay" class="warden-alert-screen hidden">
        <div class="warden-modal mc-panel">
          <div class="alarm-strobe">🚨 WARDEN RAID ALERT! 🚨</div>
          <h2 class="pixel-danger-title">DR. SHARMA IS ON THE FLOOR!</h2>
          <p class="warden-desc">
            "Whose room is this?! What is this kettle doing on the table?!
            Who gave permission for induction stove and 8-way multi-plug?!"
          </p>
          <div class="warden-actions">
            <button id="btn-hide-kettle" class="mc-btn mc-btn-gold">
              ⚡ Shove Kettle Under Bed!
            </button>
            <button id="btn-fake-study" class="mc-btn mc-btn-primary">
              📚 Pretend to Read B.S. Grewal!
            </button>
          </div>
        </div>
      </div>

      <!-- ITEM LORE INSPECTION MODAL -->
      <div id="item-modal" class="lore-modal-overlay hidden">
        <div class="lore-modal mc-panel">
          <button id="modal-close" class="modal-close-btn">✕</button>
          <div class="modal-header">
            <div class="modal-emoji-badge" id="modal-emoji">🫖</div>
            <div>
              <div class="modal-category" id="modal-category">CONTRABAND • LEGENDARY</div>
              <h3 class="modal-title" id="modal-title">Contraband Electric Kettle</h3>
              <div class="modal-hindi" id="modal-hindi">चोरी की केतली</div>
            </div>
          </div>
          <div class="modal-body">
            <p id="modal-desc" class="modal-desc">
              Classified Level 5 Contraband by Chief Warden.
            </p>
            <blockquote id="modal-quote" class="modal-quote">
              "Bhai warden aa raha hai, kettle ko jaldi bed ke neeche phenk!"
            </blockquote>
            <div class="modal-stats" id="modal-stats"></div>
          </div>
          <div class="modal-footer">
            <button id="modal-action-btn" class="mc-btn mc-btn-gold">
              ⚡ Action Prompt
            </button>
            <span id="modal-feedback" class="action-feedback"></span>
          </div>
        </div>
      </div>

      <!-- HOSTEL LIFE MANIFESTO & MEMORY HALL MODAL -->
      <div id="manifesto-modal" class="lore-modal-overlay hidden">
        <div class="manifesto-modal mc-panel">
          <button id="manifesto-close" class="modal-close-btn">✕</button>
          <div class="manifesto-header">
            <span class="pixel-badge">OFFICIAL ARCHIVE</span>
            <h2 class="pixel-gold-title">THE HOSTEL LIFE MANIFESTO</h2>
            <p class="manifesto-subtitle">Room 204 • The Unwritten Laws of Indian Engineering Hostels</p>
          </div>

          <div class="manifesto-tabs">
            <div class="manifesto-scroll-body">
              <section class="manifesto-section">
                <h3 class="section-title">📜 The 10 Unwritten Commandments</h3>
                <ol class="commandments-list">
                  <li><strong>The Maggi Sovereignty:</strong> Thou shalt never touch another brother's Maggi without written or telepathic consent.</li>
                  <li><strong>The Kettle Hierarchy:</strong> Whosoever owns the functioning heating kettle is the undisputed Prime Minister of the wing.</li>
                  <li><strong>The Attendance Theorem:</strong> 75% attendance is a mythological construct. 65% + a dubious medical certificate is destiny.</li>
                  <li><strong>The Temporal Anomaly:</strong> "5 minutes bro" is a quantum unit that denotes anything from 20 minutes to 3 business days.</li>
                  <li><strong>The Sunday Mess Truce:</strong> Paneer appears only on Sunday nights or during NAAC inspection audits. Guard your bowl.</li>
                  <li><strong>The Chair Principle:</strong> The Neelkamal plastic chair is not seating; it is a sedimentary geological strata of clothes.</li>
                  <li><strong>The 11:59 PM Rule:</strong> All 40-page lab assignments are transcribed between 11:15 PM and 11:58 PM.</li>
                  <li><strong>The Warden Evasion:</strong> When the warden knocks, the room must transition from a music festival to a Buddhist monastery in 0.4 seconds.</li>
                  <li><strong>The Cold Shower Grit:</strong> Geysers that fail in December forge character that no corporate job can ever break.</li>
                  <li><strong>The Inevitable Goodbye:</strong> The 10x10 room you cursed for four years will be the hardest place in the world to leave.</li>
                </ol>
              </section>

              <section class="manifesto-section">
                <h3 class="section-title">⚖️ The Hostel Black Market Exchange Rates</h3>
                <div class="currency-grid">
                  <div class="currency-card">
                    <span class="curr-icon">🍜</span>
                    <div class="curr-title">1 Maggi Packet</div>
                    <div class="curr-eq">= 1 Complete Lab Record Copy</div>
                  </div>
                  <div class="currency-card">
                    <span class="curr-icon">☕</span>
                    <div class="curr-title">1 Cutting Chai</div>
                    <div class="curr-eq">= 1 Morning 8 AM Proxy Attendance</div>
                  </div>
                  <div class="currency-card">
                    <span class="curr-icon">📶</span>
                    <div class="curr-title">Mobile Hotspot</div>
                    <div class="curr-eq">= Eternal Brotherhood & Loyalty</div>
                  </div>
                  <div class="currency-card">
                    <span class="curr-icon">🔌</span>
                    <div class="curr-title">Free Socket</div>
                    <div class="curr-eq">= Midnight Snacks Sharing Rights</div>
                  </div>
                </div>
              </section>

              <section class="manifesto-section">
                <h3 class="section-title">🕹️ 8-Bit Hostel Soundboard</h3>
                <div class="soundboard-grid">
                  <button id="sb-block" class="mc-btn">🧱 Block Place</button>
                  <button id="sb-maggi" class="mc-btn">🍜 Maggi Sizzle</button>
                  <button id="sb-light" class="mc-btn">💡 Tube Light Buzz</button>
                  <button id="sb-warden" class="mc-btn mc-btn-danger">🚨 Warden Whistle</button>
                  <button id="sb-xp" class="mc-btn mc-btn-gold">✨ XP Level Up</button>
                </div>
              </section>
            </div>
          </div>

          <div class="manifesto-footer">
            <button id="manifesto-orbit-btn" class="mc-btn mc-btn-primary">
              🕹️ Explore Room in Free 3D Orbit!
            </button>
          </div>
        </div>
      </div>

      <!-- TOAST NOTIFICATIONS (Minecraft Achievement style) -->
      <div id="toast-container" class="toast-container"></div>
    `;

    // Cache elements
    this.xpFillEl = document.getElementById('xp-fill')!;
    this.xpLevelEl = document.getElementById('xp-level')!;
    this.modalEl = document.getElementById('item-modal')!;
    this.manifestoModalEl = document.getElementById('manifesto-modal')!;
    this.toastContainerEl = document.getElementById('toast-container')!;
    this.hotbarSlots = Array.from(document.querySelectorAll('.hotbar-slot'));
  }

  private initEvents() {
    // 1. Hotbar slot clicks
    this.hotbarSlots.forEach((slot) => {
      slot.addEventListener('click', () => {
        const index = parseInt(slot.dataset.index || '0');
        if (slot.classList.contains('locked')) {
          sound.playClick();
          this.showToast('Item Locked!', 'Scroll down to Year ' + (Math.floor(index / 2) + 1) + ' to unlock.');
          return;
        }
        this.selectHotbarSlot(index);
      });
    });

    // Keyboard keys 1 to 9
    window.addEventListener('keydown', (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const index = num - 1;
        if (index < HOTBAR_ITEMS.length && !this.hotbarSlots[index].classList.contains('locked')) {
          this.selectHotbarSlot(index);
        }
      }
    });

    // 2. Camera Toggle
    const btnCamera = document.getElementById('btn-camera')!;
    btnCamera.addEventListener('click', () => {
      sound.playClick();
      this.toggleCamera();
    });

    // 3. Day / Night Toggle
    const btnNight = document.getElementById('btn-night')!;
    btnNight.addEventListener('click', () => {
      sound.playClick();
      this.isNight = !this.isNight;
      btnNight.innerHTML = this.isNight
        ? '🌙 <span class="btn-label">2:00 AM</span>'
        : '☀️ <span class="btn-label">Day</span>';
      this.onToggleNightMode?.(this.isNight);
      this.showToast(
        this.isNight ? '2:00 AM Night Session' : 'Campus Morning Sun',
        this.isNight ? 'Fairy lights and laptop screen illuminate Room 204.' : 'Bright sunlight through hostel window.'
      );
    });

    // 4. Fan Toggle
    const btnFan = document.getElementById('btn-fan')!;
    btnFan.addEventListener('click', () => {
      this.fanSpeed = (this.fanSpeed + 1) % 5;
      btnFan.innerHTML = `🌀 <span class="btn-label">Fan: ${this.fanSpeed}</span>`;
      this.onToggleFan?.();
    });

    // 5. Tube Light Toggle
    const btnTube = document.getElementById('btn-tubelight')!;
    btnTube.addEventListener('click', () => {
      this.onToggleTubeLight?.();
    });

    // 6. Sound Mute Toggle
    const btnSound = document.getElementById('btn-sound')!;
    btnSound.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      btnSound.innerHTML = isMuted
        ? '🔇 <span class="btn-label">Muted</span>'
        : '🔊 <span class="btn-label">Sound</span>';
      if (!isMuted) sound.playClick();
    });

    // 7. Warden Raid Panic Button
    const btnWarden = document.getElementById('btn-warden')!;
    btnWarden.addEventListener('click', () => {
      this.triggerWardenRaid();
    });

    // Warden modal dismissals
    document.getElementById('btn-hide-kettle')?.addEventListener('click', () => {
      sound.playBlockPop();
      document.getElementById('warden-overlay')!.classList.add('hidden');
      this.showToast('Crisis Averted!', 'Kettle hidden under mattress. Warden Dr. Sharma left without a clue.');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    });

    document.getElementById('btn-fake-study')?.addEventListener('click', () => {
      sound.playClick();
      document.getElementById('warden-overlay')!.classList.add('hidden');
      this.showToast('Warden Impressed!', '"Very good boys, studying Fourier series at 2 AM. Keep it up."');
    });

    // 8. Manifesto Modal
    const btnManifesto = document.getElementById('btn-manifesto')!;
    btnManifesto.addEventListener('click', () => {
      sound.playClick();
      this.manifestoModalEl.classList.remove('hidden');
    });

    document.getElementById('manifesto-close')?.addEventListener('click', () => {
      sound.playClick();
      this.manifestoModalEl.classList.add('hidden');
    });

    document.getElementById('manifesto-orbit-btn')?.addEventListener('click', () => {
      this.manifestoModalEl.classList.add('hidden');
      this.setCameraMode('free');
    });

    // 9. Soundboard Buttons inside Manifesto
    document.getElementById('sb-block')?.addEventListener('click', () => sound.playBlockPlace());
    document.getElementById('sb-maggi')?.addEventListener('click', () => sound.playMaggiSizzle());
    document.getElementById('sb-light')?.addEventListener('click', () => sound.playTubeLightFlicker());
    document.getElementById('sb-warden')?.addEventListener('click', () => sound.playWardenAlarm());
    document.getElementById('sb-xp')?.addEventListener('click', () => sound.playLevelUp());

    // Scroll Steppers & Timeline Quick Jumps
    document.getElementById('btn-scroll-down')?.addEventListener('click', () => {
      sound.playClick();
      window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    });

    document.getElementById('btn-scroll-up')?.addEventListener('click', () => {
      sound.playClick();
      window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
    });

    document.getElementById('scroll-hint')?.addEventListener('click', () => {
      sound.playClick();
      window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    });

    document.querySelectorAll('.timeline-node').forEach((node) => {
      node.addEventListener('click', () => {
        sound.playClick();
        const targetProgress = parseFloat((node as HTMLElement).dataset.progress || '0');
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: targetProgress * maxScroll, behavior: 'smooth' });
      });
    });

    // Modal Close
    document.getElementById('modal-close')?.addEventListener('click', () => {
      this.modalEl.classList.add('hidden');
      sound.playClick();
    });
  }

  private toggleCamera() {
    this.setCameraMode(this.cameraMode === 'story' ? 'free' : 'story');
  }

  public setCameraMode(mode: 'story' | 'free') {
    this.cameraMode = mode;
    const btnCamera = document.getElementById('btn-camera');
    if (btnCamera) {
      btnCamera.innerHTML = this.cameraMode === 'story'
        ? '🎥 <span class="btn-label">Story Scroll</span>'
        : '🕹️ <span class="btn-label">Free 3D Orbit</span>';
    }
    this.onToggleCameraMode?.(this.cameraMode);
    this.showToast(
      this.cameraMode === 'story' ? 'Story Camera Active' : 'Free 3D Orbit Mode',
      this.cameraMode === 'story' ? 'Scrolling drives camera and builds the room.' : 'Click and drag to rotate, scroll to zoom!'
    );
  }

  public selectHotbarSlot(index: number) {
    this.hotbarSlots.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });

    const item = HOTBAR_ITEMS[index];
    if (!item) return;

    sound.playClick();
    this.openItemModal(item);
    this.onSelectHotbarItem?.(item);
  }

  public openItemModal(item: HostelLoreItem) {
    document.getElementById('modal-emoji')!.textContent = item.emoji;
    document.getElementById('modal-category')!.textContent = `${item.category.toUpperCase()} • ${item.rarity.toUpperCase()}`;
    document.getElementById('modal-title')!.textContent = item.name;
    document.getElementById('modal-hindi')!.textContent = item.hindiName;
    document.getElementById('modal-desc')!.textContent = item.description;
    document.getElementById('modal-quote')!.textContent = item.quote;

    const statsEl = document.getElementById('modal-stats')!;
    statsEl.innerHTML = item.stats.map(s => `
      <div class="stat-pill">
        <span class="stat-label">${s.label}:</span>
        <span class="stat-val">${s.value}</span>
      </div>
    `).join('');

    const actionBtn = document.getElementById('modal-action-btn')!;
    actionBtn.textContent = `⚡ ${item.actionPrompt}`;

    const feedbackEl = document.getElementById('modal-feedback')!;
    feedbackEl.textContent = '';

    actionBtn.onclick = () => {
      feedbackEl.textContent = item.interactedMessage;
      sound.playLevelUp();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    };

    this.modalEl.classList.remove('hidden');
  }

  public triggerWardenRaid() {
    sound.playWardenAlarm();
    const overlay = document.getElementById('warden-overlay')!;
    overlay.classList.remove('hidden');
  }

  public showToast(title: string, message: string) {
    const toast = document.createElement('div');
    toast.className = 'mc-toast';
    toast.innerHTML = `
      <div class="toast-icon">🏆</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    this.toastContainerEl.appendChild(toast);
    sound.playLevelUp();

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  /**
   * Updates HUD on scroll progress
   */
  public updateScrollProgress(progress: number) {
    const percent = Math.round(progress * 100);

    // 1. Boss bar & XP Level
    const bossFill = document.getElementById('boss-bar-fill');
    if (bossFill) bossFill.style.width = `${Math.max(4, percent)}%`;

    if (this.xpFillEl) this.xpFillEl.style.width = `${percent}%`;
    const level = Math.max(1, Math.min(100, Math.floor(progress * 80) + 1));
    if (this.xpLevelEl) this.xpLevelEl.textContent = level.toString();

    // 2. Hide scroll hint once user started scrolling
    const hint = document.getElementById('scroll-hint');
    if (hint && progress > 0.04) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    } else if (hint && progress <= 0.04) {
      hint.style.opacity = '1';
    }

    // 3. Current Story Chapter
    const chapter = STORY_CHAPTERS.find(
      c => progress >= c.scrollRange[0] && progress <= c.scrollRange[1]
    ) || STORY_CHAPTERS[STORY_CHAPTERS.length - 1];

    if (chapter && chapter.id !== this.currentChapterId) {
      this.currentChapterId = chapter.id;

      // Update Top Boss bar text
      const bossTitle = document.getElementById('boss-chapter-name');
      if (bossTitle) bossTitle.textContent = `${chapter.year}: ${chapter.title.toUpperCase()}`;

      // Update Card
      document.getElementById('chapter-year')!.textContent = chapter.year;
      document.getElementById('chapter-title')!.textContent = chapter.title;
      document.getElementById('chapter-subtitle')!.textContent = chapter.subtitle;
      document.getElementById('chapter-quote')!.textContent = chapter.quote;

      // Unlock hotbar item
      const itemToUnlock = Math.min(HOTBAR_ITEMS.length, chapter.unlockedItemIndex + 1);
      if (itemToUnlock > this.unlockedItemsCount) {
        this.unlockedItemsCount = itemToUnlock;
        this.unlockHotbarSlots(itemToUnlock);
        const unlockedItem = HOTBAR_ITEMS[chapter.unlockedItemIndex];
        if (unlockedItem) {
          this.showToast(`Achievement Unlocked!`, `Acquired: ${unlockedItem.emoji} ${unlockedItem.name}`);
        }
      }
    }

    // Update Timeline active state
    document.querySelectorAll('.timeline-node').forEach((node) => {
      const p = parseFloat((node as HTMLElement).dataset.progress || '0');
      node.classList.toggle('active', Math.abs(progress - p) < 0.12);
    });

    // 4. Milestone celebration on 100% completion
    if (progress >= 0.95 && !this.hasCelebratedEnd) {
      this.hasCelebratedEnd = true;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      this.showToast('Hostel Life Complete! 🎓', "You survived 4 years in Room 204. Tap 'Manifesto' in the top bar to view the unwritten laws & soundboard!");
    }
  }

  private unlockHotbarSlots(count: number) {
    this.hotbarSlots.forEach((slot, idx) => {
      if (idx < count) {
        slot.classList.remove('locked');
        slot.classList.add('unlocked');
      }
    });
  }
}
