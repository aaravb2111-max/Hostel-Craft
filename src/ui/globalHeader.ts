import { store, type AppView } from '../data/stateStore';
import { sound } from '../audio/soundSystem';
import type { PortalTransitionOverlay } from './portalOverlay';

export class GlobalHeader {
  private container: HTMLElement;
  private portalOverlay: PortalTransitionOverlay;
  private clockInterval: number | null = null;

  constructor(container: HTMLElement, portalOverlay: PortalTransitionOverlay) {
    this.container = container;
    this.portalOverlay = portalOverlay;
  }

  public render() {
    const state = store.getState();
    const isMuted = sound.getIsMuted();

    this.container.innerHTML = `
      <header class="global-portal-bar">
        <!-- BRAND & TEAM BADGE -->
        <div class="portal-bar-left">
          <div class="brand-badge" id="btn-brand-home" title="Go to Hostel Craft Home">
            <span class="brand-icon">🧱</span>
            <div class="brand-text-group">
              <span class="brand-title">HOSTEL CRAFT</span>
              <span class="brand-team-badge">TEAM ASTEROID DESTROYER • MSRIT</span>
            </div>
          </div>
        </div>

        <!-- 4 INTERACTIVE VIEW PORTAL TABS -->
        <nav class="portal-bar-center">
          <button class="view-nav-tab tab-home ${state.currentView === 'landing' ? 'active' : ''}" data-view="landing">
            <span>🏠</span>
            <span>HOME</span>
          </button>
          <button class="view-nav-tab tab-student ${state.currentView === 'student' ? 'active' : ''}" data-view="student">
            <span>🎓</span>
            <span>STUDENT</span>
          </button>
          <button class="view-nav-tab tab-parent ${state.currentView === 'parent' ? 'active' : ''}" data-view="parent">
            <span>👨‍👩‍👦</span>
            <span>PARENT</span>
          </button>
          <button class="view-nav-tab tab-admin ${state.currentView === 'admin' ? 'active' : ''}" data-view="admin">
            <span>🏢</span>
            <span>ADMIN</span>
          </button>
        </nav>

        <!-- RIGHT CONTROLS: CLOCK, CURFEW, AUDIO, DAY/NIGHT, PITCH -->
        <div class="portal-bar-right">
          <!-- LIVE CLOCK -->
          <div class="live-clock-pill" id="live-clock">
            <span>⏱️</span>
            <span id="clock-time-val">08:42 AM IST</span>
          </div>

          <!-- CURFEW INDICATOR -->
          <div class="curfew-top-pill ${state.gateCurfewActive ? 'curfew-locked' : 'gates-open'}" id="curfew-badge">
            <span>${state.gateCurfewActive ? '🌙 10 PM CURFEW' : '☀️ GATES OPEN'}</span>
          </div>

          <!-- DAY / NIGHT TOGGLE -->
          <button id="btn-top-daynight" class="mc-btn" title="Toggle Day / Night Curfew Mode">
            <span>${state.dayNight === 'day' ? '☀️' : '🌙'}</span>
          </button>

          <!-- SOUND TOGGLE -->
          <button id="btn-top-sound" class="mc-btn" title="Toggle 8-bit Audio Synthesizer">
            <span>${isMuted ? '🔇' : '🔊'}</span>
          </button>

          <!-- HACKATHON PITCH MODAL TRIGGER -->
          <button id="btn-top-pitch" class="mc-btn mc-btn-gold" title="View Hackathon Elevator Pitch & Tech Specs">
            💡 <span class="btn-label">PITCH</span>
          </button>
        </div>
      </header>

      <!-- HACKATHON MODAL CONTAINER -->
      <div id="hackathon-pitch-modal-container"></div>
    `;

    this.bindEvents();
    this.startClock();
  }

