import { CGFobject } from "../../../lib/CGF.js";
import { MyUnitCube } from "../../tps/MyUnitCube.js";

export class MyWagonBed extends CGFobject {
  constructor(scene) {
    super(scene);
    this.cube = new MyUnitCube(scene);
  }

  display() {
    this.cube.display();
  }
}
