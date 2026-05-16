import { CGFobject } from "../lib/CGF.js";

export class MyDirtPatch extends CGFobject {
    constructor(scene, terrain, centerX, centerZ, radius = 5, rotation = 0, segments = 24, yOffset = 0.04) {
        super(scene);

        this.terrain = terrain;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.radius = radius;
        this.rotation = rotation;
        this.segments = Math.max(32, segments);
        this.yOffset = yOffset;
        this.terrainYOffset = -1;

        this.initBuffers();
    }

    getTerrainY(x, z) {
        return this.terrain.getHeight(x, z) + this.terrainYOffset + this.yOffset;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const cosR = Math.cos(this.rotation);
        const sinR = Math.sin(this.rotation);

        this.vertices.push(
            this.centerX, 
            this.getTerrainY(this.centerX, this.centerZ), 
            this.centerZ
        );
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.segments; i++) {
            const theta = (i / this.segments) * Math.PI * 2;

            const wobble =
                0.05 * Math.sin(i * 0.9 + this.centerX * 0.11 + this.centerZ * 0.07) +
                0.03 * Math.sin(i * 2.2 + this.centerX * 0.23 + this.centerZ * 0.17);

            const irregularity = 1.0 + wobble;
            const r = this.radius * irregularity;

            const localX = Math.cos(theta) * r;
            const localZ = Math.sin(theta) * r;

            const rotatedX = localX * cosR - localZ * sinR;
            const rotatedZ = localX * sinR + localZ * cosR;

            const worldX = this.centerX + rotatedX;
            const worldZ = this.centerZ + rotatedZ;
            const worldY = this.getTerrainY(worldX, worldZ);

            this.vertices.push(worldX, worldY, worldZ);
            this.normals.push(0, 1, 0);
            this.texCoords.push(
                (Math.cos(theta) + 1) * 0.5, 
                (Math.sin(theta) + 1) * 0.5
            );
        }

        for (let i = 1; i <= this.segments; i++) {
            this.indices.push(0, i + 1, i);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
