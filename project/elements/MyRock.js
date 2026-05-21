import { CGFobject } from "../../lib/CGF.js";

export class MyRock extends CGFobject {
  constructor(scene, slices = 16, stacks = 10, seed = 1) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.seed = seed;

    this.initBuffers();
  }

  random(i) {
    const x = Math.sin(i * 12.9898 + this.seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (let stack = 0; stack <= this.stacks; stack++) {
      const v = stack / this.stacks;
      const phi = -Math.PI / 2 + Math.PI * v;

      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      for (let slice = 0; slice <= this.slices; slice++) {
        const u = slice / this.slices;
        const theta = 2 * Math.PI * u;

        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const index = stack * (this.slices + 1) + slice;

        // Perturbação do raio
        const variation = 
            Math.sin(theta * 3 + this.seed) * 0.12 +
            Math.cos(phi * 4 + this.seed * 0.5) * 0.10 +
            (this.random(index) - 0.5) * 0.08;

        const radius = 1.0 + variation;

        const x = radius * cosPhi * cosTheta;
        const y = radius * sinPhi;
        const z = radius * cosPhi * sinTheta;

        this.vertices.push(x, y, z);

        const length = Math.sqrt(x * x + y * y + z * z);
        this.normals.push(x / length, y / length, z / length);

        this.texCoords.push(u, v);
      }
    }

    for (let stack = 0; stack <= this.stacks; stack++) {
      for (let slice = 0; slice <= this.slices; slice++) {
        const first = stack * (this.slices + 1) + slice;
        const second = first + this.slices + 1;

        this.indices.push(first, second, first + 1);
        this.indices.push(first + 1, second, second + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
