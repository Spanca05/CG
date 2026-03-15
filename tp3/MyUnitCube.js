import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // Front (+Z)
            -0.5, -0.5, 0.5,//4
            0.5, -0.5, 0.5,//6
            0.5, 0.5, 0.5,	//7
            -0.5, 0.5, 0.5,//5

            // Back (-Z)
            0.5, -0.5, -0.5, //1
            -0.5, -0.5, -0.5, //3
            -0.5, 0.5, -0.5, //2
            0.5, 0.5, -0.5,	//0

            // Top (+Y)
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,

            // Bottom (-Y)
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Right (+X)
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,

            // Left (-X)
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,    0, 2, 3,
            4, 5, 6,    4, 6, 7,
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];

        this.normals = [
            // Front (+Z)
            0,0,1,  0,0,1,  0,0,1,  0,0,1,
            // Back (-Z)
            0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
            // Top (+Y)
            0,1,0,  0,1,0,  0,1,0,  0,1,0,
            // Bottom (-Y)
            0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
            // Right (+X)
            1,0,0,  1,0,0,  1,0,0,  1,0,0,
            // Left (-X)
            -1,0,0, -1,0,0, -1,0,0, -1,0,0
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

