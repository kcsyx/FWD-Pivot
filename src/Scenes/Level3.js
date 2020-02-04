import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level3 extends Phaser.Scene {
    constructor() {
        super('Level3');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
        this.load.image("blueCar", "assets/tiled/$ModernPlus Car - Compact Vehicle I Blue.png");
        this.load.image("purpleCar", "assets/tiled/$ModernPlus Car - Compact Vehicle II Blue.png");
        this.load.image("redCar", "assets/tiled/$ModernPlus Car - Compact Vehicle I Red I.png");
        this.load.image("greenCar", "assets/tiled/$ModernPlus Car - Compact Vehicle I Green.png");
        this.load.image("orangeCar", "assets/tiled/orange car.png");
        this.load.image("doors", "assets/tiled/doors.png");
        this.load.image("motorCycle", "assets/tiled/motorcycle.png");
        this.load.tilemapTiledJSON("level3", "assets/tiled/level3.json");
        this.csMarker = this.add.tileSprite(257, 500, 0, 0, "marker").setScale(0.1).setDepth(1);
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 526, 109);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 526, 109);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level3 = this.add.tilemap("level3");
        this.physics.world.setBounds(0, 0, this.level3.widthInPixels, this.level3.heightInPixels);
        this.road = this.level3.addTilesetImage("A5", "roadLayer", 32, 32);
        this.hotDogLayer = this.level3.addTilesetImage("Tile3", "hotDogLayer", 32, 32);
        this.blueCar = this.level3.addTilesetImage("blue car", "blueCar", 32, 32);
        this.doors = this.level3.addTilesetImage("doors", "doors", 32, 32);
        this.greenCar = this.level3.addTilesetImage("green car", "greenCar", 32, 32);
        this.mainCar = this.level3.addTilesetImage("main car", "orangeCar", 32, 32);
        this.motorCycle = this.level3.addTilesetImage("motorcycle", "motorCycle", 32, 32);
        this.purpleCar = this.level3.addTilesetImage("purple car", "purpleCar", 32, 32);

        this.floorLayer = this.level3.createStaticLayer("floor", this.road, 0, 0).setDepth(-3);
        this.wallsLayer = this.level3.createStaticLayer("wall", this.road, 0, 0).setDepth(-3);
        this.markingsLayer = this.level3.createStaticLayer("markings", this.road, 0, 0).setDepth(-1);
        this.spillLayer = this.level3.createStaticLayer("spill", this.hotDogLayer, 0, 0).setDepth(-1);
        this.decoLayer = this.level3.createStaticLayer("deco", this.hotDogLayer, 0, 0).setDepth(-1);
        this.doorLayer = this.level3.createStaticLayer("door", this.doors, 0, 0).setDepth(-1);
        this.blueCarLayer = this.level3.createStaticLayer("blue car", this.blueCar, 0, 0);
        this.purpleCarLayer = this.level3.createStaticLayer("purple car", this.purpleCar, 0, 0);
        this.greenCarLayer = this.level3.createStaticLayer("green car", this.greenCar, 0, 0);
        this.motorCycleLayer = this.level3.createStaticLayer("motorcycle", this.motorCycle, 0, 0);
        this.mainCarLayer = this.level3.createStaticLayer("main car", this.mainCar, 0, 0);
        // Collisions based on layer.
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.decoLayer.setCollisionByProperty({ collides: true });
        this.blueCarLayer.setCollisionByProperty({ collides: true });
        this.greenCarLayer.setCollisionByProperty({ collides: true });
        this.purpleCarLayer.setCollisionByProperty({ collides: true });
        this.mainCarLayer.setCollisionByProperty({ collides: true });
        this.motorCycleLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.decoLayer);
        this.physics.add.collider(this.player, this.blueCarLayer);
        this.physics.add.collider(this.player, this.greenCarLayer);
        this.physics.add.collider(this.player, this.purpleCarLayer);
        this.physics.add.collider(this.player, this.mainCarLayer);
        this.physics.add.collider(this.player, this.motorCycleLayer);
        //end map

        // KEY INTERACTION
        this.interacted = false;
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //Initialize moneybags and amount insured
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start(this.clockTime);
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.amountInsuredMotorCycle = 0;
    }
    update() {
        function msConversion(millis) {
            let sec = Math.floor(millis / 1000);
            let hrs = Math.floor(sec / 3600);
            sec -= hrs * 3600;
            let min = Math.floor(sec / 60);
            sec -= min * 60;

            sec = '' + sec;
            sec = ('00' + sec).substring(sec.length);

            if (hrs > 0) {
                min = '' + min;
                min = ('00' + min).substring(min.length);
                return hrs + ":" + min + ":" + sec;
            }
            else {
                return min + ":" + sec;
            }
        }
        this.clockTimer.setText(msConversion(this.clock.now));
        if (this.interacted === false) {
            var self = this;
            this.motorCycleLayer.setTileLocationCallback(4, 15, 7, 4, function () {
                if (self.keyE.isDown && self.interacted === false) {
                    self.interacted = true;
                    self.player.vel = 0;
                    self.csMarker.destroy();
                    //DIALOG
                    var createLabel = function (scene, text, backgroundColor) {
                        return scene.rexUI.add.label({
                            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x6a4f4b),
                            text: scene.add.text(0, 0, text, {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10
                            }
                        });
                    };

                    var dialog = self.rexUI.add.dialog({
                        x: 400,
                        y: 300,
                        background: self.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x3e2723),
                        title: self.rexUI.add.label({
                            background: self.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x1b0000),
                            text: self.add.text(0, 0, 'Motorcycle Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'Motorcycles could BREAKDOWN at any time and repairs can be COSTLY.\n\nDon’t let BILLS get in the way of your RIDING, get MOTORCYCLE INSURANCE!\n\nFun Fact: Motorcycles tend to need MORE regular maintenance than cars do.', {
                            fontSize: '24px',
                            wordWrap: { width: 450, useAdvancedWrap: false }
                        }),
                        choices: [
                            createLabel(self, 'Do not insure'),
                            createLabel(self, 'Insure $1250'),
                            createLabel(self, 'Insure $2500')
                        ],
                        space: {
                            title: 25,
                            content: 25,
                            choice: 15,
                            left: 25,
                            right: 25,
                            top: 25,
                            bottom: 25,
                        },
                        expand: {
                            content: false,  // Content is a pure text object
                        }
                    })
                        .layout()
                        .setScrollFactor(0)
                        .popUp(1000);

                    dialog
                        .on('button.click', function (button, groupName, index) {
                            dialog.destroy();
                            if (index == 0) {
                                self.moneyBags = self.moneyBags;
                                self.amountInsuredMotorCycle = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredMotorCycle = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredMotorCycle = 2500;
                                self.moneyChange = self.add.text(600, 60, "- 2500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            }
                            self.scoreBoard.setText('FWD$: ' + self.moneyBags);
                            self.player.vel = 200;
                            if (self.interacted == true) {
                                self.cameras.main.fadeOut(1000);
                                self.cameras.main.on('camerafadeoutcomplete', function () {
                                    self.scene.start('Level3Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredMotorCycle: self.amountInsuredMotorCycle });
                                });
                            };
                        }, this)
                        .on('button.over', function (button, groupName, index) {
                            button.getElement('background').setStrokeStyle(1, 0xffffff);
                        })
                        .on('button.out', function (button, groupName, index) {
                            button.getElement('background').setStrokeStyle();
                        });
                };
            });
        }
    }

};
