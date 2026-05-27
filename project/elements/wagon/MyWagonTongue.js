import { CGFobject } from "../../../lib/CGF.js";
import { MyCylinder } from "../../tps/MyCylinder.js";

export class MyWagonTongue extends CGFobject {
  constructor(scene) {
    super(scene);
    this.cyl = new MyCylinder(scene, 24, 1);
  }

  display() {
    const scene = this.scene;
    this.cyl.display();
  }
}
