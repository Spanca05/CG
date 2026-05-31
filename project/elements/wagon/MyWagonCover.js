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
    this.archThickness = 0.15;
    this.archDepth = 0.05;
    this.panel = new MyQuad(scene);
    this.beam = new MyUnitCubeQuad(
      scene,
      woodTexture,
      woodTexture,
      woodTexture,
      woodTexture,
      woodTexture,
      woodTexture,
    );

    
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
  displayArches(){

    const radius = this.width / 2 + 0.02; 
    
    const step = Math.PI / this.sides;
    const radius_center = radius * Math.cos(step / 2);
    const chord = 2 * radius * Math.sin(step / 2);

    
    const positions = [this.length / 2 - this.archThickness / 2, 0, -this.length / 2 + this.archThickness / 2];

    this.scene.pushMatrix();

    for (let xPos of positions) {
      this.scene.pushMatrix();
      this.scene.translate(xPos, 0, 0);

      // 1. Arco Curvo Superior
      this.scene.pushMatrix();
      this.scene.translate(0, this.wallHeight, 0);
      for (let i = 0; i < this.sides; i++) {
        let angle = -Math.PI / 2 + (i + 0.5) * step;
        this.scene.pushMatrix();
        this.scene.rotate(angle, 1, 0, 0);
        this.scene.translate(0, radius_center + this.archDepth /2, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.archThickness, chord, this.archDepth); // Escala para ser uma tira fina
        this.beam.display();
        this.scene.popMatrix();
      }
      this.scene.popMatrix();

      // 2. Paredes Verticais do Arco
      // Parede Esquerda (Exterior)
      this.scene.pushMatrix();
      this.scene.translate(0, this.wallHeight / 2, radius + this.archDepth);
      this.scene.scale(this.archThickness, this.wallHeight, this.archDepth);
      this.beam.display();
      this.scene.popMatrix();

      // Parede Direita (Exterior)
      this.scene.pushMatrix();
      this.scene.translate(0, this.wallHeight / 2, -radius - this.archDepth);
      this.scene.scale(this.archThickness, this.wallHeight, this.archDepth);
      this.scene.rotate(Math.PI, 0, 1, 0);
      this.beam.display();
      this.scene.popMatrix();

      this.scene.popMatrix();

    }
    this.scene.popMatrix();
    }
 
}