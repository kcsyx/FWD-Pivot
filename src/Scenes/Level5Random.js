import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';

export default class Level5Random extends Phaser.Scene {
    constructor() {
        super('Level5Random');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.amountInsuredPet = data.amountInsuredPet;
        this.amountInsuredCar = data.amountInsuredCar;
        this.clockTime = data.clockTime;
    }

    preload() {
        this.load.tilemapTiledJSON("level5random", "assets/tiled/level5random.json");
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 110, 80);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 110, 80);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level5random = this.add.tilemap("level5random");
        this.physics.world.setBounds(0, 0, this.level5random.widthInPixels, this.level5random.heightInPixels);
        this.building = this.level5random.addTilesetImage("A4", "building", 32, 32);
        this.doors = this.level5random.addTilesetImage("doors", "doors", 32, 32);
        this.roadDeco = this.level5random.addTilesetImage("Tile2", "roadDeco", 32, 32);
        this.hotDogLayer = this.level5random.addTilesetImage("Tile3", "hotDogLayer", 32, 32);
        this.treesLayer = this.level5random.addTilesetImage("Tile4", "treesLayer", 32, 32);
        this.newRoad = this.level5random.addTilesetImage("new road", "newRoad", 32, 32);
        this.blueCar = this.level5random.addTilesetImage("blue car", "blueCar", 32, 32);
        this.greenCar = this.level5random.addTilesetImage("green car", "greenCar", 32, 32);
        this.purpleCar = this.level5random.addTilesetImage("purple car", "purpleCar", 32, 32);

        this.roadFloor = this.level5random.createStaticLayer("floor", this.newRoad, 0, 0).setDepth(-3);
        this.buildingsLayer = this.level5random.createStaticLayer("building", this.treesLayer, 0, 0).setDepth(-2);
        this.markingsLayer = this.level5random.createStaticLayer("markings", this.newRoad, 0, 0).setDepth(-2);
        this.greenCarLayer = this.level5random.createStaticLayer("green car", this.greenCar, 0, 0);
        this.purpleCarLayer = this.level5random.createStaticLayer("purple car", this.purpleCar, 0, 0);
        this.blueCarLayer = this.level5random.createStaticLayer("blue car", this.blueCar, 0, 0);
        this.tile2Layer = this.level5random.createStaticLayer("Tile2", this.roadDeco, 0, 0);
        this.tile3Layer = this.level5random.createStaticLayer("Tile3", this.roadDeco, 0, 0).setDepth(-2);
        this.tile4Layer = this.level5random.createStaticLayer("Tile4", this.treesLayer, 0, 0).setDepth(-1);
        this.doorsLayer = this.level5random.createStaticLayer("doors", this.doors, 0, 0).setDepth(-1);
        this.decoLayer = this.level5random.createStaticLayer("deco", this.hotDogLayer, 0, 0).setDepth(-2);

        // Collisions based on layer.
        this.roadFloor.setCollisionByProperty({ collides: true });
        this.tile3Layer.setCollisionByProperty({ collides: true });
        this.decoLayer.setCollisionByProperty({ collides: true });
        this.tile2Layer.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.roadFloor);
        this.physics.add.collider(this.player, this.tile3Layer);
        this.physics.add.collider(this.player, this.tile2Layer);
        this.physics.add.collider(this.player, this.decoLayer);
        //end map

        //Initialize moneybags and amount insured
        this.arr = ["nH", "minorA", "majorA"]
        this.item1 = Phaser.Math.RND.pick(this.arr);
        this.item2 = Phaser.Math.RND.pick(this.arr);
        this.popUp = false;
        this.popUp2 = false;
        this.endMap = false;
        this.endGame = false;
        this.scoreBoard = this.add.text(600, 40, "FWD$: " + this.moneyBags, { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
        this.clock = this.plugins.get('rexClock').add(this);
        this.clock.start(this.clockTime);
        this.clockTimer = this.add.text(100, 40, '', { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff' }).setScrollFactor(0).setDepth(2);
    }
    update() {
        if (this.moneyBags < 0 && this.endGame == false) {
            this.endGame = true;
            var self = this;
            this.player.vel = 0;
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
                    text: self.add.text(0, 0, 'GAME OVER!', {
                        fontSize: '24px'
                    }),
                    space: {
                        left: 15,
                        right: 15,
                        top: 10,
                        bottom: 10
                    }
                }),
                content: self.add.text(0, 0, 'You are in debt', {
                    fontSize: '24px'
                }),
                choices: [
                    createLabel(self, 'RETRY')
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
                    location.reload();
                }, this)
                .on('button.over', function (button, groupName, index) {
                    button.getElement('background').setStrokeStyle(1, 0xffffff);
                })
                .on('button.out', function (button, groupName, index) {
                    button.getElement('background').setStrokeStyle();
                });
        }
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
        if (this.popUp === false) {
            var self = this;
            this.roadFloor.setTileLocationCallback(10, 3, 5, 1, function () {
                if (self.amountInsuredPet == 0 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    if (self.item1 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item1 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 1250;
                        self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has gotten ill, requiring medicine!\n\nUnfortunately, you did not insure at all and lost a bit of money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item1 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 2500;
                        self.moneyChange = self.add.text(600, 60, "- 2500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has broken his leg, requiring immediate surgery!\n\nUnfortunately, you did not insure at all and lost a lot of money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                } else if (self.amountInsuredPet == 1250 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    if (self.item1 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item1 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 1825;
                        self.moneyChange = self.add.text(600, 60, "+ 1825", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has gotten ill, requiring medicine!\n\nLucky for you, you insured the right amount and got back more money!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item1 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 250;
                        self.moneyChange = self.add.text(600, 60, "- 250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has broken his leg, requiring immediate surgery!\n\nUnfortunately, you did not insure enough and lost more money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                } else if (self.amountInsuredPet == 2500 && self.popUp === false) {
                    self.popUp = true;
                    self.player.vel = 0;
                    if (self.item1 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item1 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 1500;
                        self.moneyChange = self.add.text(600, 60, "+ 1500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has gotten ill, requiring medicine!\n\nUnfortunately, you insured more than needed but at least you got some of the money back!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item1 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 3750;
                        self.moneyChange = self.add.text(600, 60, "+ 3750", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'Your dog has broken his leg, requiring immediate surgery!\n\nLucky for you, you insured heavily and got back more money!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                }
                self.scoreBoard.setText('FWD$: ' + self.moneyBags);
            });
            this.roadFloor.setTileLocationCallback(18, 13, 2, 3, function () {
                self.cameras.main.fadeOut(1000);
                if (self.endMap === false) {
                    self.endMap = true;
                    self.cameras.main.on('camerafadeoutcomplete', function () {
                        self.scene.start('QuizLevel1', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now });
                    });
                }
            });
        };
        if (this.popUp2 === false) {
            var self = this;
            this.roadFloor.setTileLocationCallback(12, 13, 1, 4, function () {
                if (self.amountInsuredCar == 0 && self.popUp2 === false) {
                    self.popUp2 = true;
                    self.player.vel = 0;
                    if (self.item2 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item2 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 1250;
                        self.moneyChange = self.add.text(600, 60, "- 1250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You hit a curb, causing minor damage to your car!\n\nUnfortunately, you did not insure at all and lost a bit of money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item2 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 2500;
                        self.moneyChange = self.add.text(600, 60, "- 2500", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You drove into a pillar, causing major damage to your car!\n\nUnfortunately, you did not insure at all and lost a lot of money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                } else if (self.amountInsuredCar == 1250 && self.popUp2 === false) {
                    self.popUp2 = true;
                    self.player.vel = 0;
                    if (self.item2 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item2 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 1825;
                        self.moneyChange = self.add.text(600, 60, "+ 1825", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You hit a curb, causing minor damage to your car!\n\nLucky for you, you insured the right amount and got back more money!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item2 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags -= 250;
                        self.moneyChange = self.add.text(600, 60, "- 250", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#fb0909' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You drove into a pillar, causing major damage to your car!\n\nUnfortunately, you did not insure enough and lost more money.', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                } else if (self.amountInsuredCar == 2500 && self.popUp2 === false) {
                    self.popUp2 = true;
                    self.player.vel = 0;
                    if (self.item2 == "nH") {
                        self.moneyBags = self.moneyBags;
                        self.player.vel = 200;
                    } else if (self.item2 == "minorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 1825;
                        self.moneyChange = self.add.text(600, 60, "+ 1825", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Minor accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You hit a curb, causing minor damage to your car!\n\nUnfortunately, you insured more than needed but at least you got some of the money back!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    } else if (self.item2 == "majorA") {
                        self.cameras.main.shake(200);
                        self.moneyBags += 3750;
                        self.moneyChange = self.add.text(600, 60, "+ 3750", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
                        self.tweens.add({
                            targets: self.moneyChange,
                            alpha: { from: 1, to: 0 },
                            duration: 4000,
                            ease: 'Power2'
                        });
                        // dialog pop up, close on click and set player vel back to 200
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
                                text: self.add.text(0, 0, 'Major accident occurred', {
                                    fontSize: '24px'
                                }),
                                space: {
                                    left: 15,
                                    right: 15,
                                    top: 10,
                                    bottom: 10
                                }
                            }),
                            content: self.add.text(0, 0, 'You drove into a pillar, causing major damage to your car!\n\nLucky for you, you insured heavily and got back more money!', {
                                fontSize: '24px',
                                wordWrap: { width: 450, useAdvancedWrap: false }
                            }),
                            choices: [
                                createLabel(self, 'Close')
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
                                self.player.vel = 200;
                            }, this)
                            .on('button.over', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle(1, 0xffffff);
                            })
                            .on('button.out', function (button, groupName, index) {
                                button.getElement('background').setStrokeStyle();
                            });
                    }
                }
                self.scoreBoard.setText('FWD$: ' + self.moneyBags);
            });
        };
    }
};
