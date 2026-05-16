import { CGFobject } from "../lib/CGF.js";

export class MyTerrain extends CGFobject {
    constructor(scene, size = 100, divisions = 100, heightScale = 2) {
        super(scene);

        this.size = size;
        this.divisions = divisions;
        this.heightScale = heightScale;

        this.initBuffers();
    }

    getHeight(x, z) {
        return (
            Math.sin(x * 0.12) * 0.6 +
            Math.cos(z * 0.10) * 0.5 +
            Math.sin((x + z) * 0.05) * 0.4 
        ) * this.heightScale;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const halfSize = this.size / 2;
        const step = this.size / this.divisions;

        for (let row = 0; row <= this.divisions; row++) {
            const z = -halfSize + row * step;

            for (let col = 0; col <= this.divisions; col++) {
                const x = -halfSize + col * step;
                const y = this.getHeight(x, z);

                this.vertices.push(x, y, z);

                this.normals.push(0, 0, 0);

                const tilingFactor = 8; 
                const u = (col / this.divisions) * tilingFactor;
                const v = (row / this.divisions) * tilingFactor;
                this.texCoords.push(u, v);
            }
        }

        for (let row = 0; row < this.divisions; row++) {
            for (let col = 0; col < this.divisions; col++) {
                const topLeft = row * (this.divisions + 1) + col;
                const topRight = topLeft + 1;
                const bottomLeft = (row + 1) * (this.divisions + 1) + col;
                const bottomRight = bottomLeft + 1;

                this.indices.push(topLeft, bottomLeft, topRight);
                this.indices.push(topRight, bottomLeft, bottomRight);
            }
        }

        this.normals = new Array(this.vertices.length).fill(0);

        for (let i = 0; i < this.indices.length; i += 3) {
            const ia = this.indices[i] * 3;
            const ib = this.indices[i + 1] * 3;
            const ic = this.indices[i + 2] * 3;

            const vax = this.vertices[ia], vay = this.vertices[ia + 1], vaz = this.vertices[ia + 2];
            const vbx = this.vertices[ib], vby = this.vertices[ib + 1], vbz = this.vertices[ib + 2];
            const vcx = this.vertices[ic], vcy = this.vertices[ic + 1], vcz = this.vertices[ic + 2];

            const ux = vbx - vax, uy = vby - vay, uz = vbz - vaz;
            const vx = vcx - vax, vy = vcy - vay, vz = vcz - vaz;

            const nx = uy * vz - uz * vy;
            const ny = uz * vx - ux * vz;
            const nz = ux * vy - uy * vx;

            this.normals[ia] += nx; this.normals[ia + 1] += ny; this.normals[ia + 2] += nz;
            this.normals[ib] += nx; this.normals[ib + 1] += ny; this.normals[ib + 2] += nz;
            this.normals[ic] += nx; this.normals[ic + 1] += ny; this.normals[ic + 2] += nz;
        }

        for (let i = 0; i < this.normals.length; i += 3) {
            const nx = this.normals[i], ny = this.normals[i + 1], nz = this.normals[i + 2];
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
            this.normals[i] = nx / len;
            this.normals[i + 1] = ny / len;
            this.normals[i + 2] = nz / len;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

