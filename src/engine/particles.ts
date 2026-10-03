import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  rotationSpeed: THREE.Vector3;
  scaleInitial: number;
}

export class VoxelParticleSystem {
  private scene: THREE.Scene;
  private particles: Particle[] = [];
  private boxGeometry: THREE.BoxGeometry;
  private dustMaterial: THREE.MeshLambertMaterial;
  private steamMaterial: THREE.MeshLambertMaterial;
  private sparkMaterial: THREE.MeshBasicMaterial;
  private xpMaterial: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    this.dustMaterial = new THREE.MeshLambertMaterial({
      color: 0xd6cdb7,
      transparent: true,
      opacity: 0.8
    });

    this.steamMaterial = new THREE.MeshLambertMaterial({
      color: 0xf5f5f5,
      transparent: true,
      opacity: 0.6
    });

    this.sparkMaterial = new THREE.MeshBasicMaterial({
      color: 0xffea00
    });

    this.xpMaterial = new THREE.MeshBasicMaterial({
      color: 0x55ff55
    });
  }

  /**
   * Spawns a burst of Minecraft block placement dust
   */
  public spawnDust(pos: THREE.Vector3, count = 12, spread = 0.5) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.boxGeometry, this.dustMaterial.clone());
      const size = 0.08 + Math.random() * 0.12;
      mesh.scale.set(size, size, size);
      mesh.position.set(
        pos.x + (Math.random() - 0.5) * spread,
        pos.y + 0.05,
        pos.z + (Math.random() - 0.5) * spread
      );

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.4;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        1.2 + Math.random() * 1.5,
        Math.sin(angle) * speed
      );

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        rotationSpeed: new THREE.Vector3(Math.random() * 5, Math.random() * 5, Math.random() * 5),
        scaleInitial: size
      });
    }
  }

  /**
   * Spawns steam rising from the Maggi kettle
   */
  public spawnSteam(pos: THREE.Vector3) {
    const mesh = new THREE.Mesh(this.boxGeometry, this.steamMaterial.clone());
    const size = 0.06 + Math.random() * 0.06;
    mesh.scale.set(size, size, size);
    mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.15,
      pos.y,
      pos.z + (Math.random() - 0.5) * 0.15
    );

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      0.8 + Math.random() * 0.5,
      (Math.random() - 0.5) * 0.2
    );

    this.scene.add(mesh);
    this.particles.push({
      mesh,
      velocity,
      life: 0,
      maxLife: 0.9 + Math.random() * 0.4,
      rotationSpeed: new THREE.Vector3(1, 1, 1),
      scaleInitial: size
    });
  }

  /**
   * Spawns electrical sparks from extension board
   */
  public spawnSparks(pos: THREE.Vector3, count = 8) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.boxGeometry, this.sparkMaterial);
      const size = 0.04 + Math.random() * 0.04;
      mesh.scale.set(size, size, size);
      mesh.position.copy(pos);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        1.5 + Math.random() * 2,
        (Math.random() - 0.5) * 3
      );

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.2,
        rotationSpeed: new THREE.Vector3(10, 10, 10),
        scaleInitial: size
      });
    }
  }

  /**
   * Spawns floating Minecraft XP orbs
   */
  public spawnXpOrbs(pos: THREE.Vector3, count = 6) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.boxGeometry, this.xpMaterial);
      const size = 0.12;
      mesh.scale.set(size, size, size);
      mesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.6,
        pos.y + 0.2,
        pos.z + (Math.random() - 0.5) * 0.6
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        1.8 + Math.random() * 1.0,
        (Math.random() - 0.5) * 0.6
      );

      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
        rotationSpeed: new THREE.Vector3(4, 4, 4),
        scaleInitial: size
      });
    }
  }

  public update(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        if (p.mesh.material instanceof THREE.Material) {
          p.mesh.material.dispose();
        }
        this.particles.splice(i, 1);
        continue;
      }

      // Physics update
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 3.5 * delta; // Gravity

      // Rotation
      p.mesh.rotation.x += p.rotationSpeed.x * delta;
      p.mesh.rotation.y += p.rotationSpeed.y * delta;
      p.mesh.rotation.z += p.rotationSpeed.z * delta;

      // Scale & opacity fade
      const progress = p.life / p.maxLife;
      const scale = p.scaleInitial * (1 - progress * 0.8);
      p.mesh.scale.set(scale, scale, scale);

      if (p.mesh.material instanceof THREE.MeshLambertMaterial || p.mesh.material instanceof THREE.MeshBasicMaterial) {
        p.mesh.material.opacity = Math.max(0, 1 - progress);
      }
    }
  }
}
