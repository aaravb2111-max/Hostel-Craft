import { store, type ParentTab } from '../data/stateStore';
import {
  WEEKLY_MESS_MENU,
  OFFICIAL_2026_HOLIDAYS,
  HOSTEL_FACILITIES,
  HOSTEL_FEE_BREAKDOWN,
  TOTAL_HOSTEL_FEE,
  EMERGENCY_CONTACTS
} from '../data/hostelData';
import { sound } from '../audio/soundSystem';
import confetti from 'canvas-confetti';

export class ParentDashboard {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render() {
    const state = store.getState();
    const activeTab = state.parentTab;
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysMenu = WEEKLY_MESS_MENU.find(m => m.day === todayName) || WEEKLY_MESS_MENU[0];

    this.container.innerHTML = `
      <div class="parent-dashboard-layout">
        <!-- TOP REASSURANCE BANNER -->
        <header class="parent-top-banner">
          <div class="parent-welcome">
            <span class="parent-cottage-icon">🏡</span>
            <div>
              <h2>Parent Care & Safety Gateway</h2>
              <p>MS Ramaiah Institute of Technology • Freshers Block Warden Desk</p>
            </div>
          </div>

          <div class="parent-guardian-tag">
            <span>Guardian: <strong>Mr. & Mrs. Sharma</strong> (Aarav's Parents)</span>
            <span class="verified-badge">✓ Verified Mobile: +91 98451 22334</span>
          </div>
        </header>

        <!-- LARGE HERO "CHILD STATUS" CARD (Core Prompt Requirement) -->
        <div class="child-status-hero-card">
          <div class="child-status-top-bar">
            <span class="status-card-badge">LIVE BIOMETRIC TELEMETRY</span>
            <span class="status-timestamp">Synchronized: Today at 8:42 AM</span>
          </div>

          <div class="child-status-grid">
            <div class="status-col student-identity">
              <span class="field-label">STUDENT</span>
              <div class="field-value highlight">${state.student.name}</div>
              <span class="field-sub">USN: ${state.student.usn} • 1st Sem CSE</span>
            </div>

            <div class="status-col student-attendance">
              <span class="field-label">ATTENDANCE</span>
              <div class="field-value attendance-val">${state.student.attendancePercent}%</div>
              <div class="xp-mini-track">
                <div class="xp-mini-fill" style="width: ${state.student.attendancePercent}%;"></div>
              </div>
              <span class="field-sub green-sub">✓ Above Mandatory 75% Safe Zone</span>
            </div>

            <div class="status-col student-hostel">
              <span class="field-label">HOSTEL</span>
              <div class="field-value">${state.student.block}</div>
              <span class="field-sub">Room <strong>${state.student.room}</strong> (Wing B, 2nd Floor)</span>
            </div>

            <div class="status-col student-safety">
              <span class="field-label">STATUS</span>
              <div class="field-value checkin-pill">
                <span class="check-circle">✓</span> Checked In
              </div>
              <span class="field-sub">Inside Hostel before 10:00 PM Curfew</span>
            </div>

            <div class="status-col student-mess">
              <span class="field-label">MESS</span>
              <div class="field-value mess-pill">Today's Menu Available</div>
              <span class="field-sub">100% Nutritious Pure Vegetarian</span>
            </div>
          </div>
        </div>

        <!-- PARENT TAB NAVIGATION STRIP -->
        <div class="parent-tabs-strip">
          <button class="parent-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-ptab="overview">
            📊 Overall Summary
          </button>
          <button class="parent-tab-btn ${activeTab === 'attendance' ? 'active' : ''}" data-ptab="attendance">
            ⚡ Detailed Attendance
          </button>
          <button class="parent-tab-btn ${activeTab === 'mess' ? 'active' : ''}" data-ptab="mess">
            🍲 Daily Diet & Mess
          </button>
          <button class="parent-tab-btn ${activeTab === 'notices' ? 'active' : ''}" data-ptab="notices">
            📢 Warden Circulars (${state.announcements.length})
          </button>
          <button class="parent-tab-btn ${activeTab === 'holidays' ? 'active' : ''}" data-ptab="holidays">
            📅 Upcoming Holidays
          </button>
          <button class="parent-tab-btn ${activeTab === 'outpass' ? 'active' : ''}" data-ptab="outpass">
            🎫 Weekend Leave / Outpass
          </button>
          <button class="parent-tab-btn ${activeTab === 'facilities' ? 'active' : ''}" data-ptab="facilities">
            🚿 Facilities & Curfew
          </button>
          <button class="parent-tab-btn ${activeTab === 'fees' ? 'active' : ''}" data-ptab="fees">
            💎 Fee Receipt (₹1,07,000)
          </button>
        </div>

        <!-- PARENT MAIN TAB CONTENT -->
        <div class="parent-tab-content">
          ${this.renderParentTabContent(activeTab, todaysMenu)}
        </div>

        <!-- MODAL POPUPS -->
        <div id="parent-modal-container"></div>
      </div>
    `;

