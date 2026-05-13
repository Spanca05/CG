import { CGFobject } from "../lib/CGF.js";

export class MyFlowerCenter extends CGFobject {
  constructor(scene, radius = 0.08, slices = 16) {
    super(scene);
    this.radius = radius;
    this.slices = slices;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // center vertex
    this.vertices.push(0, 0.02, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    for (let s = 0; s <= this.slices; s++) {
      const theta = (2 * Math.PI * s) / this.slices;
      const x = Math.cos(theta) * this.radius;
      const z = Math.sin(theta) * this.radius;
      this.vertices.push(x, 0.02, z);
      this.normals.push(0, 1, 0);
      this.texCoords.push(
        0.5 + x / (2 * this.radius),
        0.5 + z / (2 * this.radius),
      );
    }

    for (let s = 1; s <= this.slices; s++) {
      this.indices.push(0, s, s + 1);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
