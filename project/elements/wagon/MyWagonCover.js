import { CGFobject } from "../../../lib/CGF.js";
import { MyQuad } from "../../tps/MyQuad.js";
import { MyUnitCubeQuad } from "../../tps/MyUnitCubeQuad.js";

export class MyWagonCover extends CGFobject {
  constructor(scene, width, length, sides = 12, woodTexture = null) {
    super(scene);
    this.width = width;
    this.length = length;
    this.sides = sides;
    this.wallHeight =  0.75;
    
    this.panel = new MyQuad(scene);
    
  }

  display() {
    const radius = this.width / 2;
    const step = Math.PI / this.sides;
    const radius_center = radius * Math.cos(step / 2);
    const chord = 2 * radius * Math.sin(step / 2);

    this.scene.pushMatrix();
    this.scene.translate(0, this.wallHeight, 0); 
    
    for (let i = 0; i < this.sides; i++) {
      let angle = -Math.PI / 2 + (i + 0.5) * step;
      
      this.scene.pushMatrix();
      this.scene.rotate(angle, 1, 0, 0);
      this.scene.translate(0, radius_center, 0);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.scene.scale(this.length, chord, 1);
      this.panel.display(); // Face Exterior
      this.scene.rotate(Math.PI, 1, 0, 0);
      this.panel.display(); // Face Interior
      this.scene.popMatrix();
      
    }
    this.scene.popMatrix();
    // parede esquerda
    this.scene.pushMatrix();
    this.scene.translate(0, this.wallHeight / 2, radius);
    this.scene.scale(this.length, this.wallHeight, 1);

    this.scene.pushMatrix();
    this.panel.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.panel.display();
    this.scene.popMatrix();
    this.scene.popMatrix();

    // Parede Direita 
    this.scene.pushMatrix();
    this.scene.translate(0, this.wallHeight / 2, -radius);
    this.scene.scale(this.length, this.wallHeight, 1);
    
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.panel.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.panel.display();
    this.scene.popMatrix();
    this.scene.popMatrix();
  }
 
}