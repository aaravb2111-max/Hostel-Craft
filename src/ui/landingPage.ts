import { store } from '../data/stateStore';
import { sound } from '../audio/soundSystem';
import type { PortalTransitionOverlay } from './portalOverlay';

export class LandingPage {
  private container: HTMLElement;
  private portalOverlay: PortalTransitionOverlay;

  constructor(container: HTMLElement, portalOverlay: PortalTransitionOverlay) {
    this.container = container;
    this.portalOverlay = portalOverlay;
  }

  public render() {
    this.container.innerHTML = `
      <section class="landing-hero-section">
        <!-- BACKGROUND VOXEL SKY WITH STARS & MOON -->
        <div class="voxel-sky">
          <div class="voxel-moon"></div>
          <div class="pixel-stars"></div>
          <div class="voxel-cloud cloud-1"></div>
          <div class="voxel-cloud cloud-2"></div>
          <div class="voxel-cloud cloud-3"></div>
        </div>

        <!-- SERVER STATUS BADGE & TEAM CREDIT -->
        <div class="server-badge-container">
          <div class="server-badge">
            <span class="status-dot"></span>
            <span class="server-text">SERVER ONLINE</span>
            <span class="divider">|</span>
            <span class="server-ip">mc.msrit.hostelcraft:25565</span>
            <span class="divider">|</span>
            <span class="team-tag">🚀 TEAM: ASTEROID DESTROYER</span>
          </div>
        </div>

        <!-- MAIN HEADER & BRANDING -->
        <div class="landing-header">
          <div class="college-crest-banner">
            <span class="crest-icon">🏛️</span>
            <span class="college-name">MS RAMAIAH INSTITUTE OF TECHNOLOGY, BANGALORE</span>
          </div>
          <div class="hostel-block-tag">
            <span class="block-icon">🧱</span>
            <span class="block-title">FRESHERS BLOCK • DIGITAL HOSTEL EXPERIENCE</span>
          </div>

          <h1 class="main-title-minecraft">
            HOSTEL CRAFT
          </h1>
          <p class="main-tagline">“Your Hostel. Your World.”</p>
          <p class="main-descriptor">
            The first-semester engineering student's digital hostel universe — powered by blocky gamification, real hostel logistics, and total parent peace of mind.
          </p>
        </div>

        <!-- PROCEDURAL VOXEL BUILDING ASSEMBLY (Freshers Block Diorama Preview) -->
        <div class="voxel-building-wrapper">
          <div class="voxel-building-model">
            <div class="building-roof">
              <div class="water-tank"><span>SOLAR GEYSER 42°C</span></div>
              <div class="dish-antenna"></div>
            </div>
            <div class="building-floor floor-4">
              <span class="floor-sign">4TH FLOOR • WING A/B</span>
              <div class="window-row">
                <div class="voxel-window lit"></div>
                <div class="voxel-window"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window"></div>
                <div class="voxel-window lit"></div>
              </div>
            </div>
            <div class="building-floor floor-3">
              <span class="floor-sign">3RD FLOOR • WING C</span>
              <div class="window-row">
                <div class="voxel-window lit"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window"></div>
              </div>
            </div>
            <div class="building-floor floor-2">
              <span class="floor-sign">2ND FLOOR • ROOM 204 (AARAV)</span>
              <div class="window-row">
                <div class="voxel-window lit pulse-aarav"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window"></div>
                <div class="voxel-window lit"></div>
                <div class="voxel-window lit"></div>
              </div>
            </div>
            <div class="building-ground">
              <div class="gate-archway">
                <div class="gate-sign">FRESHERS BLOCK ENTRY</div>
                <div class="gate-turnstile">
                  <span class="curfew-pill">☀️ GATES OPEN (IN-TIME 10:00 PM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- THREE INTERACTIVE MINECRAFT PORTALS / BUILDINGS -->
        <div class="portals-section">
          <div class="portals-title-bar">
            <span class="portal-choice-label">CHOOSE YOUR GATEWAY TO ENTER FRESHERS BLOCK</span>
          </div>

          <div class="portals-grid">
            <!-- PORTAL 1: STUDENT -->
            <div class="portal-card student-portal" id="portal-btn-student">
              <div class="portal-vortex-art vortex-purple">
                <div class="portal-frame-obsidian"></div>
                <div class="portal-shimmer purple-shimmer"></div>
                <div class="portal-glyph">🎓</div>
              </div>
              <div class="portal-content">
                <div class="portal-role-badge badge-purple">STUDENT ADVENTURE</div>
                <h3 class="portal-heading">SIGN IN AS STUDENT</h3>
                <p class="portal-sub">
                  Enter Freshers Block Room 204. Manage daily attendance XP, check the real mess menu, view hostel economy, and summon housekeeping.
                </p>
                <div class="portal-perks">
                  <span>⚡ Attendance XP Bar</span>
                  <span>🍲 7-Day Mess Menu</span>
                  <span>🗺️ Facilities Map</span>
                  <span>💎 ₹1,07,000 Fees</span>
                </div>
                <button class="portal-action-btn btn-purple">
                  <span>ENTER HOSTEL WORLD</span>
                  <span class="btn-arrow">➔</span>
                </button>
              </div>
            </div>

            <!-- PORTAL 2: PARENT -->
            <div class="portal-card parent-portal" id="portal-btn-parent">
              <div class="portal-vortex-art vortex-amber">
                <div class="portal-frame-oak"></div>
                <div class="portal-shimmer amber-shimmer"></div>
                <div class="portal-glyph">👨‍👩‍👦</div>
              </div>
              <div class="portal-content">
                <div class="portal-role-badge badge-amber">PARENT SANCTUARY</div>
                <h3 class="portal-heading">SIGN IN AS PARENT</h3>
                <p class="portal-sub">
                  Real-time reassurance for families. Verify Aarav's attendance status, inspect today's 4-meal diet, view warden circulars, and approve home outpass.
                </p>
                <div class="portal-perks">
                  <span>🛡️ 92% Attendance Audit</span>
                  <span>📍 Checked-In Status</span>
                  <span>🥦 Pure Veg Nutrition</span>
                  <span>🎫 Instant Outpass</span>
                </div>
                <button class="portal-action-btn btn-amber">
                  <span>ENTER PARENT PORTAL</span>
                  <span class="btn-arrow">➔</span>
                </button>
              </div>
            </div>

            <!-- PORTAL 3: ADMIN -->
            <div class="portal-card admin-portal" id="portal-btn-admin">
              <div class="portal-vortex-art vortex-redstone">
                <div class="portal-frame-command"></div>
                <div class="portal-shimmer redstone-shimmer"></div>
                <div class="portal-glyph">🏢</div>
              </div>
              <div class="portal-content">
                <div class="portal-role-badge badge-redstone">COMMAND CENTER</div>
                <h3 class="portal-heading">SIGN IN AS ADMIN</h3>
                <p class="portal-sub">
                  Warden Command Room. Oversee 1,200 students, broadcast emergency updates, toggle 10 PM curfew gate locks, and audit biometric logs.
                </p>
                <div class="portal-perks">
                  <span>👥 1,200 Student Roster</span>
                  <span>📢 Broadcast Updates</span>
                  <span>🔒 10 PM Curfew Control</span>
                  <span>💻 Command Terminal</span>
                </div>
                <button class="portal-action-btn btn-redstone">
                  <span>ACCESS COMMAND DESK</span>
                  <span class="btn-arrow">➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 10-SECOND HACKATHON PITCH CARDS -->
        <div class="hackathon-pitch-grid">
          <div class="pitch-card">
            <div class="pitch-icon">🎮</div>
            <h4>Gamified Life</h4>
            <p>Attendance visualised as Minecraft XP. Stepping on turnstiles triggers level-up sounds and pressure plate animations.</p>
          </div>
          <div class="pitch-card">
            <div class="pitch-icon">🍲</div>
            <h4>Real MSRIT Mess</h4>
            <p>100% authentic 7-day vegetarian menu with official circular notes, 4 daily meal timings, and dietary tracking.</p>
          </div>
          <div class="pitch-card">
            <div class="pitch-icon">📅</div>
            <h4>All 24 Holidays</h4>
            <p>Official 2026 Karnataka & National holiday circular integrated with countdown alerts and festive mess specials.</p>
          </div>
          <div class="pitch-card">
            <div class="pitch-icon">💎</div>
            <h4>₹1,07,000 Economy</h4>
            <p>Transparent fee breakdown into Minecraft emeralds, detailing mess, amenities, maintenance, admission, and deposit.</p>
          </div>
        </div>

        <!-- FOOTER CREDITS -->
        <footer class="landing-footer">
          <div class="footer-content">
            <div class="footer-left">
              <strong>HOSTEL CRAFT</strong> • Developed for MSRIT Hackathon 2026
            </div>
            <div class="footer-center">
              <span>Freshers Block • MS Ramaiah Institute of Technology, Bangalore</span>
            </div>
            <div class="footer-right">
              <span>Presented by <strong>Team Asteroid Destroyer</strong></span>
            </div>
          </div>
        </footer>
      </section>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    const studentBtn = document.getElementById('portal-btn-student');
    const parentBtn = document.getElementById('portal-btn-parent');
    const adminBtn = document.getElementById('portal-btn-admin');

    if (studentBtn) {
      studentBtn.addEventListener('click', () => {
        sound.playClick();
        this.portalOverlay.warp(
          'Entering Freshers Block...',
          'Loading Room 204, Attendance XP bar & Today\'s Hot Mess Menu...',
          'student',
          () => {
            store.setView('student');
          }
        );
      });
    }

    if (parentBtn) {
      parentBtn.addEventListener('click', () => {
        sound.playClick();
        this.portalOverlay.warp(
          'Opening Parent Gateway...',
          'Connecting to Freshers Block Warden Biometric Feed & Meal Logs...',
          'parent',
          () => {
            store.setView('parent');
          }
        );
      });
    }

    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        sound.playClick();
        this.portalOverlay.warp(
          'Authenticating Warden Command Block...',
          'Loading 1,200 Student Records, Curfew Override & Broadcast Terminal...',
          'admin',
          () => {
            store.setView('admin');
          }
        );
      });
    }
  }
}
