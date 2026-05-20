import {
    CGFscene,
    CGFcamera,
    CGFaxis,
    CGFappearance,
    CGFtexture,
    CGFshader,
} from "../lib/CGF.js";
import { MySky } from "./MySky.js";
import { MyClouds } from "./MyClouds.js";
import { MySun } from "./MySun.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyRock } from "./elements/MyRock.js";
import { MyFlower } from "./elements/flower/MyFlower.js";
import { MyGrassBlade } from "./elements/grass/MyGrassBlade.js";
import { MyGrassPatch } from "./elements/grass/MyGrassPatch.js";
import { MyGrassField } from "./elements/grass/MyGrassField.js";
import { MyPath } from "./MyPath.js";
import { MyDirtPatch } from "./elements/MyDirtPatch.js";

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

        this.showGrass = true;
        this.grassScale = 1.0;

        this.showFlowers = true;
        this.flowersStemHeight = 5;
        this.flowersNumberPetals = 5;
        this.flowersNumberLeaves = 2;
        this.flowersColorVariation = 1;
        this.flowersMinDist = 0.5;

        this.randomSeed = Date.now();
        this.grassStartTime = 0;
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
        this.terrain = new MyTerrain(this, 420, 120, 1.2);

        this.rocks = [];
        this.rocks.push(new MyRock(this, 16, 10, 1));
        this.rocks.push(new MyRock(this, 12, 8, 2));
        this.rocks.push(new MyRock(this, 14, 9, 3));
        this.rocks.push(new MyRock(this, 13, 9, 4));
        this.rocks.push(new MyRock(this, 15, 10, 5));

        this.grassBlade = new MyGrassBlade(this, 0.12, 1.4, 0.18);
        this.grassPatch = new MyGrassPatch(this, this.grassBlade, 48, 0.9, 0.34);
        this.deadGrassPatch = new MyGrassPatch(this, this.grassBlade, 30, 0.7, 0.25);

        this.grassField = new MyGrassField(
            this,
            this.grassPatch,
            this.terrain,
            24,
            24,
            420,
            420,
            0.02,
            0.35,
        );

        this.deadGrassField = new MyGrassField(
            this,
            this.deadGrassPatch,
            this.terrain,
            10,
            10,
            380,
            380,
            0.025,
            0.45,
        );

        this.path = new MyPath(this, this.terrain, 500, 14, 44, 0.32);

        this.dirtPatches = [];
        const dirtCount = 32;
        const half = this.terrain.size / 2;
        for (let i = 0; i < dirtCount; i++) {
            const seed = i * 37 + 13;
            const x = this.random(seed) * (this.terrain.size * 0.9) - half * 0.9;
            const z = this.random(seed + 7) * (this.terrain.size * 0.9) - half * 0.9;
            const radius = 2.0 + this.random(seed + 11) * 6.0;
            const rotation = this.random(seed + 19) * Math.PI * 2;
            this.dirtPatches.push(
                new MyDirtPatch(this, this.terrain, x, z, radius, rotation, 24, 0.05),
            );
        }

        this.flowersNum = 10;
        this.initFlowers();

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
        this.sunAppearance.setDiffuse(1.0, 1, 1, 1.0);
        this.sunAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.sunAppearance.setEmission(1.0, 0.65, 0.18, 1.0);
        this.sunAppearance.setShininess(1.0);

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
        this.terrainTexture = new CGFtexture(this, "./textures/grass.webp");

        this.terrainAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.terrainAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
        this.terrainAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.terrainAppearance.setShininess(10);
        this.terrainAppearance.setTexture(this.terrainTexture);
        this.terrainAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.pathAppearance = new CGFappearance(this);
        this.pathAppearance.setAmbient(0.32, 0.24, 0.14, 1);
        this.pathAppearance.setDiffuse(0.48, 0.36, 0.2, 1);
        this.pathAppearance.setSpecular(0.02, 0.02, 0.02, 1);
        this.pathAppearance.setShininess(3);
        this.pathTexture = new CGFtexture(this, "./textures/ground.jpg");
        this.pathAppearance.setTexture(this.pathTexture);
        this.pathAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.dirtTexture = new CGFtexture(this, "./textures/dirtTexture.jpg");
        this.dirtAppearance = new CGFappearance(this);
        this.dirtAppearance.setAmbient(0.28, 0.2, 0.08, 1);
        this.dirtAppearance.setDiffuse(0.45, 0.33, 0.12, 1);
        this.dirtAppearance.setSpecular(0.02, 0.02, 0.02, 1);
        this.dirtAppearance.setShininess(2);
        this.dirtAppearance.setTexture(this.dirtTexture);
        this.dirtAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.rockAppearance = new CGFappearance(this);
        this.rockAppearance.setAmbient(0.35, 0.35, 0.35, 1);
        this.rockAppearance.setDiffuse(0.45, 0.45, 0.45, 1);
        this.rockAppearance.setSpecular(0.08, 0.08, 0.08, 1);
        this.rockAppearance.setShininess(8);

        this.flowerAppearance = new CGFappearance(this);
        this.flowerAppearance.setAmbient(0.9, 0.2, 0.4, 1);
        this.flowerAppearance.setDiffuse(1.0, 0.3, 0.5, 1);
        this.flowerAppearance.setSpecular(0.2, 0.1, 0.15, 1);
        this.flowerAppearance.setShininess(8);

        this.grassShader = new CGFshader(
            this.gl,
            "shaders/grass.vert",
            "shaders/grass.frag",
        );

        this.grassShader.setUniformsValues({
            time: 0,
            windStrength: 0.18,
            windSpeed: 1.4,
        });
    }

    initFlowers() {
        this.flowerTypes = [];

        const flowerCountPerType = 64;
        const terrainHalf = this.terrain ? this.terrain.size / 2 : 30;
        const spreadHalf = terrainHalf * 0.95;
        const minDist = this.flowersMinDist;
        const maxAttempts = 10;
        const placed = [];

        for (let typeIndex = 0; typeIndex < this.flowersNum; typeIndex++) {
            const typeSeed = this.randomSeed / (typeIndex * 100 + 1);
            const stemH = this.flowersStemHeight / 10.0 + this.random(typeSeed + 4);
            const petals = Math.max(3, Math.round(3 + this.random(typeSeed + 5) * 4));
            const leaves = Math.round(this.random(typeSeed + 6) * 100);
            const colorVariation = this.random(typeSeed) * 3.2;

            const flower = new MyFlower(this, stemH, petals, leaves, colorVariation);

            const transforms = [];
            for (let i = 0; i < flowerCountPerType; i++) {
                let candidate = null;

                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    const seed = typeSeed + i * 1000 + attempt * 17;
                    const x = (this.random(seed) * 2 - 1) * spreadHalf;
                    const z = (this.random(seed + 1) * 2 - 1) * spreadHalf;

                    if (this.isValidFlowerPosition(x, z, minDist, placed)) {
                        candidate = {
                            x,
                            z,
                            scale: 0.5 + this.random(seed + 2) * 0.6,
                            rotation: this.random(seed + 3) * Math.PI * 2,
                        };
                        placed.push({ x, z });
                        transforms.push(candidate);
                        break;
                    }
                }
            }

            this.flowerTypes.push({ flower, transforms });
        }
    }

    distanceSquared(x1, z1, x2, z2) {
        const dx = x1 - x2;
        const dz = z1 - z2;
        return dx * dx + dz * dz;
    }

    isPointOnPath(x, z, clearance = 1.5) {
        if (!this.path || typeof this.path.getCenterX !== "function") return false;

        const halfWidth = this.path.width / 2 + clearance;
        const centerX = this.path.getCenterX(z);
        return Math.abs(x - centerX) <= halfWidth;
    }

    isPointInsideDirtPatch(x, z, clearance = 0.8) {
        for (const patch of this.dirtPatches) {
            const limit = patch.radius + clearance;
            if (
                this.distanceSquared(x, z, patch.centerX, patch.centerZ) <=
                limit * limit
            )
                return true;
        }

        return false;
    }

    isPointNearRock(x, z, clearance = 3.5) {
        for (let i = 0; i < this.rocks.length; i++) {
            const rx = 5 + (i % 3) * 8;
            const rz = 0 + Math.floor(i / 3) * 10;
            if (this.distanceSquared(x, z, rx, rz) <= clearance * clearance)
                return true;
        }

        return false;
    }

    isValidFlowerPosition(x, z, minDist, placed) {
        const minDistSq = minDist * minDist;

        for (const point of placed) {
            if (this.distanceSquared(x, z, point.x, point.z) < minDistSq)
                return false;
        }

        if (this.isPointOnPath(x, z)) return false;
        if (this.isPointInsideDirtPatch(x, z)) return false;
        if (this.isPointNearRock(x, z)) return false;

        return true;
    }

    random(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
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
        return Math.max(
            edgePadding,
            this.skyScale - this.sunMarkerSize - edgePadding,
        );
    }

    initCameras() {
        this.camera = new CGFcamera(
            1,
            0.1,
            500,
            vec3.fromValues(30, 30, 30),
            vec3.fromValues(0, 0, 0),
        );
    }

    update(t) {
        if (this.grassStartTime === 0) {
            this.grassStartTime = t;
        }

        if (this.lastUpdateTime === 0) {
            this.lastUpdateTime = t;
            return;
        }

        const dt = (t - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = t;
        this.cloudRotationDeg =
            (this.cloudRotationDeg + this.cloudRotationSpeedDegPerSec * dt) % 360;

        this.grassShader.setUniformsValues({
            time: (t - this.grassStartTime) / 1000,
        });
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
            this.scale(this.sunMarkerSize, this.sunMarkerSize, this.sunMarkerSize);

            this.sunAppearance.apply();
            this.sunMarker.display();

            this.popMatrix();
        }

        this.pushMatrix();
        this.translate(0, -1, 0);
        this.terrainAppearance.apply();
        this.terrain.display();

        this.popMatrix();

        this.pushMatrix();
        this.dirtAppearance.apply();
        for (const patch of this.dirtPatches) {
            patch.display();
        }
        this.popMatrix();

        this.pushMatrix();
        this.pathAppearance.apply();
        this.path.display();
        this.popMatrix();

        this.rocks.forEach((rock, i) => {
            this.pushMatrix();
            const x = 5 + (i % 3) * 8;
            const z = 0 + Math.floor(i / 3) * 10;
            this.translate(x, 1, z);
            this.scale(2.5 - i * 0.1, 1.4, 2.0);
            this.rockAppearance.apply();
            rock.display();
            this.popMatrix();
        });

        if (this.showGrass) {
            this.pushMatrix();
            this.translate(0, -0.45, 0);
            this.scale(this.grassScale, this.grassScale, this.grassScale);

            this.setActiveShader(this.grassShader);

            this.grassShader.setUniformsValues({
                baseColor: [0.18, 0.32, 0.08],
                tipColor: [0.45, 0.50, 0.18],
            });
            this.grassField.display();

            this.grassShader.setUniformsValues({
                baseColor: [0.28, 0.20, 0.07],
                tipColor: [0.62, 0.54, 0.22],
            });
            this.deadGrassField.display();

            this.setActiveShader(this.defaultShader);

            this.popMatrix();
        }

        if (this.showFlowers) {
            for (const flowerType of this.flowerTypes) {
                for (const transform of flowerType.transforms) {
                    this.pushMatrix();

                    const rawGroundY = this.terrain
                        ? this.terrain.getHeight(transform.x, transform.z)
                        : 0;
                    const groundY = rawGroundY - 1;

                    this.translate(transform.x, groundY + 0.002, transform.z);
                    this.rotate(transform.rotation, 0, 1, 0);
                    this.scale(transform.scale, transform.scale, transform.scale);
                    this.flowerAppearance.apply();
                    flowerType.flower.display();

                    this.popMatrix();
                }
            }
        }

        if (this.displayAxis) {
            this.axis.display();
        }
    }
}
