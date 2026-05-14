import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyFlowerStem } from "./MyFlowerStem.js";
import { MyFlowerPetal } from "./MyFlowerPetal.js";
import { MyFlowerCenter } from "./MyFlowerCenter.js";
import { MyFlowerLeaf } from "./MyFlowerLeaf.js";

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
    this.petals = petals;
    this.leaves = leaves;
    this.colorVariation = colorVariation;

    this.stem = new MyFlowerStem(scene, this.stemHeight, 0.015);
    this.petal = new MyFlowerPetal(scene, 0.4, 0.18);
    this.center = new MyFlowerCenter(scene, 0.12);
    this.leaf = new MyFlowerLeaf(scene, 0.24, 0.1);

    this.stemAppearance = new CGFappearance(scene);
    this.stemAppearance.setAmbient(0.05, 0.35, 0.05, 1);
    this.stemAppearance.setDiffuse(0.1, 0.6, 0.1, 1);
    this.stemAppearance.setSpecular(0, 0, 0, 1);
    this.stemAppearance.setShininess(2);

    this.petalAppearance = new CGFappearance(scene);
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
    this.centerAppearance.setAmbient(0.75, 0.62, 0.08, 1);
    this.centerAppearance.setDiffuse(0.98, 0.86, 0.12, 1);
    this.centerAppearance.setSpecular(0.2, 0.18, 0.08, 1);
    this.centerAppearance.setShininess(10);

    this.leafAppearance = new CGFappearance(scene);
    this.leafAppearance.setAmbient(0.08, 0.45, 0.08, 1);
    this.leafAppearance.setDiffuse(0.12, 0.68, 0.12, 1);
    this.leafAppearance.setSpecular(0.04, 0.08, 0.04, 1);
    this.leafAppearance.setShininess(6);
  }

  display() {
    this.scene.pushMatrix();
    this.stemAppearance.apply();
    this.stem.display();

    const totalLeaves = this.leaves;
    const levels = Math.ceil(totalLeaves / 2);
    let placed = 0;

    for (let i = 0; i < levels; i++) {
      const t = (i + 1) / (levels + 1);
      const y = this.stemHeight * (0.2 + 0.65 * t);

      if (placed < totalLeaves) {
        this.scene.pushMatrix();
        this.scene.translate(0, y, 0);
        this.scene.rotate(0, 0, 1, 0);
        this.scene.translate(0.03, 0, 0);
        this.scene.rotate(Math.PI / 5, 0, 0, 1);
        this.leafAppearance.apply();
        this.leaf.display();
        this.scene.popMatrix();
        placed++;
      }

      if (placed < totalLeaves) {
        this.scene.pushMatrix();
        this.scene.translate(0, y, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0.03, 0, 0);
        this.scene.rotate(Math.PI / 5, 0, 0, 1);
        this.leafAppearance.apply();
        this.leaf.display();
        this.scene.popMatrix();
        placed++;
      }
    }

    this.scene.popMatrix();

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

    this.scene.pushMatrix();
    this.scene.translate(0, this.stemHeight + 0.03, 0);
    this.centerAppearance.apply();
    this.center.display();
    this.scene.popMatrix();
  }
}
