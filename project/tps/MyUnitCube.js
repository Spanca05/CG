import { CGFobject } from "../../lib/CGF.js";
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const pushFace = (v0, v1, v2, v3, nx, ny, nz) => {
      const base = this.vertices.length / 3;
      this.vertices.push(...v0, ...v1, ...v2, ...v3);

      this.indices.push(base, base + 1, base + 2);
      this.indices.push(base, base + 2, base + 3);
      this.indices.push(base + 2, base + 1, base);
      this.indices.push(base + 3, base + 2, base);
      

      for (let i = 0; i < 4; i++) this.normals.push(nx, ny, nz);
    };

    const s = 0.5;
    pushFace([s, s, -s], [-s, s, -s], [-s, -s, -s], [s, -s, -s], 0, 0, -1);
    pushFace([-s, s, s], [s, s, s], [s, -s, s], [-s, -s, s], 0, 0, 1);
    pushFace([s, s, s], [s, s, -s], [s, -s, -s], [s, -s, s], 1, 0, 0);
    pushFace([-s, s, -s], [-s, s, s], [-s, -s, s], [-s, -s, -s], -1, 0, 0);
    pushFace([-s, s, -s], [-s, s, s], [s, s, s], [s, s, -s], 0, 1, 0);
    pushFace([-s, -s, s], [s, -s, s], [s, -s, -s], [-s, -s, -s], 0, -1, 0);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
