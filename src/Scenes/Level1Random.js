import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level1Random extends Phaser.Scene {
    constructor() {
        super('Level1Random');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.amountInsuredCS = data.amountInsuredCS;
    }

    preload() {
        this.load.image("treesLayer", "assets/tiled/Tile4.png");
        this.load.image("grassLayer", "assets/tiled/Tile A2.png");
        this.load.image("roadLayer", "assets/tiled/A5.png");
        this.load.image("hotDogLayer", "assets/tiled/Tile3.png");
        this.load.tilemapTiledJSON("level1random", "assets/tiled/level1random.json");
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 120, 100);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 120, 100);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level1random = this.add.tilemap("level1random");
        this.physics.world.setBounds(0, 0, this.level1random.widthInPixels, this.level1random.heightInPixels);
        this.grassLayer = this.level1random.addTilesetImage("A2", "grassLayer", 32, 32);
        this.roadLayer = this.level1random.addTilesetImage("A5", "roadLayer", 32, 32);
        this.treesLayer = this.level1random.addTilesetImage("Tile4", "treesLayer", 32, 32);
        this.hotDogLayer = this.level1random.addTilesetImage("Tile3", "hotDogLayer", 32, 32);
        this.grassFloor = this.level1random.createStaticLayer("grass", this.grassLayer, 0, 0).setDepth(-3);
        this.roadFloor = this.level1random.createStaticLayer("road", this.roadLayer, 0, 0).setDepth(-3);
        this.treesGround = this.level1random.createStaticLayer("tree", this.treesLayer, 0, 0);
        this.lightsGround = this.level1random.createStaticLayer("lights", this.treesLayer, 0, 0);
        this.hotDogGround = this.level1random.createStaticLayer("deco", this.hotDogLayer, 0, 0);
        // Collisions based on layer.
        this.grassFloor.setCollisionByProperty({ collides: true });
        this.hotDogGround.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.grassFloor);
        this.physics.add.collider(this.player, this.hotDogGround);
        //end map

        //Initialize moneybags and amount insured
        this.arr = ["nH", "minorA", "majorA"]
        this.itemCS = Phaser.Math.RND.pick(this.arr);
        console.log(this.itemCS);
        this.popUp = false;
        this.scoreBoard = this.add.text(600, 40, "Cash: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
    }
    update() {
        if (this.popUp === false) {
            var self = this;
            this.grassFloor.setTileLocationCallback(13, 4, 5, 1, function () {
                if (self.amountInsuredCS == 0 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    self.cameras.main.shake(200);
                    if (self.itemCS == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.moneyChange = self.add.text(600, 60, "+ 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // show money lossprofit and fade 2s
                        // dialog pop up, close on click and set player vel back to 200
                    } else if (self.itemCS == "minorA") {
                        self.moneyBags -= 1250;
                        self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    } else if (self.itemCS == "majorA") {
                        self.moneyBags -= 2500;
                        self.moneyChange = self.add.text(600, 60, "- 2500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    }
                } else if (self.amountInsuredCS == 1250 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    self.cameras.main.shake(200);
                    if (self.itemCS == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.moneyChange = self.add.text(600, 60, "+ 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    } else if (self.itemCS == "minorA") {
                        self.moneyBags += 1825;
                        self.moneyChange = self.add.text(600, 60, "+ 1825", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    } else if (self.itemCS == "majorA") {
                        self.moneyBags -= 250;
                        self.moneyChange = self.add.text(600, 60, "- 250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    }
                } else if (self.amountInsuredCS == 2500 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    self.cameras.main.shake(200);
                    if (self.itemCS == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.moneyChange = self.add.text(600, 60, "+ 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    } else if (self.itemCS == "minorA") {
                        self.moneyBags += 1500;
                        self.moneyChange = self.add.text(600, 60, "+ 1500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    } else if (self.itemCS == "majorA") {
                        self.moneyBags += 3750;
                        self.moneyChange = self.add.text(600, 60, "+ 3750", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        //
                    }
                }
                self.scoreBoard.setText('Cash: ' + self.moneyBags);
            });
        }
    }

};
