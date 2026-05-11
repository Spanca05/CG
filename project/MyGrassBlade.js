import { CGFobject } from "../lib/CGF.js";

export class MyGrassBlade extends CGFobject {
    constructor(scene, width = 0.08, height = 1.0, bend = 0.05) {
        super(scene);
        this.width = width;
        this.height = height;
        this.bend = bend;
        this.initBuffers();
    }

    initBuffers() {
        const w = this.width / 2;
        const h = this.height;
        const b = this.bend;

        this.vertices = [
            // frente
            -w, 0, 0,
            w, 0, 0,
            b, h, 0,

            // trás
            w, 0, 0,
            -w, 0, 0,
            b, h, 0
        ];

        this.indices = [
            0, 1, 2,
            3, 4, 5,
        ];

        this.normals = [
            // frente
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // trás
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
        ];

        this.texCoords = [
            0, 1,
            1, 1,
            0.5, 0,

            1, 1,
            0, 1,
            0.5, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}