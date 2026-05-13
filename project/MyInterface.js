import { CGFinterface, dat } from "../lib/CGF.js";

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.gui = new dat.GUI();

    const sceneFolder = this.gui.addFolder("Scene");
    sceneFolder.add(this.scene, "displayAxis").name("Display Axis");
    sceneFolder.open();

    const skyFolder = this.gui.addFolder("Sky");
    skyFolder.add(this.scene, "showSky").name("Visible");
    skyFolder.add(this.scene, "useSkyTexture").name("Use Texture");
    skyFolder.add(this.scene, "skyScale", 50, 400, 1).name("Size");
    skyFolder.open();

    const cloudsFolder = this.gui.addFolder("Clouds");
    cloudsFolder.add(this.scene, "showClouds").name("Visible");
    cloudsFolder.add(this.scene, "cloudsScale", 120, 260, 1).name("Size");
    cloudsFolder.add(this.scene, "cloudRotationSpeedDegPerSec", 0, 5, 0.05).name("Rotation Speed");
    cloudsFolder.open();

    const sunFolder = this.gui.addFolder("Sun");
    sunFolder.add(this.scene, "sunEnabled").name("Enabled");
    sunFolder.add(this.scene, "showSunMarker").name("Show Marker");
    sunFolder.add(this.scene, "sunAzimuthDeg", 0, 360, 1).name("Azimuth");
    sunFolder.add(this.scene, "sunElevationDeg", 0, 90, 1).name("Elevation");
    sunFolder.add(this.scene, "sunIntensity", 0, 2, 0.01).name("Intensity");
    sunFolder.add(this.scene, "sunMarkerSize", 1, 20, 0.1).name("Marker Size");
    sunFolder.open();

    const flowersFolder = this.gui.addFolder("Flowers");
    flowersFolder.add(this.scene, "showFlowers").name("Visible");
    flowersFolder.add(this.scene, "flowersStemHeight", 1, 100, 1).name("Stem Height");
    flowersFolder.add(this.scene, "flowersNumberPetals", 3, 10, 1).name("Petals");
    flowersFolder.add(this.scene, "flowersNumberLeaves", 0, 10, 1).name("Leaves");
    flowersFolder.add(this.scene, "flowersColorVariation", 0, 1, 0.1).name("Color Variation");
    flowersFolder.open();

    return true;
  }
}