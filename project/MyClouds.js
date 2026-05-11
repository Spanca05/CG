import { CGFobject } from "../lib/CGF.js";

export class MyClouds extends CGFobject {
  constructor(scene, slices = 32, stacks = 16) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (let stack = 0; stack <= this.stacks; stack++) {
      const v = stack / this.stacks;
      const phi = (Math.PI / 2) * v;
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

        // Normals point outward so lighting works correctly even when
        // the dome is viewed from the inside.
        this.normals.push(x, y, z);
        this.texCoords.push(u, 1 - v);
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const first = stack * (this.slices + 1) + slice;
        const second = first + this.slices + 1;

        // Reversed winding so front faces are visible from inside.
        this.indices.push(first, first + 1, second);
        this.indices.push(first + 1, second + 1, second);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
