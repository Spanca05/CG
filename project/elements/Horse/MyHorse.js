import { CGFobject, CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import { CGFobjModel } from "./CGFobjModel.js";

export class MyHorse extends CGFobject {
  constructor(scene) {
    super(scene);

    this.model = new CGFobjModel(scene, "elements/Horse/WildHorse.obj");

    this.horseMaterial = new CGFappearance(this.scene);
    this.horseMaterial.setAmbient(0.4, 0.4, 0.4, 1.0);
    this.horseMaterial.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.horseMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.horseMaterial.setShininess(10.0);

    this.horseTexture = new CGFtexture(
      this.scene,
      "elements/Horse/WildHorse_BaseColor.jpg",
    );
    this.horseMaterial.setTexture(this.horseTexture);
    this.horseMaterial.setTextureWrap("REPEAT", "REPEAT");
  }

  display() {
    this.scene.pushMatrix();

    this.horseMaterial.apply();
    this.scene.scale(0.2, 0.2, 0.2); // Increased scale so the horse is visible

    this.model.display();

    this.scene.popMatrix();
  }
}
