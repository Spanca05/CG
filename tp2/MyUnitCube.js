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
            0.5, 0.5, -0.5,	//0
            0.5, -0.5, -0.5, //1
            -0.5, 0.5, -0.5, //2
            -0.5, -0.5, -0.5, //3
            -0.5, -0.5, 0.5,//4
            -0.5, 0.5, 0.5,//5
            0.5, -0.5, 0.5,//6
            0.5, 0.5, 0.5,	//7

        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 2, 1,
            2, 3, 1, // 1
            4, 5, 6,
            5, 7, 6, // 2
            0, 1, 6,
            0, 6, 7,//3
            1, 3, 4,
            1, 4, 6,//4
            3, 2, 5,
            3, 5, 4,//5
            2, 0, 7,
            2, 7, 5 //6
        ];

        
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

