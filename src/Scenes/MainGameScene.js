import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGame');
    }

    init(data) {
        this.gender = data.gender;
    }

    preload() {
        console.log(this.gender);
        this.load.image("castle", "assets/castle.png");
        this.load.tilemapTiledJSON("level1", "assets/level1.json");
    }

    create() {
        this.cameras.main.fadeIn(1000);

        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 300, 300);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 300, 300);
        }
        this.cameras.main.startFollow(this.player);
        //tentative map
        let level1 = this.add.tilemap("level1");
        let castle = level1.addTilesetImage("castle", "castle", 32, 32);
        let floorLayer = level1.createStaticLayer("floor", castle, 0, 0).setDepth(-1);
        let wallsLayer = level1.createStaticLayer("walls", castle, 0, 0);
        let tablesLayer = level1.createStaticLayer("tables", castle, 0, 0);
        // Collisions based on layer.
        wallsLayer.setCollisionByProperty({ collides: true });
        tablesLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, tablesLayer);
        // TODO KEY INTERACTION
        let keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        tablesLayer.setTileLocationCallback(24, 18, 1, 1, function () {
            if (keyE.isDown) {
                console.log("Interacted!");
            };
        });
        //end tentative map
    }

};
