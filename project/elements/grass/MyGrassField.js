import { CGFobject } from "../../../lib/CGF.js";

export class MyGrassField extends CGFobject {
  constructor(
    scene,
    patch,
    terrain = null,
    rows = 7,
    cols = 7,
    width = 90,
    depth = 90,
    yOffset = 0.02,
    jitter = 0.35,
  ) {
    super(scene);

    this.patch = patch;
    this.terrain = terrain;
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.depth = depth;
    this.yOffset = yOffset;
    this.jitter = jitter;
    this.terrainYOffset = -1;

    this.transforms = [];
    this.initTransforms();
  }

  random(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  getTerrainHeight(x, z) {
    if (!this.terrain || typeof this.terrain.getHeight !== "function") {
      return 0;
    }

    return this.terrain.getHeight(x, z) + this.terrainYOffset;
  }

  initTransforms() {
    const rowStep = this.rows > 1 ? this.depth / (this.rows - 1) : 0;
    const colStep = this.cols > 1 ? this.width / (this.cols - 1) : 0;
    const halfWidth = this.width / 2;
    const halfDepth = this.depth / 2;

    let seed = 1;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const baseX = -halfWidth + col * colStep;
        const baseZ = -halfDepth + row * rowStep;

        const xJitter = (this.random(seed + 3) - 0.5) * colStep * this.jitter;
        const zJitter = (this.random(seed + 7) - 0.5) * rowStep * this.jitter;

        const x = baseX + xJitter;
        const z = baseZ + zJitter;
        const y = this.getTerrainHeight(x, z) + this.yOffset;
        const scale = 0.9 + this.random(seed + 11) * 0.7;
        const rotation = this.random(seed + 19) * Math.PI * 2;

        this.transforms.push({
          x,
          y,
          z,
          scale,
          rotation,
        });

        seed += 23;
      }
    }
  }

  display() {
    for (const transform of this.transforms) {
      this.scene.pushMatrix();
      this.scene.translate(transform.x, transform.y, transform.z);
      this.scene.rotate(transform.rotation, 0, 1, 0);
      this.scene.scale(transform.scale, transform.scale, transform.scale);

      this.patch.display();

      this.scene.popMatrix();
    }
  }
}
