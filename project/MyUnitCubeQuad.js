import { CGFappearance, CGFobject } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";


export class MyUnitCubeQuad extends CGFobject {
  constructor(
    scene,
    topTexture = null,
    frontTexture = null,
    rightTexture = null,
    backTexture = null,
    leftTexture = null,
    bottomTexture = null,
  ) {
    super(scene);
    this.quad = new MyQuad(scene);

    this.topTexture = topTexture;
    this.frontTexture = frontTexture;
    this.rightTexture = rightTexture;
    this.backTexture = backTexture;
    this.leftTexture = leftTexture;
    this.bottomTexture = bottomTexture;

    this.faceMaterial = new CGFappearance(scene);
    this.faceMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.faceMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.faceMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.faceMaterial.setShininess(10.0);
    this.faceMaterial.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
  }

  applyFaceTexture(texture) {
    this.faceMaterial.setTexture(texture);
    this.faceMaterial.apply();

    this.scene.gl.texParameteri(
        this.scene.gl.TEXTURE_2D, 
        this.scene.gl.TEXTURE_MAG_FILTER, 
        this.scene.gl.NEAREST
    );
  }

  display() {
    // Front face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.frontTexture);
    this.scene.translate(0, 0, 0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Back face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.backTexture);
    this.scene.translate(0, 0, -0.5);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Right face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.rightTexture);
    this.scene.translate(0.5, 0, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Left face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.leftTexture);
    this.scene.translate(-0.5, 0, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Top face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.topTexture);
    this.scene.translate(0, 0.5, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Bottom face
    this.scene.pushMatrix();
    this.applyFaceTexture(this.bottomTexture);
    this.scene.translate(0, -0.5, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();
  }
}
