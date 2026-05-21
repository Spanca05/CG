import { CGFobject } from "../../../lib/CGF.js";

export class MyGrassPatch extends CGFobject {
    constructor(
        scene,
        blade,
        bladeCount = 16,
        radius = 0.5,
        spread = 0.15,
    ) {
        super(scene);

        this.blade = blade;
        this.bladeCount = bladeCount;
        this.radius = radius;
        this.spread = spread;

        this.transforms = [];
        this.initTransforms();
    }

    random(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
    }

    initTransforms() {
        this.transforms = [];

        for (let i = 0; i < this.bladeCount; i++) {
            const angle = this.random(i + 1) * Math.PI * 2;

            const edgeNoise = 0.7 + 0.3 * Math.sin(angle * 4.0 + this.random(i + 200) * Math.PI * 2);   
            const distance = Math.sqrt(this.random(i + 17)) * this.radius * edgeNoise;

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            const heightScale = 0.6 + this.random(i + 31) * 0.8;
            const widthScale = 0.85 + this.random(i + 43) * 0.6;
            const bend = (this.random(i + 59) - 0.5) * this.spread;
            const yRotation = this.random(i + 71) * Math.PI * 2;

            const jitterX = (this.random(i + 83) - 0.5) * this.radius * 0.08;
            const jitterZ = (this.random(i + 97) - 0.5) * this.radius * 0.08;

            this.transforms.push({
                x: x + jitterX,
                z: z + jitterZ,
                heightScale,
                widthScale,
                bend,
                yRotation,
            });
        }
    }

    display() {
        for (const transform of this.transforms) {
            this.scene.pushMatrix();

            this.scene.translate(transform.x, 0, transform.z);
            this.scene.rotate(transform.yRotation, 0, 1, 0);
            this.scene.translate(transform.bend, 0, 0);
            this.scene.scale(transform.widthScale, transform.heightScale, 1);

            this.blade.display();

            this.scene.popMatrix();
        }
    }
}
