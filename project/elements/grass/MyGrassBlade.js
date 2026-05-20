import { CGFobject } from "../../../lib/CGF.js";

export class MyGrassBlade extends CGFobject {
    constructor(scene, width = 0.12, height = 1.0, bend = 0.18, segments = 5) {
        super(scene);

        this.width = width;
        this.height = height;
        this.bend = bend;
        this.segments = segments;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let i = 0; i <= this.segments; i++) {
            const t = i / this.segments;
            const y = t * this.height;

            const currentWidth = this.width * (1 - t);
            const halfWidth = currentWidth / 2;

            const curveX = this.bend * t * t;

            this.vertices.push(
                curveX - halfWidth, y, 0,
                curveX + halfWidth, y, 0
            );

            this.normals.push(
                0, 0, 1,
                0, 0, 1
            );

            this.texCoords.push(
                0, 1 - t,
                1, 1 - t
            );
        }

        for (let i = 0; i < this.segments; i++) {
            const left0 = i * 2;
            const right0 = left0 + 1;
            const left1 = left0 + 2;
            const right1 = left0 + 3;

            this.indices.push(left0, right0, left1);
            this.indices.push(right0, right1, left1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
