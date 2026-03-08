import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyTangram } from "./MyTangram.js";
import { MyUnitCube } from "./MyUnitCube.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.greenDiamond = new MyDiamond(this);
    this.pinkTriangle = new MyTriangle(this);
    this.redTriangleSmall = new MyTriangleSmall(this);
    this.purpleTriangleSmall = new MyTriangleSmall(this);
    this.orangeTriangleBig = new MyTriangleBig(this);
    this.blueTriangleBig = new MyTriangleBig(this);
    this.yellowParallelogram = new MyParallelogram(this);
    this.triangleSmall = new MyTriangleSmall(this);
    this.triangleBig = new MyTriangleBig(this);
    this.tangram = new MyTangram(this);
    this.unitCube = new MyUnitCube(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;
    this.displayTangram = true;
    this.displayTriangle = false;
    this.displayDiamond = false;
    this.displayParallelogram = false;
    this.displayTriangleSmall = false;
    this.displayTriangleBig = false;
    this.displayPurpleTriangle = false;
    this.displayRedTriangleSmall = false;
    this.displayOrangeTriangle = false;
    this.displayUnitCube = true;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0),
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    this.pushMatrix();
    this.multMatrix(sca);

    // ---- BEGIN Primitive drawing section

    if (this.displayTangram || this.displayUnitCube) {
      this.pushMatrix();
      // Rotate the Tangram and the base(unit cube) so it is parallel to the XZ plane
      this.rotate(-Math.PI / 2, 1, 0, 0);

      if (this.displayTangram) this.tangram.display();

      if (this.displayUnitCube) {
        this.pushMatrix();
        // Move only the base(unit cube) so its top-left vertex is at the origin after the parent rotation
        this.translate(0.5, -0.5, -0.5);
        this.unitCube.display();
        this.popMatrix();
      }

      this.popMatrix();
    }

    // Draw Individual Figures
    // Display Triangle
    if (this.displayTriangle) {
      this.pushMatrix();
      let tx = -Math.sqrt(2) / 2;
      let ty = Math.sqrt(2) / 2;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos(Math.PI / 4);
      let sin = Math.sin(Math.PI / 4);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.pinkTriangle.display();
      this.popMatrix();
    }

    // Display Diamond
    if (this.displayDiamond) {
      this.pushMatrix();
      let tx = 0.0;
      let ty = Math.sqrt(2);
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos(Math.PI / 4);
      let sin = Math.sin(Math.PI / 4);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.greenDiamond.display();
      this.popMatrix();
    }

    // Display Purple Triangle Small
    if (this.displayPurpleTriangle) {
      this.pushMatrix();
      let tx = (2 * Math.sqrt(2)) / 2;
      let ty = (2 * Math.sqrt(2)) / 2;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos((-3 * Math.PI) / 4);
      let sin = Math.sin((-3 * Math.PI) / 4);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.purpleTriangleSmall.display();
      this.popMatrix();
    }

    // Display Red Triangle Small
    if (this.displayRedTriangleSmall) {
      this.pushMatrix();
      let tx = 0.0;
      let ty = 0.0;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos(-Math.PI / 4);
      let sin = Math.sin(-Math.PI / 4);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.redTriangleSmall.display();
      this.popMatrix();
    }

    // Display Parallelogram
    if (this.displayParallelogram) {
      this.pushMatrix();
      let tx = -Math.sqrt(2) / 2;
      let ty = -Math.sqrt(2) / 2;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cosY = Math.cos(-Math.PI);
      let sinY = Math.sin(-Math.PI);
      let Ry = [cosY, 0, sinY, 0, 0, 1, 0, 0, -sinY, 0, cosY, 0, 0, 0, 0, 1];
      let cosZ = Math.cos((-3 * Math.PI) / 4);
      let sinZ = Math.sin((-3 * Math.PI) / 4);
      let Rz2 = [cosZ, -sinZ, 0, 0, sinZ, cosZ, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Ry);
      this.multMatrix(Rz2);
      this.yellowParallelogram.display();
      this.popMatrix();
    }

    // Display Small Triangle
    if (this.displayTriangleSmall) this.triangleSmall.display();

    // Display Big Triangle
    if (this.displayTriangleBig) {
      this.pushMatrix();
      let tx = -2.0 - Math.sqrt(2) / 2;
      let ty = 0.0 - Math.sqrt(2) / 2;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos(Math.PI / 2);
      let sin = Math.sin(Math.PI / 2);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.blueTriangleBig.display();
      this.popMatrix();
    }

    // Display Orange Triangle
    if (this.displayOrangeTriangle) {
      this.pushMatrix();
      let tx = 2.0 + Math.sqrt(2) / 2;
      let ty = -Math.sqrt(2) / 2;
      let tz = 0.0;
      let T = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
      let cos = Math.cos(-Math.PI / 2);
      let sin = Math.sin(-Math.PI / 2);
      let Rz = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      this.multMatrix(T);
      this.multMatrix(Rz);
      this.orangeTriangleBig.display();
      this.popMatrix();
    }

    this.popMatrix();

    // ---- END Primitive drawing section
  }
}
