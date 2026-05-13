import { CGFobject } from "../lib/CGF.js";

export class MyFlowerPetal extends CGFobject {
  constructor(scene, length = 0.28, width = 0.16) {
    super(scene);
    this.length = length;
    this.width = width;
    this.initBuffers();
  }

  initBuffers() {
    // simple curved-ish petal made from two triangles (quad)
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const l = this.length;
    const w = this.width;

    // coordinates oriented so petal points along +X; base at origin
    const innerL = l * 0.18;
    const midL = l * 0.55;
    const tipL = l;

    // inner left, inner right, mid up, tip
    this.vertices.push(
      innerL,
      0.02,
      -w * 0.5,
      innerL,
      0.02,
      w * 0.5,
      midL,
      l * 0.15,
      0,
      tipL,
      l * 0.05,
      0,
    );

    // normals roughly upwards
    for (let i = 0; i < 4; i++) this.normals.push(0, 1, 0);
    this.texCoords.push(0, 1, 1, 1, 0.5, 0.3, 0.5, 0);

    // two triangles (innerLeft, innerRight, midUp) and (innerRight, tip, midUp)
    this.indices.push(0, 1, 2);
    this.indices.push(1, 3, 2);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
