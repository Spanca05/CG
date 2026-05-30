import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyUnitCubeQuad } from "../../tps/MyUnitCubeQuad.js";
import { MyQuad } from "../../tps/MyQuad.js";
import { MyBarnRoofWall } from "./MyBarnRoofWall.js";
import { MyBarnRoof } from "./MyBarnRoof.js";

export class MyBarn extends CGFobject {
  constructor(scene, x = -60, z = 100, width = 24.0, height = 12.0, length = 28.0) {
    super(scene);

    this.x = x;
    this.z = z;
    this.width = width;
    this.height = height;
    this.length = length;
    
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

    const h1 = this.p1_y - this.p0_y;
    const h2 = this.p2_y - this.p0_y;

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
    this.door = new MyQuad(scene);
    this.window = new MyQuad(scene);
    
    this.roofwall = new MyBarnRoofWall(scene, this.p0_x, this.p1_x, h1, h2);
    this.roof = new MyBarnRoof(scene, this.length, this.L1, this.L2, this.p0_x, this.p0_y, this.p1_x, this.p1_y, this.p2_x, this.p2_y);
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
    this.roofwallAppearance.apply(); 
    
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

    
    this.scene.pushMatrix();
    this.roofAppearance.apply();
    this.roof.display();
    this.scene.popMatrix();
  }
}