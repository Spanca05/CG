import {CGFobject} from '../lib/CGF.js';

export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        const alpha = 2 * Math.PI / this.slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];        

        for (let slice = 0; slice < this.slices; slice++) {

            const ang = slice * alpha
            const nextAng = (slice + 1) * alpha;

            const midAng = ang + alpha / 2;
            const nx = Math.cos(midAng);
            const ny = Math.sin(midAng);
            const nz = 0;

            for (let stack = 0; stack < this.stacks; stack++) {
                const z0 = stack / this.stacks;
                const z1 = (stack + 1) / this.stacks;

                this.vertices.push(
                    Math.cos(ang), Math.sin(ang), z0,
                    Math.cos(nextAng), Math.sin(nextAng), z0,

                    Math.cos(nextAng), Math.sin(nextAng), z1,
                    Math.cos(ang), Math.sin(ang), z1
                );

                // Índice base = retângulo número (slice * stacks + stack) * 4
                const base = (slice * this.stacks + stack) * 4;
                this.indices.push(base, base + 1, base + 2);
                this.indices.push(base, base + 2, base + 3);


                // Para cada um dos 4 vértices do retângulo:
                for (let i = 0; i < 4; i++) {
                    this.normals.push(nx, ny, nz);
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        if (typeof complexity === 'number') {
            this.slices = 3 + Math.round(9 * complexity);
            this.stacks = 1 + Math.round(8 * complexity);
        }
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}