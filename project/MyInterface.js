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

    const sunFolder = this.gui.addFolder("Sun");
    sunFolder.add(this.scene, "sunEnabled").name("Enabled");
    sunFolder.add(this.scene, "showSunMarker").name("Show Marker");
    sunFolder.add(this.scene, "sunAzimuthDeg", 0, 360, 1).name("Azimuth");
    sunFolder.add(this.scene, "sunElevationDeg", 0, 90, 1).name("Elevation");
    sunFolder.add(this.scene, "sunIntensity", 0, 2, 0.01).name("Intensity");
    sunFolder.add(this.scene, "sunMarkerSize", 1, 20, 0.1).name("Marker Size");
    sunFolder.open();

    return true;
  }
}