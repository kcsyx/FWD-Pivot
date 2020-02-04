import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level5 extends Phaser.Scene {
    constructor() {
        super('Level5');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
        this.load.image("room", "assets/tiled/Room.png");
        this.load.image("dogToy", "assets/tiled/$Sink.png");
        this.load.tilemapTiledJSON("level5", "assets/tiled/level5.json");
        this.csMarker = this.add.tileSprite(335, 160, 0, 0, "marker").setScale(0.1).setDepth(1);
        this.csMarker2 = this.add.tileSprite(110, 220, 0, 0, "marker").setScale(0.1).setDepth(1);
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 223, 300);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 223, 300);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level5 = this.add.tilemap("level5");
        this.physics.world.setBounds(0, 0, this.level5.widthInPixels, this.level5.heightInPixels);
        this.room = this.level5.addTilesetImage("room", "room", 32, 32);
        this.dogToy = this.level5.addTilesetImage("dogtoy", "dogToy", 32, 32);
        this.schoolFloor = this.level5.addTilesetImage("floor", "schoolFloor", 32, 32);
        this.livingRoom = this.level5.addTilesetImage("livingroom", "livingRoom", 32, 32);

        this.floorLayer = this.level5.createStaticLayer("floor", this.schoolFloor, 0, 0).setDepth(-3);
        this.wallsLayer = this.level5.createStaticLayer("wall", this.schoolFloor, 0, 0).setDepth(-3);
        this.dogToyLayer = this.level5.createStaticLayer("dogtoy", this.dogToy, 0, 0).setDepth(-2);
        this.decoLayer = this.level5.createStaticLayer("deco", this.livingRoom, 0, 0).setDepth(-2);
        this.moreDecoLayer = this.level5.createStaticLayer("more deco", this.livingRoom, 0, 0);
        this.windowLayer = this.level5.createStaticLayer("window", this.room, 0, 0).setDepth(-1);
        // Collisions based on layer.
        this.moreDecoLayer.setCollisionByProperty({ collides: true });
        this.decoLayer.setCollisionByProperty({ collides: true });
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.windowLayer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.decoLayer);
        this.physics.add.collider(this.player, this.windowLayer);
        this.physics.add.collider(this.player, this.moreDecoLayer);
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
        this.amountInsuredPet = 0;
        this.amountInsuredCar = 0;
    }
    update() {
        //TO SEE POINTER COORDINATE TO PLACE SPRITES
        // console.log('x'+this.input.activePointer.worldX);
        // console.log('y'+this.input.activePointer.worldY);
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
            this.decoLayer.setTileLocationCallback(9, 5, 3, 3, function () {
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
                            text: self.add.text(0, 0, 'Pet Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'BAD things happen even to GOOD pets, and medical EXPENSES can rack up.\n\nGet PET INSURANCE because a HAPPY pet makes for a HAPPY owner!', {
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
                        .setDepth(2)
                        .layout()
                        .setScrollFactor(0)
                        .popUp(1000);

                    dialog
                        .on('button.click', function (button, groupName, index) {
                            dialog.destroy();
                            if (index == 0) {
                                self.moneyBags = self.moneyBags;
                                self.amountInsuredPet = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredPet = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredPet = 2500;
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
                                    self.scene.start('Level5Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredPet: self.amountInsuredPet, amountInsuredCar: self.amountInsuredCar });
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
            this.decoLayer.setTileLocationCallback(2, 7, 3, 3, function () {
                if (self.keyE.isDown && self.interacted2 === false) {
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
                            text: self.add.text(0, 0, 'Car Insurance', {
                                fontSize: '24px'
                            }),
                            space: {
                                left: 15,
                                right: 15,
                                top: 10,
                                bottom: 10
                            }
                        }),
                        content: self.add.text(0, 0, 'You NEVER know when a car CRASH could happen.\n\nEnsure you and your family are PROTECTED, get CAR INSURANCE.', {
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
                        .setDepth(2)
                        .setScrollFactor(0)
                        .popUp(1000);

                    dialog
                        .on('button.click', function (button, groupName, index) {
                            dialog.destroy();
                            if (index == 0) {
                                self.moneyBags = self.moneyBags;
                                self.amountInsuredCar = 0;
                                self.moneyChange = self.add.text(600, 60, "- 0", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 1) {
                                self.moneyBags -= 1250;
                                self.amountInsuredCar = 1250;
                                self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                                self.tweens.add({
                                    targets: self.moneyChange,
                                    alpha: { from: 1, to: 0 },
                                    duration: 4000,
                                    ease: 'Power2'
                                });
                            } else if (index == 2) {
                                self.moneyBags -= 2500;
                                self.amountInsuredCar = 2500;
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
                                    self.scene.start('Level5Random', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now, amountInsuredPet: self.amountInsuredPet, amountInsuredCar: self.amountInsuredCar });
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
