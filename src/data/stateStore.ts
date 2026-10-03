import {
  DEFAULT_NOTICES,
  DEFAULT_STUDENTS,
  type HostelNotice,
  type StudentRecord,
  type ComplaintTicket
} from './hostelData';

export type AppView = 'landing' | 'student' | 'parent' | 'admin';
export type StudentTab = 'profile' | 'attendance' | 'mess' | 'facilities' | 'fees' | 'rules' | 'complaints' | 'holidays' | 'room3d';
export type ParentTab = 'overview' | 'attendance' | 'mess' | 'facilities' | 'fees' | 'notices' | 'holidays' | 'outpass';
export type AdminTab = 'control' | 'attendance' | 'notices' | 'mess' | 'facilities' | 'terminal';

export interface ParentMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  snackPocketMoney?: number;
}

export interface OutpassRequest {
  id: string;
  studentName: string;
  usn: string;
  destination: string;
  reason: string;
  departDate: string;
  returnDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  approvedBy: string;
  gatePassCode: string;
}

export interface AppState {
  currentView: AppView;
  studentTab: StudentTab;
  parentTab: ParentTab;
  adminTab: AdminTab;
  dayNight: 'day' | 'night';
  gateCurfewActive: boolean; // True if locked at 10 PM
  soundMuted: boolean;
  
  // Student Profile State
  student: {
    name: string;
    usn: string;
    room: string;
    wing: string;
    block: string;
    college: string;
    branch: string;
    level: number;
    attendancePercent: number;
    todayMarked: boolean;
    lastMarkedTime: string;
    laundryTokensLeft: number;
    totalTokens: number;
    roomCleaningRequested: boolean;
    maggiBowlsEaten: number;
    activeTitle: string;
  };

  // Dynamic Lists
  announcements: HostelNotice[];
  complaints: ComplaintTicket[];
  studentsRoster: StudentRecord[];
  parentMessages: ParentMessage[];
  outpasses: OutpassRequest[];
}

const STORAGE_KEY = 'hostel_craft_state_v1';

const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'c-101',
    studentName: 'Aarav Sharma',
    room: '204',
    category: 'Plumbing',
    description: 'Hot water tap pressure in 2nd Floor Wing B washroom cubicle 3 is slightly low.',
    status: 'In Progress',
    timestamp: 'Yesterday, 4:15 PM',
    adminRemark: 'Plumber inspected; solar valve replacement scheduled for 3 PM.'
  },
  {
    id: 'c-102',
    studentName: 'Rohan Nambiar',
    room: '204',
    category: 'WiFi / Network',
    description: 'B-Wing corridor router speed dropped to 20 Mbps around 11 PM.',
    status: 'Resolved',
    timestamp: '28 Sep 2026',
    adminRemark: 'Cisco access point rebooted. Bandwidth restored to 100 Mbps.'
  }
];

const INITIAL_PARENT_MESSAGES: ParentMessage[] = [
  {
    id: 'pm-1',
    sender: 'Mummy & Papa',
    text: 'Aarav beta, take warm water in the morning. Focus well on Physics internals! We sent ₹1,500 snack money for canteen.',
    timestamp: 'Yesterday, 8:15 PM',
    snackPocketMoney: 1500
  }
];

const INITIAL_OUTPASSES: OutpassRequest[] = [
  {
    id: 'op-1',
    studentName: 'Aarav Sharma',
    usn: '1MS26CS042',
    destination: 'Home (Indiranagar, Bangalore)',
    reason: 'Family festival celebration for Ayudha Pooja',
    departDate: '19.10.2026',
    returnDate: '22.10.2026',
    status: 'Approved',
    approvedBy: 'Prof. Ramesh N (Warden)',
    gatePassCode: 'PASS-MSRIT-9812'
  }
];

class StateStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentView: parsed.currentView || 'landing'
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }

    return {
      currentView: 'landing',
      studentTab: 'profile',
      parentTab: 'overview',
      adminTab: 'control',
      dayNight: 'day',
      gateCurfewActive: false, // In daylight, gates open (6 AM - 10 PM)
      soundMuted: false,
      student: {
        name: 'Aarav Sharma',
        usn: '1MS26CS042',
        room: '204',
        wing: 'B',
        block: 'Freshers Block',
        college: 'MS Ramaiah Institute of Technology',
        branch: 'Computer Science & Engineering',
        level: 92,
        attendancePercent: 92,
        todayMarked: false,
        lastMarkedTime: 'Yesterday, 8:42 AM',
        laundryTokensLeft: 3,
        totalTokens: 4,
        roomCleaningRequested: false,
        maggiBowlsEaten: 42,
        activeTitle: 'Freshers Block Survivor'
      },
      announcements: [...DEFAULT_NOTICES],
      complaints: [...INITIAL_COMPLAINTS],
      studentsRoster: [...DEFAULT_STUDENTS],
      parentMessages: [...INITIAL_PARENT_MESSAGES],
      outpasses: [...INITIAL_OUTPASSES]
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist state', e);
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.persist();
    this.listeners.forEach(fn => fn());
  }

  // --- ACTIONS ---

  public setView(view: AppView) {
    this.state.currentView = view;
    this.notify();
  }

  public setStudentTab(tab: StudentTab) {
    this.state.studentTab = tab;
    this.notify();
  }

  public setParentTab(tab: ParentTab) {
    this.state.parentTab = tab;
    this.notify();
  }

  public setAdminTab(tab: AdminTab) {
    this.state.adminTab = tab;
    this.notify();
  }

  public toggleDayNight() {
    const isDay = this.state.dayNight === 'day';
    this.state.dayNight = isDay ? 'night' : 'day';
    // If night, gate lock is active at 10 PM
    this.state.gateCurfewActive = !isDay;
    this.notify();
  }

  public setGateCurfew(locked: boolean) {
    this.state.gateCurfewActive = locked;
    this.notify();
  }

  public toggleSound(): boolean {
    this.state.soundMuted = !this.state.soundMuted;
    this.notify();
    return !this.state.soundMuted;
  }

  public markStudentAttendance(timeStr: string = 'Today, 8:42 AM') {
    this.state.student.todayMarked = true;
    this.state.student.lastMarkedTime = timeStr;
    // Boost level / XP!
    this.state.student.level = Math.min(100, this.state.student.level + 1);
    this.state.student.attendancePercent = 93;

    // Update in Admin Roster as well!
    const aaravInRoster = this.state.studentsRoster.find(s => s.id === 'std-1');
    if (aaravInRoster) {
      aaravInRoster.presentToday = true;
      aaravInRoster.lastCheckinTime = timeStr;
      aaravInRoster.attendancePercent = 93;
    }

    this.notify();
  }

  public addAnnouncement(title: string, category: HostelNotice['category'], content: string, target: 'All' | 'Students' | 'Parents', urgent: boolean = false) {
    const newNotice: HostelNotice = {
      id: 'n-' + Date.now(),
      title,
      category,
      content,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Warden Administration',
      urgent,
      target
    };
    this.state.announcements.unshift(newNotice);
    this.notify();
    return newNotice;
  }

  public addComplaint(category: ComplaintTicket['category'], description: string) {
    const newTicket: ComplaintTicket = {
      id: 'c-' + (this.state.complaints.length + 101),
      studentName: this.state.student.name,
      room: this.state.student.room,
      category,
      description,
      status: 'Pending',
      timestamp: 'Just now'
    };
    this.state.complaints.unshift(newTicket);
    this.notify();
    return newTicket;
  }

  public toggleStudentAttendance(studentId: string) {
    const std = this.state.studentsRoster.find(s => s.id === studentId);
    if (std) {
      std.presentToday = !std.presentToday;
      if (std.id === 'std-1') {
        this.state.student.todayMarked = std.presentToday;
        this.state.student.lastMarkedTime = std.presentToday ? 'Marked by Warden' : 'Marked Absent';
      }
      this.notify();
    }
  }

  public requestHousekeepingCleaning() {
    this.state.student.roomCleaningRequested = true;
    this.notify();
  }

  public useLaundryToken() {
    if (this.state.student.laundryTokensLeft > 0) {
      this.state.student.laundryTokensLeft -= 1;
      this.notify();
      return true;
    }
    return false;
  }

  public sendParentMessage(message: string, snackPocketMoney: number = 0) {
    const msg: ParentMessage = {
      id: 'pm-' + Date.now(),
      sender: 'Papa & Mummy',
      text: message,
      timestamp: 'Just now',
      snackPocketMoney: snackPocketMoney > 0 ? snackPocketMoney : undefined
    };
    this.state.parentMessages.unshift(msg);
    this.notify();
    return msg;
  }

  public requestOutpass(destination: string, reason: string, departDate: string, returnDate: string) {
    const op: OutpassRequest = {
      id: 'op-' + Date.now(),
      studentName: this.state.student.name,
      usn: this.state.student.usn,
      destination,
      reason,
      departDate,
      returnDate,
      status: 'Approved', // Auto approval for parent request prototype!
      approvedBy: 'Prof. Ramesh N (Verified with Parent)',
      gatePassCode: 'PASS-MSRIT-' + Math.floor(1000 + Math.random() * 9000)
    };
    this.state.outpasses.unshift(op);
    this.notify();
    return op;
  }

  public eatMessFood() {
    this.state.student.maggiBowlsEaten += 1;
    this.notify();
  }

  public resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadInitialState();
    this.notify();
  }
}

export const store = new StateStore();
