import {
    CGFscene,
    CGFcamera,
    CGFaxis,
    CGFappearance,
    CGFtexture,
} from "../lib/CGF.js";
import { MySky } from "./MySky.js";
import { MyClouds } from "./MyClouds.js";
import { MySun } from "./MySun.js";
import { MySphere } from "./MySphere.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyRock } from "./MyRock.js";

export class MyScene extends CGFscene {
    constructor() {
        super();
        this.displayAxis = true;

        this.showSky = true;
        this.useSkyTexture = true;
        this.skyScale = 200;

        this.showClouds = true;
        this.cloudsScale = 180;
        this.cloudRotationDeg = 0;
        this.cloudRotationSpeedDegPerSec = 0.8;
        this.lastUpdateTime = 0;

        this.sunEnabled = true;
        this.sunAzimuthDeg = 45;
        this.sunElevationDeg = 35;
        this.sunIntensity = 1.0;
        this.showSunMarker = true;
        this.sunMarkerSize = 10;
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
        this.clouds = new MyClouds(this, 40, 20);
        this.sunMarker = new MySun(this, 24, 24);
        this.sunAuraMarker = new MySun(this, 24, 24);
        this.terrain = new MyTerrain(this, 420, 120, 1.2);
        this.sphere = new MySphere(this, 8, 32, 32);
        this.rocks = [];
        this.rocks.push(new MyRock(this, 16, 10, 1));
        this.rocks.push(new MyRock(this, 12, 8, 2));
        this.rocks.push(new MyRock(this, 14, 9, 3));
        this.rocks.push(new MyRock(this, 13, 9, 4));
        this.rocks.push(new MyRock(this, 15, 10, 5));

        this.skyAppearance = new CGFappearance(this);
        this.skyAppearance.setAmbient(0.7, 0.8, 1.0, 1.0);
        this.skyAppearance.setDiffuse(0.7, 0.8, 1.0, 1.0);
        this.skyAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.skyAppearance.setShininess(1.0);

        this.enableTextures(true);
        this.skyTexture = new CGFtexture(this, "./textures/skyTexture.jpg");
        this.skyAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

        this.sunAppearance = new CGFappearance(this);
        this.sunAppearance.setAmbient(1.0, 0.78, 0.25, 1.0);
        this.sunAppearance.setDiffuse(1.0, 0.78, 0.25, 1.0);
        this.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.sunAppearance.setEmission(1.0, 0.65, 0.18, 1.0);
        this.sunAppearance.setShininess(1.0);

        this.sunAuraAppearance = new CGFappearance(this);
        this.sunAuraAppearance.setAmbient(1.0, 0.85, 0.35, 0.18);
        this.sunAuraAppearance.setDiffuse(1.0, 0.85, 0.35, 0.18);
        this.sunAuraAppearance.setSpecular(0, 0, 0, 1);
        this.sunAuraAppearance.setEmission(1.0, 0.75, 0.25, 0.18);
        this.sunAuraAppearance.setShininess(1.0);

        this.cloudTexture = new CGFtexture(this, "./textures/cloudTexture.png");

        this.cloudAppearance = new CGFappearance(this);
        this.cloudAppearance.setAmbient(1, 1, 1, 1);
        this.cloudAppearance.setDiffuse(1, 1, 1, 1);
        this.cloudAppearance.setSpecular(0, 0, 0, 1);
        this.cloudAppearance.setShininess(1);
        this.cloudAppearance.setTexture(this.cloudTexture);
        this.cloudAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.setUpdatePeriod(50);

        this.terrainAppearance = new CGFappearance(this);
        this.terrainTexture = new CGFtexture(this, "./textures/ground.jpg")

        this.terrainAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.terrainAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
        this.terrainAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.terrainAppearance.setShininess(10);
        this.terrainAppearance.setTexture(this.terrainTexture);
        this.terrainAppearance.setTextureWrap("REPEAT", "REPEAT");

        // Simple appearance for the test sphere (base for rocks)
        this.sphereAppearance = new CGFappearance(this);
        this.sphereAppearance.setAmbient(0.6, 0.6, 0.6, 1.0);
        this.sphereAppearance.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.sphereAppearance.setSpecular(0.05, 0.05, 0.05, 1.0);
        this.sphereAppearance.setShininess(5.0);

        this.rockAppearence = new CGFappearance(this);
        this.rockAppearence.setAmbient(0.35, 0.35, 0.35, 1);
        this.rockAppearence.setDiffuse(0.45, 0.45, 0.45, 1);
        this.rockAppearence.setSpecular(0.08, 0.08, 0.08, 1);
        this.rockAppearence.setShininess(8);

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

        // Set directional light position to match visual sun direction.
        this.lights[0].setPosition(sunDir.x, sunDir.y, sunDir.z, 0);

        const i = Math.max(0, this.sunIntensity);
        this.lights[0].setAmbient(0.25 * i, 0.24 * i, 0.22 * i, 1);
        this.lights[0].setDiffuse(0.95 * i, 0.92 * i, 0.85 * i, 1);
        this.lights[0].setSpecular(0.25 * i, 0.24 * i, 0.22 * i, 1);

        if (this.sunEnabled) this.lights[0].enable();
        else this.lights[0].disable();
    }

