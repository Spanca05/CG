import { CGFobject } from '../lib/CGF.js';
/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
    }

    display() {
        this.scene.pushMatrix();
        //! Porque é que com .rotate(), o ângulo tem que ser o inverso em relação a se for com matrizes?
        this.scene.translate(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.scene.pinkTriangle.display();
        this.scene.popMatrix();

        // Green Diamond
        this.scene.pushMatrix();
        let tx = 0.0;
        let ty = Math.sqrt(2);
        let tz = 0.0;
        let T = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
        let cos = Math.cos(Math.PI / 4);
        let sin = Math.sin(Math.PI / 4);
        let Rz = [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        this.scene.multMatrix(T);
        this.scene.multMatrix(Rz);
        this.scene.greenDiamond.display();
        this.scene.popMatrix();

        // Purple Triangle Small
        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2) / 2, 2 * Math.sqrt(2) / 2, 0);
        this.scene.rotate(3 * Math.PI / 4, 0, 0, 1);
        this.scene.purpleTriangleSmall.display();
        this.scene.popMatrix();

        // Red Triangle Small
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 4, 0, 0, 1);
        this.scene.redTriangleSmall.display();
        this.scene.popMatrix();

        // Yellow Parallelogram
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(3 * Math.PI / 4, 0, 0, 1);
        this.scene.yellowParallelogram.display();
        this.scene.popMatrix();

        // Blue Triangle Big
        this.scene.pushMatrix();
        this.scene.translate(-2.0 - Math.sqrt(2) / 2, - Math.sqrt(2) / 2, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.scene.blueTriangleBig.display();
        this.scene.popMatrix();

        // Orange Triangle Big
        this.scene.pushMatrix();
        this.scene.translate(2.0 + Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.orangeTriangleBig.display();
        this.scene.popMatrix();
    }
}