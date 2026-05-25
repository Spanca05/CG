import { CGFobject } from "../../../lib/CGF.js";
import { MyCylinder } from "../../tps/MyCylinder.js";
import { MyUnitCube } from "../../tps/MyUnitCube.js";

export class MyWagonWheel extends CGFobject {
  constructor(scene, radius = 0.45, thickness = 0.12, spokeCount = 8) {
    super(scene);

    this.radius = radius;
    this.thickness = thickness;
    this.spokeCount = spokeCount;

    this.rim = new MyCylinder(scene, 36, 1);
    this.hub = new MyCylinder(scene, 16, 1);
    this.spoke = new MyUnitCube(scene);
  }

  display() {
    const scene = this.scene;

    scene.pushMatrix();
    
    scene.translate(0, 0, -0.5 * this.thickness);
    scene.scale(this.radius, this.radius, this.thickness);
    this.rim.display();
    scene.popMatrix();

    scene.pushMatrix();
    scene.translate(0, 0, -0.5 * (this.thickness * 0.6));
    scene.scale(this.radius * 0.25, this.radius * 0.25, this.thickness * 0.6);
    this.hub.display();
    scene.popMatrix();

    const spokeLength = this.radius * 1.0;
    const spokeThickness = this.thickness * 0.25;

    for (let i = 0; i < this.spokeCount; i++) {
      const ang = (2 * Math.PI * i) / this.spokeCount;

      scene.pushMatrix();
      scene.rotate(ang, 0, 0, 1);
      scene.translate(spokeLength / 2, 0, 0);
      scene.translate(0, 0, -spokeThickness / 2);
      scene.scale(spokeLength, spokeThickness, spokeThickness);
      this.spoke.display();
    
      scene.popMatrix();
    }
  }
}