    getSunMarkerDistance() {
        const edgePadding = 1.0;
        // Keep marker slightly inside the dome so it is not hidden by sky depth.
        return Math.max(
            edgePadding,
            this.skyScale - this.sunMarkerSize - edgePadding,
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

    update(t) {
        if (this.lastUpdateTime === 0) {
            this.lastUpdateTime = t;
            return;
        }

        const dt = (t - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = t;
        this.cloudRotationDeg = (this.cloudRotationDeg + this.cloudRotationSpeedDegPerSec * dt) % 360;
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

        if (this.showClouds) {
            this.pushMatrix();
            this.scale(this.cloudsScale, this.cloudsScale, this.cloudsScale);
            this.rotate((this.cloudRotationDeg * Math.PI) / 180, 0, 1, 0);

            this.gl.enable(this.gl.BLEND);

            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(false);

            this.cloudAppearance.apply();
            this.clouds.display();

            this.gl.depthMask(true);
            this.gl.disable(this.gl.BLEND);
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
            this.scale(
                this.sunMarkerSize * 1.3,
                this.sunMarkerSize * 1.3,
                this.sunMarkerSize * 1.3,
            );

            this.gl.enable(this.gl.BLEND);
            this.gl.blendColor(1.0, 0.85, 0.3, 0.18);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.depthMask(false);

            this.sunAuraAppearance.apply();
            this.sunAuraMarker.display();

            this.gl.depthMask(true);
            this.gl.disable(this.gl.BLEND);
            this.popMatrix();

            this.pushMatrix();
            this.translate(
                sunDir.x * sunDistance,
                sunDir.y * sunDistance,
                sunDir.z * sunDistance,
            );
            this.scale(
                this.sunMarkerSize,
                this.sunMarkerSize,
                this.sunMarkerSize,
            );

            this.sunAppearance.apply();
            this.sunMarker.display();

            this.popMatrix();
        }

        this.pushMatrix();
        this.translate(0, -1, 0);
        this.terrainAppearance.apply();
        this.terrain.display();

        this.popMatrix();

        this.rocks.forEach((rock, i) => {
            this.pushMatrix();
            const x = 5 + (i % 3) * 8;
            const z = 0 + Math.floor(i / 3) * 10;
            this.translate(x, 1, z);
            this.scale(2.5 - i * 0.1, 1.4, 2.0);
            this.rockAppearence.apply();
            rock.display();
            this.popMatrix();
        });

        if (this.displayAxis) {
            this.axis.display();
        }
    }
}
