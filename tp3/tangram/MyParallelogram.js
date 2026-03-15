import { CGFobject } from '../../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
            1, 1, 0,	//1
            2, 1, 0,    //2
            3, 1, 0,	//3
            2, 0, 0,    //4
            1, 0, 0,    //5

            // BAck (duplicated)
            0, 0, 0,	//6
            1, 1, 0,	//7
            2, 1, 0,    //8
            3, 1, 0,	//9
            2, 0, 0,    //10
            1, 0, 0,    //11
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // Front (+Z)
            0, 5, 1,
            1, 5, 4,
            1, 4, 2,
            2, 4, 3,

            // Back(-Z)
            6,7, 11,
            11, 7, 10,
            10, 7, 8,
            10, 8, 9
        ];

        this.normals = [
            // Front
            0,0,1,  0,0,1,  0,0,1,
            0,0,1,  0,0,1,  0,0,1,

            // Back
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

