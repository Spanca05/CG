import { CGFobject } from "../lib/CGF.js";

export class MyFlowerLeaf extends CGFobject {
  constructor(scene, length = 0.22, width = 0.08) {
    super(scene);
    this.length = length;
    this.width = width;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const l = this.length;
    const w = this.width;

    // Simple leaf (quad made of two triangles), pointing along +X
    // base, upper mid, tip, lower mid
    this.vertices.push(
      0,
      0,
      0,
      l * 0.5,
      w * 0.45,
      0,
      l,
      0,
      0,
      l * 0.5,
      -w * 0.45,
      0,
    );

    // Normals roughly up
    for (let i = 0; i < 4; i++) this.normals.push(0, 1, 0);

    this.texCoords.push(0, 0.5, 0.5, 0, 1, 0.5, 0.5, 1);

    this.indices.push(0, 1, 2, 0, 2, 3);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
