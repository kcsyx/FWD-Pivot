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
        this.level1 = this.add.tilemap("level1");
        this.castle = this.level1.addTilesetImage("castle", "castle", 32, 32);
        this.floorLayer = this.level1.createStaticLayer("floor", this.castle, 0, 0).setDepth(-1);
        this.wallsLayer = this.level1.createStaticLayer("walls", this.castle, 0, 0);
        this.tablesLayer = this.level1.createStaticLayer("tables", this.castle, 0, 0);
        // Collisions based on layer.
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.tablesLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.tablesLayer);
        // KEY INTERACTION
        this.interacted = false;
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //end tentative map
    }
    update() {
        if (this.interacted === false) {
            var self = this;
            this.tablesLayer.setTileLocationCallback(24, 18, 1, 1, function () {
                if (self.player.direction == "right" && self.keyE.isDown && self.interacted === false) {
                    console.log("Interacted!");
                    //TODO DIALOG
                    self.interacted = true;
                };
            });
        }
    }

};
