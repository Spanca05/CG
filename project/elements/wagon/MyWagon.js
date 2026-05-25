import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyWagonAxle } from "./MyWagonAxle.js";
import { MyWagonBed } from "./MyWagonBed.js";
import { MyWagonTongue } from "./MyWagonTongue.js";
import { MyWagonWheel } from "./MyWagonWheel.js";
import { MyWagonCover } from "./MyWagonCover.js"; 

export class MyWagon extends CGFobject {
  constructor(scene) {
    super(scene);

    this.width = 2.6;
    this.length = 4.0;
    this.height = 0.32;

    this.wheelRadius = 0.45;
    this.wheelThickness = 0.12;
    this.axleRadius = 0.06;

    this.tongueLength = 1.8;
    this.tongueWidth = 0.1;
    this.tongueHeight = 0.08;

    this.wheelFL = new MyWagonWheel(scene);
    this.wheelFR = new MyWagonWheel(scene);
    this.wheelBL = new MyWagonWheel(scene);
    this.wheelBR = new MyWagonWheel(scene);

    this.axle = new MyWagonAxle(scene);
    this.bed = new MyWagonBed(scene);
    this.tongue = new MyWagonTongue(scene);

    this.initMaterials();

    this.cover = new MyWagonCover(scene, this.width, this.length, 12, this.woodTex);
  }

  initMaterials() {
    this.woodApp = new CGFappearance(this.scene);
    this.woodApp.setAmbient(0.4, 0.3, 0.2, 1.0);
    this.woodApp.setDiffuse(0.6, 0.4, 0.2, 1.0);
    this.woodApp.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.woodApp.setShininess(10);
    this.woodTex = new CGFtexture(this.scene, "./textures/wood1_1.png");
    this.woodApp.setTexture(this.woodTex);
    this.woodApp.setTextureWrap("REPEAT", "REPEAT");

    this.clothApp = new CGFappearance(this.scene);
    this.clothApp.setAmbient(0.7, 0.7, 0.65, 1.0);
    this.clothApp.setDiffuse(0.9, 0.9, 0.85, 1.0); 
    this.clothApp.setSpecular(0.05, 0.05, 0.05, 1.0); 
    this.clothApp.setShininess(2);

    this.clothApp.setTexture(null); 
  }
    
  display() {
    const scene = this.scene;

    scene.pushMatrix();

    this.woodApp.apply();

    const x = this.length / 2 - 0.4;
    const z = this.width / 2 + 0.05;
    const wheelY = 0.0;
    const axleLength = 2 * z + 0.05;
    const bedY = 0.62;
    const bedHeight = this.height * 0.7;
    const supportHeight = bedY - bedHeight / 2 - wheelY;

    const wheelDeg = scene && typeof scene.wheelRotationDeg === "number" ? scene.wheelRotationDeg : 0;
    const wheelRad = (wheelDeg * Math.PI) / 180.0;

    // Bed
    scene.pushMatrix();
    scene.translate(0, bedY, 0);
    scene.scale(this.length, bedHeight, this.width);
    this.bed.display();
    scene.popMatrix();

    // Front axle 
    scene.pushMatrix();
    scene.translate(-x, wheelY, 0);
    scene.translate(0, 0, -0.5 * axleLength);
    scene.scale(this.axleRadius, this.axleRadius, axleLength);
    this.axle.display();
    scene.popMatrix();

    // Back axle 
    scene.pushMatrix();
    scene.translate(x, wheelY, 0);
    scene.translate(0, 0, -0.5 * axleLength);
    scene.scale(this.axleRadius, this.axleRadius, axleLength);
    this.axle.display();
    scene.popMatrix();

    // Wheels - Front-left
    scene.pushMatrix();
    scene.translate(-x, wheelY, z);
    scene.rotate(wheelRad, 0, 0, 1);
    this.wheelFL.display();
    scene.popMatrix();

    // Front-right
    scene.pushMatrix();
    scene.translate(-x, wheelY, -z);
    scene.rotate(wheelRad, 0, 0, 1);
    this.wheelFR.display();
    scene.popMatrix();

    // Back-left
    scene.pushMatrix();
    scene.translate(x, wheelY, z);
    scene.rotate(wheelRad, 0, 0, 1);
    this.wheelBL.display();
    scene.popMatrix();

    // Back-right
    scene.pushMatrix();
    scene.translate(x, wheelY, -z);
    scene.rotate(wheelRad, 0, 0, 1);
    this.wheelBR.display();
    scene.popMatrix();

    // Vertical supports that connect the middle of each axle to the bed
    for (const axleX of [-x, x]) {
      scene.pushMatrix();
      scene.translate(axleX, wheelY + 0.54, 0);
      scene.rotate(Math.PI / 2, 1, 0, 0);
      scene.scale(this.axleRadius, this.axleRadius, supportHeight);
      this.axle.display();
      scene.popMatrix();
    }

    // Tongue
    scene.pushMatrix();
    scene.translate(-x, wheelY + 0.02, 0);
    scene.rotate(Math.PI / 2, 0, 1, 0);
    scene.translate(0, 0, -this.tongueLength);
    scene.scale(this.tongueWidth, this.tongueHeight, this.tongueLength);
    this.tongue.display();
    scene.popMatrix();

    // Perpendicular tongue to make a cross
    scene.pushMatrix();
    scene.translate(-x - this.tongueLength / 2 - 0.35, wheelY + 0.02, -this.tongueLength / 2);
    scene.scale(this.tongueWidth, this.tongueHeight, this.tongueLength);
    this.tongue.display();
    scene.popMatrix();

   
    scene.pushMatrix();
    scene.translate(0, bedY + bedHeight / 2, 0);
    
    this.clothApp.apply(); 
    this.cover.display();
    
    this.woodApp.apply();
    this.cover.displayArches();
    
    scene.popMatrix();

    scene.popMatrix();
  }
}