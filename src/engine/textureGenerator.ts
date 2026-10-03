import * as THREE from 'three';

/**
 * Procedural Pixel Art Texture Generator
 * Creates crisp Minecraft-style 16x16 / 32x32 textures using HTML Canvas
 * with NearestFilter for authentic voxel rendering.
 */
export class TextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  private static createPixelCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return [canvas, ctx];
  }

  private static wrapTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Classic Indian Hostel Terrazzo Floor Tile
   */
  public static getFloorTexture(): THREE.CanvasTexture {
    if (this.cache.has('floor')) return this.cache.get('floor')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    // Base yellowish-grey terrazzo
    ctx.fillStyle = '#b8b2a5';
    ctx.fillRect(0, 0, 32, 32);

    // Speckles (marble chips characteristic of Indian government hostel floors)
    const speckles = [
      '#6b6357', '#e2ded5', '#8a7e70', '#4a433a', '#9e9484', '#d0c9bc'
    ];
    for (let x = 0; x < 32; x += 2) {
      for (let y = 0; y < 32; y += 2) {
        if (Math.random() > 0.4) {
          ctx.fillStyle = speckles[Math.floor(Math.random() * speckles.length)];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Tile border / cement grout lines
    ctx.fillStyle = '#7a7266';
    ctx.fillRect(0, 0, 32, 1);
    ctx.fillRect(0, 0, 1, 32);
    ctx.fillRect(31, 0, 1, 32);
    ctx.fillRect(0, 31, 32, 1);

    const tex = this.wrapTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set('floor', tex);
    return tex;
  }

  /**
   * Indian Hostel Distemper Wall (with subtle seepage & weather stains)
   */
  public static getWallTexture(): THREE.CanvasTexture {
    if (this.cache.has('wall')) return this.cache.get('wall')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    ctx.fillStyle = '#e8dec8'; // Off-white / pale cream
    ctx.fillRect(0, 0, 32, 32);

    // Slight noise
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        if (Math.random() > 0.6) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ded3bb' : '#ede5d4';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Classic hostel seepage / damp stain near lower edge
    ctx.fillStyle = '#c4b89b';
    ctx.fillRect(8, 22, 6, 4);
    ctx.fillRect(10, 26, 8, 3);
    ctx.fillStyle = '#b0a283';
    ctx.fillRect(11, 24, 4, 3);

    // Brick mortar lines
    ctx.fillStyle = '#c7baa1';
    ctx.fillRect(0, 15, 32, 1);
    ctx.fillRect(15, 0, 1, 15);
    ctx.fillRect(7, 16, 1, 16);
    ctx.fillRect(23, 16, 1, 16);

    const tex = this.wrapTexture(canvas);
    this.cache.set('wall', tex);
    return tex;
  }

  /**
   * Metal Iron Bed Frame Texture
   */
  public static getMetalBedTexture(): THREE.CanvasTexture {
    if (this.cache.has('metal_bed')) return this.cache.get('metal_bed')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 16);
    ctx.fillStyle = '#2c333a'; // Dark painted hostel iron
    ctx.fillRect(0, 0, 16, 16);

    // Metallic highlight edge
    ctx.fillStyle = '#4f5b66';
    ctx.fillRect(0, 0, 16, 1);
    ctx.fillRect(0, 0, 1, 16);

    // Paint chip / scratch
    ctx.fillStyle = '#7a4e32'; // Rust streak
    ctx.fillRect(5, 7, 2, 1);
    ctx.fillStyle = '#8b949e'; // Bare iron showing
    ctx.fillRect(11, 12, 1, 1);

    const tex = this.wrapTexture(canvas);
    this.cache.set('metal_bed', tex);
    return tex;
  }

  /**
   * Indian Hostel Checked Cotton Mattress ("Gadda")
   */
  public static getMattressTexture(theme: 'red' | 'blue' = 'red'): THREE.CanvasTexture {
    const key = `mattress_${theme}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    const bg = theme === 'red' ? '#8a2b2b' : '#2b4d8a';
    const fg = theme === 'red' ? '#c75252' : '#527ec7';
    const alt = theme === 'red' ? '#e8a59b' : '#9bafe8';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 32, 32);

    // Classic checked pattern
    for (let i = 0; i < 32; i += 8) {
      ctx.fillStyle = fg;
      ctx.fillRect(i, 0, 4, 32);
      ctx.fillRect(0, i, 32, 4);

      ctx.fillStyle = alt;
      ctx.fillRect(i + 1, 0, 1, 32);
      ctx.fillRect(0, i + 1, 32, 1);
    }

    const tex = this.wrapTexture(canvas);
    this.cache.set(key, tex);
    return tex;
  }

  /**
   * Neelkamal Blue Plastic Chair
   */
  public static getPlasticChairTexture(): THREE.CanvasTexture {
    if (this.cache.has('chair')) return this.cache.get('chair')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 16);
    ctx.fillStyle = '#0f62fe'; // Classic vibrant Indian plastic blue
    ctx.fillRect(0, 0, 16, 16);

    // Chair ventilation perforations / ridges
    ctx.fillStyle = '#0043ce';
    ctx.fillRect(3, 4, 2, 4);
    ctx.fillRect(7, 4, 2, 4);
    ctx.fillRect(11, 4, 2, 4);

    // Highlight
    ctx.fillStyle = '#4589ff';
    ctx.fillRect(0, 0, 16, 1);

    const tex = this.wrapTexture(canvas);
    this.cache.set('chair', tex);
    return tex;
  }

  /**
   * Hostel Ply Study Desk (with pen scribbles & scratches)
   */
  public static getStudyDeskTexture(): THREE.CanvasTexture {
    if (this.cache.has('desk')) return this.cache.get('desk')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    ctx.fillStyle = '#9c6f44'; // Laminated wood ply
    ctx.fillRect(0, 0, 32, 32);

    // Wood grain lines
    ctx.fillStyle = '#80562e';
    ctx.fillRect(0, 6, 32, 1);
    ctx.fillRect(0, 14, 32, 1);
    ctx.fillRect(0, 24, 32, 1);

    // Classic hostel student pen scribbles ("PASS", "EXAM", heart symbol)
    ctx.fillStyle = '#1f2937'; // Ballpoint pen ink
    ctx.fillRect(5, 8, 3, 1);
    ctx.fillRect(6, 9, 1, 3); // 'T' scribble
    ctx.fillRect(18, 18, 4, 1); // Math formula scribble
    ctx.fillRect(20, 19, 1, 2);

    // Compass compass gouge mark
    ctx.fillStyle = '#613f1e';
    ctx.fillRect(24, 10, 2, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('desk', tex);
    return tex;
  }

  /**
   * Maggi 2-Minute Noodle Packet Texture
   */
  public static getMaggiTexture(): THREE.CanvasTexture {
    if (this.cache.has('maggi')) return this.cache.get('maggi')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    // Iconic Maggi Yellow
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(0, 0, 32, 32);

    // Red Nestle wave banner
    ctx.fillStyle = '#e60000';
    ctx.fillRect(0, 4, 32, 10);

    // White "Maggi" text pixel logo
    ctx.fillStyle = '#ffffff';
    // M
    ctx.fillRect(4, 6, 1, 6);
    ctx.fillRect(5, 7, 1, 2);
    ctx.fillRect(6, 6, 1, 6);
    // A
    ctx.fillRect(8, 7, 3, 5);
    ctx.fillRect(9, 6, 1, 1);
    ctx.fillStyle = '#e60000';
    ctx.fillRect(9, 8, 1, 2);
    // G
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 6, 3, 6);
    ctx.fillStyle = '#e60000';
    ctx.fillRect(13, 7, 2, 2);

    // 2-MIN clock logo
    ctx.fillStyle = '#e60000';
    ctx.fillRect(22, 18, 7, 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 20, 3, 3);

    // Green veg dot logo
    ctx.fillStyle = '#008000';
    ctx.fillRect(26, 2, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 3, 2, 2);

    // Noodles graphics
    ctx.fillStyle = '#cc8800';
    ctx.fillRect(3, 20, 16, 8);
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(4, 21, 14, 2);
    ctx.fillRect(5, 24, 12, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('maggi', tex);
    return tex;
  }

  /**
   * Electric Heating Kettle (Brushed steel & black handle)
   */
  public static getKettleTexture(): THREE.CanvasTexture {
    if (this.cache.has('kettle')) return this.cache.get('kettle')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 16);
    // Steel gradient
    ctx.fillStyle = '#c5c9cc';
    ctx.fillRect(0, 0, 16, 16);

    // Metallic sheen highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 0, 2, 16);
    ctx.fillStyle = '#8f969c';
    ctx.fillRect(10, 0, 3, 16);

    // Base black rim & glowing power indicator
    ctx.fillStyle = '#1c1f21';
    ctx.fillRect(0, 13, 16, 3);
    ctx.fillStyle = '#ff3b30'; // Glowing red switch
    ctx.fillRect(7, 14, 2, 1);

    const tex = this.wrapTexture(canvas);
    this.cache.set('kettle', tex);
    return tex;
  }

  /**
   * Extension Board (White strip with 6 multi-sockets and red neon switch)
   */
  public static getExtensionBoardTexture(): THREE.CanvasTexture {
    if (this.cache.has('extension')) return this.cache.get('extension')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 16);
    ctx.fillStyle = '#e8eaed';
    ctx.fillRect(0, 0, 32, 16);

    // Neon master switch
    ctx.fillStyle = '#ff2424';
    ctx.fillRect(2, 4, 4, 8);

    // 4 Sockets with holes
    for (let i = 8; i < 30; i += 6) {
      ctx.fillStyle = '#c4c7c5';
      ctx.fillRect(i, 3, 4, 10);
      // Socket 3-pin holes
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(i + 1, 5, 2, 2); // Earth
      ctx.fillRect(i + 1, 9, 1, 2); // Live
      ctx.fillRect(i + 2, 9, 1, 2); // Neutral
    }

    const tex = this.wrapTexture(canvas);
    this.cache.set('extension', tex);
    return tex;
  }

  /**
   * Laptop Screen Texture (VS Code + Terminal outputting hackathon code)
   */
  public static getLaptopScreenTexture(): THREE.CanvasTexture {
    if (this.cache.has('laptop')) return this.cache.get('laptop')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 24);
    // Dark editor background
    ctx.fillStyle = '#181824';
    ctx.fillRect(0, 0, 32, 24);

    // Top window bar
    ctx.fillStyle = '#282a36';
    ctx.fillRect(0, 0, 32, 3);
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(1, 1, 1, 1);
    ctx.fillStyle = '#f1fa8c';
    ctx.fillRect(3, 1, 1, 1);
    ctx.fillStyle = '#50fa7b';
    ctx.fillRect(5, 1, 1, 1);

    // Code lines
    const colors = ['#8be9fd', '#50fa7b', '#ff79c6', '#bd93f9', '#f1fa8c'];
    for (let y = 5; y < 16; y += 2) {
      ctx.fillStyle = colors[(y * 3) % colors.length];
      const len = 6 + ((y * 7) % 18);
      ctx.fillRect(3, y, len, 1);
    }

    // Terminal split at bottom
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 17, 32, 7);
    ctx.fillStyle = '#00ff66'; // Glowing bash prompt
    ctx.fillRect(2, 19, 2, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 19, 16, 1); // "npm run dev: 11:59PM"
    ctx.fillStyle = '#50fa7b';
    ctx.fillRect(2, 21, 1, 1); // Cursor blink

    const tex = this.wrapTexture(canvas);
    this.cache.set('laptop', tex);
    return tex;
  }

  /**
   * Godrej Steel Cupboard Texture
   */
  public static getCupboardTexture(): THREE.CanvasTexture {
    if (this.cache.has('cupboard')) return this.cache.get('cupboard')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    ctx.fillStyle = '#4a5d52'; // Classic hostel olive green enamel
    ctx.fillRect(0, 0, 32, 32);

    // Door center split
    ctx.fillStyle = '#313d36';
    ctx.fillRect(15, 0, 2, 32);

    // Handle & Keyhole
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(13, 14, 2, 4); // Steel handle
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(13, 19, 2, 1); // Keyhole

    // Sticker on door (e.g. funny sticker)
    ctx.fillStyle = '#ffbb00';
    ctx.fillRect(4, 6, 6, 6);
    ctx.fillStyle = '#111111';
    ctx.fillRect(5, 8, 4, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('cupboard', tex);
    return tex;
  }

  /**
   * Hostel Wall Posters (Humorous Indian college memes)
   */
  public static getPosterTexture(type: 'attendance' | 'exam' | 'rules'): THREE.CanvasTexture {
    const key = `poster_${type}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [canvas, ctx] = this.createPixelCanvas(32, 40);

    if (type === 'attendance') {
      // Urgent Attendance Warning poster
      ctx.fillStyle = '#fff0f0';
      ctx.fillRect(0, 0, 32, 40);
      ctx.fillStyle = '#d90429';
      ctx.fillRect(2, 2, 28, 6); // Red header
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, 4, 24, 2); // "ATTENDANCE"

      // 74.9% in huge red pixels
      ctx.fillStyle = '#d90429';
      ctx.fillRect(6, 12, 20, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 14, 16, 6);

      // Warning text
      ctx.fillStyle = '#2b2d42';
      ctx.fillRect(4, 26, 24, 2);
      ctx.fillRect(4, 30, 20, 2);
      ctx.fillRect(4, 34, 16, 2);
    } else if (type === 'exam') {
      // End Sem Survival Checklist
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 32, 40);
      ctx.fillStyle = '#1d3557';
      ctx.fillRect(2, 2, 28, 5); // Dark blue header

      // Checklist boxes
      for (let y = 10; y < 35; y += 7) {
        ctx.fillStyle = '#457b9d';
        ctx.fillRect(4, y, 4, 4);
        ctx.fillStyle = '#e63946'; // Unchecked tick
        ctx.fillRect(5, y + 1, 2, 2);
        ctx.fillStyle = '#1d3557';
        ctx.fillRect(10, y + 1, 18, 2);
      }
    } else {
      // Room 204 Constitution
      ctx.fillStyle = '#fefae0';
      ctx.fillRect(0, 0, 32, 40);
      ctx.fillStyle = '#bc6c25';
      ctx.fillRect(2, 2, 28, 4);

      // Rules lines
      for (let y = 8; y < 36; y += 4) {
        ctx.fillStyle = '#283618';
        ctx.fillRect(4, y, 2 + ((y * 11) % 22), 2);
      }
    }

    // Scotch tape on 4 corners (classic hostel wall decoration!)
    ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
    ctx.fillRect(0, 0, 4, 3);
    ctx.fillRect(28, 0, 4, 3);
    ctx.fillRect(0, 37, 4, 3);
    ctx.fillRect(28, 37, 4, 3);

    const tex = this.wrapTexture(canvas);
    this.cache.set(key, tex);
    return tex;
  }

  /**
   * B.S. Grewal Engineering Math Book
   */
  public static getBookTexture(): THREE.CanvasTexture {
    if (this.cache.has('book')) return this.cache.get('book')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 24);
    // Iconic yellow & red engineering book cover
    ctx.fillStyle = '#f9c74f';
    ctx.fillRect(0, 0, 16, 24);

    ctx.fillStyle = '#d90429';
    ctx.fillRect(0, 0, 16, 6);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 2, 12, 2); // Title

    // Author block
    ctx.fillStyle = '#277da1';
    ctx.fillRect(3, 9, 10, 4);

    // Spine
    ctx.fillStyle = '#b5179e';
    ctx.fillRect(0, 0, 2, 24);

    const tex = this.wrapTexture(canvas);
    this.cache.set('book', tex);
    return tex;
  }

  /**
   * Balti & Mug (Indian bathroom red plastic bucket)
   */
  public static getBucketTexture(): THREE.CanvasTexture {
    if (this.cache.has('bucket')) return this.cache.get('bucket')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 16);
    ctx.fillStyle = '#e63946'; // Red plastic
    ctx.fillRect(0, 0, 16, 16);

    // Plastic rim highlight
    ctx.fillStyle = '#ff758f';
    ctx.fillRect(0, 0, 16, 2);

    // Inner water surface
    ctx.fillStyle = '#48cae4';
    ctx.fillRect(2, 4, 12, 3);

    const tex = this.wrapTexture(canvas);
    this.cache.set('bucket', tex);
    return tex;
  }

  /**
   * Institutional Chequered Mess Hall Floor Tiles (Dark Green & Cream)
   */
  public static getMessFloorTexture(): THREE.CanvasTexture {
    if (this.cache.has('mess_floor')) return this.cache.get('mess_floor')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    // Green and cream chequered dining hall tiles
    ctx.fillStyle = '#2d5a43'; // Forest green tile
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillRect(16, 16, 16, 16);

    ctx.fillStyle = '#e5dec9'; // Pale cream tile
    ctx.fillRect(16, 0, 16, 16);
    ctx.fillRect(0, 16, 16, 16);

    // Grout lines
    ctx.fillStyle = '#1e382b';
    ctx.fillRect(0, 0, 32, 1);
    ctx.fillRect(0, 15, 32, 2);
    ctx.fillRect(0, 0, 1, 32);
    ctx.fillRect(15, 0, 2, 32);

    const tex = this.wrapTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.cache.set('mess_floor', tex);
    return tex;
  }

  /**
   * Stainless Steel Long Mess Table Top
   */
  public static getMessTableTexture(): THREE.CanvasTexture {
    if (this.cache.has('mess_table')) return this.cache.get('mess_table')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    ctx.fillStyle = '#b0b8c0'; // Steel grey
    ctx.fillRect(0, 0, 32, 32);

    // Brushed metal streaks
    for (let y = 0; y < 32; y += 2) {
      ctx.fillStyle = Math.random() > 0.5 ? '#c5ccd4' : '#9ea7b0';
      ctx.fillRect(0, y, 32, 1);
    }

    // Scratches and stains from 1000 hostel thalis
    ctx.fillStyle = '#7d8791';
    ctx.fillRect(8, 12, 6, 1);
    ctx.fillRect(20, 22, 8, 1);
    ctx.fillStyle = '#d4dc00'; // Turmeric dal ring stain!
    ctx.fillRect(14, 14, 4, 1);
    ctx.fillRect(14, 17, 4, 1);
    ctx.fillRect(13, 15, 1, 2);
    ctx.fillRect(18, 15, 1, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('mess_table', tex);
    return tex;
  }

  /**
   * 5-Compartment Indian Hostel Steel Thali (Top View)
   */
  public static getThaliTexture(): THREE.CanvasTexture {
    if (this.cache.has('thali')) return this.cache.get('thali')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 32);
    // Steel Plate Outer Rim
    ctx.fillStyle = '#949ba3';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#d8e0e8';
    ctx.fillRect(1, 1, 30, 30);
    ctx.fillStyle = '#b4bcc5';
    ctx.fillRect(2, 2, 28, 28);

    // Compartment 1: Watery Yellow Dal (Top Left)
    ctx.fillStyle = '#6e7680';
    ctx.fillRect(3, 3, 12, 10);
    ctx.fillStyle = '#facc15'; // Yellow dal
    ctx.fillRect(4, 4, 10, 8);
    ctx.fillStyle = '#4d3800'; // Floating jeera / mustard seed
    ctx.fillRect(6, 6, 1, 1);
    ctx.fillRect(9, 8, 1, 1);

    // Compartment 2: Mystery Sabzi / Aloo Gravy (Top Right)
    ctx.fillStyle = '#6e7680';
    ctx.fillRect(17, 3, 12, 10);
    ctx.fillStyle = '#b45309'; // Red-brown gravy
    ctx.fillRect(18, 4, 10, 8);
    ctx.fillStyle = '#fde68a'; // Potato cubes
    ctx.fillRect(20, 6, 3, 3);
    ctx.fillRect(24, 7, 2, 2);

    // Compartment 3: White Rice (Bottom Left)
    ctx.fillStyle = '#6e7680';
    ctx.fillRect(3, 15, 13, 14);
    ctx.fillStyle = '#f8fafc'; // Rice mound
    ctx.fillRect(4, 16, 11, 12);
    ctx.fillStyle = '#e2e8f0'; // Individual grain texture
    ctx.fillRect(5, 18, 2, 1);
    ctx.fillRect(9, 20, 2, 1);
    ctx.fillRect(7, 24, 2, 1);

    // Compartment 4: Two Dry Rotis (Bottom Right)
    ctx.fillStyle = '#6e7680';
    ctx.fillRect(18, 15, 11, 14);
    ctx.fillStyle = '#d97706'; // Golden toasted wheat
    ctx.fillRect(19, 16, 9, 10);
    ctx.fillStyle = '#78350f'; // Dark charred tawa spots
    ctx.fillRect(21, 18, 2, 1);
    ctx.fillRect(24, 21, 2, 1);
    ctx.fillRect(22, 23, 1, 1);

    // Compartment 5: Tiny Red Mango Pickle Dot (Center)
    ctx.fillStyle = '#6e7680';
    ctx.fillRect(13, 12, 6, 6);
    ctx.fillStyle = '#dc2626'; // Spicy red pickle
    ctx.fillRect(14, 13, 4, 4);
    ctx.fillStyle = '#f59e0b'; // Mango oil sheen
    ctx.fillRect(15, 14, 2, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('thali', tex);
    return tex;
  }

  /**
   * Blue Water Cooler with Chained Steel Glass
   */
  public static getWaterCoolerTexture(): THREE.CanvasTexture {
    if (this.cache.has('cooler')) return this.cache.get('cooler')!;

    const [canvas, ctx] = this.createPixelCanvas(32, 40);
    // Blue enamel body (classic Voltas / Blue Star)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 32, 40);

    // Front cooling vents
    ctx.fillStyle = '#0369a1';
    for (let y = 14; y < 36; y += 3) {
      ctx.fillRect(4, y, 24, 1);
    }

    // Top metal drip tray
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 32, 4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(2, 2, 28, 2);

    // Red Push Tap
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(14, 6, 4, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(15, 11, 2, 2);

    const tex = this.wrapTexture(canvas);
    this.cache.set('cooler', tex);
    return tex;
  }

  /**
   * Weekly Mess Menu Chalkboard
   */
  public static getMessMenuChalkboardTexture(): THREE.CanvasTexture {
    if (this.cache.has('mess_menu')) return this.cache.get('mess_menu')!;

    const [canvas, ctx] = this.createPixelCanvas(48, 36);
    // Wooden Frame
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 48, 36);

    // Dark Slate Chalkboard
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2, 2, 44, 32);

    // White Chalk Header: "MESS MENU"
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(6, 4, 36, 3);

    // Days lines
    const colors = ['#fde047', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#f87171'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors[i];
      const y = 10 + i * 5;
      ctx.fillRect(4, y, 8, 2); // Mon/Tue/etc
      ctx.fillRect(14, y, 28, 2); // Dish name
    }

    const tex = this.wrapTexture(canvas);
    this.cache.set('mess_menu', tex);
    return tex;
  }

  /**
   * Giant Dal Cauldron / Degchi
   */
  public static getCauldronTexture(): THREE.CanvasTexture {
    if (this.cache.has('cauldron')) return this.cache.get('cauldron')!;

    const [canvas, ctx] = this.createPixelCanvas(16, 16);
    ctx.fillStyle = '#9ca3af'; // Aluminum
    ctx.fillRect(0, 0, 16, 16);

    // Hammered spots & reflections
    for (let x = 0; x < 16; x += 3) {
      for (let y = 0; y < 16; y += 3) {
        ctx.fillStyle = Math.random() > 0.5 ? '#d1d5db' : '#6b7280';
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const tex = this.wrapTexture(canvas);
    this.cache.set('cauldron', tex);
    return tex;
  }
}
