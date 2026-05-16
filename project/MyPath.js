import { CGFobject } from "../lib/CGF.js";

export class MyPath extends CGFobject {
    constructor(
        scene,
        terrain = null,
        length = 120,
        width = 7,
        segments = 40,
        yOffset = 0.06,
    ) {
        super(scene);

        this.terrain = terrain;
        this.length = length;
        this.width = width;
        this.segments = segments;
        this.yOffset = yOffset;

        this.initBuffers();
    }

    random(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
    }

    getCenterX(z) {
        return Math.sin(z * 0.035) * 9;
    }

    getTerrainHeight(x, z) {
        if (!this.terrain || typeof this.terrain.getHeight !== "function") {
            return 0;
        }

        return this.terrain.getHeight(x, z) - 1;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const halfLength = this.length / 2;
        const halfWidth = this.width / 2;
        const step = this.length / this.segments;

        for (let i = 0; i <= this.segments; i++) {
            const z = -halfLength + i * step;
            const centerX = this.getCenterX(z);
            const taper = 0.88 + 0.12 * Math.cos((i / this.segments) * Math.PI);
            const currentHalfWidth = halfWidth * taper;
            const waviness = Math.sin(z * 0.18) * 0.35;
            const leftX = centerX - currentHalfWidth + waviness;
            const rightX = centerX + currentHalfWidth + waviness;
            const leftY = this.getTerrainHeight(leftX, z) + this.yOffset;
            const rightY = this.getTerrainHeight(rightX, z) + this.yOffset;
            const t = i / this.segments;

            this.vertices.push(leftX, leftY, z);
            this.vertices.push(rightX, rightY, z);

            this.normals.push(0, 1, 0);
            this.normals.push(0, 1, 0);

            this.texCoords.push(0, t * 4);
            this.texCoords.push(1, t * 4);
        }

        for (let i = 0; i < this.segments; i++) {
            const base = i * 2;
            this.indices.push(base, base + 2, base + 1);
            this.indices.push(base + 1, base + 2, base + 3);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}