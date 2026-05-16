import { CGFobject } from "../lib/CGF.js";

export class MyGrassPatch extends CGFobject {
    constructor(scene, blade, bladeCount = 16, radius = 0.5, spread = 0.15, colorVariants = null) {
        super(scene);
        this.blade = blade;
        this.bladeCount = bladeCount;
        this.radius = radius;
        this.spread = spread;

        this.transforms = [];
        if (colorVariants && Array.isArray(colorVariants) && colorVariants.length) {
            this.colorVariants = colorVariants;
        } else {
            this.colorVariants = [
                { ambient: [0.12, 0.30, 0.07], diffuse: [0.35, 0.45, 0.18] }, // main dry green
                { ambient: [0.09, 0.25, 0.06], diffuse: [0.22, 0.40, 0.12] }, // darker variant
                { ambient: [0.16, 0.12, 0.03], diffuse: [0.28, 0.20, 0.07] }, // dry/yellow
            ];
        }
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
            const distance = this.random(i + 17) * this.radius;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            const heightScale = 0.6 + this.random(i + 31) * 0.8;
            const widthScale = 0.85 + this.random(i + 43) * 0.6; 
            const bend = (this.random(i + 59) - 0.5) * this.spread;
            const yRotation = this.random(i + 71) * Math.PI * 2;

            const jitterX = (this.random(i + 83) - 0.5) * this.radius * 0.2;
            const jitterZ = (this.random(i + 97) - 0.5) * this.radius * 0.2;

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
        const baseAmbient = [0.1, 0.35, 0.08];
        const baseDiffuse = [0.2, 0.6, 0.15];

        for (let i = 0; i < this.transforms.length; i++) {
            const transform = this.transforms[i];

            const v = this.random(i + 101);
            const variant = this.colorVariants[Math.floor(v * this.colorVariants.length)];
            const brightness = 0.9 + this.random(i + 123) * 0.25;
            const ambient = variant.ambient.map(c => c * brightness);
            const diffuse = variant.diffuse.map(c => c * brightness);

            this.scene.grassAppearance.setAmbient(ambient[0], ambient[1], ambient[2], 1);
            this.scene.grassAppearance.setDiffuse(diffuse[0], diffuse[1], diffuse[2], 1);
            this.scene.grassAppearance.apply();

            this.scene.pushMatrix();
            this.scene.translate(transform.x, 0, transform.z);
            this.scene.rotate(transform.yRotation, 0, 1, 0);
            this.scene.scale(transform.widthScale, transform.heightScale, 1);

            this.scene.translate(transform.bend, 0, 0);

            this.blade.display();
            this.scene.popMatrix();
        }

        this.scene.grassAppearance.setAmbient(baseAmbient[0], baseAmbient[1], baseAmbient[2], 1);
        this.scene.grassAppearance.setDiffuse(baseDiffuse[0], baseDiffuse[1], baseDiffuse[2], 1);
        this.scene.grassAppearance.apply();
    }
}