import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

    init(data) {
        this.gender = data.gender;
    }

    preload() {
        this.load.image("schoolClassrooms", "assets/tiled/School - Classrooms.png");
        this.load.image("schoolFloor", "assets/tiled/School - Floor.png");
        this.load.tilemapTiledJSON("level1", "assets/tiled/level1.json");
        this.csMarker = this.add.tileSprite(360, 215, 0, 0, "marker").setScale(0.1).setDepth(1);
        this.csMarker2 = this.add.tileSprite(135, 90, 0, 0, "marker").setScale(0.1).setDepth(1);
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 210, 200);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 210, 200);
        }
        this.cameras.main.startFollow(this.player);
        //map
        this.level1 = this.add.tilemap("level1");
        this.physics.world.setBounds(0, 0, this.level1.widthInPixels, this.level1.heightInPixels);
        this.schoolClassrooms = this.level1.addTilesetImage("deco", "schoolClassrooms", 32, 32);
        this.schoolFloor = this.level1.addTilesetImage("floor", "schoolFloor", 32, 32);
        this.floorLayer = this.level1.createStaticLayer("floor", this.schoolFloor, 0, 0).setDepth(-3);
        this.wallsLayer = this.level1.createStaticLayer("walls", this.schoolFloor, 0, 0).setDepth(-3);
        this.decoLayer = this.level1.createStaticLayer("deco", this.schoolClassrooms, 0, 0).setDepth(-1);
        this.decoChairsLayer = this.level1.createStaticLayer("decoChairs", this.schoolClassrooms, 0, 0).setDepth(-1);
        this.decoWhiteboardLayer = this.level1.createStaticLayer("decoWhiteboard", this.schoolClassrooms, 0, 0);
        // Collisions based on layer.
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.decoLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.decoLayer);
        //end map

        // KEY INTERACTION
        this.interacted = false;
        this.interacted2 = false;
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //Initialize moneybags and amount insured
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start();
        this.moneyBags = 5000;
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
        this.amountInsuredCS = 0;
        this.amountInsuredEP = 0;
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
        //Interaction 1 this.interacted
        if (this.interacted === false) {
            var self = this;
            this.decoLayer.setTileLocationCallback(11, 10, 1, 1, function () {
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
                            text: self.add.text(0, 0, 'Cybersecurity Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'LOSING all your hard work to MALWARE or getting SCAMMED by HACKERS sure is SCARY.\n\nMake sure your data is PROTECTED with CYBERSECURITY INSURANCE.', {
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
                                self.amountInsuredCS = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredCS = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredCS = 2500;
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
                                    self.scene.start('Level1Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredCS: self.amountInsuredCS, amountInsuredEP: self.amountInsuredEP });
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
            this.decoLayer.setTileLocationCallback(4, 3, 1, 1, function () {
                if (self.player.direction == "down" && self.keyE.isDown && self.interacted2 === false) {
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
                            text: self.add.text(0, 0, 'Endowment Plan', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, "Education is incredibly EXPENSIVE - will you have enough saved?\n\nEndowment policies HELP you to meet your educational NEEDS.", {
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
                        .popUp(1000)
                        .setDepth(2);

                    dialog
                        .on('button.click', function (button, groupName, index) {
                            dialog.destroy();
                            if (index == 0) {
                                self.moneyBags = self.moneyBags;
                                self.amountInsuredEP = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredEP = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredEP = 2500;
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
                                    self.scene.start('Level1Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredCS: self.amountInsuredCS, amountInsuredEP: self.amountInsuredEP });
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
