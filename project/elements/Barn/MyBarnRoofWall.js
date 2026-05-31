import { CGFobject } from "../../../lib/CGF.js";

export class MyBarnRoofWall extends CGFobject {
  constructor(scene, px0, px1, h1, h2) {
    super(scene);
    this.px0 = px0;
    this.px1 = px1;
    this.h1 = h1;
    this.h2 = h2;
    
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -this.px0, 0, 0,        // canto inferior esquerdo
       this.px0, 0, 0,        // canto inferior direito
       this.px1, this.h1, 0,  // cima direito
      -this.px1, this.h1, 0,  // cima esquerdo
       0,        this.h2, 0   // topo 
    ];

    this.indices = [
      0, 1, 2,
      0, 2, 3,
      3, 2, 4
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 1,
      1, 1,
      (this.px0 + this.px1) / (2 * this.px0), 1 - (this.h1 / this.h2),
      (this.px0 - this.px1) / (2 * this.px0), 1 - (this.h1 / this.h2),
      0.5, 0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}