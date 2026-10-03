import { store, type StudentTab } from '../data/stateStore';
import {
  WEEKLY_MESS_MENU,
  OFFICIAL_2026_HOLIDAYS,
  HOSTEL_FACILITIES,
  HOSTEL_FEE_BREAKDOWN,
  TOTAL_HOSTEL_FEE,
  HOSTEL_RULES,
  MESS_CIRCULAR_NOTES
} from '../data/hostelData';
import { sound } from '../audio/soundSystem';
import confetti from 'canvas-confetti';

export class StudentDashboard {
  private container: HTMLElement;
  private selectedMessDay: string = 'Monday';
  private selectedHolidayId: string | null = null;
  private isSteppingOnPlate: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;

    // Automatically pick today's day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];
    this.selectedMessDay = currentDay;
  }

  public render() {
    const state = store.getState();
    const activeTab = state.studentTab;

    this.container.innerHTML = `
      <div class="student-dashboard-layout">
        <!-- TOP STATUS STRIP -->
        <header class="student-top-strip">
          <div class="student-profile-summary">
            <div class="student-avatar-frame">
              <span class="avatar-head">🧑‍💻</span>
              <span class="avatar-lvl-badge">LVL ${state.student.level}</span>
            </div>
            <div class="student-meta">
              <div class="student-name-row">
                <span class="student-name">${state.student.name}</span>
                <span class="usn-tag">${state.student.usn}</span>
                <span class="title-tag">${state.student.activeTitle}</span>
              </div>
              <div class="student-sub-row">
                <span>Room <strong>${state.student.room}</strong> (Wing ${state.student.wing})</span>
                <span class="bullet">•</span>
                <span>Freshers Block</span>
                <span class="bullet">•</span>
                <span>MSRIT Bangalore</span>
              </div>
            </div>
          </div>

          <div class="student-top-indicators">
            <!-- GATE CURFEW STATUS -->
            <div class="indicator-pill ${state.gateCurfewActive ? 'curfew-locked' : 'gates-open'}">
              <span class="pill-icon">${state.gateCurfewActive ? '🌙' : '☀️'}</span>
              <div class="pill-text">
                <span class="pill-title">${state.gateCurfewActive ? 'HOSTEL GATES LOCKED' : 'HOSTEL GATES OPEN'}</span>
                <span class="pill-sub">${state.gateCurfewActive ? 'Curfew In-Time 10:00 PM' : 'Entry Free until 10:00 PM'}</span>
              </div>
            </div>

            <!-- ATTENDANCE XP CAPSULE -->
            <div class="xp-capsule">
              <div class="xp-capsule-header">
                <span class="xp-text">ATTENDANCE XP</span>
                <span class="xp-percent">${state.student.attendancePercent}%</span>
              </div>
              <div class="xp-progress-bar">
                <div class="xp-fill-green" style="width: ${state.student.attendancePercent}%;"></div>
              </div>
            </div>
          </div>
        </header>

        <!-- MAIN CONTENT AREA DEPENDING ON ACTIVE TAB -->
        <main class="student-main-content">
          ${this.renderActiveTab(activeTab)}
        </main>

        <!-- MINECRAFT INVENTORY HOTBAR (Bottom Navigation) -->
        <nav class="minecraft-hotbar-nav">
          <div class="hotbar-slots-container">
            ${this.renderHotbarItem('profile', '🪪', 'Profile', '1', activeTab === 'profile')}
            ${this.renderHotbarItem('attendance', '⚡', 'Attendance', '2', activeTab === 'attendance')}
            ${this.renderHotbarItem('mess', '🍲', 'Mess Menu', '3', activeTab === 'mess')}
            ${this.renderHotbarItem('facilities', '🗺️', 'Facilities', '4', activeTab === 'facilities')}
            ${this.renderHotbarItem('fees', '💎', 'Fees Economy', '5', activeTab === 'fees')}
            ${this.renderHotbarItem('rules', '📜', 'Curfew Rules', '6', activeTab === 'rules')}
            ${this.renderHotbarItem('complaints', '📋', 'Book & Quill', '7', activeTab === 'complaints')}
            ${this.renderHotbarItem('holidays', '📅', '2026 Holidays', '8', activeTab === 'holidays')}
            ${this.renderHotbarItem('room3d', '🕹️', '3D Room 204', '9', activeTab === 'room3d')}
          </div>
        </nav>

        <!-- MODAL CONTAINERS -->
        <div id="student-modal-container"></div>
      </div>
    `;

    this.bindEvents();
  }

  private renderHotbarItem(
    tab: StudentTab,
    icon: string,
    label: string,
    numKey: string,
    isActive: boolean
  ): string {
    return `
      <button class="hotbar-slot ${isActive ? 'active' : ''}" data-tab="${tab}" title="${label} (Key ${numKey})">
        <span class="slot-num">${numKey}</span>
        <span class="slot-icon">${icon}</span>
        <span class="slot-label">${label}</span>
      </button>
    `;
  }

  private renderActiveTab(tab: StudentTab): string {
    switch (tab) {
      case 'profile':
        return this.renderProfileView();
      case 'attendance':
        return this.renderAttendanceView();
      case 'mess':
        return this.renderMessView();
      case 'facilities':
        return this.renderFacilitiesView();
      case 'fees':
        return this.renderFeesView();
      case 'rules':
        return this.renderRulesView();
      case 'complaints':
        return this.renderComplaintsView();
      case 'holidays':
        return this.renderHolidaysView();
      case 'room3d':
        return this.render3dRoomView();
      default:
        return this.renderProfileView();
    }
  }

  // ==========================================
  // TAB 1: STUDENT PROFILE & CHARACTER
  // ==========================================
  private renderProfileView(): string {
    const state = store.getState();
    return `
      <div class="panel-pixel-card profile-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">🪪</span>
            <div>
              <h2>Freshers Block Identity & Character Lore</h2>
              <p>Room 204, Wing B • Department of Computer Science & Engineering</p>
            </div>
          </div>
          <span class="badge-gold">SEMESTER 1 ROOKIE</span>
        </div>

        <div class="profile-grid">
          <!-- CHARACTER 2.5D PAPER DOLL / MINECRAFT AVATAR -->
          <div class="character-diorama-card">
            <div class="avatar-pixel-art">
              <div class="mc-player-stand">
                <div class="mc-char-head">
                  <div class="hair"></div>
                  <div class="eyes"></div>
                  <div class="glasses"></div>
                </div>
                <div class="mc-char-body">
                  <div class="college-lanyard">MSRIT</div>
                  <div class="char-sleeves"></div>
                </div>
                <div class="mc-char-legs">
                  <div class="jeans"></div>
                  <div class="sneakers"></div>
                </div>
              </div>
            </div>
            <div class="character-stats-bar">
              <div class="stat-bubble">
                <span class="stat-icon">🍜</span>
                <span class="stat-val">${state.student.maggiBowlsEaten} Bowls</span>
                <span class="stat-lbl">Maggi Devoured</span>
              </div>
              <div class="stat-bubble">
                <span class="stat-icon">🧺</span>
                <span class="stat-val">${state.student.laundryTokensLeft} / 4</span>
                <span class="stat-lbl">Tokens Remaining</span>
              </div>
              <div class="stat-bubble">
                <span class="stat-icon">🛏️</span>
                <span class="stat-val">Bunk Bed (Lower)</span>
                <span class="stat-lbl">Room 204 Slot</span>
              </div>
            </div>
          </div>

          <!-- HOSTEL INVENTORY & EQUIPMENT SLOTS -->
          <div class="equipment-inventory-card">
            <h3 class="section-subheading">SURVIVAL HOTBAR & HOSTEL GEAR</h3>
            <div class="inventory-slots-grid">
              <div class="inv-slot" title="Contraband Electric Kettle (Rank Legendary)">
                <span class="inv-emoji">🫖</span>
                <span class="inv-tag">KETTLE</span>
              </div>
              <div class="inv-slot" title="Engineering Drawing Drafter & Sheet Tube">
                <span class="inv-emoji">📐</span>
                <span class="inv-tag">DRAFTER</span>
              </div>
              <div class="inv-slot" title="Anchor Overloaded 8-Port Extension Cord">
                <span class="inv-emoji">⚡</span>
                <span class="inv-tag">MULTI-PLUG</span>
              </div>
              <div class="inv-slot" title="Steel Thali with 5 Compartments">
                <span class="inv-emoji">🍽️</span>
                <span class="inv-tag">THALI</span>
              </div>
              <div class="inv-slot" title="Neelkamal Chair (Holds 14 T-shirts)">
                <span class="inv-emoji">🪑</span>
                <span class="inv-tag">KURSI</span>
              </div>
              <div class="inv-slot" title="Hostel Biometric Turnstile RFID Card">
                <span class="inv-emoji">🪪</span>
                <span class="inv-tag">RFID PASS</span>
              </div>
            </div>

            <!-- ROOM DETAILS & ROOMMATE -->
            <div class="roommate-card">
              <div class="roommate-avatar">🧑‍🤝‍🧑</div>
              <div class="roommate-info">
                <h4>Roommate: Rohan Nambiar (1MS26CS089)</h4>
                <p>"Bhai tu extension cord me apna phone mat laga, mera laptop 1% pe render ho raha hai."</p>
                <span class="roommate-status">✓ Present in Room • Studying for Physics</span>
              </div>
            </div>

            <!-- PARENT CARE PACKAGE / MESSAGES -->
            <div class="parent-message-box">
              <div class="parent-msg-header">
                <span>💌 RECENT MESSAGE FROM PARENTS</span>
                <span class="msg-date">${state.parentMessages[0]?.timestamp || 'Yesterday'}</span>
              </div>
              <p class="parent-msg-text">"${state.parentMessages[0]?.text || 'Take care beta, study well and eat fruits!'}"</p>
              ${state.parentMessages[0]?.snackPocketMoney ? `
                <div class="pocket-money-pill">
                  <span>💰 Pocket Money Credited: ₹${state.parentMessages[0].snackPocketMoney}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 2: STUDENT ATTENDANCE (XP SYSTEM)
  // ==========================================
  private renderAttendanceView(): string {
    const state = store.getState();
    const isMarked = state.student.todayMarked;

    return `
      <div class="panel-pixel-card attendance-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">⚡</span>
            <div>
              <h2>Biometric Attendance XP System</h2>
              <p>Freshers Block Turnstile Checkpoint • Threshold: 75% Mandatory</p>
            </div>
          </div>
          <span class="badge-${state.student.attendancePercent >= 75 ? 'green' : 'red'}">
            ${state.student.attendancePercent >= 75 ? 'ELIGIBLE FOR EXAMS (GREEN ZONE)' : 'CRITICAL ATTENDANCE'}
          </span>
        </div>

        <div class="attendance-hero-grid">
          <!-- MINECRAFT XP VISUALIZATION -->
          <div class="attendance-xp-showcase">
            <div class="xp-level-display">
              <span class="xp-lvl-title">ATTENDANCE LEVEL</span>
              <div class="xp-lvl-big">${state.student.level}</div>
              <span class="xp-sub">Safe from Chief Warden Warning List</span>
            </div>

            <div class="xp-bar-detailed">
              <div class="xp-bar-meta">
                <span>ATTENDANCE XP</span>
                <span><strong>${state.student.attendancePercent}%</strong> OVERALL</span>
              </div>
              <div class="xp-bar-outer">
                <div class="xp-bar-inner" style="width: ${state.student.attendancePercent}%;">
                  <span class="xp-glow-line"></span>
                </div>
              </div>
              <div class="xp-ticks">
                <span>0%</span>
                <span class="threshold-tick">75% (MIN SAFE)</span>
                <span>100%</span>
              </div>
            </div>

            <!-- INTERACTIVE PRESSURE PLATE / MARK ATTENDANCE BUTTON -->
            <div class="mark-attendance-chamber">
              <div class="pressure-plate-diorama ${this.isSteppingOnPlate ? 'stepped' : ''} ${isMarked ? 'active-checkpoint' : ''}">
                <div class="plate-stone">
                  <div class="plate-top"></div>
                </div>
                <div class="redstone-lamp ${isMarked ? 'lit' : ''}"></div>
              </div>

              <div class="mark-btn-wrapper">
                <button 
                  id="btn-mark-attendance" 
                  class="mc-action-btn ${isMarked ? 'btn-marked-done' : 'btn-mark-active'}"
                  ${isMarked ? 'disabled' : ''}
                >
                  <span class="btn-icon">${isMarked ? '✓' : '🦶'}</span>
                  <span class="btn-text">${isMarked ? 'ATTENDANCE MARKED FOR TODAY' : 'STEP ON PRESSURE PLATE • MARK ATTENDANCE'}</span>
                </button>
                <div class="last-attendance-timestamp">
                  <span class="clock-icon">⏱️</span>
                  <span>LAST ATTENDANCE: <strong>${state.student.lastMarkedTime}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- ATTENDANCE STATS & RECENT HISTORY -->
          <div class="attendance-history-card">
            <h3 class="section-subheading">MONTHLY LOGS & CLASS BREAKDOWN</h3>
            
            <div class="subject-attendance-list">
              <div class="subject-row">
                <span class="sub-name">Data Structures & Applications</span>
                <div class="sub-bar"><div class="sub-fill" style="width: 95%;"></div></div>
                <span class="sub-pct">95% (38/40)</span>
              </div>
              <div class="subject-row">
                <span class="sub-name">Mathematics for Computing - I</span>
                <div class="sub-bar"><div class="sub-fill" style="width: 92%;"></div></div>
                <span class="sub-pct">92% (35/38)</span>
              </div>
              <div class="subject-row">
                <span class="sub-name">Applied Physics & Quantum Mechanics</span>
                <div class="sub-bar"><div class="sub-fill" style="width: 88%;"></div></div>
                <span class="sub-pct">88% (30/34)</span>
              </div>
              <div class="subject-row">
                <span class="sub-name">Computer Programming Lab (C/Python)</span>
                <div class="sub-bar"><div class="sub-fill" style="width: 96%;"></div></div>
                <span class="sub-pct">96% (24/25)</span>
              </div>
              <div class="subject-row">
                <span class="sub-name">Night Hostel Turnstile Biometric Scan</span>
                <div class="sub-bar"><div class="sub-fill" style="width: 100%;"></div></div>
                <span class="sub-pct">100% (30/30)</span>
              </div>
            </div>

            <!-- RECENT 14 DAYS PIXEL CALENDAR STRIP -->
            <div class="history-calendar-strip">
              <h4>LAST 14 DAYS LOG:</h4>
              <div class="pixel-calendar-blocks">
                <div class="day-block present" title="20 Sep: Present">✓</div>
                <div class="day-block present" title="21 Sep: Present">✓</div>
                <div class="day-block present" title="22 Sep: Present">✓</div>
                <div class="day-block absent" title="23 Sep: Absent (Fever)">✗</div>
                <div class="day-block present" title="24 Sep: Present">✓</div>
                <div class="day-block present" title="25 Sep: Present">✓</div>
                <div class="day-block present" title="26 Sep: Present">✓</div>
                <div class="day-block holiday" title="27 Sep: Sunday">☀️</div>
                <div class="day-block present" title="28 Sep: Present">✓</div>
                <div class="day-block present" title="29 Sep: Present">✓</div>
                <div class="day-block present" title="30 Sep: Present">✓</div>
                <div class="day-block present" title="01 Oct: Present">✓</div>
                <div class="day-block present" title="02 Oct: Gandhi Jayanthi">🏛️</div>
                <div class="day-block ${isMarked ? 'present' : 'pending'}" title="Today">
                  ${isMarked ? '✓' : '?'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 3: REAL HOSTEL MESS MENU
  // ==========================================
  private renderMessView(): string {
    const currentMenu = WEEKLY_MESS_MENU.find(m => m.day === this.selectedMessDay) || WEEKLY_MESS_MENU[0];
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return `
      <div class="panel-pixel-card mess-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">🍲</span>
            <div>
              <h2>Freshers Block Dining Hall & Mess Schedule</h2>
              <p>Official 100% Vegetarian Menu • Student Mess Committee, Gokula Education Foundation</p>
            </div>
          </div>
          <div class="mess-header-actions">
            <button id="btn-eat-mess" class="mc-btn mc-btn-gold" title="Take a plate & eat meal!">
              🍽️ <span class="btn-label">Eat Food (+1 Hunger Bar)</span>
            </button>
          </div>
        </div>

        <!-- DAYS OF THE WEEK SELECTOR TABS -->
        <div class="mess-days-nav">
          ${WEEKLY_MESS_MENU.map(dayItem => {
            const isSelected = dayItem.day === this.selectedMessDay;
            const isToday = dayItem.day === todayName;
            return `
              <button 
                class="mess-day-tab ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''}"
                data-day="${dayItem.day}"
              >
                <span class="day-abbr">${dayItem.day.slice(0, 3).toUpperCase()}</span>
                ${isToday ? '<span class="today-tag">TODAY</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- ACTIVE DAY HIGHLIGHT BANNER -->
        <div class="mess-day-banner">
          <div class="day-badge-wrap">
            <span class="active-day-title">${currentMenu.day.toUpperCase()} MENU</span>
            ${currentMenu.day === todayName ? '<span class="today-banner-pill">🌟 SERVING TODAY</span>' : ''}
          </div>
          <p class="special-highlight-text">Chef\'s Special: <strong>${currentMenu.specialHighlight}</strong></p>
        </div>

        <!-- 4 MEALS GRID (Breakfast, Lunch, Snacks, Dinner) -->
        <div class="meals-quad-grid">
          <!-- 1. BREAKFAST -->
          <div class="meal-block-card breakfast-card">
            <div class="meal-card-header">
              <div class="meal-title-group">
                <span class="meal-icon">🍳</span>
                <div>
                  <h4 class="meal-name">BREAKFAST</h4>
                  <span class="meal-timing">${currentMenu.meals.breakfast.timing}</span>
                </div>
              </div>
            </div>
            <div class="meal-food-list">
              <ul>
                ${currentMenu.meals.breakfast.items.map((item, idx) => `
                  <li>
                    <span class="item-icon">${currentMenu.meals.breakfast.icons[idx] || '🥘'}</span>
                    <span class="item-name">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="meal-beverage-tag">
              <span>☕ Beverage: ${currentMenu.meals.breakfast.beverage}</span>
            </div>
          </div>

          <!-- 2. LUNCH -->
          <div class="meal-block-card lunch-card">
            <div class="meal-card-header">
              <div class="meal-title-group">
                <span class="meal-icon">🍛</span>
                <div>
                  <h4 class="meal-name">LUNCH</h4>
                  <span class="meal-timing">${currentMenu.meals.lunch.timing}</span>
                </div>
              </div>
            </div>
            <div class="meal-food-list">
              <ul>
                ${currentMenu.meals.lunch.items.map((item, idx) => `
                  <li>
                    <span class="item-icon">${currentMenu.meals.lunch.icons[idx] || '🍲'}</span>
                    <span class="item-name">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            ${currentMenu.meals.lunch.dessert ? `
              <div class="meal-dessert-tag">
                <span>🍮 Sweet: ${currentMenu.meals.lunch.dessert}</span>
              </div>
            ` : ''}
          </div>

          <!-- 3. EVENING SNACKS -->
          <div class="meal-block-card snacks-card">
            <div class="meal-card-header">
              <div class="meal-title-group">
                <span class="meal-icon">🍪</span>
                <div>
                  <h4 class="meal-name">EVENING SNACKS</h4>
                  <span class="meal-timing">${currentMenu.meals.snacks.timing}</span>
                </div>
              </div>
            </div>
            <div class="meal-food-list">
              <ul>
                ${currentMenu.meals.snacks.items.map((item, idx) => `
                  <li>
                    <span class="item-icon">${currentMenu.meals.snacks.icons[idx] || '🥟'}</span>
                    <span class="item-name">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="meal-beverage-tag">
              <span>🫖 Beverage: ${currentMenu.meals.snacks.beverage}</span>
            </div>
          </div>

          <!-- 4. DINNER -->
          <div class="meal-block-card dinner-card">
            <div class="meal-card-header">
              <div class="meal-title-group">
                <span class="meal-icon">🍽️</span>
                <div>
                  <h4 class="meal-name">DINNER</h4>
                  <span class="meal-timing">${currentMenu.meals.dinner.timing}</span>
                </div>
              </div>
            </div>
            <div class="meal-food-list">
              <ul>
                ${currentMenu.meals.dinner.items.map((item, idx) => `
                  <li>
                    <span class="item-icon">${currentMenu.meals.dinner.icons[idx] || '🫓'}</span>
                    <span class="item-name">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="meal-dessert-tag">
              <span>🍨 Dessert: ${currentMenu.meals.dinner.dessert}</span>
            </div>
          </div>
        </div>

        <!-- OFFICIAL MESS CIRCULAR NOTES (Required) -->
        <div class="mess-circular-notes-card">
          <div class="notes-header">
            <span class="notes-icon">📜</span>
            <h4>OFFICIAL MESS CIRCULAR NOTIFICATIONS</h4>
          </div>
          <ul class="circular-notes-list">
            ${MESS_CIRCULAR_NOTES.map(note => `<li>${note}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 4: HOSTEL FACILITIES & MAP
  // ==========================================
  private renderFacilitiesView(): string {
    return `
      <div class="panel-pixel-card facilities-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">🗺️</span>
            <div>
              <h2>Freshers Block Facilities & Interactive Campus Map</h2>
              <p>Explore recreation courts, housekeeping services, and hot water schedules</p>
            </div>
          </div>
        </div>

        <!-- INTERACTIVE FACILITIES GRID -->
        <div class="facilities-grid">
          ${HOSTEL_FACILITIES.map(fac => {
            return `
              <div class="facility-card fac-${fac.id}" data-facility-id="${fac.id}">
                <div class="fac-top-bar">
                  <span class="fac-icon-big">${fac.icon}</span>
                  <span class="fac-badge fac-badge-${fac.status.toLowerCase()}">${fac.status}</span>
                </div>
                <h3 class="fac-title">${fac.name}</h3>
                <div class="fac-location-tag">📍 ${fac.location}</div>
                <div class="fac-hours-tag">⏰ ${fac.hours}</div>
                <p class="fac-desc">${fac.description}</p>
                
                <div class="fac-details-list">
                  ${fac.details.map(d => `
                    <div class="fac-detail-row">
                      <span class="detail-label">${d.label}:</span>
                      <span class="detail-value">${d.value}</span>
                    </div>
                  `).join('')}
                </div>

                <div class="fac-action-bar">
                  <button class="mc-btn mc-btn-block btn-facility-action" data-action="${fac.id}">
                    ${fac.actionLabel}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 5: HOSTEL FEES & ECONOMY (₹1,07,000)
  // ==========================================
  private renderFeesView(): string {
    return `
      <div class="panel-pixel-card fees-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">💎</span>
            <div>
              <h2>Hostel Economy & Fee Structure</h2>
              <p>Academic Year 2026–2027 • Approved by Gokula Education Foundation</p>
            </div>
          </div>
          <div class="fee-receipt-action">
            <button id="btn-open-fee-receipt" class="mc-btn mc-btn-gold">
              📄 <span class="btn-label">View Official Receipt</span>
            </button>
          </div>
        </div>

        <!-- TOTAL HERO CARD -->
        <div class="total-fee-hero">
          <div class="total-fee-left">
            <span class="total-label">TOTAL ANNUAL HOSTEL FEE</span>
            <div class="total-amount-display">₹${TOTAL_HOSTEL_FEE.toLocaleString('en-IN')}</div>
            <span class="total-words">Rupees One Lakh Seven Thousand Only</span>
          </div>
          <div class="total-fee-right">
            <div class="payment-status-capsule paid">
              <span class="check-icon">✓</span>
              <span>PAID IN FULL</span>
            </div>
            <div class="txn-info">TXN ID: <strong>MSRIT-HOSTEL-2026-8914</strong></div>
          </div>
        </div>

        <!-- MINECRAFT EMERALD ECONOMY CHEST BREAKDOWN -->
        <div class="fee-breakdown-grid">
          ${HOSTEL_FEE_BREAKDOWN.map(item => `
            <div class="fee-breakdown-card">
              <div class="fee-item-header">
                <span class="fee-icon">${item.icon}</span>
                <div class="fee-name-group">
                  <h4>${item.category}</h4>
                  <span class="fee-pct">${item.percentage}% of Total</span>
                </div>
              </div>
              <div class="fee-item-amount">₹${item.amount.toLocaleString('en-IN')}</div>
              
              <!-- MINECRAFT EMERALD STACK VISUAL -->
              <div class="emerald-stack-bar">
                <span class="emerald-icon">🟢</span>
                <span class="emerald-count">${item.emeraldCount} Emerald Stacks</span>
              </div>

              <p class="fee-desc">${item.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 6: HOSTEL RULES & CURFEW TIMINGS
  // ==========================================
  private renderRulesView(): string {
    const state = store.getState();
    return `
      <div class="panel-pixel-card rules-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">📜</span>
            <div>
              <h2>Freshers Block Rules & Day/Night Curfew Mechanics</h2>
              <p>Strictly enforced for safety, discipline, and peaceful academic environment</p>
            </div>
          </div>
          <div class="rules-toggle-action">
            <button id="btn-toggle-daynight" class="mc-btn ${state.dayNight === 'day' ? 'mc-btn-gold' : 'mc-btn-danger'}">
              ${state.dayNight === 'day' ? '☀️ Day Mode (Gates Open)' : '🌙 Night Curfew (Gates Locked)'}
            </button>
          </div>
        </div>

        <!-- DAY / NIGHT TIMING MECHANICS BANNER -->
        <div class="day-night-showcase ${state.gateCurfewActive ? 'curfew-mode' : 'day-mode'}">
          <div class="curfew-visual">
            <div class="sky-cycle-art">
              ${state.gateCurfewActive ? '🌙' : '☀️'}
            </div>
            <div class="curfew-statement">
              <h3>${state.gateCurfewActive ? '🌙 HOSTEL GATES LOCKED (CURFEW ACTIVE)' : '☀️ HOSTEL GATES OPEN'}</h3>
              <p>
                ${state.gateCurfewActive 
                  ? 'Time is past 10:00 PM. Iron security gates are locked. Biometric turnstiles disabled without warden outpass token.' 
                  : 'Gates unlocked at 6:00 AM. Free movement to college campus, basketball courts, and library until 10:00 PM.'}
              </p>
            </div>
          </div>

          <div class="golden-curfew-timings">
            <div class="timing-badge">
              <span class="lbl">HOSTEL IN-TIME:</span>
              <span class="val">10:00 PM STRICTLY</span>
            </div>
            <div class="timing-badge">
              <span class="lbl">MORNING GATES OPEN:</span>
              <span class="val">6:00 AM</span>
            </div>
          </div>
        </div>

        <!-- DETAILED RULES LIST -->
        <div class="rules-cards-list">
          ${HOSTEL_RULES.map((rule, idx) => `
            <div class="rule-item-card">
              <div class="rule-icon-box">${rule.icon}</div>
              <div class="rule-body">
                <div class="rule-title-row">
                  <h4>RULE ${idx + 1}: ${rule.title}</h4>
                  <span class="rule-badge">${rule.badge}</span>
                </div>
                <span class="rule-time">Effective Window: <strong>${rule.time}</strong></span>
                <p class="rule-desc">${rule.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 7: COMPLAINTS / BOOK & QUILL
  // ==========================================
  private renderComplaintsView(): string {
    const state = store.getState();
    return `
      <div class="panel-pixel-card complaints-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">📋</span>
            <div>
              <h2>Hostel Maintenance Book & Quill</h2>
              <p>Direct ticket dispatch to Caretaker Office & Estate Maintenance Cell</p>
            </div>
          </div>
        </div>

        <div class="complaints-grid">
          <!-- WRITE NEW COMPLAINT (Book & Quill) -->
          <div class="book-and-quill-form">
            <div class="book-cover-header">
              <span class="book-icon">📖</span>
              <h3>LOG NEW GRIEVANCE / REPAIR</h3>
            </div>
            <form id="form-complaint" class="quill-form">
              <div class="form-group">
                <label>Category of Maintenance:</label>
                <select id="complaint-category" class="mc-select">
                  <option value="Plumbing">🚿 Plumbing & Geyser Issues</option>
                  <option value="Electrical">💡 Electrical, Fan & Tube Light</option>
                  <option value="WiFi / Network">📶 Campus WiFi & Fiber Leased Line</option>
                  <option value="Carpentry">🪑 Room Cot, Neelkalam Chair & Study Desk</option>
                  <option value="Cleanliness">🧹 Room Mopping & Waste Bin Clearance</option>
                </select>
              </div>

              <div class="form-group">
                <label>Describe the Issue (Mention specific wing/room):</label>
                <textarea 
                  id="complaint-desc" 
                  class="mc-textarea" 
                  rows="4" 
                  placeholder="e.g. B-Wing 2nd floor hot water geyser valve is dripping slowly..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="mc-action-btn btn-quill-submit">
                <span>✒️ SIGN & DISPATCH TICKET</span>
              </button>
            </form>
          </div>

          <!-- LIST OF ACTIVE TICKETS -->
          <div class="complaints-history-card">
            <h3 class="section-subheading">ACTIVE MAINTENANCE LOGS</h3>
            <div class="tickets-list">
              ${state.complaints.map(ticket => `
                <div class="ticket-card status-${ticket.status.toLowerCase().replace(' ', '-')}">
                  <div class="ticket-header">
                    <span class="ticket-cat">${ticket.category}</span>
                    <span class="ticket-status-pill">${ticket.status}</span>
                  </div>
                  <p class="ticket-desc">${ticket.description}</p>
                  <div class="ticket-meta">
                    <span>Logged by: Room ${ticket.room} (${ticket.studentName})</span>
                    <span>${ticket.timestamp}</span>
                  </div>
                  ${ticket.adminRemark ? `
                    <div class="ticket-admin-remark">
                      <strong>Caretaker Note:</strong> ${ticket.adminRemark}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 8: ALL 24 OFFICIAL 2026 HOLIDAYS
  // ==========================================
  private renderHolidaysView(): string {
    return `
      <div class="panel-pixel-card holidays-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">📅</span>
            <div>
              <h2>2026 Official Academic & Karnataka Holiday Calendar</h2>
              <p>Official Circular Source of Truth • 24 Approved Holidays</p>
            </div>
          </div>
          <span class="badge-gold">24 OFFICIAL DAYS</span>
        </div>

        <div class="holidays-intro-strip">
          <p>
            Plan your train travel and long weekend trips home. Clicking any holiday reveals celebration details, date, day of the week, and festive sweet served in Freshers Block mess.
          </p>
        </div>

        <!-- 24 HOLIDAYS MINECRAFT QUEST GRID -->
        <div class="holidays-grid">
          ${OFFICIAL_2026_HOLIDAYS.map((holiday, idx) => {
            const isSelected = holiday.id === this.selectedHolidayId;
            return `
              <div 
                class="holiday-card ${isSelected ? 'selected' : ''}" 
                data-holiday-id="${holiday.id}"
                title="Click to view details"
              >
                <div class="holiday-card-top">
                  <span class="holiday-index">#${idx + 1}</span>
                  <span class="holiday-cat-tag cat-${holiday.category.toLowerCase()}">${holiday.category}</span>
                </div>
                <div class="holiday-date-large">${holiday.date}</div>
                <h4 class="holiday-name">${holiday.name}</h4>
                <div class="holiday-day-badge">📅 ${holiday.dayOfWeek}</div>
                <div class="holiday-sweet-tag">
                  <span>🍬 ${holiday.sweetServed}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 9: 3D HOSTEL ROOM (DIORAMA EMBED)
  // ==========================================
  private render3dRoomView(): string {
    return `
      <div class="panel-pixel-card room3d-panel">
        <div class="panel-header">
          <div class="panel-title-group">
            <span class="pixel-glyph">🕹️</span>
            <div>
              <h2>Interactive 3D Voxel Room 204 (Freshers Block)</h2>
              <p>Scroll or drag orbit controls to inspect your hostel cots, kettle, study tables, and mess cauldrons</p>
            </div>
          </div>
        </div>

        <div class="room3d-prompt-box">
          <p>
            🌟 You are inside the WebGL 3D Voxel Engine. Use your mouse wheel or touch gesture to rotate the camera around Room 204, inspect the iron beds, click on the electric kettle to boil water, or turn on the ceiling fan!
          </p>
          <div class="room3d-instructions">
            <span>🖱️ Left Click + Drag: Orbit Camera</span>
            <span>📜 Mouse Wheel: Zoom / Step Chapters</span>
            <span>💡 Click Objects: Trigger Interactions & Sounds</span>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  private bindEvents() {
    // 1. Hotbar Navigation Clicks
    const slots = this.container.querySelectorAll('.hotbar-slot');
    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        sound.playClick();
        const tab = (slot as HTMLElement).dataset.tab as StudentTab;
        if (tab) {
          store.setStudentTab(tab);
          this.render();
        }
      });
    });

    // 2. Keyboard Hotkeys 1-9 for Hotbar
    const onKeydown = (e: KeyboardEvent) => {
      const tabs: StudentTab[] = ['profile', 'attendance', 'mess', 'facilities', 'fees', 'rules', 'complaints', 'holidays', 'room3d'];
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        sound.playClick();
        store.setStudentTab(tabs[num - 1]);
        this.render();
      }
    };
    window.removeEventListener('keydown', onKeydown);
    window.addEventListener('keydown', onKeydown);

    // 3. Mark Attendance Pressure Plate Click
    const markBtn = document.getElementById('btn-mark-attendance');
    if (markBtn && !store.getState().student.todayMarked) {
      markBtn.addEventListener('click', () => {
        this.isSteppingOnPlate = true;
        sound.playPressurePlate();

        // Confetti burst!
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#55ff55', '#ffaa00', '#55ffff', '#ffff55']
        });

        setTimeout(() => {
          this.isSteppingOnPlate = false;
          store.markStudentAttendance('Today, 8:42 AM');
          this.render();
        }, 300);
      });
    }

    // 4. Mess Day Selector Clicks
    const dayTabs = this.container.querySelectorAll('.mess-day-tab');
    dayTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const day = (btn as HTMLElement).dataset.day;
        if (day) {
          this.selectedMessDay = day;
          this.render();
        }
      });
    });

    // 5. Eat Mess Food Button
    const eatBtn = document.getElementById('btn-eat-mess');
    if (eatBtn) {
      eatBtn.addEventListener('click', () => {
        sound.playEatingCrunch();
        store.eatMessFood();
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#f97316', '#eab308']
        });
        alert('Delicious meal consumed! Character stamina & hunger bar replenished.');
        this.render();
      });
    }

    // 6. Holiday Card Clicks (Popup Modal)
    const holidayCards = this.container.querySelectorAll('.holiday-card');
    holidayCards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        const hId = (card as HTMLElement).dataset.holidayId;
        const holiday = OFFICIAL_2026_HOLIDAYS.find(h => h.id === hId);
        if (holiday) {
          this.openHolidayModal(holiday);
        }
      });
    });

    // 7. Facilities Actions (Booking / Washing Machine / Geyser)
    const facActionBtns = this.container.querySelectorAll('.btn-facility-action');
    facActionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const facId = (btn as HTMLElement).dataset.action;
        this.handleFacilityAction(facId || '');
      });
    });

    // 8. Day/Night Toggle
    const dayNightBtn = document.getElementById('btn-toggle-daynight');
    if (dayNightBtn) {
      dayNightBtn.addEventListener('click', () => {
        sound.playClick();
        store.toggleDayNight();
        this.render();
      });
    }

    // 9. Fee Receipt Modal
    const feeReceiptBtn = document.getElementById('btn-open-fee-receipt');
    if (feeReceiptBtn) {
      feeReceiptBtn.addEventListener('click', () => {
        sound.playChest();
        this.openFeeReceiptModal();
      });
    }

    // 10. Complaint Form Submit
    const complaintForm = document.getElementById('form-complaint');
    if (complaintForm) {
      complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();
        const catEl = document.getElementById('complaint-category') as HTMLSelectElement;
        const descEl = document.getElementById('complaint-desc') as HTMLTextAreaElement;
        if (catEl && descEl && descEl.value.trim()) {
          store.addComplaint(catEl.value as any, descEl.value.trim());
          alert('Maintenance Ticket successfully logged in Warden Caretaker Register!');
          this.render();
        }
      });
    }
  }

  // ==========================================
  // MODALS & POPUPS
  // ==========================================
  private openHolidayModal(holiday: (typeof OFFICIAL_2026_HOLIDAYS)[0]) {
    const modalContainer = document.getElementById('student-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="mc-modal-backdrop">
        <div class="mc-dialog-box holiday-dialog">
          <div class="dialog-header">
            <span class="dialog-glyph">📅</span>
            <h3>${holiday.name}</h3>
            <button class="dialog-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="dialog-body">
            <div class="holiday-popup-hero">
              <div class="popup-date-box">
                <span class="pop-date">${holiday.date}</span>
                <span class="pop-day">${holiday.dayOfWeek}</span>
              </div>
              <span class="holiday-cat-tag cat-${holiday.category.toLowerCase()}">${holiday.category} Holiday</span>
            </div>
            <p class="popup-desc">${holiday.description}</p>
            <div class="popup-sweet-box">
              <span class="sweet-icon">🍯</span>
              <div>
                <strong>Festive Mess Special:</strong>
                <p>${holiday.sweetServed}</p>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="mc-btn mc-btn-gold" id="btn-modal-ok">CLOSE HOLIDAY NOTICE</button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-modal');
    const okBtn = document.getElementById('btn-modal-ok');
    const close = () => {
      sound.playClick();
      modalContainer.innerHTML = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (okBtn) okBtn.addEventListener('click', close);
  }

  private openFeeReceiptModal() {
    const modalContainer = document.getElementById('student-modal-container');
    if (!modalContainer) return;

    const state = store.getState();

    modalContainer.innerHTML = `
      <div class="mc-modal-backdrop">
        <div class="mc-dialog-box receipt-dialog">
          <div class="dialog-header">
            <span class="dialog-glyph">📜</span>
            <h3>MSRIT HOSTEL OFFICIAL RECEIPT</h3>
            <button class="dialog-close-btn" id="btn-close-modal">✕</button>
          </div>
          <div class="dialog-body receipt-body">
            <div class="receipt-institute-header">
              <h4>M. S. RAMAIAH INSTITUTE OF TECHNOLOGY</h4>
              <p>Autonomous Institute Affiliated to VTU • Freshers Block Hostels</p>
              <span class="receipt-no">RECEIPT NO: <strong>MSRIT/FB/2026/0942</strong></span>
            </div>

            <div class="receipt-student-meta">
              <div><strong>Student:</strong> ${state.student.name}</div>
              <div><strong>USN:</strong> ${state.student.usn}</div>
              <div><strong>Room:</strong> 204 (Wing B, Freshers Block)</div>
              <div><strong>Academic Year:</strong> 2026-2027</div>
            </div>

            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th style="text-align: right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                ${HOSTEL_FEE_BREAKDOWN.map(item => `
                  <tr>
                    <td>${item.category} (${item.percentage}%)</td>
                    <td style="text-align: right;">₹${item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <th>TOTAL AMOUNT PAID</th>
                  <th style="text-align: right;">₹${TOTAL_HOSTEL_FEE.toLocaleString('en-IN')}</th>
                </tr>
              </tfoot>
            </table>

            <div class="receipt-stamp-box">
              <div class="stamp-pill">
                <span>✓ PAYMENT VERIFIED & CREDITED</span>
                <small>Bank of Baroda • Ramaiah Campus Branch</small>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="mc-btn" onclick="window.print()">🖨️ PRINT RECEIPT</button>
            <button class="mc-btn mc-btn-gold" id="btn-modal-ok">CLOSE RECEIPT</button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-modal');
    const okBtn = document.getElementById('btn-modal-ok');
    const close = () => {
      sound.playClick();
      modalContainer.innerHTML = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (okBtn) okBtn.addEventListener('click', close);
  }

  private handleFacilityAction(facId: string) {
    if (facId === 'washroom') {
      alert('🚿 Common Washroom Status:\nHot water geysers active 6:00 AM – 11:00 AM.\nCurrent Temperature: 42°C. Solar thermal grid operational.');
    } else if (facId === 'basketball') {
      alert('🏀 Basketball Court:\nEvening slot reserved (6:30 PM - 7:30 PM) for Room 204 squad! Floodlights activate at dusk.');
    } else if (facId === 'tennis') {
      alert('🎾 Tennis Court:\nToken issued for Court #2. Collect 2 Wilson rackets from Caretaker Desk.');
    } else if (facId === 'housekeeping') {
      store.requestHousekeepingCleaning();
      alert('🧹 Housekeeping Request Dispatched!\nMr. Shivanna (Custodial Staff) assigned for Room 204 mopping at 11:30 AM.');
    } else if (facId === 'laundry') {
      const success = store.useLaundryToken();
      if (success) {
        alert('🧺 Laundry Token Redressed!\n1 Token used (7kg load). Clothes ready for pickup in 24 hours at Utility Basement.');
      } else {
        alert('⚠️ No monthly laundry tokens remaining! Purchase additional tokens at Caretaker Office for ₹50.');
      }
    }
  }
}
