import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level4 extends Phaser.Scene {
    constructor() {
        super('Level4');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
        this.load.image("kitchen", "assets/tiled/Kitcheen.png");
        this.load.image("kitchen2", "assets/tiled/kitchen.png");
        this.load.image("misc", "assets/tiled/Miscs.png");
        this.load.image("corridor", "assets/tiled/corridorz.png");
        this.load.tilemapTiledJSON("level4", "assets/tiled/level4.json");
        this.csMarker = this.add.tileSprite(395, 370, 0, 0, "marker").setScale(0.1).setDepth(1);
        this.csMarker2 = this.add.tileSprite(535, 220, 0, 0, "marker").setScale(0.1).setDepth(1);
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 176, 353);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 176, 353);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level4 = this.add.tilemap("level4");
        this.physics.world.setBounds(0, 0, this.level4.widthInPixels, this.level4.heightInPixels);
        this.building = this.level4.addTilesetImage("A4", "building", 32, 32);
        this.schoolFloor = this.level4.addTilesetImage("floor", "schoolFloor", 32, 32);
        this.livingRoom = this.level4.addTilesetImage("livingroom", "livingRoom", 32, 32);
        this.kitchen = this.level4.addTilesetImage("kitchen", "kitchen", 32, 32);
        this.kitchen2 = this.level4.addTilesetImage("kitchen2", "kitchen2", 32, 32);
        this.misc = this.level4.addTilesetImage("misc", "misc", 32, 32);
        this.corridor = this.level4.addTilesetImage("corridorz", "corridor", 32, 32);

        this.floorLayer = this.level4.createStaticLayer("floor", this.building, 0, 0).setDepth(-3);
        this.wallsLayer = this.level4.createStaticLayer("wall", this.schoolFloor, 0, 0).setDepth(-3);
        this.kitchenLayer = this.level4.createStaticLayer("kitchen", this.kitchen, 0, 0).setDepth(-2);
        this.kitchen2Layer = this.level4.createStaticLayer("kitchen2", this.kitchen2, 0, 0).setDepth(-2);
        this.miscLayer = this.level4.createStaticLayer("misc", this.misc, 0, 0);
        this.platesLayer = this.level4.createStaticLayer("plates", this.corridor, 0, 0).setDepth(-1);
        this.morePlatesLayer = this.level4.createStaticLayer("more plates", this.corridor, 0, 0).setDepth(-1);
        this.livingRoomLayer = this.level4.createStaticLayer("livingroom", this.livingRoom, 0, 0);
        this.kitchenPropsLayer = this.level4.createStaticLayer("kitchen props", this.kitchen, 0, 0);
        // Collisions based on layer.
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.kitchenLayer.setCollisionByProperty({ collides: true });
        this.kitchen2Layer.setCollisionByProperty({ collides: true });
        this.livingRoomLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.kitchenLayer);
        this.physics.add.collider(this.player, this.kitchen2Layer);
        this.physics.add.collider(this.player, this.livingRoomLayer);
        //end map

        // KEY INTERACTION
        this.interacted = false;
        this.interacted2 = false;
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //Initialize moneybags and amount insured
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start(this.clockTime);
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0);
        this.amountInsuredFood = 0;
        this.amountInsuredTravel = 0;
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
            this.kitchenLayer.setTileLocationCallback(12, 13, 1, 2, function () {
                if (self.player.direction == "up" && self.keyE.isDown && self.interacted === false) {
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
                            text: self.add.text(0, 0, 'Food Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'DESCRIPTION ', {
                            fontSize: '24px'
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
                                self.amountInsuredFood = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredFood = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredFood = 2500;
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
                            if (self.interacted == true && self.interacted2 == true) {
                                self.cameras.main.fadeOut(1000);
                                self.cameras.main.on('camerafadeoutcomplete', function () {
                                    self.scene.start('Level4Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredFood: self.amountInsuredFood, amountInsuredTravel: self.amountInsuredTravel });
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
        if (this.interacted2 === false) {
            var self = this;
            this.kitchenLayer.setTileLocationCallback(16, 8, 1, 3, function () {
                if (self.player.direction == "up" && self.keyE.isDown && self.interacted2 === false) {
                    self.interacted2 = true;
                    self.player.vel = 0;
                    self.csMarker2.destroy();
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
                            text: self.add.text(0, 0, 'Travel Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'DESCRIPTION ', {
                            fontSize: '24px'
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
                                self.amountInsuredTravel = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredTravel = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredTravel = 2500;
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
                            if (self.interacted == true && self.interacted2 == true) {
                                self.cameras.main.fadeOut(1000);
                                self.cameras.main.on('camerafadeoutcomplete', function () {
                                    self.scene.start('Level4Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredFood: self.amountInsuredFood, amountInsuredTravel: self.amountInsuredTravel });
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
