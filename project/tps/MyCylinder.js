import { CGFobject } from "../../lib/CGF.js";

export class MyCylinder extends CGFobject {
  constructor(scene, slices, stacks) {
    super(scene);

    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
  }

  initBuffers() {
    const alpha = (2 * Math.PI) / this.slices;

    this.vertices = [];
    this.indices = [];
    this.normals = [];

    for (let stack = 0; stack <= this.stacks; stack++) {
      const z = stack / this.stacks;

      for (let slice = 0; slice < this.slices; slice++) {
        const ang = slice * alpha;
        const x = Math.cos(ang);
        const y = Math.sin(ang);

        this.vertices.push(x, y, z);

        const len = Math.hypot(x, y) || 1;
        this.normals.push(x / len, y / len, 0);
        
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const nextSlice = (slice + 1) % this.slices;

        const v0 = stack * this.slices + slice;
        const v1 = stack * this.slices + nextSlice;
        const v2 = (stack + 1) * this.slices + nextSlice;
        const v3 = (stack + 1) * this.slices + slice;

        this.indices.push(v0, v1, v2);
        this.indices.push(v0, v2, v3);
        this.indices.push(v2, v1, v0);
        this.indices.push(v3, v2, v0);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  updateBuffers(complexity) {
    if (typeof complexity === "number") {
      this.slices = 3 + Math.round(9 * complexity);
      this.stacks = 1 + Math.round(8 * complexity);
    }

    this.initBuffers();
    this.initNormalVizBuffers();
  }
}
