import { CGFobject } from "../../../lib/CGF.js";
import { MyCylinder } from "../../tps/MyCylinder.js";

export class MyWagonAxle extends CGFobject {
  constructor(scene, slices = 24, stacks = 1) {
    super(scene);
    this.cyl = new MyCylinder(scene, slices, stacks);
  }

  display() {
    this.cyl.display();
  }
}
