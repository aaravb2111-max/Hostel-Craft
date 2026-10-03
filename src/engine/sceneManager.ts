import * as THREE from 'three';
import { RoomBuilder } from './roomBuilder';
import { VoxelParticleSystem } from './particles';

export type CameraMode = 'story' | 'free';

export class SceneManager {
  public canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public roomBuilder: RoomBuilder;
  public particles: VoxelParticleSystem;

  // Camera animation & controls
  public cameraMode: CameraMode = 'story';
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3(12, 10, 14);
  private targetLookAt: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);

  // Free Orbit Mouse Tracking
  private isPointerDown: boolean = false;
  private pointerStartX: number = 0;
  private pointerStartY: number = 0;
  private orbitTheta: number = Math.PI / 4; // Horizontal angle
  private orbitPhi: number = Math.PI / 5;   // Vertical elevation
  private orbitRadius: number = 18;

  // Lighting & Day/Night
  public sunLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public isNightMode: boolean = false;

  // Raycasting
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer: THREE.Vector2 = new THREE.Vector2(-10, -10);
  private hoveredMesh: THREE.Mesh | null = null;
  public onObjectClicked?: (id: string, name: string) => void;
  public onObjectHovered?: (id: string | null) => void;

  private clock: THREE.Clock = new THREE.Clock();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Scene & Fog (Minecraft aesthetic sky)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdcebf5);
    this.scene.fog = new THREE.FogExp2(0xdcebf5, 0.015);

    // 3. Camera (Isometric field of view)
    this.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(13, 11, 15);
    this.camera.lookAt(this.targetLookAt);

    // 4. Lights
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xb0b8c0, 0.65);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.4);
    this.sunLight.position.set(12, 16, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 40;
    this.sunLight.shadow.camera.left = -10;
    this.sunLight.shadow.camera.right = 10;
    this.sunLight.shadow.camera.top = 10;
    this.sunLight.shadow.camera.bottom = -10;
    this.scene.add(this.sunLight);

    // 5. Particles & Room Builder
    this.particles = new VoxelParticleSystem(this.scene);
    this.roomBuilder = new RoomBuilder(this.scene, this.particles);

    // Initial setup
    this.roomBuilder.updateScroll(0);

    // Event listeners
    this.initEvents();
  }

  private initEvents() {
    window.addEventListener('resize', this.onResize.bind(this));

    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: true });
    this.canvas.addEventListener('click', this.onClick.bind(this));
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerDown(e: PointerEvent) {
    if (this.cameraMode === 'free') {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
    }
  }

  private onPointerMove(e: PointerEvent) {
    // Normalise mouse coords for raycasting
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.cameraMode === 'free' && this.isPointerDown) {
      const deltaX = e.clientX - this.pointerStartX;
      const deltaY = e.clientY - this.pointerStartY;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;

      this.orbitTheta -= deltaX * 0.007;
      this.orbitPhi = Math.max(0.1, Math.min(Math.PI / 2.2, this.orbitPhi + deltaY * 0.007));
    }
  }

  private onPointerUp() {
    this.isPointerDown = false;
  }

  private onWheel(e: WheelEvent) {
    if (this.cameraMode === 'free') {
      this.orbitRadius = Math.max(8, Math.min(26, this.orbitRadius + e.deltaY * 0.015));
    } else {
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  }

  private onClick() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.roomBuilder.interactiveMeshes, false);

    if (intersects.length > 0) {
      const target = intersects[0].object as THREE.Mesh;
      if (target.userData.interactId) {
        this.onObjectClicked?.(target.userData.interactId, target.userData.name);
      }
    }
  }

  /**
   * Sets Day vs 2:00 AM Night session lighting
   */
  public setNightMode(isNight: boolean) {
    this.isNightMode = isNight;
    if (isNight) {
      // 2:00 AM Night Cramming Atmosphere
      this.scene.background = new THREE.Color(0x0a0c18);
      this.scene.fog = new THREE.FogExp2(0x0a0c18, 0.02);
      this.sunLight.intensity = 0.15;
      this.sunLight.color.setHex(0x3d5a80);
      this.hemiLight.intensity = 0.25;
      this.hemiLight.color.setHex(0x1d3557);
      if (this.roomBuilder.tubeLight && this.roomBuilder.isTubeLightOn) {
        this.roomBuilder.tubeLight.intensity = 1.6;
      }
    } else {
      // Bright campus sunshine
      this.scene.background = new THREE.Color(0xdcebf5);
      this.scene.fog = new THREE.FogExp2(0xdcebf5, 0.015);
      this.sunLight.intensity = 1.4;
      this.sunLight.color.setHex(0xfff6e5);
      this.hemiLight.intensity = 0.65;
      this.hemiLight.color.setHex(0xffffff);
      if (this.roomBuilder.tubeLight && this.roomBuilder.isTubeLightOn) {
        this.roomBuilder.tubeLight.intensity = 1.0;
      }
    }
  }

  /**
   * Focuses camera smoothly onto a target object (e.g. from hotbar selection)
   */
  public focusOnObject(objId: string) {
    const targetObj = this.roomBuilder.voxelObjects.find(o => o.id === objId || o.interactId === objId);
    if (!targetObj) return;

    const pos = targetObj.group.position;
    this.targetLookAt.set(pos.x, pos.y + 0.8, pos.z);

    if (this.cameraMode === 'free') {
      this.orbitRadius = 12;
    }
  }

  /**
   * Updates camera based on scroll progress (0 to 1)
   */
  public updateScroll(progress: number) {
    this.roomBuilder.updateScroll(progress);

    if (this.cameraMode === 'story') {
      if (progress < 0.50) {
        // STAGE 1: Room 204 Construction (0.00 to 0.50)
        const roomT = progress / 0.50;
        const angle = 0.7 + roomT * 0.8;
        const radius = 16 - Math.sin(roomT * Math.PI) * 2.5;
        const height = 10 + Math.sin(roomT * Math.PI) * 2.0;

        this.targetCameraPos.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );

        if (roomT < 0.4) {
          this.targetLookAt.set(0, 1.2, 0);
        } else if (roomT < 0.7) {
          this.targetLookAt.set(-1.0, 1.8, 1.0);
        } else {
          this.targetLookAt.set(0, 2.4, 0);
        }

        if (this.isNightMode) this.setNightMode(false);
      } else {
        // STAGE 2: The Great Indian Hostel Mess Hall (0.50 to 1.00)
        const messT = (progress - 0.50) / 0.50;
        const angle = 0.8 + messT * 0.7;
        const radius = 18 - Math.sin(messT * Math.PI) * 2.0;
        const height = 12 + Math.sin(messT * Math.PI) * 2.0;

        // Glides camera down corridor into Mess Hall centered at Z = 22.5
        const camZCenter = 22.5;
        this.targetCameraPos.set(
          Math.cos(angle) * radius,
          height,
          camZCenter + Math.sin(angle) * radius
        );

        if (messT < 0.3) {
          // Corridor entry & banner
          this.targetLookAt.set(0, 2.4, 16.0);
        } else if (messT < 0.7) {
          // Focus dining tables & steel thalis
          this.targetLookAt.set(0, 1.8, 22.5);
        } else {
          // Focus giant dal cauldrons & Sunday Paneer sign
          this.targetLookAt.set(0, 2.6, 26.5);
        }

        // Evening 8:00 PM Mess dinner lighting
        if (messT > 0.3 && !this.isNightMode) {
          this.setNightMode(true);
        }
      }
    }
  }

  /**
   * Main animation loop
   */
  public start() {
    const renderLoop = () => {
      requestAnimationFrame(renderLoop);
      const delta = Math.min(this.clock.getDelta(), 0.1);

      // 1. Update room dynamic items & particles
      this.roomBuilder.update(delta);
      this.particles.update(delta);

      // 2. Camera interpolation
      if (this.cameraMode === 'story') {
        this.camera.position.lerp(this.targetCameraPos, delta * 3.5);
        this.currentLookAt.lerp(this.targetLookAt, delta * 4.0);
        this.camera.lookAt(this.currentLookAt);
      } else {
        // Free Orbit Mode
        const x = this.orbitRadius * Math.sin(this.orbitPhi) * Math.sin(this.orbitTheta);
        const y = this.orbitRadius * Math.cos(this.orbitPhi);
        const z = this.orbitRadius * Math.sin(this.orbitPhi) * Math.cos(this.orbitTheta);
        this.targetCameraPos.set(x, y, z);

        this.camera.position.lerp(this.targetCameraPos, delta * 8.0);
        this.currentLookAt.lerp(this.targetLookAt, delta * 6.0);
        this.camera.lookAt(this.currentLookAt);
      }

      // 3. Raycast cursor hover detection
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.roomBuilder.interactiveMeshes, false);

      if (intersects.length > 0) {
        const top = intersects[0].object as THREE.Mesh;
        if (this.hoveredMesh !== top) {
          this.hoveredMesh = top;
          this.canvas.style.cursor = 'pointer';
          this.onObjectHovered?.(top.userData.interactId || null);
        }
      } else {
        if (this.hoveredMesh !== null) {
          this.hoveredMesh = null;
          this.canvas.style.cursor = 'default';
          this.onObjectHovered?.(null);
        }
      }

      this.renderer.render(this.scene, this.camera);
    };

    renderLoop();
  }
}
