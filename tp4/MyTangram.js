import { CGFappearance, CGFobject } from '../lib/CGF.js';
/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initMaterials();
    }

    createPieceMaterial(r, g, b) {
        const m = new CGFappearance(this.scene);
        m.setAmbient(0.2 * r, 0.2 * g, 0.2 * b, 1.0);
        m.setDiffuse(r, g, b, 1.0);
        m.setSpecular(1.0, 1.0, 1.0, 1.0);
        m.setShininess(80.0);
        return m;
    }

    initMaterials() {
        this.pinkMat = this.createPieceMaterial(0.95, 0.45, 0.70);
        this.purpleSmallMat = this.createPieceMaterial(0.55, 0.25, 0.75);
        this.redSmallMat = this.createPieceMaterial(0.90, 0.10, 0.10);
        this.yellowMat = this.createPieceMaterial(0.95, 0.85, 0.10);
        this.blueBigMat = this.createPieceMaterial(0.10, 0.35, 0.90);
        this.orangeBigMat = this.createPieceMaterial(0.95, 0.55, 0.10);
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        this.pinkMat.apply();
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
        this.scene.customMaterial.apply();
        this.scene.greenDiamond.display();
        this.scene.popMatrix();

        // Purple Triangle Small
        this.scene.pushMatrix();
        this.scene.translate(2 * Math.sqrt(2) / 2, 2 * Math.sqrt(2) / 2, 0);
        this.scene.rotate(3 * Math.PI / 4, 0, 0, 1);
        this.purpleSmallMat.apply();
        this.scene.purpleTriangleSmall.display();
        this.scene.popMatrix();

        // Red Triangle Small
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 4, 0, 0, 1);
        this.redSmallMat.apply();
        this.scene.redTriangleSmall.display();
        this.scene.popMatrix();

        // Yellow Parallelogram
        this.scene.pushMatrix();
        this.scene.translate(-Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(3 * Math.PI / 4, 0, 0, 1);
        this.yellowMat.apply();
        this.scene.yellowParallelogram.display();
        this.scene.popMatrix();

        // Blue Triangle Big
        this.scene.pushMatrix();
        this.scene.translate(-2.0 - Math.sqrt(2) / 2, - Math.sqrt(2) / 2, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.blueBigMat.apply();
        this.scene.blueTriangleBig.display();
        this.scene.popMatrix();

        // Orange Triangle Big
        this.scene.pushMatrix();
        this.scene.translate(2.0 + Math.sqrt(2) / 2, -Math.sqrt(2) / 2, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.orangeBigMat.apply();
        this.scene.orangeTriangleBig.display();
        this.scene.popMatrix();
    }
}