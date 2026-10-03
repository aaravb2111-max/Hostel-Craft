import * as THREE from 'three';
import { TextureGenerator } from './textureGenerator';
import { VoxelParticleSystem } from './particles';
import { sound } from '../audio/soundSystem';

export interface VoxelObject {
  id: string;
  name: string;
  group: THREE.Group;
  category: 'base' | 'furniture' | 'tech' | 'survival' | 'chaos' | 'mess';
  scrollStart: number;
  scrollEnd: number;
  targetY: number;
  dropOffset: number;
  isPlaced: boolean;
  interactiveMesh?: THREE.Mesh;
  interactId?: string;
}

export class RoomBuilder {
  public scene: THREE.Scene;
  public particles: VoxelParticleSystem;
  public voxelObjects: VoxelObject[] = [];
  public interactiveMeshes: THREE.Mesh[] = [];

  // Dynamic interactive elements
  public fanBladesGroup: THREE.Group | null = null;
  public fanSpeed: number = 2.0; // 0 to 4
  public tubeLight: THREE.PointLight | null = null;
  public tubeLightGlowMesh: THREE.Mesh | null = null;
  public isTubeLightOn: boolean = true;

  // Particle Sources
  public kettleSteamSource: THREE.Vector3 = new THREE.Vector3();
  public cauldronSteamSource: THREE.Vector3 = new THREE.Vector3(0, 2.3, 29);
  public isKettleBoiling: boolean = true;
  private steamTimer: number = 0;
  private fairyLightMaterials: THREE.MeshBasicMaterial[] = [];

  constructor(scene: THREE.Scene, particles: VoxelParticleSystem) {
    this.scene = scene;
    this.particles = particles;
    this.buildAllEnvironments();
  }

  private buildAllEnvironments() {
    // ------------------------------------
    // PHASE 1: ROOM 204 (Scroll: 0.00 - 0.50)
    // ------------------------------------
    this.buildFloor();
    this.buildWalls();
    this.buildIronCot();
    this.buildRoommateCot();
    this.buildStudyDesk();
    this.buildNeelkamalChair();
    this.buildGodrejAlmirah();
    this.buildMaggiKitchenStation();
    this.buildExtensionBoard();
    this.buildCeilingFan();
    this.buildTubeLight();
    this.buildBathroomCorner();
    this.buildPostersAndDecor();
    this.buildFairyLights();

    // ------------------------------------
    // PHASE 2: HOSTEL MESS HALL (Scroll: 0.50 - 1.00)
    // ------------------------------------
    this.buildMessHallFloor();
    this.buildMessPillars();
    this.buildMessDiningTables();
    this.buildMessThalis();
    this.buildServiceCounterAndCauldrons();
    this.buildWaterCoolerAndMenuBoard();
    this.buildMessRegisterAndSundaySpecial();
  }

  /**
   * Helper: Registers an assembly into the scroll drop-in system
   */
  private registerObject(
    id: string,
    name: string,
    group: THREE.Group,
    scrollStart: number,
    scrollEnd: number,
    category: 'base' | 'furniture' | 'tech' | 'survival' | 'chaos' | 'mess',
    interactiveMesh?: THREE.Mesh,
    interactId?: string,
    dropOffset: number = 6.0
  ): VoxelObject {
    this.scene.add(group);
    const targetY = group.position.y;
    group.position.y = targetY + dropOffset;
    group.visible = false;

    if (interactiveMesh && interactId) {
      interactiveMesh.userData = { interactId, name };
      this.interactiveMeshes.push(interactiveMesh);
    }

    const obj: VoxelObject = {
      id,
      name,
      group,
      category,
      scrollStart,
      scrollEnd,
      targetY,
      dropOffset,
      isPlaced: false,
      interactiveMesh,
      interactId
    };

    this.voxelObjects.push(obj);
    return obj;
  }