  private startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const updateTime = () => {
      const clockEl = document.getElementById('clock-time-val');
      if (clockEl) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        clockEl.textContent = `${timeStr} IST`;
      }
    };
    updateTime();
    this.clockInterval = window.setInterval(updateTime, 1000);
  }

  private bindEvents() {
    // Brand Home Click
    const brandHome = document.getElementById('btn-brand-home');
    if (brandHome) {
      brandHome.addEventListener('click', () => {
        sound.playClick();
        store.setView('landing');
      });
    }

    // View Navigation Tabs
    const viewTabs = this.container.querySelectorAll('.view-nav-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sound.playClick();
        const view = (tab as HTMLElement).dataset.view as AppView;
        if (view && view !== store.getState().currentView) {
          if (view === 'student') {
            this.portalOverlay.warp('Entering Freshers Block...', 'Connecting to Room 204 & Attendance XP...', 'student', () => {
              store.setView('student');
            });
          } else if (view === 'parent') {
            this.portalOverlay.warp('Opening Parent Gateway...', 'Verifying Biometric Logs & Diet Records...', 'parent', () => {
              store.setView('parent');
            });
          } else if (view === 'admin') {
            this.portalOverlay.warp('Authenticating Command Block...', 'Accessing 1,200 Residents & Curfew Controls...', 'admin', () => {
              store.setView('admin');
            });
          } else {
            store.setView('landing');
          }
        }
      });
    });

    // Day / Night Toggle
    const dayNightBtn = document.getElementById('btn-top-daynight');
    if (dayNightBtn) {
      dayNightBtn.addEventListener('click', () => {
        sound.playClick();
        store.toggleDayNight();
        this.render();
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('btn-top-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        sound.toggleMute();
        this.render();
      });
    }

    // Pitch Modal
    const pitchBtn = document.getElementById('btn-top-pitch');
    if (pitchBtn) {
      pitchBtn.addEventListener('click', () => {
        sound.playChest();
        this.openPitchModal();
      });
    }
  }

  private openPitchModal() {
    const container = document.getElementById('hackathon-pitch-modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="mc-modal-backdrop">
        <div class="mc-dialog-box" style="max-width: 640px;">
          <div class="dialog-header">
            <span class="dialog-glyph">🚀</span>
            <h3>HACKATHON PRESENTATION BRIEF</h3>
            <button class="dialog-close-btn" id="btn-close-pitch">✕</button>
          </div>
          <div class="dialog-body" style="font-size: 13px; line-height: 1.6; color: #cbd5e1;">
            <div style="background: #11141d; padding: 14px; border-radius: 4px; border-left: 4px solid #f59e0b; margin-bottom: 14px;">
              <h4 style="color: #f59e0b; font-family: var(--mc-font-pixel); font-size: 11px; margin-bottom: 6px;">PROJECT: HOSTEL CRAFT</h4>
              <p><strong>Tagline:</strong> “Your Hostel. Your World.”</p>
              <p><strong>Team:</strong> Asteroid Destroyer</p>
              <p><strong>College:</strong> MS Ramaiah Institute of Technology (MSRIT), Bangalore</p>
              <p><strong>Hostel:</strong> Freshers Block (First-Year Boys Hostel)</p>
            </div>

            <h4 style="color: #38bdf8; font-family: var(--mc-font-pixel); font-size: 10px; margin-bottom: 6px;">💡 THE CORE INNOVATION</h4>
            <p style="margin-bottom: 12px;">
              Indian hostel management software has traditionally been clunky, bureaucratic, and despised by students. <strong>Hostel Craft</strong> reimagines Freshers Block as a living, gamified Minecraft-inspired digital realm that bridges students, parents, and wardens seamlessly.
            </p>

            <h4 style="color: #55ff55; font-family: var(--mc-font-pixel); font-size: 10px; margin-bottom: 6px;">🌟 KEY IMPLEMENTATION HIGHLIGHTS</h4>
            <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
              <li><strong>Attendance XP & Pressure Plate Checkpoint:</strong> Gamifies mandatory 75% attendance with animated glowing XP progress and pressure-plate biometric marking.</li>
              <li><strong>Authentic 7-Day Vegetarian Mess Menu:</strong> 4 daily meals (Breakfast, Lunch, Snacks, Dinner) with official circular notes, South & North Indian dishes, and today's meal auto-highlight.</li>
              <li><strong>All 24 Official 2026 Holidays:</strong> Full Karnataka circular with interactive popups and festive sweet tracking.</li>
              <li><strong>Transparent ₹1,07,000 Fee Economy:</strong> Broken down into Minecraft emerald stacks with verifiable official receipt generation.</li>
              <li><strong>Curfew Mechanics:</strong> 10:00 PM gate lock and 6:00 AM gate unlock synchronized with redstone levers and day/night sky.</li>
              <li><strong>Reassuring Parent Gateway:</strong> Real-time "Child Status" card, diet inspection, emergency wardens directory, and instant home outpass generator.</li>
              <li><strong>Warden Command Center:</strong> 1,200 student metrics, real-time circular broadcast, and interactive command terminal.</li>
            </ul>

            <div style="background: #1e293b; padding: 10px 14px; border-radius: 4px; font-size: 11px; color: #94a3b8;">
              🛠️ <strong>Built With:</strong> TypeScript, Three.js WebGL Engine, Web Audio API Procedural Synthesizers, Canvas Confetti, and LocalStorage Reactive State Sync.
            </div>
          </div>
          <div class="dialog-footer">
            <button class="mc-btn mc-btn-gold" id="btn-pitch-ok">RETURN TO WORLD</button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-pitch');
    const okBtn = document.getElementById('btn-pitch-ok');
    const close = () => {
      sound.playClick();
      container.innerHTML = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (okBtn) okBtn.addEventListener('click', close);
  }
}