    this.bindEvents();
  }

  private renderParentTabContent(tab: ParentTab, todaysMenu: any): string {
    const state = store.getState();

    switch (tab) {
      case 'overview':
        return `
          <div class="parent-overview-grid">
            <!-- REASSURANCE SUMMARY CARD -->
            <div class="parent-card reassurance-box">
              <div class="card-icon-header">
                <span class="reassurance-icon">🛡️</span>
                <div>
                  <h3>How is Aarav Doing at Freshers Block?</h3>
                  <p>Comprehensive health, security, and academic engagement indicator</p>
                </div>
              </div>
              <div class="reassurance-points">
                <div class="point-item">
                  <span class="point-icon green">✓</span>
                  <div>
                    <strong>Biometric Check-in Confirmed:</strong>
                    <p>Scanned into Freshers Block turnstiles at ${state.student.lastMarkedTime}.</p>
                  </div>
                </div>
                <div class="point-item">
                  <span class="point-icon green">✓</span>
                  <div>
                    <strong>Attendance Zone: Excellent (${state.student.attendancePercent}%):</strong>
                    <p>Eligible for semester examinations with zero attendance warnings.</p>
                  </div>
                </div>
                <div class="point-item">
                  <span class="point-icon green">✓</span>
                  <div>
                    <strong>Curfew & Room Safety:</strong>
                    <p>Hostel gates lock at 10:00 PM. CCTV surveillance active 24/7 across corridors.</p>
                  </div>
                </div>
                <div class="point-item">
                  <span class="point-icon green">✓</span>
                  <div>
                    <strong>Balanced Diet Consumed:</strong>
                    <p>4 healthy vegetarian meals prepared daily by student committee caterers.</p>
                  </div>
                </div>
              </div>

              <!-- SEND CARE MESSAGE & SNACK POCKET MONEY -->
              <div class="send-care-package-strip">
                <h4>💌 Send a Heartwarming Message to Aarav's Portal</h4>
                <form id="form-parent-care-msg" class="care-msg-form">
                  <input 
                    type="text" 
                    id="parent-care-input" 
                    class="mc-input" 
                    placeholder="e.g. Beta Aarav, eat your fruits and study well! We are proud of you." 
                    required 
                  />
                  <div class="care-pocket-money-row">
                    <label>Add Canteen Pocket Money:</label>
                    <select id="parent-pocket-money" class="mc-select-inline">
                      <option value="0">No funds (Message only)</option>
                      <option value="500">+ ₹500 (Snacks & Juice)</option>
                      <option value="1000">+ ₹1,000 (Study Books & Stationery)</option>
                      <option value="2000">+ ₹2,000 (Semester Emergency Cash)</option>
                    </select>
                    <button type="submit" class="mc-btn mc-btn-gold">
                      <span>SEND TO AARAV</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- EMERGENCY CONTACT DIRECTORY -->
            <div class="parent-card emergency-desk-card">
              <div class="card-icon-header">
                <span class="reassurance-icon">📞</span>
                <div>
                  <h3>Direct Warden & Emergency Helpline</h3>
                  <p>24/7 access to hostel authorities and medical care</p>
                </div>
              </div>
              <div class="emergency-list">
                ${EMERGENCY_CONTACTS.map(contact => `
                  <div class="contact-entry">
                    <div class="contact-role">${contact.role}</div>
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-phone">
                      <a href="tel:${contact.phone}">${contact.phone}</a>
                    </div>
                    <div class="contact-loc">📍 ${contact.location}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

      case 'attendance':
        return `
          <div class="parent-card">
            <h3>Aarav's Comprehensive Attendance Records</h3>
            <p>Monitored via RFID turnstiles and class biometric readers</p>
            <div class="parent-attendance-stats">
              <div class="p-att-stat-box">
                <span class="p-stat-num">92%</span>
                <span class="p-stat-label">Overall Attendance</span>
              </div>
              <div class="p-att-stat-box">
                <span class="p-stat-num">142 / 154</span>
                <span class="p-stat-label">Classes Attended</span>
              </div>
              <div class="p-att-stat-box">
                <span class="p-stat-num">0</span>
                <span class="p-stat-label">Curfew Violations</span>
              </div>
            </div>

            <table class="parent-table">
              <thead>
                <tr>
                  <th>Course / Subject</th>
                  <th>Faculty</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Structures & Algorithms (CSE-101)</td>
                  <td>Dr. Annapurna K</td>
                  <td><strong>95%</strong> (38/40)</td>
                  <td><span class="badge-green">EXCELLENT</span></td>
                </tr>
                <tr>
                  <td>Engineering Mathematics I (MAT-101)</td>
                  <td>Prof. K. R. Sharma</td>
                  <td><strong>92%</strong> (35/38)</td>
                  <td><span class="badge-green">SAFE</span></td>
                </tr>
                <tr>
                  <td>Applied Physics (PHY-101)</td>
                  <td>Dr. Suresh Babu</td>
                  <td><strong>88%</strong> (30/34)</td>
                  <td><span class="badge-green">SAFE</span></td>
                </tr>
                <tr>
                  <td>Digital Logic & Computer Design (CSE-102)</td>
                  <td>Prof. Geetha V</td>
                  <td><strong>96%</strong> (24/25)</td>
                  <td><span class="badge-green">EXCELLENT</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;

      case 'mess':
        return `
          <div class="parent-card">
            <div class="mess-parent-header">
              <div>
                <h3>What is Aarav Eating Today? (${todaysMenu.day})</h3>
                <p>Nutritious vegetarian meals served in Freshers Block Dining Hall</p>
              </div>
              <span class="badge-gold">100% PURE VEGETARIAN</span>
            </div>

            <div class="parent-meals-row">
              <div class="parent-meal-box">
                <span class="pm-icon">🍳</span>
                <h4>BREAKFAST (7:30 – 9:30 AM)</h4>
                <p>${todaysMenu.meals.breakfast.items.join(', ')}</p>
                <small>Beverage: ${todaysMenu.meals.breakfast.beverage}</small>
              </div>
              <div class="parent-meal-box">
                <span class="pm-icon">🍛</span>
                <h4>LUNCH (12:00 – 2:15 PM)</h4>
                <p>${todaysMenu.meals.lunch.items.join(', ')}</p>
                ${todaysMenu.meals.lunch.dessert ? `<small>Sweet: ${todaysMenu.meals.lunch.dessert}</small>` : ''}
              </div>
              <div class="parent-meal-box">
                <span class="pm-icon">🍪</span>
                <h4>SNACKS (4:30 – 5:30 PM)</h4>
                <p>${todaysMenu.meals.snacks.items.join(', ')}</p>
                <small>Beverage: ${todaysMenu.meals.snacks.beverage}</small>
              </div>
              <div class="parent-meal-box">
                <span class="pm-icon">🍽️</span>
                <h4>DINNER (7:30 – 9:30 PM)</h4>
                <p>${todaysMenu.meals.dinner.items.join(', ')}</p>
                <small>Sweet: ${todaysMenu.meals.dinner.dessert}</small>
              </div>
            </div>

            <div class="mess-reassurance-note">
              <p>💡 <em>Note: Fresh rotis, steamed rice, sambar, curd, papad, and fresh salad are served unlimited with every lunch and dinner. Purified RO drinking water is provided on every floor.</em></p>
            </div>
          </div>
        `;

      case 'notices':
        return `
          <div class="parent-card">
            <h3>Official Hostel Notices & Warden Circulars</h3>
            <p>Updates published directly by Chief Warden & Caretaker Office</p>
            <div class="parent-notices-feed">
              ${state.announcements.map(notice => `
                <div class="notice-card ${notice.urgent ? 'urgent-notice' : ''}">
                  <div class="notice-top">
                    <span class="notice-badge">${notice.category}</span>
                    <span class="notice-date">${notice.date}</span>
                  </div>
                  <h4 class="notice-title">${notice.title}</h4>
                  <p class="notice-content">${notice.content}</p>
                  <span class="notice-author">Issued by: ${notice.author}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'holidays':
        return `
          <div class="parent-card">
            <h3>2026 Academic Holidays (Plan Aarav's Visits Home)</h3>
            <p>Official 24 Karnataka & National Holidays for booking bus / train tickets</p>
            <div class="holidays-table-wrap">
              <table class="parent-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Holiday Name</th>
                    <th>Day</th>
                    <th>Festive Mess Sweet</th>
                  </tr>
                </thead>
                <tbody>
                  ${OFFICIAL_2026_HOLIDAYS.map(h => `
                    <tr>
                      <td><strong>${h.date}</strong></td>
                      <td>${h.name}</td>
                      <td>${h.dayOfWeek}</td>
                      <td>🍬 ${h.sweetServed}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      case 'outpass':
        return `
          <div class="parent-card">
            <h3>Weekend Home Leave / Outpass Application</h3>
            <p>Parents can apply directly for digital permission. Passes are instantly verified with gate security.</p>
            
            <form id="form-parent-outpass" class="outpass-form">
              <div class="form-row-2">
                <div class="form-group">
                  <label>Departure Date from Hostel:</label>
                  <input type="date" id="outpass-depart" class="mc-input" required />
                </div>
                <div class="form-group">
                  <label>Return Date to Hostel:</label>
                  <input type="date" id="outpass-return" class="mc-input" required />
                </div>
              </div>

              <div class="form-group">
                <label>Destination & Travel Details:</label>
                <input type="text" id="outpass-dest" class="mc-input" placeholder="e.g. Home, Indiranagar, Bangalore (Traveling with Father)" required />
              </div>

              <div class="form-group">
                <label>Reason for Leave:</label>
                <input type="text" id="outpass-reason" class="mc-input" placeholder="e.g. Family festival & grandparent anniversary" required />
              </div>

              <button type="submit" class="mc-btn mc-btn-gold">
                <span>🎫 GENERATE DIGITAL GATE PASS</span>
              </button>
            </form>

            <h4 style="margin-top: 2rem;">Recent Gate Outpasses:</h4>
            <div class="outpass-list">
              ${state.outpasses.map(op => `
                <div class="outpass-card">
                  <div class="op-header">
                    <span class="op-code">PASS CODE: <strong>${op.gatePassCode}</strong></span>
                    <span class="badge-green">${op.status}</span>
                  </div>
                  <div class="op-details">
                    <span><strong>Destination:</strong> ${op.destination}</span>
                    <span><strong>Duration:</strong> ${op.departDate} to ${op.returnDate}</span>
                    <span><strong>Reason:</strong> ${op.reason}</span>
                    <span><strong>Approved By:</strong> ${op.approvedBy}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'facilities':
        return `
          <div class="parent-card">
            <h3>Hostel Facilities, Water Schedule & Curfew Rules</h3>
            <div class="parent-facilities-grid">
              ${HOSTEL_FACILITIES.map(f => `
                <div class="p-fac-card">
                  <span class="p-fac-icon">${f.icon}</span>
                  <h4>${f.name}</h4>
                  <p class="p-fac-loc">📍 ${f.location}</p>
                  <p class="p-fac-hrs">⏰ ${f.hours}</p>
                  <p>${f.description}</p>
                </div>
              `).join('')}
            </div>

            <div class="curfew-rules-reassurance">
              <h4>🌙 Night In-Time Policy:</h4>
              <p>Hostel gates lock strictly at <strong>10:00 PM</strong>. Any student delayed due to lab submissions or campus projects must have verified approval from their department head. Morning gates open at <strong>6:00 AM</strong>.</p>
            </div>
          </div>
        `;

      case 'fees':
        return `
          <div class="parent-card">
            <div class="fee-receipt-head">
              <div>
                <h3>Hostel Fee Structure & Payment Confirmation</h3>
                <p>Academic Year 2026–2027 • Total Amount: <strong>₹1,07,000</strong></p>
              </div>
              <div class="paid-badge-large">✓ 100% PAID IN FULL</div>
            </div>

            <table class="parent-table">
              <thead>
                <tr>
                  <th>Fee Component</th>
                  <th>Amount</th>
                  <th>Coverage & Inclusions</th>
                </tr>
              </thead>
              <tbody>
                ${HOSTEL_FEE_BREAKDOWN.map(f => `
                  <tr>
                    <td><strong>${f.category}</strong></td>
                    <td>₹${f.amount.toLocaleString('en-IN')}</td>
                    <td>${f.description}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td><strong>TOTAL ANNUAL HOSTEL EXPENSE</strong></td>
                  <td><strong>₹${TOTAL_HOSTEL_FEE.toLocaleString('en-IN')}</strong></td>
                  <td><strong>Zero Outstanding Balance</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;

      default:
        return `<div class="parent-card"><p>Select a tab above to view details.</p></div>`;
    }
  }

  private bindEvents() {
    // Tab switching
    const tabBtns = this.container.querySelectorAll('.parent-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const tab = (btn as HTMLElement).dataset.ptab as ParentTab;
        if (tab) {
          store.setParentTab(tab);
          this.render();
        }
      });
    });

    // Send Care Message & Pocket Money
    const careForm = document.getElementById('form-parent-care-msg');
    if (careForm) {
      careForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playChest();
        const msgEl = document.getElementById('parent-care-input') as HTMLInputElement;
        const moneyEl = document.getElementById('parent-pocket-money') as HTMLSelectElement;
        if (msgEl && msgEl.value.trim()) {
          const money = parseInt(moneyEl.value, 10) || 0;
          store.sendParentMessage(msgEl.value.trim(), money);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#10b981', '#3b82f6']
          });
          alert(`💌 Message sent to Aarav's Portal!${money > 0 ? ` ₹${money} pocket money credited.` : ''}`);
          this.render();
        }
      });
    }

    // Submit Outpass
    const outpassForm = document.getElementById('form-parent-outpass');
    if (outpassForm) {
      outpassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playPressurePlate();
        const dest = (document.getElementById('outpass-dest') as HTMLInputElement)?.value;
        const reason = (document.getElementById('outpass-reason') as HTMLInputElement)?.value;
        const dep = (document.getElementById('outpass-depart') as HTMLInputElement)?.value;
        const ret = (document.getElementById('outpass-return') as HTMLInputElement)?.value;

        if (dest && reason && dep && ret) {
          store.requestOutpass(dest, reason, dep, ret);
          alert('🎫 Digital Gate Pass Generated!\nSMS confirmation sent to Warden and Security Gate turnstile.');
          this.render();
        }
      });
    }
  }
}
