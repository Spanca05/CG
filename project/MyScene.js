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
import { MyRockField } from "./elements/MyRockField.js";
import { MyBarn } from "./elements/Barn/MyBarn.js";
import { MyWagon } from "./elements/wagon/MyWagon.js";
import { MyHorse } from "./elements/Horse/MyHorse.js";
import { MyHayBale } from "./elements/hay/MyHayBale.js";
import { MyHayArrow } from "./elements/hay/MyHayArrow.js";
import { MyDropZone } from "./elements/Barn/MyDropZone.js";
import { gui } from "../lib/dat.gui.module.min.js";

export class MyScene extends CGFscene {
  constructor() {
    super();

    this.randomSeed = Date.now();
    this.useFollowCamera = true;

    this.showSky = true;
    this.useSkyTexture = true;
    this.skyScale = 200;

    this.showClouds = true;
    this.cloudsScale = 180;
    this.cloudRotationDeg = 0;
    this.cloudRotationSpeedDegPerSec = 0.8;
    this.lastUpdateTime = 0;

    this.sunEnabled = true;
    this.sunAzimuthDeg = 90;
    this.sunElevationDeg = 80;
    this.sunIntensity = 1.15;
    this.showSunMarker = true;
    this.sunMarkerSize = 20;

    this.showGrass = true;
    this.grassScale = 1.0;
    this.grassStartTime = 0;

    this.showFlowers = true;
    this.flowersStemHeight = 5;
    this.flowersNumberPetals = 5;
    this.flowersNumberLeaves = 2;
    this.flowersColorVariation = 1;
    this.flowersMinDist = 0.5;

    this.showWagon = true;
    this.wagonX = 0;
    this.wagonZ = 0;
    this.wagonAngle = 0;
    this.wagonSpeed = 0;
    this.initialWagonState = {
      x: this.wagonX,
      z: this.wagonZ,
      angle: this.wagonAngle,
      speed: this.wagonSpeed,
    };

    this.wheelRotationDeg = 0;
    this.wagonSteerAngle = 0;

    this.wagonCenterY = 0;
    this.wagonPitch = 0;
    this.wagonRoll = 0;

    this.wagonMaxSpeed = 25;

    this.prevWagonX = 0;
    this.prevWagonZ = 0;

    this.hp = 100;
    this.hpLossPerSec = 1;
    this.collisionDamage = 10;
    this.healthRestore = 10;
    this.balesAtBarn = 0;
    this.startTime = 0;
    this.gameActive = true;
    this.score = 0;

    this.gameTimeSeconds = 0;
    this.hayCarryLimit = 2;
    this.hayPickupRadius = 5.0;
    this.hayVisibilityRadius = 30.0;
    this.haySpawnCount = 8;
    this.haySpawnHeight = 2.5;
    this.hayBales = [];
    this.carriedHayBales = [];
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
    this.terrain = new MyTerrain(this, 420, 120, 20, 0.015);

    this.path = new MyPath(this, this.terrain, 500, 14, 150, 0.32);
    this.barn = new MyBarn(this);

    this.hayBale = new MyHayBale(this);
    this.hayArrow = new MyHayArrow(this);
    this.dropZone = new MyDropZone(this, 7.0);
    this.wagon = new MyWagon(this);
    this.horseLeft = new MyHorse(this);
    this.horseRight = new MyHorse(this);

    this.dirtPatches = [];
    const spread = this.terrain.size * 0.9; // place patches within 90% of terrain, away from edges
    for (let i = 0; i < 32; i++) {
      const seed = i * 37 + 13;
      const x = (this.random(seed) - 0.5) * spread;
      const z = (this.random(seed + 7) - 0.5) * spread;
      const radius = 2.0 + this.random(seed + 11) * 6.0;
      this.dirtPatches.push(new MyDirtPatch(this, this.terrain, x, z, radius));
    }

    this.rock = new MyRock(this, 20, 14, 1);
    this.rockField = new MyRockField(
      this,
      this.rock,
      this.terrain,
      this.path,
      40,
      300,
      0.05,
      this.dirtPatches,
      this.barn,
    );

    this.grassBlade = new MyGrassBlade(this, 0.12, 1.4, 0.18, 8);
    this.grassPatch = new MyGrassPatch(this, this.grassBlade, 180, 2.2, 0.34);
    this.deadGrassPatch = new MyGrassPatch(
      this,
      this.grassBlade,
      100,
      1.8,
      0.28,
    );

    this.grassField = new MyGrassField(
      this,
      this.grassPatch,
      this.terrain,
      14,
      14,
      420,
      420,
      0.02,
      0.35,
      this.path,
      2.0,
      this.dirtPatches,
      this.barn,
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
      this.path,
      2.0,
      this.dirtPatches,
      this.barn,
    );

    this.flowersNum = 10;
    this.initFlowers();
    this.initHayBales();

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

    this.setUpdatePeriod(1);

    this.terrainAppearance = new CGFappearance(this);
    this.terrainTexture = new CGFtexture(this, "./textures/grass.webp");

    this.terrainAppearance.setAmbient(0.9, 0.9, 0.9, 1);
    this.terrainAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
    this.terrainAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.terrainAppearance.setShininess(10);
    this.terrainAppearance.setTexture(this.terrainTexture);
    this.terrainAppearance.setTextureWrap("REPEAT", "REPEAT");

    this.pathAppearance = new CGFappearance(this);
    this.pathAppearance.setAmbient(0.9, 0.9, 0.9, 1);
    this.pathAppearance.setDiffuse(1.0, 1.0, 1.0, 1);
    this.pathAppearance.setSpecular(0.02, 0.02, 0.02, 1);
    this.pathAppearance.setShininess(3);
    this.pathTexture = new CGFtexture(this, "./textures/stone-pavement.jpg");
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

    this.rockShader = new CGFshader(
      this.gl,
      "shaders/rock.vert",
      "shaders/rock.frag",
    );

    this.rockShader.setUniformsValues({
      uNoiseScale: 3.5,
      uNoiseStrength: 0.45,
      baseColor: [0.48, 0.45, 0.42],
    });

    this.terrainShader = new CGFshader(
      this.gl,
      "shaders/terrain.vert",
      "shaders/terrain.frag",
    );

    this.terrainShader.setUniformsValues({
      uHeightScale: this.terrain.heightScale,
      uNoiseScale: this.terrain.noiseScale,
      uSampler: 0,
      uPathSampler: 1,
      uDirtSampler: 2,
    });

    const prog = this.terrainShader.program;
    this.gl.useProgram(prog);
    const posData = new Float32Array(32 * 2).fill(0);
    const radData = new Float32Array(32).fill(-2.0);
    for (let i = 0; i < Math.min(this.dirtPatches.length, 32); i++) {
      posData[i * 2] = this.dirtPatches[i].centerX;
      posData[i * 2 + 1] = this.dirtPatches[i].centerZ;
      radData[i] = this.dirtPatches[i].radius;
    }
    this.gl.uniform2fv(this.gl.getUniformLocation(prog, "uPatchPos"), posData);
    this.gl.uniform1fv(
      this.gl.getUniformLocation(prog, "uPatchRadius"),
      radData,
    );

    this.mipmapsReady = false;
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

  isValidFlowerPosition(x, z, minDist, placed) {
    const minDistSq = minDist * minDist;

    for (const point of placed) {
      if (this.distanceSquared(x, z, point.x, point.z) < minDistSq)
        return false;
    }

    if (this.isPointOnPath(x, z)) return false;
    if (this.isPointInsideDirtPatch(x, z)) return false;

    return true;
  }

  random(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  isValidHayPosition(x, z, placed, minDist = 12) {
    if (this.isPointOnPath(x, z, 2.0)) return false;
    if (this.isPointInsideDirtPatch(x, z, 0.9)) return false;

    if (this.barn) {
      const dx = x - this.barn.x;
      const dz = z - this.barn.z;
      const barnRadius = Math.max(this.barn.width, this.barn.length) * 0.75;
      if (dx * dx + dz * dz <= barnRadius * barnRadius) return false;
    }

    if (this.rockField && this.rockField.transforms) {
      for (const rock of this.rockField.transforms) {
        const dx = x - rock.x;
        const dz = z - rock.z;
        const limit = 5 + rock.scale * 0.7;
        if (dx * dx + dz * dz <= limit * limit) return false;
      }
    }

    const minDistSq = minDist * minDist;
    for (const point of placed) {
      if (this.distanceSquared(x, z, point.x, point.z) < minDistSq) {
        return false;
      }
    }

    return true;
  }

  initHayBales() {
    this.hayBales = [];

    const terrainHalf = this.terrain ? this.terrain.size / 2 : 120;
    const spreadHalf = terrainHalf * 0.9;
    const placed = [];

    for (let i = 0; i < this.haySpawnCount; i++) {
      const bale = {
        id: i,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        state: "ground",
        visible: false,
      };

      if (i === 0) {
        bale.x = 14;
        bale.z = 18;
        bale.y = this.terrain
          ? this.terrain.getHeight(bale.x, bale.z) - 1 + this.haySpawnHeight
          : 0;
        bale.rotation = 0.7;
        bale.state = "ground";
        bale.visible = true;
      } else {
        this.placeHayBale(bale, placed, spreadHalf, i * 97 + 11);
      }
      this.hayBales.push(bale);
      placed.push({ x: bale.x, z: bale.z });
    }
  }

  placeHayBale(bale, placed = [], spreadHalf = 100, seed = 1) {
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const currentSeed = seed + attempt * 31;
      const x = (this.random(currentSeed) * 2 - 1) * spreadHalf;
      const z = (this.random(currentSeed + 1) * 2 - 1) * spreadHalf;

      if (!this.isValidHayPosition(x, z, placed)) {
        continue;
      }

      bale.x = x;
      bale.z = z;
      bale.y = this.terrain ? this.terrain.getHeight(x, z) - 1 + this.haySpawnHeight : 0;
      bale.rotation = this.random(currentSeed + 2) * Math.PI * 2;
      bale.state = "ground";
      bale.visible = false;
      return true;
    }

    return false;
  }

  respawnHayBale(bale) {
    const placed = this.hayBales
      .filter((other) => other !== bale && other.state === "ground")
      .map((other) => ({ x: other.x, z: other.z }));
    const terrainHalf = this.terrain ? this.terrain.size / 2 : 120;
    const spreadHalf = terrainHalf * 0.9;

    this.placeHayBale(
      bale,
      placed,
      spreadHalf,
      bale.id * 131 + this.score + 17,
    );
  }

  pickupHayBale() {
    if (!this.gameActive) return;
    if (this.carriedHayBales.length >= this.hayCarryLimit) return;

    let bestBale = null;
    let bestDistSq = this.hayPickupRadius * this.hayPickupRadius;

    for (const bale of this.hayBales) {
      if (bale.state !== "ground") continue;

      const distSq = this.distanceSquared(
        this.wagonX,
        this.wagonZ,
        bale.x,
        bale.z,
      );

      if (distSq <= bestDistSq) {
        bestDistSq = distSq;
        bestBale = bale;
      }
    }

    if (!bestBale) return;

    bestBale.state = "carried";
    bestBale.visible = false;
    this.carriedHayBales.push(bestBale);
  }

  dropCarriedHayBales() {
    if (!this.gameActive) return;
    if (!this.dropZone || !this.dropZone.isIntersecting) return;
    if (this.carriedHayBales.length === 0) return;

    const deliveredCount = this.carriedHayBales.length;
    const restoreAmount = deliveredCount * this.healthRestore;

    this.addHP(restoreAmount, deliveredCount);

    const deliveredBales = [...this.carriedHayBales];
    this.carriedHayBales = [];

    for (const bale of deliveredBales) {
      this.respawnHayBale(bale);
    }
  }

  displayGroundHayBales() {
    for (const bale of this.hayBales) {
      if (bale.state !== "ground") continue;

      const distSq = this.distanceSquared(
        this.wagonX,
        this.wagonZ,
        bale.x,
        bale.z,
      );
      const isVisible =
        distSq <= this.hayVisibilityRadius * this.hayVisibilityRadius;
      const canPickup =
        distSq <= this.hayPickupRadius * this.hayPickupRadius &&
        this.carriedHayBales.length < this.hayCarryLimit;

      if (isVisible) {
        this.pushMatrix();
        this.translate(bale.x, bale.y, bale.z);
        this.rotate(bale.rotation, 0, 1, 0);
        this.scale(0.9, 0.9, 0.9);
        this.hayBale.display();
        this.popMatrix();
      }

      this.pushMatrix();
      const bob = Math.sin(this.gameTimeSeconds * 3.0 + bale.id) * 0.25;
      const spin = this.gameTimeSeconds * 1.8 + bale.id * 0.6;
      this.translate(bale.x, bale.y + 2.4 + bob, bale.z);
      this.rotate(Math.PI, 1, 0, 0);
      this.rotate(spin, 0, 1, 0);
      this.scale(0.9, 0.9, 0.9);
      this.hayArrow.display(canPickup);
      this.popMatrix();
    }
  }

  displayCarriedHayBales() {
    for (let i = 0; i < this.carriedHayBales.length; i++) {
      this.pushMatrix();

      const xOffset = i === 0 ? -0.45 : 0.55;
      const yOffset = 0.95 + i * 0.18;
      const zOffset = -0.05 + i * 0.03;

      this.translate(xOffset, yOffset, zOffset);
      this.rotate((i % 2 === 0 ? -1 : 1) * 0.25, 0, 1, 0);
      this.scale(0.7, 0.7, 0.7);
      this.hayBale.display();

      this.popMatrix();
    }
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

  checkCollisions() {
    if (!this.gameActive) return;

    const wagonRadius = 2.5;

    for (const rock of this.rockField.transforms) {
      const dx = this.wagonX - rock.x;
      const dz = this.wagonZ - rock.z;
      const distSq = dx * dx + dz * dz;
      const minDist = wagonRadius + rock.scale * 0.9;

      if (distSq < minDist * minDist) {
        this.wagonX = this.prevWagonX;
        this.wagonZ = this.prevWagonZ;

        if (rock.scale < 3) this.wagonSpeed = -3;
        else if (rock.scale < 6) this.wagonSpeed = -6;
        else this.wagonSpeed = -10;

        this.hp -= this.collisionDamage;
        if (this.hp <= 0) {
          this.hp = 0;
          // reset the whole game when health reaches zero
          this.resetGame();
        }

        return;
      }
    }

    const bdx = this.wagonX - this.barn.x;
    const bdz = this.wagonZ - this.barn.z;
    const barnDistSq = bdx * bdx + bdz * bdz;
    const barnMinDist = wagonRadius + 17;

    if (barnDistSq < barnMinDist * barnMinDist) {
      this.wagonX = this.prevWagonX;
      this.wagonZ = this.prevWagonZ;
      this.wagonSpeed = -8;
    }
  }
  checkDropZone() {
    if (!this.dropZone) return;

    const dropZoneX = this.barn.x + 17.0;
    const dropZoneZ = this.barn.z - 17.0;

    const dx = this.wagonX - dropZoneX;
    const dz = this.wagonZ - dropZoneZ;
    const distSq = dx * dx + dz * dz;

    const wagonRadius = 2.5;
    const triggerDistance = this.dropZone.radius + wagonRadius;

    if (distSq < triggerDistance * triggerDistance) {
      this.dropZone.setIntersecting(true);
    } else {
      this.dropZone.setIntersecting(false);
    }
  }

  checkKeys(dt) {
    if (!this.gameActive) return;

    this.prevWagonX = this.wagonX;
    this.prevWagonZ = this.wagonZ;

    if (this.gui.isKeyPressed("KeyP")) {
      this.pickupHayBale();
    }

    if (this.gui.isKeyPressed("KeyL")) {
      this.dropCarriedHayBales();
    }

    if (this.gui.isKeyPressed("KeyW")) {
      if (this.wagonSpeed <= this.wagonMaxSpeed)
        this.wagonSpeed += 5 * dt;

    }

    if (this.gui.isKeyPressed("KeyS")) {
      this.wagonSpeed -= 12 * dt;
      if (this.wagonSpeed < 0) this.wagonSpeed = 0;
    }

    const maxSteer = Math.PI / 6;

    if (this.gui.isKeyPressed("KeyA")) {
      this.wagonAngle += 1.5 * dt;
      this.wagonSteerAngle = Math.min(maxSteer, this.wagonSteerAngle + 2 * dt);
    } else if (this.gui.isKeyPressed("KeyD")) {
      this.wagonAngle -= 1.5 * dt;
      this.wagonSteerAngle = Math.max(-maxSteer, this.wagonSteerAngle - 2 * dt);
    } else {
      this.wagonSteerAngle *= 0.85;
    }

    if (this.wagonSpeed > 0) {
      this.wagonSpeed -= 3 * dt;
      if (this.wagonSpeed < 0) this.wagonSpeed = 0;
    } else if (this.wagonSpeed < 0) {
      this.wagonSpeed += 8 * dt;
      if (this.wagonSpeed > 0) this.wagonSpeed = 0;
    }

    if (this.wagonSpeed > 25) this.wagonSpeed = 25;
    if (this.wagonSpeed < -10) this.wagonSpeed = -10;

    this.wagonX += Math.sin(this.wagonAngle) * this.wagonSpeed * dt;
    this.wagonZ += Math.cos(this.wagonAngle) * this.wagonSpeed * dt;
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

    if (this.startTime === 0) this.startTime = t;

    if (this.gameActive) {
      this.gameTimeSeconds = (t - this.startTime) / 1000;
      this.score = Math.floor(this.gameTimeSeconds);
    }

    if (this.gameActive) {
      this.hp -= this.hpLossPerSec * dt;
      if (this.hp <= 0) {
        this.hp = 0;
        // reset the game immediately when hp depletes
        this.resetGame();
      }
    }

    this.checkKeys(dt);
    this.checkCollisions();
    this.checkDropZone();

    const axleHalfLen = 1.6;
    const axleHalfWidth = 1.3;
    const fwdX = Math.sin(this.wagonAngle);
    const fwdZ = Math.cos(this.wagonAngle);
    const rgtX = Math.cos(this.wagonAngle);
    const rgtZ = -Math.sin(this.wagonAngle);

    const hFront =
      this.terrain.getHeight(
        this.wagonX + fwdX * axleHalfLen,
        this.wagonZ + fwdZ * axleHalfLen,
      ) - 1;
    const hBack =
      this.terrain.getHeight(
        this.wagonX - fwdX * axleHalfLen,
        this.wagonZ - fwdZ * axleHalfLen,
      ) - 1;
    const hRight =
      this.terrain.getHeight(
        this.wagonX + rgtX * axleHalfWidth,
        this.wagonZ + rgtZ * axleHalfWidth,
      ) - 1;
    const hLeft =
      this.terrain.getHeight(
        this.wagonX - rgtX * axleHalfWidth,
        this.wagonZ - rgtZ * axleHalfWidth,
      ) - 1;

    this.wagonCenterY = (hFront + hBack) / 2 + 0.45;
    this.wagonPitch = Math.atan2(hBack - hFront, 2 * axleHalfLen);
    this.wagonRoll = Math.atan2(hLeft - hRight, 2 * axleHalfWidth);

    const wheelCircumference = 2 * Math.PI * 0.45;
    this.wheelRotationDeg += this.wagonSpeed * dt * (360 / wheelCircumference);

    if (this.useFollowCamera) {
      const backDist = 15;
      const upDist = 8;
      const fwdX = Math.sin(this.wagonAngle);
      const fwdZ = Math.cos(this.wagonAngle);

      this.camera.position = vec3.fromValues(
        this.wagonX - fwdX * backDist,
        this.terrain.getHeight(this.wagonX, this.wagonZ) - 1 + upDist,
        this.wagonZ - fwdZ * backDist,
      );

      this.camera.target = vec3.fromValues(
        this.wagonX,
        this.terrain.getHeight(this.wagonX, this.wagonZ) - 1 + 2,
        this.wagonZ,
      );
    }
  }

  addHP(amount, baleCount = 1) {
    if (!amount || amount <= 0) return;
    this.hp += amount;
    this.balesAtBarn += baleCount;
  }

  resetGame() {
    this.hp = 100;
    this.gameActive = true;
    this.score = 0;
    this.gameTimeSeconds = 0;
    this.startTime = 0;
    this.balesAtBarn = 0;

    this.wagonX = this.initialWagonState.x;
    this.wagonZ = this.initialWagonState.z;
    this.wagonAngle = this.initialWagonState.angle;
    this.wagonSpeed = this.initialWagonState.speed;
    this.wheelRotationDeg = 0;
    this.wagonSteerAngle = 0;
    this.wagonCenterY = 0;
    this.wagonPitch = 0;
    this.wagonRoll = 0;
    this.prevWagonX = this.wagonX;
    this.prevWagonZ = this.wagonZ;

    this.carriedHayBales = [];
    this.initHayBales();

    if (this.dropZone) {
      this.dropZone.setIntersecting(false);
    }
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
      this.translate(0, -20, 0);
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
      this.translate(0, -20, 0);
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

    if (!this.mipmapsReady) {
      const textures = [
        this.terrainTexture,
        this.pathTexture,
        this.dirtTexture,
      ];
      if (textures.every((tex) => tex.texID !== -1)) {
        const anisoExt = this.gl.getExtension("EXT_texture_filter_anisotropic");
        textures.forEach((tex) => {
          this.gl.bindTexture(this.gl.TEXTURE_2D, tex.texID);
          this.gl.generateMipmap(this.gl.TEXTURE_2D);
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR_MIPMAP_LINEAR,
          );
          if (anisoExt) {
            const maxAniso = this.gl.getParameter(
              anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT,
            );
            this.gl.texParameterf(
              this.gl.TEXTURE_2D,
              anisoExt.TEXTURE_MAX_ANISOTROPY_EXT,
              Math.min(16, maxAniso),
            );
          }
        });
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.mipmapsReady = true;
      }
    }

    this.pushMatrix();
    const barnY = this.terrain
      ? this.terrain.getHeight(this.barn.x, this.barn.z) - 1
      : 0;
    this.translate(this.barn.x, barnY, this.barn.z);
    this.rotate((3 * Math.PI) / 4, 0, 1, 0);
    this.barn.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, -1, 0);
    this.setActiveShader(this.terrainShader);
    const terrainSunDir = this.getSunDirection();
    this.terrainShader.setUniformsValues({
      uLightDir: [terrainSunDir.x, terrainSunDir.y, terrainSunDir.z],
      uLightIntensity: this.sunEnabled ? Math.max(0, this.sunIntensity) : 0.0,
    });
    this.terrainAppearance.apply();
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pathTexture.texID);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    );
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.dirtTexture.texID);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    );
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(2, 2);
    this.terrain.display();
    this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
    this.setActiveShader(this.defaultShader);
    this.popMatrix();

    if (this.showGrass) {
      this.pushMatrix();
      this.translate(0, -0.45, 0);
      this.scale(this.grassScale, this.grassScale, this.grassScale);

      this.setActiveShader(this.grassShader);

      const grassSunDir = this.getSunDirection();
      this.grassShader.setUniformsValues({
        uLightDir: [grassSunDir.x, grassSunDir.y, grassSunDir.z],
        uLightIntensity: this.sunEnabled ? Math.max(0, this.sunIntensity) : 0.0,
      });

      this.grassShader.setUniformsValues({
        baseColor: [0.18, 0.32, 0.08],
        tipColor: [0.45, 0.5, 0.18],
      });
      this.grassField.display();

      this.grassShader.setUniformsValues({
        baseColor: [0.28, 0.2, 0.07],
        tipColor: [0.62, 0.54, 0.22],
      });
      this.deadGrassField.display();

      this.setActiveShader(this.defaultShader);

      this.popMatrix();
    }

    this.setActiveShader(this.rockShader);
    this.rockAppearance.apply();
    const sunDir = this.getSunDirection();
    this.rockShader.setUniformsValues({
      uLightDir: [sunDir.x, sunDir.y, sunDir.z],
      uLightIntensity: this.sunEnabled ? Math.max(0, this.sunIntensity) : 0.0,
    });
    this.rockField.display();
    this.setActiveShader(this.defaultShader);

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

    this.displayGroundHayBales();

    if (this.displayAxis) {
      this.axis.display();
    }

    if (this.showWagon) {
      this.pushMatrix();
      this.translate(this.wagonX, this.wagonCenterY, this.wagonZ);
      this.rotate(this.wagonAngle, 0, 1, 0);
      this.rotate(Math.PI / 2, 0, 1, 0);
      this.rotate(this.wagonPitch, 0, 0, 1);
      this.rotate(this.wagonRoll, 1, 0, 0);
      this.wagon.display();
      this.displayCarriedHayBales();
      this.popMatrix();

      // Draw two horses in front of the wagon
      if (this.horseLeft && this.horseRight) {
        const axleHalfLen = 1.6;
        const horseDistance = axleHalfLen + 2.4; // place horses just past the tongue
        const fwdX = Math.sin(this.wagonAngle);
        const fwdZ = Math.cos(this.wagonAngle);
        const rgtX = Math.cos(this.wagonAngle);
        const rgtZ = -Math.sin(this.wagonAngle);
        const sideOffset = 0.6; // distance between horses and wagon centerline

        // left horse
        this.pushMatrix();
        const lx = this.wagonX + fwdX * horseDistance + rgtX * sideOffset;
        const lz = this.wagonZ + fwdZ * horseDistance + rgtZ * sideOffset;
        const ly = this.terrain ? this.terrain.getHeight(lx, lz) - 1 : 0;
        this.translate(lx, ly, lz);
        this.scale(1.0, 1.0, 1.0);
        this.rotate(this.wagonAngle, 0, 1, 0);
        this.horseLeft.display();
        this.popMatrix();

        // right horse
        this.pushMatrix();
        const rx = this.wagonX + fwdX * horseDistance - rgtX * sideOffset;
        const rz = this.wagonZ + fwdZ * horseDistance - rgtZ * sideOffset;
        const ry = this.terrain ? this.terrain.getHeight(rx, rz) - 1 : 0;
        this.translate(rx, ry, rz);
        this.scale(1.0, 1.0, 1.0);
        this.rotate(this.wagonAngle, 0, 1, 0);
        this.horseRight.display();
        this.popMatrix();
      }
    }

    if (this.dropZone) {
      this.pushMatrix();

      const dropZoneX = this.barn.x + 17.0;
      const dropZoneZ = this.barn.z - 17.0;

      const rawGroundY = this.terrain
        ? this.terrain.getHeight(dropZoneX, dropZoneZ)
        : 0;

      const dropZoneY = rawGroundY - 1 + 0.01;
      this.translate(dropZoneX, rawGroundY, dropZoneZ);
      this.dropZone.display();
      this.popMatrix();
    }
  }
}
