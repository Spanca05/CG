import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyQuad } from "../../tps/MyQuad.js";

export class MyHayBale extends CGFobject {
  constructor(scene) {
    super(scene);
    
    this.quad = new MyQuad(scene);
    
    this.initMaterials();
  }

  initMaterials() {
    this.haySideTex = new CGFtexture(this.scene, "./textures/hay_side.jpg");
    this.hayTopTex = new CGFtexture(this.scene, "./textures/hay_top.jpg");

    this.sideApp = new CGFappearance(this.scene);
    this.sideApp.setAmbient(0.7, 0.7, 0.5, 1.0);
    this.sideApp.setDiffuse(0.9, 0.8, 0.4, 1.0);
    this.sideApp.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.sideApp.setShininess(5);
    this.sideApp.setTexture(this.haySideTex);
    this.sideApp.setTextureWrap("REPEAT", "REPEAT");

    this.topApp = new CGFappearance(this.scene);
    this.topApp.setAmbient(0.7, 0.7, 0.5, 1.0);
    this.topApp.setDiffuse(0.9, 0.8, 0.4, 1.0);
    this.topApp.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.topApp.setShininess(0.1);
    this.topApp.setTexture(this.hayTopTex);
    this.topApp.setTextureWrap("REPEAT", "REPEAT");
  }

  display() {
    const length = 3.0; 
    const height = 1.0; 
    const depth = 1.0;  

    this.scene.pushMatrix();
    
    this.scene.translate(0, height / 2, 0);

    this.sideApp.apply();

    // Face da Frente
    this.scene.pushMatrix();
    this.scene.translate(0, 0, depth / 2);
    this.scene.scale(length, height, 1);
    this.quad.display();
    this.scene.popMatrix();

    // Face de Trás 
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -depth / 2);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(length, height, 1);
    this.quad.display();
    this.scene.popMatrix();

    // Face de Cima 
    this.scene.pushMatrix();
    this.scene.translate(0, height / 2, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(length, depth, 1);
    this.quad.display();
    this.scene.popMatrix();

    // Face de Baixo
    this.scene.pushMatrix();
    this.scene.translate(0, -height / 2, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(length, depth, 1);
    this.quad.display();
    this.scene.popMatrix();



    this.topApp.apply();

    // esquerda
    this.scene.pushMatrix();
    this.scene.translate(-length / 2, 0, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.scale(depth, height, 1);
    this.quad.display();
    this.scene.popMatrix();

    // direita
    this.scene.pushMatrix();
    this.scene.translate(length / 2, 0, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(depth, height, 1);
    this.quad.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}