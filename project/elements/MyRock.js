import { CGFobject } from "../../lib/CGF.js";

export class MyRock extends CGFobject {
  constructor(scene, slices = 20, stacks = 14, seed = 1) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.seed = seed;

    this.initBuffers();
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

        const x = cosPhi * cosTheta;
        const y = sinPhi;
        const z = cosPhi * sinTheta;

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
