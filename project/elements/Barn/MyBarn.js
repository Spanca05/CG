import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyUnitCubeQuad } from "../../tps/MyUnitCubeQuad.js";
import { MyQuad } from "../../tps/MyQuad.js";

export class MyBarn extends CGFobject {
  constructor(scene) {
    super(scene);

    this.initMaterials();

    this.body = new MyUnitCubeQuad(
      scene,
      null,
      this.wallTexture,
      this.wallTexture,
      this.wallTexture,
      this.wallTexture,
      null
    );

    this.roofPanel = new MyQuad(scene);
    this.door = new MyQuad(scene);
    this.window = new MyQuad(scene);
    
   
    this.width = 10.0;
    this.height = 5.0;
    this.length = 12.0;
    
    const theta1 = (60 * Math.PI) / 180;
    const theta2 = (25 * Math.PI) / 180;
    this.L1 = 3.8;

    this.p0_x = this.width / 2;
    this.p0_y = this.height;

    this.p1_x = this.p0_x - this.L1 * Math.cos(theta1);
    this.p1_y = this.p0_y + this.L1 * Math.sin(theta1);

    this.L2 = this.p1_x / Math.cos(theta2);

    this.p2_x = 0;
    this.p2_y = this.p1_y + this.L2 * Math.sin(theta2);

    
    this.roofwall = new CGFobject(scene);
    
    const h1 = this.p1_y - this.p0_y;
    const h2 = this.p2_y - this.p0_y;
    const px0 = this.p0_x;
    const px1 = this.p1_x;

    this.roofwall.initBuffers = function () {
      this.vertices = [
        -px0, 0, 0,   // canto inferior esquerdo
         px0, 0, 0,   // canto inferior direito
         px1, h1, 0,  // cima direito
        -px1, h1, 0,  // cima esquerdo
         0,   h2, 0   // topo 
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
        (px0 + px1) / (2 * px0), 1 - (h1 / h2),
        (px0 - px1) / (2 * px0), 1 - (h1 / h2),
        0.5, 0
      ];

      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    };

  
    this.roofwall.initBuffers();
  }

  initMaterials() {
    this.wallAppearance = new CGFappearance(this.scene);
    this.wallAppearance.setAmbient(0.5, 0.4, 0.3, 1.0); 
    this.wallAppearance.setDiffuse(0.88, 0.78, 0.65, 1.0);
    this.wallAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.wallAppearance.setShininess(10);
    this.wallTexture = new CGFtexture(this.scene, "./textures/barnwoodTexture.jpg");
    this.wallAppearance.setTexture(this.wallTexture);
    this.wallAppearance.setTextureWrap("REPEAT", "REPEAT");
   
    this.roofwallAppearance = new CGFappearance(this.scene);
    this.roofwallAppearance.setAmbient(0.8, 0.7, 0.6, 1.0); 
    this.roofwallAppearance.setDiffuse(1.0, 0.9, 0.8, 1.0);
    this.roofwallAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.roofwallAppearance.setShininess(10);
    this.roofwallAppearance.setTexture(this.wallTexture);
    this.roofwallAppearance.setTextureWrap("REPEAT", "REPEAT");
    
    this.roofAppearance = new CGFappearance(this.scene);
    this.roofAppearance.setAmbient(0.4, 0.35, 0.3, 1.0);
    this.roofAppearance.setDiffuse(0.85, 0.80, 0.75, 1.0);
    this.roofAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.roofAppearance.setShininess(5);
    this.roofTexture = new CGFtexture(this.scene, "./textures/roofwoodTexture.jpg");
    this.roofAppearance.setTexture(this.roofTexture);
    this.roofAppearance.setTextureWrap("REPEAT", "REPEAT");

    this.doorAppearance = new CGFappearance(this.scene);
    this.doorAppearance.setAmbient(0.6, 0.6, 0.6, 1.0);
    this.doorAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.doorAppearance.setShininess(5);
    this.doorTexture = new CGFtexture(this.scene, "./textures/doorTexture.jpg"); 
    this.doorAppearance.setTexture(this.doorTexture);
   
    this.windowAppearance = new CGFappearance(this.scene);
    this.windowAppearance.setAmbient(0.7, 0.7, 0.7, 1.0);
    this.windowAppearance.setDiffuse(0.9, 0.9, 0.9, 1.0);
    this.windowAppearance.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.windowAppearance.setShininess(20);
    this.windowTexture = new CGFtexture(this.scene, "./textures/windowTexture.jpg");
    this.windowAppearance.setTexture(this.windowTexture);
  }

  display() {
    this.scene.pushMatrix();
    this.wallAppearance.apply();
    this.scene.scale(this.width, this.height, this.length);
    this.scene.translate(0, 0.5, 0);
    this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.doorAppearance.apply();
    
    const doorWidth = this.width * 0.35;  
    const doorHeight = this.height * 0.75; 
    
  
    this.scene.translate(0, doorHeight / 2, this.length / 2 + 0.02);
    this.scene.scale(doorWidth, doorHeight, 1);
    this.door.display();
    this.scene.popMatrix();
    

    this.scene.pushMatrix();
    this.windowAppearance.apply();
    this.scene.translate(this.width / 2 + 0.02, this.height * 0.65, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(this.width * 0.25, this.width * 0.25, 1);
    this.window.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    this.wallAppearance.apply(); 
    
    this.scene.pushMatrix();
    this.scene.translate(0, this.p0_y, this.length / 2);
    this.roofwall.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, this.p0_y, -this.length / 2);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.roofwall.display();
    this.scene.popMatrix();

    this.scene.popMatrix();


    this.roofAppearance.apply();
    const roofLength = this.length + 1.0; 

    const drawPanel = (startX, startY, endX, endY, pLength, flipNormal = false) => {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const angle = Math.atan2(endY - startY, endX - startX);

      this.scene.pushMatrix();
      this.scene.translate(midX, midY, 0); 
      this.scene.rotate(angle, 0, 0, 1);   
      this.scene.rotate(flipNormal ? -Math.PI / 2 : Math.PI / 2, 1, 0, 0); 
      this.scene.scale(pLength, roofLength, 1);
      this.scene.rotate(3 * Math.PI / 2, 0, 0, 1); 
      this.roofPanel.display();
      this.scene.popMatrix();
    };

    drawPanel(this.p0_x, this.p0_y, this.p1_x, this.p1_y, this.L1, false); 
    drawPanel(this.p1_x, this.p1_y, this.p2_x, this.p2_y, this.L2, false); 

    drawPanel(-this.p0_x, this.p0_y, -this.p1_x, this.p1_y, this.L1, true); 
    drawPanel(-this.p1_x, this.p1_y, -this.p2_x, this.p2_y, this.L2, true); 
  }
}