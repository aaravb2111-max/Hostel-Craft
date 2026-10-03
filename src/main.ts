import './style.css';
import { store } from './data/stateStore';
import { PortalTransitionOverlay } from './ui/portalOverlay';
import { GlobalHeader } from './ui/globalHeader';
import { LandingPage } from './ui/landingPage';
import { StudentDashboard } from './ui/studentDashboard';
import { ParentDashboard } from './ui/parentDashboard';
import { AdminDashboard } from './ui/adminDashboard';
import { SceneManager } from './engine/sceneManager';
import { sound } from './audio/soundSystem';

// Grab DOM mounts
const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
const canvasContainer = document.getElementById('canvas-container') as HTMLElement;
const headerMount = document.getElementById('global-header-mount') as HTMLElement;
const viewMount = document.getElementById('view-mount') as HTMLElement;

if (!canvas || !headerMount || !viewMount) {
  throw new Error('Hostel Craft root DOM elements not found!');
}

// 1. Initialize 3D WebGL Scene
let sceneManager: SceneManager | null = null;
try {
  sceneManager = new SceneManager(canvas);
  sceneManager.start();
  // Set day/night mode according to initial state
  sceneManager.setNightMode(store.getState().dayNight === 'night');
} catch (e) {
  console.warn('3D Scene initialization skipped or unsupported', e);
}

// 2. Initialize Portal Overlay & Global Header
const portalOverlay = new PortalTransitionOverlay();
const globalHeader = new GlobalHeader(headerMount, portalOverlay);

// 3. Initialize View Controllers
const landingPage = new LandingPage(viewMount, portalOverlay);
const studentDashboard = new StudentDashboard(viewMount);
const parentDashboard = new ParentDashboard(viewMount);
const adminDashboard = new AdminDashboard(viewMount);

// 4. View Render Dispatcher
function renderCurrentView() {
  const state = store.getState();
  const view = state.currentView;

  // Update canvas container styling depending on active view & student tab
  if (canvasContainer) {
    if (view === 'student' && state.studentTab === 'room3d') {
      canvasContainer.style.opacity = '1';
      canvasContainer.style.pointerEvents = 'auto';
      canvasContainer.style.zIndex = '5';
      if (sceneManager) {
        sceneManager.cameraMode = 'free';
      }
    } else {
      // Keep canvas subtle in background or hidden
      canvasContainer.style.opacity = view === 'landing' ? '0.35' : '0.15';
      canvasContainer.style.pointerEvents = 'none';
      canvasContainer.style.zIndex = '1';
    }
  }

  // Update 3D scene lighting when day/night changes
  if (sceneManager) {
    sceneManager.setNightMode(state.dayNight === 'night');
  }

  // Render appropriate view controller
  switch (view) {
    case 'landing':
      landingPage.render();
      break;
    case 'student':
      studentDashboard.render();
      break;
    case 'parent':
      parentDashboard.render();
      break;
    case 'admin':
      adminDashboard.render();
      break;
    default:
      landingPage.render();
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// 5. Connect 3D Raycasting to Audio & Feedback (for 3D Room view)
if (sceneManager) {
  sceneManager.onObjectClicked = (interactId: string, name: string) => {
    sound.playClick();
    if (interactId === 'kettle') {
      sound.playMaggiSizzle();
      sceneManager!.particles.spawnSteam(sceneManager!.roomBuilder.kettleSteamSource);
      alert('🫖 Contraband Electric Kettle:\nHeating water at 2:00 AM! Aroma of 2-minute Maggi fills Room 204.');
    } else if (interactId === 'fan') {
      const spd = sceneManager!.roomBuilder.toggleFanSpeed();
      alert(`🌀 Ceiling Fan speed toggled to: ${spd}`);
    } else if (interactId === 'tubelight') {
      const on = sceneManager!.roomBuilder.toggleTubeLight();
      alert(`💡 Fluorescent Tube Light switched ${on ? 'ON' : 'OFF'}.`);
    } else {
      alert(`🧱 Clicked on: ${name}`);
    }
  };
}

// 6. Subscribe to State Store
store.subscribe(() => {
  globalHeader.render();
  renderCurrentView();
});

// 7. Initial Mount
globalHeader.render();
renderCurrentView();

console.log('✅ HOSTEL CRAFT Initialized Successfully! Welcome to Freshers Block, MSRIT Bangalore.');
