import { CGFobject } from "../../lib/CGF.js";

export class MyRockField extends CGFobject {
    constructor(
        scene,
        rock,
        terrain = null,
        path = null,
        rockCount = 30,
        areaSize = 180,
        yOffset = 0.05,
    ) {
        super(scene);

        this.rock = rock;
        this.terrain = terrain;
        this.path = path;

        this.rockCount = rockCount;
        this.areaSize = areaSize;
        this.yOffset = yOffset;

        this.transforms = [];

        this.initTransforms();
    }

    random(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5353;
        return x - Math.floor(x);
    }

    getTerrainHeight(x, z) {
        if (!this.terrain) {
            return 0;
        }

        return this.terrain.getHeight(x, z) - 1;
    }

    initTransforms() {
        const halfSize = this.areaSize / 2;

        let seed = 1;
        let attempts = 0;

        while (
            this.transforms.length < this.rockCount &&
            attempts < this.rockCount * 20
        ) {
            const x = (this.random(seed) - 0.5) * this.areaSize;
            const z = (this.random(seed + 100) - 0.5) * this.areaSize;

            if (this.path && this.path.isNearPath(x, z, 7)) {
                seed += 13;
                attempts++;
                continue;
            }

            let tooClose = false;

            for (const rock of this.transforms) {
                const dx = x - rock.x;
                const dz = z - rock.z;

                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 10) {
                    tooClose = true;
                    break;
                }
            }

            if (tooClose) {
                seed += 17;
                attempts++;
                continue;
            }

            const y = this.getTerrainHeight(x, z) + this.yOffset;

            const scale = 1 + this.random(seed + 200) * Math.PI * 3;

            const rotation = this.random(seed + 300) * Math.PI * 2;

            this.transforms.push({
                x,
                y,
                z,
                scale,
                rotation,
            });

            seed += 23;
            attempts++;
        }
    }

    display() {
        for (const transform of this.transforms) {
            this.scene.pushMatrix();

            this.scene.translate(
                transform.x,
                transform.y,
                transform.z,
            );

            this.scene.rotate(
                transform.rotation,
                0,
                1,
                0,
            );

            this.scene.scale(
                transform.scale,
                transform.scale,
                transform.scale,
            );

            this.rock.display();

            this.scene.popMatrix();
        }
    }
}