import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { MyWagonAxle } from "./MyWagonAxle.js";
import { MyWagonBed } from "./MyWagonBed.js";
import { MyWagonTongue } from "./MyWagonTongue.js";
import { MyWagonWheel } from "./MyWagonWheel.js";

export class MyWagon extends CGFobject {
  constructor(scene) {
    super(scene);

    this.width = 2.0;
    this.length = 3.0;
    this.height = 0.25;

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

  }

  display() {
    const scene = this.scene;

    scene.pushMatrix();

    if (this.wagonAppearance) this.wagonAppearance.apply();

    const x = this.length / 2 - 0.4;
    const z = this.width / 2 + 0.05;
    const wheelY = 0.0;
    const axleLength = 2 * z + 0.05;
    const bedY = 0.62;
    const bedHeight = this.height * 0.7;
    const supportHeight = bedY - bedHeight / 2 - wheelY;

    // wheel rotation (degrees) provided by scene, default 0
    const wheelDeg =
      scene && typeof scene.wheelRotationDeg === "number"
        ? scene.wheelRotationDeg
        : 0;
    const wheelRad = (wheelDeg * Math.PI) / 180.0;

    // Bed
    scene.pushMatrix();
    scene.translate(0, bedY, 0);
    scene.scale(this.length, bedHeight, this.width);
    this.bed.display();
    scene.popMatrix();

    // Front axle connecting the two front wheel centers
    scene.pushMatrix();
    scene.translate(-x, wheelY, 0);
    scene.translate(0, 0, -0.5 * axleLength);
    scene.scale(this.axleRadius, this.axleRadius, axleLength);
    this.axle.display();
    scene.popMatrix();

    // Back axle connecting the two back wheel centers
    scene.pushMatrix();
    scene.translate(x, wheelY, 0);
    scene.translate(0, 0, -0.5 * axleLength);
    scene.scale(this.axleRadius, this.axleRadius, axleLength);
    this.axle.display();
    scene.popMatrix();

    // Wheels
    // Front-left
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
    scene.translate(
      -x - this.tongueLength / 2 - 0.35,
      wheelY + 0.02,
      -this.tongueLength / 2,
    );
    scene.scale(this.tongueWidth, this.tongueHeight, this.tongueLength);
    this.tongue.display();

    scene.popMatrix();
  }
}
