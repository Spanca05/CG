import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyFlowerStem } from "./MyFlowerStem.js";
import { MyFlowerPetal } from "./MyFlowerPetal.js";
import { MyFlowerCenter } from "./MyFlowerCenter.js";

export class MyFlower extends CGFobject {
  constructor(
    scene,
    stemHeight = 0.6,
    petals = 6,
    leaves = 2,
    colorVariation = 0.0,
  ) {
    super(scene);

    this.stemHeight = stemHeight;
    this.petals = Math.max(3, Math.floor(petals));
    this.colorVariation = colorVariation;

    // sub-objects
    this.stem = new MyFlowerStem(scene, this.stemHeight, 0.015);
    this.petal = new MyFlowerPetal(scene, 0.3, 0.18);
    this.center = new MyFlowerCenter(scene, 0.08);

    // per-part appearances
    this.stemAppearance = new CGFappearance(scene);
    this.stemAppearance.setAmbient(0.05, 0.35, 0.05, 1);
    this.stemAppearance.setDiffuse(0.1, 0.6, 0.1, 1);
    this.stemAppearance.setSpecular(0, 0, 0, 1);
    this.stemAppearance.setShininess(2);

    this.petalAppearance = new CGFappearance(scene);
    // base petal color (can be varied by colorVariation)
    const pv = Math.max(0, Math.min(1, this.colorVariation));
    const petalR = 0.9 - pv * 0.2;
    const petalG = 0.3 - pv * 0.1;
    const petalB = 0.45 + pv * 0.2;
    this.petalAppearance.setAmbient(
      petalR * 0.9,
      petalG * 0.9,
      petalB * 0.9,
      1,
    );
    this.petalAppearance.setDiffuse(petalR, petalG, petalB, 1);
    this.petalAppearance.setSpecular(0.15, 0.08, 0.08, 1);
    this.petalAppearance.setShininess(10);

    this.centerAppearance = new CGFappearance(scene);
    this.centerAppearance.setAmbient(0.45, 0.28, 0.05, 1);
    this.centerAppearance.setDiffuse(0.6, 0.38, 0.08, 1);
    this.centerAppearance.setSpecular(0.05, 0.03, 0.02, 1);
    this.centerAppearance.setShininess(6);
  }

  display() {
    // draw stem (origin at ground)
    this.scene.pushMatrix();
    this.stemAppearance.apply();
    this.stem.display();
    this.scene.popMatrix();

    // draw petals around top of stem
    this.scene.pushMatrix();
    this.scene.translate(0, this.stemHeight, 0);
    for (let p = 0; p < this.petals; p++) {
      this.scene.pushMatrix();
      const ang = (2 * Math.PI * p) / this.petals;
      this.scene.rotate(ang, 0, 1, 0);
      this.petalAppearance.apply();
      this.petal.display();
      this.scene.popMatrix();
    }
    this.scene.popMatrix();

    // center disk
    this.scene.pushMatrix();
    this.scene.translate(0, this.stemHeight + 0.02, 0);
    this.centerAppearance.apply();
    this.center.display();
    this.scene.popMatrix();
  }
}
