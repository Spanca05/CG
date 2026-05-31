import { CGFobject } from "../lib/CGF.js";

function fract(x) { return x - Math.floor(x); }

function hash3(px, py, pz) {
    const rx = px * 127.1 + py * 311.7 + pz * 74.7;
    const ry = px * 269.5 + py * 183.3 + pz * 246.1;
    const rz = px * 113.5 + py * 271.9 + pz * 124.6;
    return [
        fract(Math.sin(rx) * 43758.5453) * 2.0 - 1.0,
        fract(Math.sin(ry) * 43758.5453) * 2.0 - 1.0,
        fract(Math.sin(rz) * 43758.5453) * 2.0 - 1.0,
    ];
}

function gradientNoise(px, py, pz) {
    const ix = Math.floor(px), iy = Math.floor(py), iz = Math.floor(pz);
    const fx = px - ix, fy = py - iy, fz = pz - iz;
    const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
    const uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
    const uz = fz * fz * fz * (fz * (fz * 6 - 15) + 10);

    function dot(gx, gy, gz, ox, oy, oz) {
        const g = hash3(gx, gy, gz);
        return g[0] * ox + g[1] * oy + g[2] * oz;
    }

    function lerp(t, a, b) { return a + t * (b - a); }

    const n000 = dot(ix,   iy,   iz,   fx,   fy,   fz  );
    const n100 = dot(ix+1, iy,   iz,   fx-1, fy,   fz  );
    const n010 = dot(ix,   iy+1, iz,   fx,   fy-1, fz  );
    const n110 = dot(ix+1, iy+1, iz,   fx-1, fy-1, fz  );
    const n001 = dot(ix,   iy,   iz+1, fx,   fy,   fz-1);
    const n101 = dot(ix+1, iy,   iz+1, fx-1, fy,   fz-1);
    const n011 = dot(ix,   iy+1, iz+1, fx,   fy-1, fz-1);
    const n111 = dot(ix+1, iy+1, iz+1, fx-1, fy-1, fz-1);

    return lerp(uz,
        lerp(uy, lerp(ux, n000, n100), lerp(ux, n010, n110)),
        lerp(uy, lerp(ux, n001, n101), lerp(ux, n011, n111))
    );
}

function fbm(px, py, pz) {
    let total = 0, amplitude = 1, frequency = 1, maxAmplitude = 0;
    for (let i = 0; i < 6; i++) {
        total += gradientNoise(px * frequency, py * frequency, pz * frequency) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }
    return total / maxAmplitude;
}

export class MyTerrain extends CGFobject {
    constructor(scene, size = 100, divisions = 100, heightScale = 2, noiseScale = 0.008) {
        super(scene);

        this.size = size;
        this.divisions = divisions;
        this.heightScale = heightScale;
        this.noiseScale = noiseScale;

        this.initBuffers();
    }

    getHeight(x, z) {
        return fbm(x * this.noiseScale, 0.5, z * this.noiseScale) * this.heightScale;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const halfSize = this.size / 2;
        const step = this.size / this.divisions;

        for (let row = 0; row <= this.divisions; row++) {
            for (let col = 0; col <= this.divisions; col++) {
                const x = -halfSize + col * step;
                const z = -halfSize + row * step;

                const y = fbm(x * this.noiseScale, 0.5, z * this.noiseScale) * this.heightScale;
                this.vertices.push(x, y, z);
                this.normals.push(0, 1, 0);

                const tilingFactor = 8;
                this.texCoords.push(
                    (col / this.divisions) * tilingFactor,
                    (row / this.divisions) * tilingFactor
                );
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

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
