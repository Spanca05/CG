import { CGFobject } from "../../../lib/CGF.js";

export class MyFlowerStem extends CGFobject {
  constructor(scene, height = 0.6, radius = 0.015, slices = 16, stacks = 4) {
    super(scene);
    this.height = height;
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const alpha = (2 * Math.PI) / this.slices;
    for (let stack = 0; stack <= this.stacks; stack++) {
      const y = (stack / this.stacks) * this.height;
      for (let s = 0; s < this.slices; s++) {
        const ang = s * alpha;
        const x = Math.cos(ang) * this.radius;
        const z = Math.sin(ang) * this.radius;
        this.vertices.push(x, y, z);
        this.normals.push(Math.cos(ang), 0, Math.sin(ang));
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let s = 0; s < this.slices; s++) {
        const next = (s + 1) % this.slices;
        const a = stack * this.slices + s;
        const b = stack * this.slices + next;
        const c = (stack + 1) * this.slices + s;
        const d = (stack + 1) * this.slices + next;
        this.indices.push(a, c, b);
        this.indices.push(b, c, d);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
