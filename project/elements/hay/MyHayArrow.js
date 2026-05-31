import { CGFobject, CGFappearance } from "../../../lib/CGF.js";
import { MyUnitCube } from "../../tps/MyUnitCube.js";

export class MyHayArrow extends CGFobject {
  constructor(scene) {
    super(scene);

    this.shaft = new MyUnitCube(scene);
    this.head = new MyUnitCube(scene);

    this.arrowAppearance = new CGFappearance(this.scene);
    this.arrowAppearance.setAmbient(0.95, 0.8, 0.1, 1.0);
    this.arrowAppearance.setDiffuse(1.0, 0.9, 0.15, 1.0);
    this.arrowAppearance.setSpecular(0.4, 0.35, 0.0, 1.0);
    this.arrowAppearance.setEmission(0.35, 0.3, 0.0, 1.0);
    this.arrowAppearance.setShininess(8.0);

    this.greenAppearance = new CGFappearance(this.scene);
    this.greenAppearance.setAmbient(0.15, 0.75, 0.2, 1.0);
    this.greenAppearance.setDiffuse(0.2, 0.95, 0.25, 1.0);
    this.greenAppearance.setSpecular(0.2, 0.7, 0.2, 1.0);
    this.greenAppearance.setEmission(0.08, 0.35, 0.1, 1.0);
    this.greenAppearance.setShininess(12.0);
  }

  display(canPickup = false) {
    const appearance = canPickup ? this.greenAppearance : this.arrowAppearance;
    appearance.apply();

    this.scene.pushMatrix();
    this.scene.scale(0.12, 0.95, 0.12);
    this.shaft.display();
    this.scene.popMatrix();

    // Arrow head: a narrow point with two angled fins.
    this.scene.pushMatrix();
    this.scene.translate(-0.09, 0.38, 0);
    this.scene.rotate(Math.PI / 4, 0, 0, 1);
    this.scene.scale(0.2, 0.06, 0.1);
    this.head.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.09, 0.38, 0);
    this.scene.rotate(-Math.PI / 4, 0, 0, 1);
    this.scene.scale(0.2, 0.06, 0.1);
    this.head.display();
    this.scene.popMatrix();
  }
}
