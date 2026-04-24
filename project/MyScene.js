import {
  CGFscene,
  CGFcamera,
  CGFaxis,
  CGFappearance,
  CGFtexture,
} from "../lib/CGF.js";
import { MySky } from "./MySky.js";
import { MySun } from "./MySun.js";

export class MyScene extends CGFscene {
  constructor() {
    super();
    this.displayAxis = true;

    this.showSky = true;
    this.useSkyTexture = true;
    this.skyScale = 200;

    this.sunEnabled = true;
    this.sunAzimuthDeg = 45;
    this.sunElevationDeg = 35;
    this.sunIntensity = 1.0;
    this.showSunMarker = true;
    this.sunMarkerSize = 8;
  }

  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.sky = new MySky(this, 40, 20);
    this.sunMarker = new MySun(this, 24, 24);

    this.skyAppearance = new CGFappearance(this);
    this.skyAppearance.setAmbient(0.7, 0.8, 1.0, 1.0);
    this.skyAppearance.setDiffuse(0.7, 0.8, 1.0, 1.0);
    this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.skyAppearance.setShininess(1.0);

    this.enableTextures(true);
    this.skyTexture = new CGFtexture(this, "./textures/skyTexture.jpg");
    this.skyAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

    this.sunAppearance = new CGFappearance(this);
    this.sunAppearance.setAmbient(1.0, 0.85, 0.35, 1.0);
    this.sunAppearance.setDiffuse(1.0, 0.85, 0.35, 1.0);
    this.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.sunAppearance.setEmission(1.0, 0.7, 0.2, 1.0);
    this.sunAppearance.setShininess(1.0);
  }

  initLights() {
    this.lights[0].setVisible(false);
    this.updateSunLight();
    this.lights[0].enable();
    this.lights[0].update();
  }

  getSunDirection() {
    const azimuth = (this.sunAzimuthDeg * Math.PI) / 180;
    const elevation = (this.sunElevationDeg * Math.PI) / 180;

    return {
      x: Math.cos(elevation) * Math.cos(azimuth),
      y: Math.sin(elevation),
      z: Math.cos(elevation) * Math.sin(azimuth),
    };
  }

  updateSunLight() {
    const sunDir = this.getSunDirection();

    // Directional light (w = 0) for sun-like illumination.
    this.lights[0].setPosition(sunDir.x, sunDir.y, sunDir.z, 0);

    const i = Math.max(0, this.sunIntensity);
    this.lights[0].setAmbient(0.12 * i, 0.12 * i, 0.14 * i, 1);
    this.lights[0].setDiffuse(0.95 * i, 0.92 * i, 0.85 * i, 1);
    this.lights[0].setSpecular(0.25 * i, 0.24 * i, 0.22 * i, 1);

    if (this.sunEnabled) this.lights[0].enable();
    else this.lights[0].disable();
  }

  getSunMarkerDistance() {
    const edgePadding = 1.0;
    return Math.max(
      edgePadding,
      this.skyScale + this.sunMarkerSize + edgePadding,
    );
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

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    this.updateSunLight();
    this.lights[0].update();

    if (this.showSky) {
      this.pushMatrix();
      this.scale(this.skyScale, this.skyScale, this.skyScale);
      this.skyAppearance.setTexture(
        this.useSkyTexture ? this.skyTexture : null,
      );
      this.skyAppearance.apply();
      this.sky.display();
      this.popMatrix();
    }

    if (this.showSunMarker) {
      const sunDir = this.getSunDirection();
      const sunDistance = this.getSunMarkerDistance();

      this.pushMatrix();
      this.translate(
        sunDir.x * sunDistance,
        sunDir.y * sunDistance,
        sunDir.z * sunDistance,
      );
      this.scale(this.sunMarkerSize, this.sunMarkerSize, this.sunMarkerSize);
      this.sunAppearance.apply();
      this.sunMarker.display();
      this.popMatrix();
    }

    if (this.displayAxis) {
      this.axis.display();
    }
  }
}