  // ==========================================
  // 1. FLOOR & CARPET (Scroll: 0.00 - 0.08)
  // ==========================================
  private buildFloor() {
    const floorGroup = new THREE.Group();
    const floorTex = TextureGenerator.getFloorTexture();
    floorTex.repeat.set(5, 5);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.8
    });

    const floorGeo = new THREE.BoxGeometry(10, 0.4, 10);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.2, 0);
    floorMesh.receiveShadow = true;
    floorGroup.add(floorMesh);

    // Welcome doormat (Room 204)
    const matGeo = new THREE.BoxGeometry(2.4, 0.08, 1.4);
    const matMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const matMesh = new THREE.Mesh(matGeo, matMat);
    matMesh.position.set(0, 0.04, 4.2);
    floorGroup.add(matMesh);

    this.registerObject('floor', 'Terrazzo Floor Tiles', floorGroup, 0.00, 0.08, 'base', undefined, undefined, 4.0);
  }

  // ==========================================
  // 2. WALLS & WINDOW (Scroll: 0.06 - 0.14)
  // ==========================================
  private buildWalls() {
    const wallGroup = new THREE.Group();
    const wallTex = TextureGenerator.getWallTexture();
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });

    // Back Wall (Z = -5)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 6.5, 0.4), wallMat);
    backWall.position.set(0, 3.25, -5.0);
    backWall.receiveShadow = true;
    wallGroup.add(backWall);

    // Left Wall (X = -5)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.5, 10), wallMat);
    leftWall.position.set(-5.0, 3.25, 0);
    leftWall.receiveShadow = true;
    wallGroup.add(leftWall);

    // Hostel Window (centered on back wall)
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 0.12), windowFrameMat);
    windowFrame.position.set(0.5, 3.8, -4.8);
    wallGroup.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 2.2, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 })
    );
    windowGlass.position.set(0.5, 3.8, -4.78);
    wallGroup.add(windowGlass);

    // Window Grill
    const barMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    for (let x = -0.8; x <= 1.8; x += 0.5) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 0.06), barMat);
      bar.position.set(x, 3.8, -4.72);
      wallGroup.add(bar);
    }
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.06), barMat);
    hBar.position.set(0.5, 3.8, -4.72);
    wallGroup.add(hBar);

    this.registerObject('walls', 'Hostel Brick Walls & Window', wallGroup, 0.06, 0.14, 'base', undefined, undefined, 5.0);
  }

  // ==========================================
  // 3. MAIN IRON COT (Scroll: 0.12 - 0.20)
  // ==========================================
  private buildIronCot() {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-3.1, 0, -2.0);

    const metalTex = TextureGenerator.getMetalBedTexture();
    const metalMat = new THREE.MeshStandardMaterial({ map: metalTex, roughness: 0.5, metalness: 0.6 });

    // Bed Frame Legs & Headboard
    const legGeo = new THREE.BoxGeometry(0.15, 1.2, 0.15);
    const legFL = new THREE.Mesh(legGeo, metalMat);
    legFL.position.set(-1.0, 0.6, 1.8);
    const legFR = new THREE.Mesh(legGeo, metalMat);
    legFR.position.set(1.0, 0.6, 1.8);
    const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.2, 0.15), metalMat);
    legBL.position.set(-1.0, 1.1, -1.8);
    const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.2, 0.15), metalMat);
    legBR.position.set(1.0, 1.1, -1.8);
    bedGroup.add(legFL, legFR, legBL, legBR);

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 3.6), metalMat);
    baseMesh.position.set(0, 0.8, 0);
    bedGroup.add(baseMesh);

    // Gadda (Checked red cotton mattress)
    const gaddaTex = TextureGenerator.getMattressTexture('red');
    const gaddaMat = new THREE.MeshStandardMaterial({ map: gaddaTex, roughness: 0.8 });
    const gaddaMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.28, 3.5), gaddaMat);
    gaddaMesh.position.set(0, 0.98, 0);
    gaddaMesh.castShadow = true;
    bedGroup.add(gaddaMesh);

    // Pillow
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, 0.8), new THREE.MeshStandardMaterial({ color: 0xf0f4f8, roughness: 0.9 }));
    pillow.position.set(0, 1.18, -1.2);
    bedGroup.add(pillow);

    // Suitcase under bed
    const suitcase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.0), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 }));
    suitcase.position.set(0, 0.3, 0.2);
    bedGroup.add(suitcase);

    this.registerObject('metal_cot', 'Hostel Iron Bed & Gadda', bedGroup, 0.12, 0.20, 'furniture', gaddaMesh, 'metal_cot', 6.0);
  }

  // ==========================================
  // 4. ROOMMATE'S BED (Scroll: 0.18 - 0.26)
  // ==========================================
  private buildRoommateCot() {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(2.4, 0, -2.8);

    const metalTex = TextureGenerator.getMetalBedTexture();
    const metalMat = new THREE.MeshStandardMaterial({ map: metalTex, roughness: 0.5, metalness: 0.6 });

    const legGeo = new THREE.BoxGeometry(0.15, 1.2, 0.15);
    const legFL = new THREE.Mesh(legGeo, metalMat);
    legFL.position.set(-1.0, 0.6, 1.6);
    const legFR = new THREE.Mesh(legGeo, metalMat);
    legFR.position.set(1.0, 0.6, 1.6);
    const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.0, 0.15), metalMat);
    legBL.position.set(-1.0, 1.0, -1.6);
    const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.0, 0.15), metalMat);
    legBR.position.set(1.0, 1.0, -1.6);
    bedGroup.add(legFL, legFR, legBL, legBR);

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 3.2), metalMat);
    baseMesh.position.set(0, 0.8, 0);
    bedGroup.add(baseMesh);

    // Blue Checked Mattress
    const gaddaTex = TextureGenerator.getMattressTexture('blue');
    const gaddaMat = new THREE.MeshStandardMaterial({ map: gaddaTex, roughness: 0.8 });
    const gaddaMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.28, 3.1), gaddaMat);
    gaddaMesh.position.set(0, 0.98, 0);
    bedGroup.add(gaddaMesh);

    const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, 0.7), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    pillow.position.set(0, 1.18, -1.1);
    bedGroup.add(pillow);

    // Slippers next to bed
    const chappalMat = new THREE.MeshStandardMaterial({ color: 0x3366cc, roughness: 0.7 });
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.6), chappalMat);
    c1.position.set(-1.4, 0.03, 0.4);
    c1.rotation.y = 0.2;
    bedGroup.add(c1);

    this.registerObject('roommate_cot', "Roommate's Bed", bedGroup, 0.18, 0.26, 'furniture', gaddaMesh, 'gadda', 5.5);
  }

  // ==========================================
  // 5. STUDY DESK & LAPTOP (Scroll: 0.24 - 0.32)
  // ==========================================
  private buildStudyDesk() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-2.8, 0, 2.5);

    const deskTex = TextureGenerator.getStudyDeskTexture();
    const deskMat = new THREE.MeshStandardMaterial({ map: deskTex, roughness: 0.7 });

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 1.8), deskMat);
    tableTop.position.set(0, 1.8, 0);
    tableTop.castShadow = true;
    deskGroup.add(tableTop);

    // Metal legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const offsets = [[-1.25, 0.9, -0.75], [1.25, 0.9, -0.75], [-1.25, 0.9, 0.75], [1.25, 0.9, 0.75]];
    offsets.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), legMat);
      leg.position.set(x, y, z);
      deskGroup.add(leg);
    });

    // Open Laptop on Desk
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.3, 1.9, 0.1);
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.6), new THREE.MeshStandardMaterial({ color: 0x1f2428, roughness: 0.4 }));
    laptopGroup.add(kbMesh);

    const screenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.6, 0.04),
      new THREE.MeshBasicMaterial({ map: TextureGenerator.getLaptopScreenTexture() })
    );
    screenMesh.position.set(0, 0.3, -0.28);
    screenMesh.rotation.x = -0.25;
    laptopGroup.add(screenMesh);
    deskGroup.add(laptopGroup);

    // B.S. Grewal Math Book
    const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.8), new THREE.MeshStandardMaterial({ map: TextureGenerator.getBookTexture() }));
    bookMesh.position.set(0.8, 1.95, -0.2);
    bookMesh.rotation.y = 0.2;
    deskGroup.add(bookMesh);

    this.registerObject('study_desk', 'Ply Study Desk & Laptop', deskGroup, 0.24, 0.32, 'tech', tableTop, 'desk', 6.0);
  }

  // ==========================================
  // 6. NEELKAMAL PLASTIC CHAIR (Scroll: 0.28 - 0.36)
  // ==========================================
  private buildNeelkamalChair() {
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-2.8, 0, 1.1);
    chairGroup.rotation.y = Math.PI;

    const chairTex = TextureGenerator.getPlasticChairTexture();
    const chairMat = new THREE.MeshStandardMaterial({ map: chairTex, roughness: 0.5 });

    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), chairMat);
    seatMesh.position.set(0, 1.0, 0);
    chairGroup.add(seatMesh);

    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.1), chairMat);
    backMesh.position.set(0, 1.55, -0.55);
    backMesh.rotation.x = 0.1;
    chairGroup.add(backMesh);

    // Legs
    [[-0.45, 0.5, -0.45], [0.45, 0.5, -0.45], [-0.45, 0.5, 0.45], [0.45, 0.5, 0.45]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 0.12), chairMat);
      leg.position.set(x, y, z);
      chairGroup.add(leg);
    });

    // Clothes on chair
    const jeans = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.25), new THREE.MeshStandardMaterial({ color: 0x1d3557, roughness: 0.9 }));
    jeans.position.set(0, 1.6, -0.58);
    chairGroup.add(jeans);

    this.registerObject('neelkamal_chair', 'Neelkamal Blue Plastic Chair', chairGroup, 0.28, 0.36, 'furniture', seatMesh, 'chair', 5.0);
  }

  // ==========================================
  // 7. GODREJ STEEL CUPBOARD (Scroll: 0.32 - 0.40)
  // ==========================================
  private buildGodrejAlmirah() {
    const almirahGroup = new THREE.Group();
    almirahGroup.position.set(3.8, 0, -0.5);

    const almirahTex = TextureGenerator.getCupboardTexture();
    const almirahMat = new THREE.MeshStandardMaterial({ map: almirahTex, roughness: 0.5, metalness: 0.4 });

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.8, 2.2), almirahMat);
    bodyMesh.position.set(0, 2.4, 0);
    bodyMesh.castShadow = true;
    almirahGroup.add(bodyMesh);

    // Box on top
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.6), new THREE.MeshStandardMaterial({ color: 0xc49a45, roughness: 0.8 }));
    box1.position.set(0, 5.2, 0);
    almirahGroup.add(box1);

    this.registerObject('almirah', 'Godrej Steel Almirah', almirahGroup, 0.32, 0.40, 'furniture', bodyMesh, 'almirah', 6.0);
  }

  // ==========================================
  // 8. CONTRABAND MAGGI STATION (Scroll: 0.36 - 0.44)
  // ==========================================
  private buildMaggiKitchenStation() {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(2.0, 0, 1.8);

    const stoolMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const stoolTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.6), stoolMat);
    stoolTop.position.set(0, 1.2, 0);
    stationGroup.add(stoolTop);

    [[-0.65, 0.6, -0.65], [0.65, 0.6, -0.65], [-0.65, 0.6, 0.65], [0.65, 0.6, 0.65]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), stoolMat);
      leg.position.set(x, y, z);
      stationGroup.add(leg);
    });

    // Contraband Electric Kettle
    const kettleTex = TextureGenerator.getKettleTexture();
    const kettleMat = new THREE.MeshStandardMaterial({ map: kettleTex, roughness: 0.3, metalness: 0.7 });
    const kettleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.6, 12), kettleMat);
    kettleMesh.position.set(-0.35, 1.56, 0);
    stationGroup.add(kettleMesh);

    this.kettleSteamSource.set(2.0 - 0.35, 1.9, 1.8);

    // Maggi Packets & Bowl
    const maggiMat = new THREE.MeshStandardMaterial({ map: TextureGenerator.getMaggiTexture(), roughness: 0.7 });
    const maggi1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.4), maggiMat);
    maggi1.position.set(0.35, 1.32, -0.2);
    stationGroup.add(maggi1);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.18, 0.22, 10), new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.3, metalness: 0.8 }));
    bowl.position.set(0.2, 1.35, 0.35);
    stationGroup.add(bowl);

    this.registerObject('maggi_station', 'Contraband Kettle & 2-Min Maggi', stationGroup, 0.36, 0.44, 'survival', kettleMesh, 'kettle', 5.5);
  }

  // ==========================================
  // 9. EXTENSION BOARD (Scroll: 0.40 - 0.46)
  // ==========================================
  private buildExtensionBoard() {
    const extGroup = new THREE.Group();
    extGroup.position.set(-4.78, 1.2, 2.5);
    extGroup.rotation.y = Math.PI / 2;

    const extTex = TextureGenerator.getExtensionBoardTexture();
    const extMat = new THREE.MeshStandardMaterial({ map: extTex, roughness: 0.5 });
    const extMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.15), extMat);
    extGroup.add(extMesh);

    this.registerObject('extension_board', 'Overloaded Extension Board', extGroup, 0.40, 0.46, 'tech', extMesh, 'extension', 4.5);
  }

  // ==========================================
  // 10. CEILING FAN (Scroll: 0.42 - 0.48)
  // ==========================================
  private buildCeilingFan() {
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 5.8, 0);

    const fanMat = new THREE.MeshStandardMaterial({ color: 0xefefef, roughness: 0.4 });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.25, 12), fanMat);
    fanGroup.add(hub);

    this.fanBladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(2.4, 0.03, 0.35);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeo, fanMat);
      blade.position.set(1.2, 0, 0);
      const pivot = new THREE.Group();
      pivot.rotation.y = (i * Math.PI * 2) / 3;
      pivot.add(blade);
      this.fanBladesGroup.add(pivot);
    }
    fanGroup.add(this.fanBladesGroup);

    this.registerObject('ceiling_fan', 'Bajaj Ceiling Fan', fanGroup, 0.42, 0.48, 'furniture', hub, 'fan', 5.0);
  }

  // ==========================================
  // 11. TUBE LIGHT (Scroll: 0.44 - 0.49)
  // ==========================================
  private buildTubeLight() {
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(0, 5.4, -4.75);

    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.tubeLightGlowMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.8, 8), tubeMat);
    this.tubeLightGlowMesh.rotation.z = Math.PI / 2;
    tubeGroup.add(this.tubeLightGlowMesh);

    this.tubeLight = new THREE.PointLight(0xf0f6ff, 1.2, 14, 1.5);
    this.tubeLight.position.set(0, 0, 0.3);
    this.tubeLight.castShadow = true;
    tubeGroup.add(this.tubeLight);

    this.registerObject('tubelight', 'Fluorescent Tube Light', tubeGroup, 0.44, 0.49, 'tech', this.tubeLightGlowMesh, 'tubelight', 4.5);
  }

  // ==========================================
  // 12. BATHROOM BALTI (Scroll: 0.46 - 0.50)
  // ==========================================
  private buildBathroomCorner() {
    const bathGroup = new THREE.Group();
    bathGroup.position.set(3.8, 0, 3.8);

    const bucketMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.9, 12), new THREE.MeshStandardMaterial({ map: TextureGenerator.getBucketTexture(), roughness: 0.5 }));
    bucketMesh.position.set(0, 0.45, 0);
    bathGroup.add(bucketMesh);

    this.registerObject('balti', 'Red Balti & Mugga', bathGroup, 0.46, 0.50, 'survival', bucketMesh, 'bucket', 5.0);
  }

  // ==========================================
  // 13. POSTERS & DECOR (Scroll: 0.47 - 0.51)
  // ==========================================
  private buildPostersAndDecor() {
    const decorGroup = new THREE.Group();
    const attPoster = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.8, 1.4), new THREE.MeshStandardMaterial({ map: TextureGenerator.getPosterTexture('attendance'), roughness: 0.9 }));
    attPoster.position.set(-4.78, 3.6, -1.2);
    decorGroup.add(attPoster);

    this.registerObject('posters', 'Hostel Posters & Clothesline', decorGroup, 0.47, 0.51, 'chaos', attPoster, 'posters', 5.0);
  }

  // ==========================================
  // 14. FAIRY LIGHTS (Scroll: 0.48 - 0.52)
  // ==========================================
  private buildFairyLights() {
    const fairyGroup = new THREE.Group();
    const colors = [0xff0055, 0x00ffcc, 0xffcc00, 0x9900ff, 0x00ff00, 0xff6600];

    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
      this.fairyLightMaterials.push(mat);
      const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), mat);
      const t = i / 15;
      bulb.position.set(-4.7 + t * 3.5, 3.2 + Math.sin(t * Math.PI * 3) * 0.25, -3.8 + t * 2.0);
      fairyGroup.add(bulb);
    }

    this.registerObject('fairy_lights', '2 AM Nostalgia Fairy Lights', fairyGroup, 0.48, 0.52, 'chaos', undefined, undefined, 4.0);
  }

  // =========================================================================
  // ======================== PHASE 2: HOSTEL MESS HALL =======================
  // =========================================================================

  // ==========================================
  // 15. MESS HALL CHEQUERED FLOOR & CORRIDOR (Scroll: 0.52 - 0.60)
  // ==========================================
  private buildMessHallFloor() {
    const messFloorGroup = new THREE.Group();

    // 1. Connecting Corridor from Room 204 (Z: 5 to 13)
    const corridorTex = TextureGenerator.getFloorTexture();
    corridorTex.repeat.set(2, 6);
    const corridorFloor = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.4, 9),
      new THREE.MeshStandardMaterial({ map: corridorTex, roughness: 0.8 })
    );
    corridorFloor.position.set(0, -0.2, 9.5);
    corridorFloor.receiveShadow = true;
    messFloorGroup.add(corridorFloor);

    // Corridor walls
    const corrWallMat = new THREE.MeshStandardMaterial({ color: 0xd9cdb4, roughness: 0.9 });
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 9), corrWallMat);
    wallLeft.position.set(-1.8, 2.25, 9.5);
    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 9), corrWallMat);
    wallRight.position.set(1.8, 2.25, 9.5);
    messFloorGroup.add(wallLeft, wallRight);

    // Corridor room doors ("Room 203", "Room 202")
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11 });
    const door1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 1.6), doorMat);
    door1.position.set(-1.6, 1.6, 8.0);
    const door2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 1.6), doorMat);
    door2.position.set(1.6, 1.6, 11.0);
    messFloorGroup.add(door1, door2);

    // 2. Main Mess Hall Floor (Z: 14 to 32)
    const messFloorTex = TextureGenerator.getMessFloorTexture();
    messFloorTex.repeat.set(6, 6);
    const messFloor = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.4, 18),
      new THREE.MeshStandardMaterial({ map: messFloorTex, roughness: 0.7 })
    );
    messFloor.position.set(0, -0.2, 23);
    messFloor.receiveShadow = true;
    messFloorGroup.add(messFloor);

    // Back wall of the mess hall
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0xe0d6c3, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 0.4), backWallMat);
    backWall.position.set(0, 3.5, 32);
    backWall.receiveShadow = true;
    messFloorGroup.add(backWall);

    this.registerObject('mess_floor', 'Central Mess Hall Chequered Floor', messFloorGroup, 0.52, 0.60, 'mess', undefined, undefined, 5.0);
  }

  // ==========================================
  // 16. MESS PILLARS & BANNER (Scroll: 0.58 - 0.68)
  // ==========================================
  private buildMessPillars() {
    const pillarGroup = new THREE.Group();

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x8a929a, roughness: 0.6 });
    const pillarCoords = [
      [-6, 3.5, 17],
      [6, 3.5, 17],
      [-6, 3.5, 27],
      [6, 3.5, 27]
    ];

    pillarCoords.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7, 1.2), pillarMat);
      pillar.position.set(x, y, z);
      pillar.castShadow = true;
      pillarGroup.add(pillar);
    });

    // "WING B CENTRAL MESS" Archway Banner
    const bannerGroup = new THREE.Group();
    bannerGroup.position.set(0, 5.2, 15.5);

    const bannerBoard = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 })
    );
    bannerGroup.add(bannerBoard);

    // Yellow stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.15, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    stripe.position.set(0, -0.45, 0);
    bannerGroup.add(stripe);

    pillarGroup.add(bannerGroup);

    this.registerObject('mess_pillars', 'Mess Concrete Pillars & Archway', pillarGroup, 0.58, 0.68, 'mess', bannerBoard, 'mess_banner', 5.5);
  }

  // ==========================================
  // 17. STAINLESS STEEL DINING TABLES (Scroll: 0.66 - 0.76)
  // ==========================================
  private buildMessDiningTables() {
    const tablesGroup = new THREE.Group();

    const tableTex = TextureGenerator.getMessTableTexture();
    const tableMat = new THREE.MeshStandardMaterial({ map: tableTex, roughness: 0.3, metalness: 0.8 });
    const steelLegMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5, metalness: 0.7 });

    const stoolMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.4, metalness: 0.8 });

    // Build 2 long parallel dining tables
    const tableXPositions = [-3.4, 3.4];

    tableXPositions.forEach((tableX) => {
      const table = new THREE.Group();
      table.position.set(tableX, 0, 22.5);

      // Long tabletop (length 8.5, width 2.2)
      const topMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 8.5), tableMat);
      topMesh.position.set(0, 1.6, 0);
      topMesh.castShadow = true;
      table.add(topMesh);

      // 4 Heavy Pipe Support Pedestals
      for (let z = -3.2; z <= 3.2; z += 2.1) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.6, 8), steelLegMat);
        leg.position.set(0, 0.8, z);
        table.add(leg);

        // Attached circular steel stools on left and right
        const stoolLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12), stoolMat);
        stoolLeft.position.set(-1.6, 1.0, z);
        const postLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), steelLegMat);
        postLeft.position.set(-1.6, 0.5, z);

        const stoolRight = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12), stoolMat);
        stoolRight.position.set(1.6, 1.0, z);
        const postRight = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), steelLegMat);
        postRight.position.set(1.6, 0.5, z);

        table.add(stoolLeft, postLeft, stoolRight, postRight);
      }

      tablesGroup.add(table);
    });

    this.registerObject('mess_tables', 'Long Stainless Steel Dining Tables', tablesGroup, 0.66, 0.76, 'mess', undefined, undefined, 5.0);
  }

  // ==========================================
  // 18. 5-COMPARTMENT THALIS & WATER JUGS (Scroll: 0.74 - 0.84)
  // ==========================================
  private buildMessThalis() {
    const thalisGroup = new THREE.Group();

    const thaliTex = TextureGenerator.getThaliTexture();
    const thaliMat = new THREE.MeshStandardMaterial({ map: thaliTex, roughness: 0.4, metalness: 0.6 });

    let primaryThaliMesh: THREE.Mesh | undefined;

    // Place 6 thalis along the tables
    const thaliSpots = [
      [-3.4, 1.68, 19.5],
      [-3.4, 1.68, 22.5],
      [-3.4, 1.68, 25.5],
      [3.4, 1.68, 19.5],
      [3.4, 1.68, 22.5],
      [3.4, 1.68, 25.5]
    ];

    thaliSpots.forEach(([x, y, z], idx) => {
      const thali = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 1.4), thaliMat);
      thali.position.set(x, y, z);
      thali.rotation.y = (idx % 2 === 0) ? 0 : Math.PI;
      thalisGroup.add(thali);

      if (idx === 1) primaryThaliMesh = thali; // Center thali is interactive

      // Steel spoon next to thali
      const spoon = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.02, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 })
      );
      spoon.position.set(x + 0.9, y + 0.01, z);
      thalisGroup.add(spoon);

      // Steel tumbler / glass
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.12, 0.4, 10),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.3 })
      );
      glass.position.set(x + 0.8, y + 0.2, z - 0.6);
      thalisGroup.add(glass);
    });

    // Orange Plastic Water Jugs in the middle of each table
    const jugMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
    const jug1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.8, 10), jugMat);
    jug1.position.set(-3.4, 2.05, 21.0);
    const jug2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.8, 10), jugMat);
    jug2.position.set(3.4, 2.05, 24.0);
    thalisGroup.add(jug1, jug2);

    this.registerObject('mess_thalis', '5-Compartment Steel Thalis & Food', thalisGroup, 0.74, 0.84, 'mess', primaryThaliMesh, 'mess_thali', 4.5);
  }

  // ==========================================
  // 19. FOOD DISTRIBUTION COUNTER & CAULDRONS (Scroll: 0.82 - 0.90)
  // ==========================================
  private buildServiceCounterAndCauldrons() {
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, 0, 30.5);

    // Granite Top Distribution Counter
    const counterBody = new THREE.Mesh(
      new THREE.BoxGeometry(14, 1.8, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 })
    );
    counterBody.position.set(0, 0.9, 0);
    counterGroup.add(counterBody);

    const counterTop = new THREE.Mesh(
      new THREE.BoxGeometry(14.4, 0.15, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.3 })
    );
    counterTop.position.set(0, 1.85, 0);
    counterGroup.add(counterTop);

    // Giant Hammered Aluminum Dal Cauldron (Degchi)
    const cauldronMat = new THREE.MeshStandardMaterial({
      map: TextureGenerator.getCauldronTexture(),
      roughness: 0.3,
      metalness: 0.7
    });
    const dalCauldron = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 0.9, 14), cauldronMat);
    dalCauldron.position.set(-2.5, 2.3, 0);
    counterGroup.add(dalCauldron);

    // Dal Yellow Liquid Surface inside cauldron
    const dalSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.05, 12),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    dalSurface.position.set(-2.5, 2.7, 0);
    counterGroup.add(dalSurface);

    // Giant Wooden Ladle (Kadchhi) leaning in the dal
    const ladleHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    ladleHandle.position.set(-2.2, 2.9, 0);
    ladleHandle.rotation.z = -0.35;
    counterGroup.add(ladleHandle);

    // Second Cauldron: Rice / Sabzi
    const riceCauldron = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 0.9, 14), cauldronMat);
    riceCauldron.position.set(2.5, 2.3, 0);
    counterGroup.add(riceCauldron);

    const riceSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.05, 12),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc })
    );
    riceSurface.position.set(2.5, 2.7, 0);
    counterGroup.add(riceSurface);

    // Wicker Roti Basket with stacked flat rotis in center
    const basket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.6, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
    );
    basket.position.set(0, 2.05, 0);
    counterGroup.add(basket);

    // Stacked rotis
    const rotiTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.1, 10),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 })
    );
    rotiTop.position.set(0, 2.25, 0);
    counterGroup.add(rotiTop);

    // Save world position of Dal Cauldron for steam particles
    this.cauldronSteamSource.set(-2.5, 2.9, 30.5);

    this.registerObject('mess_counter', 'Food Service Counter & Giant Dal Cauldrons', counterGroup, 0.82, 0.90, 'mess', dalCauldron, 'mess_cauldron', 5.0);
  }

  // ==========================================
  // 20. WATER COOLER & WEEKLY MENU CHALKBOARD (Scroll: 0.88 - 0.96)
  // ==========================================
  private buildWaterCoolerAndMenuBoard() {
    const coolerGroup = new THREE.Group();

    // Blue Voltas Water Cooler in corner
    const coolerTex = TextureGenerator.getWaterCoolerTexture();
    const coolerMat = new THREE.MeshStandardMaterial({ map: coolerTex, roughness: 0.4 });
    const coolerMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.4), coolerMat);
    coolerMesh.position.set(7.2, 1.6, 22.5);
    coolerGroup.add(coolerMesh);

    // Steel glass chained to cooler (so students don't take it to room 204!)
    const chainedGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.10, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.3 })
    );
    chainedGlass.position.set(6.2, 1.4, 22.5);
    coolerGroup.add(chainedGlass);

    // Wire chain
    const chainMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const chain = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.02), chainMat);
    chain.position.set(6.65, 1.5, 22.5);
    coolerGroup.add(chain);

    // Weekly Mess Menu Chalkboard mounted on pillar
    const menuTex = TextureGenerator.getMessMenuChalkboardTexture();
    const menuMat = new THREE.MeshStandardMaterial({ map: menuTex, roughness: 0.7 });
    const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 3.2), menuMat);
    menuBoard.position.set(-6.55, 3.8, 22.5);
    coolerGroup.add(menuBoard);

    this.registerObject('mess_cooler', 'Water Cooler (Chained Glass) & Menu Board', coolerGroup, 0.88, 0.96, 'mess', coolerMesh, 'mess_cooler', 5.0);
  }

  // ==========================================
  // 21. MESS COMPLAINT REGISTER & SUNDAY SPECIAL (Scroll: 0.94 - 1.00)
  // ==========================================
  private buildMessRegisterAndSundaySpecial() {
    const registerGroup = new THREE.Group();

    // Wooden complaint podium
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.7 });
    const podium = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.2), podiumMat);
    podium.position.set(-6.2, 1.1, 15.5);
    registerGroup.add(podium);

    // Complaint Register Ledger Book (Thick open book)
    const ledgerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
    const ledger = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 1.0), ledgerMat);
    ledger.position.set(-6.2, 2.25, 15.5);
    ledger.rotation.y = 0.25;
    registerGroup.add(ledger);

    // Ballpoint pen tied with dirty string
    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
    );
    pen.position.set(-5.7, 2.3, 15.5);
    pen.rotation.z = 0.4;
    registerGroup.add(pen);

    // Giant Sunday Paneer War Alert Sign
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, 1.2, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.5 })
    );
    signBoard.position.set(0, 5.0, 31.5);
    registerGroup.add(signBoard);

    this.registerObject('mess_register', 'Mess Complaint Register & Sunday Paneer War', registerGroup, 0.94, 1.00, 'mess', ledger, 'mess_register', 4.5);
  }

  /**
   * Updates all block drop positions and animations based on scroll fraction (0 to 1)
   */
  public updateScroll(scrollProgress: number) {
    this.voxelObjects.forEach((obj) => {
      if (scrollProgress < obj.scrollStart) {
        // Above the scene / not yet placed
        obj.group.visible = false;
        obj.group.position.y = obj.targetY + obj.dropOffset;
        obj.group.scale.set(0.1, 0.1, 0.1);
        if (obj.isPlaced) {
          obj.isPlaced = false;
          sound.playBlockPop();
        }
      } else if (scrollProgress >= obj.scrollStart && scrollProgress <= obj.scrollEnd) {
        // Dropping down with Minecraft gravity bounce
        obj.group.visible = true;
        const progress = (scrollProgress - obj.scrollStart) / (obj.scrollEnd - obj.scrollStart);

        const eased = Math.min(1.0, progress * 1.1);
        const yOffset = (1 - Math.sin(eased * Math.PI * 0.5)) * obj.dropOffset;
        obj.group.position.y = obj.targetY + yOffset;

        const scale = 0.4 + eased * 0.6;
        obj.group.scale.set(scale, scale, scale);

        if (eased >= 0.98 && !obj.isPlaced) {
          obj.isPlaced = true;
          if (obj.id.startsWith('mess_thali')) {
            sound.playThaliClang();
          } else if (obj.id.startsWith('mess_floor')) {
            sound.playMessBell();
          } else {
            sound.playBlockPlace();
          }
          this.particles.spawnDust(obj.group.position, 14, 1.4);
        }
      } else {
        // Fully placed
        obj.group.visible = true;
        obj.group.position.y = obj.targetY;
        obj.group.scale.set(1, 1, 1);
        if (!obj.isPlaced) {
          obj.isPlaced = true;
          sound.playBlockPlace();
          this.particles.spawnDust(obj.group.position, 12, 1.0);
        }
      }
    });
  }

  /**
   * Dynamic frame tick: spins fan, emits steam from kettle and dal cauldron
   */
  public update(delta: number) {
    // 1. Fan Rotation
    if (this.fanBladesGroup && this.fanSpeed > 0) {
      this.fanBladesGroup.rotation.y += delta * this.fanSpeed * 4.5;
    }

    // 2. Steam Emission (Kettle in Room 204 & Giant Dal Cauldron in Mess Hall)
    if (this.isKettleBoiling) {
      this.steamTimer += delta;
      if (this.steamTimer > 0.08) {
        this.steamTimer = 0;
        this.particles.spawnSteam(this.kettleSteamSource);
        this.particles.spawnSteam(this.cauldronSteamSource);
      }
    }

    // 3. Fairy Lights subtle twinkle
    const time = performance.now() * 0.003;
    this.fairyLightMaterials.forEach((mat, idx) => {
      const brightness = 0.6 + 0.4 * Math.sin(time + idx * 1.2);
      mat.color.setScalar(brightness);
    });
  }

  public toggleFanSpeed(): number {
    this.fanSpeed = (this.fanSpeed + 1) % 5;
    sound.setFanSpeed(this.fanSpeed);
    return this.fanSpeed;
  }

  public toggleTubeLight(): boolean {
    this.isTubeLightOn = !this.isTubeLightOn;
    sound.playTubeLightFlicker();

    if (this.tubeLight && this.tubeLightGlowMesh) {
      if (this.isTubeLightOn) {
        this.tubeLight.intensity = 0.2;
        this.tubeLightGlowMesh.visible = false;
        setTimeout(() => {
          if (this.tubeLight) this.tubeLight.intensity = 0.8;
          if (this.tubeLightGlowMesh) this.tubeLightGlowMesh.visible = true;
        }, 120);
        setTimeout(() => {
          if (this.tubeLight) this.tubeLight.intensity = 0.1;
          if (this.tubeLightGlowMesh) this.tubeLightGlowMesh.visible = false;
        }, 180);
        setTimeout(() => {
          if (this.tubeLight) this.tubeLight.intensity = 1.3;
          if (this.tubeLightGlowMesh) this.tubeLightGlowMesh.visible = true;
        }, 280);
      } else {
        this.tubeLight.intensity = 0;
        this.tubeLightGlowMesh.visible = false;
      }
    }
    return this.isTubeLightOn;
  }
}
