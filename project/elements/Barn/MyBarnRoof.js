import { CGFobject } from "../../../lib/CGF.js";
import { MyQuad } from "../../tps/MyQuad.js";

export class MyBarnRoof extends CGFobject {
  constructor(scene, length, L1, L2, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y) {
    super(scene);
    
    this.roofPanel = new MyQuad(scene);
    
    this.length = length;
    this.L1 = L1;
    this.L2 = L2;
    this.p0_x = p0_x;
    this.p0_y = p0_y;
    this.p1_x = p1_x;
    this.p1_y = p1_y;
    this.p2_x = p2_x;
    this.p2_y = p2_y;
  }

  drawPanel(startX, startY, endX, endY, pLength, flipNormal = false) {
    const roofLength = this.length + 1.0; 
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const angle = Math.atan2(endY - startY, endX - startX);

    this.scene.pushMatrix();
    this.scene.translate(midX, midY, 0); 
    this.scene.rotate(angle, 0, 0, 1);   
    this.scene.rotate(flipNormal ? -Math.PI / 2 : Math.PI / 2, 1, 0, 0); 
    this.scene.scale(pLength, roofLength, 1);
    this.scene.rotate(3 * Math.PI / 2, 0, 0, 1); 
    this.roofPanel.display();
    this.scene.popMatrix();
  }

  display() {
    this.drawPanel(this.p0_x, this.p0_y, this.p1_x, this.p1_y, this.L1, false); 
    this.drawPanel(this.p1_x, this.p1_y, this.p2_x, this.p2_y, this.L2, false); 

    this.drawPanel(-this.p0_x, this.p0_y, -this.p1_x, this.p1_y, this.L1, true); 
    this.drawPanel(-this.p1_x, this.p1_y, -this.p2_x, this.p2_y, this.L2, true); 
  }
}