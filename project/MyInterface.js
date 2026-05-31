import { CGFinterface, dat } from "../lib/CGF.js";

export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = [];
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
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

        const grassFolder = this.gui.addFolder("Grass");
        grassFolder.add(this.scene, "showGrass").name("Visible");
        grassFolder.add(this.scene, "grassScale", 0.1, 3, 0.05).name("Scale");
        grassFolder.open();

        const flowersFolder = this.gui.addFolder("Flowers");
        flowersFolder.add(this.scene, "showFlowers").name("Visible");
        flowersFolder.open();

        const wagonFolder = this.gui.addFolder("Wagon");
        wagonFolder.add(this.scene, "showWagon").name("Show Wagon");
        wagonFolder.add(this.scene, "useFollowCamera").name("Follow Camera");
        wagonFolder.open();

        const gameFolder = this.gui.addFolder("Game");
        gameFolder.add(this.scene, "hp", 0, 500).name("Health").listen();
        gameFolder.add(this.scene, "collisionDamage").name("Collison Damage").listen();
        gameFolder.add(this.scene, "healthRestore").name("Health Restore").listen();
        gameFolder.add(this.scene, "balesAtBarn").name("Bales at Barn").listen();
        gameFolder.add(this.scene, "score").name("Score ").listen();
        gameFolder.open();

        this.initKeys();

        return true;
    }
}