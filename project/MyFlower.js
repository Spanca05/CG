import { CGFobject } from "../lib/CGF.js";

export class MyFlower extends CGFobject {
    constructor(scene, stemHeight = 0.6, petals = 6, leaves = 2, colorVariation = 0.0) {
        super(scene);

        this.stemHeight = stemHeight;
        this.petals = Math.max(3, Math.floor(petals));
        this.leaves = Math.max(0, Math.floor(leaves));
        this.colorVariation = colorVariation;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const petalLength = 0.30;
        const petalWidth = 0.18;
        const centerRadius = 0.08;
        const stemRadius = 0.015;
        const stemHeight = this.stemHeight;

        const slices = 8;
        const baseIndex = this.vertices.length / 3;
        for (let ring = 0; ring <= 1; ring++) {
            const y = ring * stemHeight;
            for (let s = 0; s < slices; s++) {
                const theta = (2 * Math.PI * s) / slices;
                const x = Math.cos(theta) * stemRadius;
                const z = Math.sin(theta) * stemRadius;
                this.vertices.push(x, y, z);
                this.normals.push(x, 0, z);
                this.texCoords.push(s / slices, ring);
            }
        }
        for (let s = 0; s < slices; s++) {
            const a = baseIndex + s;
            const b = baseIndex + ((s + 1) % slices);
            const c = baseIndex + slices + s;
            const d = baseIndex + slices + ((s + 1) % slices);
            this.indices.push(a, c, b);
            this.indices.push(b, c, d);
        }

        for (let p = 0; p < this.petals; p++) {
            const angle = (2 * Math.PI * p) / this.petals;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const px = cosA * petalLength * 0.5;
            const pz = sinA * petalLength * 0.5;
            const leftX = -sinA * petalWidth * 0.5;
            const leftZ = cosA * petalWidth * 0.5;
            const rightX = -leftX;
            const rightZ = -leftZ;

            const topX = cosA * petalLength;
            const topZ = sinA * petalLength;
            const yTop = stemHeight + petalLength * 0.15;

            const v0 = [px + leftX, stemHeight, pz + leftZ];
            const v1 = [px + rightX, stemHeight, pz + rightZ];
            const v2 = [topX, yTop, topZ];
            const base = this.vertices.length / 3;
            this.vertices.push(...v0, ...v1, ...v2);

            const nx = cosA, nz = sinA;
            this.normals.push(nx, 0, nz, nx, 0, nz, nx, 0, nz);
            this.texCoords.push(0, 1, 1, 1, 0.5, 0);
            this.indices.push(base, base + 1, base + 2);
        }

        const centerBase = this.vertices.length / 3;
        const centerSlices = 10;
        
        this.vertices.push(0, stemHeight + 0.02, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);
        for (let s = 0; s <= centerSlices; s++) {
            const theta = (2 * Math.PI * s) / centerSlices;
            const x = Math.cos(theta) * centerRadius;
            const z = Math.sin(theta) * centerRadius;
            this.vertices.push(x, stemHeight + 0.02, z);
            this.normals.push(0, 1, 0);
            this.texCoords.push(0.5 + x / (2 * centerRadius), 0.5 + z / (2 * centerRadius));
        }
        for (let s = 1; s <= centerSlices; s++) {
            this.indices.push(centerBase, centerBase + s, centerBase + s + 1);
        }

        for (let l = 0; l < this.leaves; l++) {
            const t = (l + 1) / (this.leaves + 1);
            const y = t * stemHeight;
            const side = l % 2 === 0 ? 1 : -1;
            const lx = side * 0.06;
            const tipX = side * 0.18;
            const tipY = y + 0.06;
            const base = this.vertices.length / 3;
            this.vertices.push(lx, y, 0, tipX, tipY, 0, lx, y + 0.02, 0);
            this.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
            this.texCoords.push(0, 1, 0.5, 0, 1, 1);
            this.indices.push(base, base + 1, base + 2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}
