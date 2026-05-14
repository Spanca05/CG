import { CGFobject } from "../lib/CGF.js";

export class MyFlowerPetal extends CGFobject {
  constructor(scene, length = 0.28, width = 0.16) {
    super(scene);
    this.length = length;
    this.width = width;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const l = this.length;
    const w = this.width;

    const segments = 12;
    const centerY = 0.02;
    const bulgeY = 0.02;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = l * t;
      const halfWidth = w * 0.55 * Math.sin(Math.PI * t);
      const y = centerY + bulgeY * 0.5 * Math.sin(Math.PI * t);

      this.vertices.push(x, y, halfWidth);
      this.vertices.push(x, y, -halfWidth);

      this.normals.push(0, 1, 0, 0, 1, 0);
    }

    for (let i = 0; i < segments; i++) {
      const topA = i * 2;
      const bottomA = topA + 1;
      const topB = topA + 2;
      const bottomB = topA + 3;

      this.indices.push(topA, topB, bottomA);
      this.indices.push(bottomA, topB, bottomB);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
