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