import 'phaser';
import config from '../Config/config';
import MalePlayer from '../Objects/MalePlayer';
import FemalePlayer from '../Objects/FemalePlayer';
import GoldCoin from '../Objects/GoldCoin';

export default class Level4Random extends Phaser.Scene {
    constructor() {
        super('Level4Random');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.amountInsuredFood = data.amountInsuredFood;
        this.amountInsuredTravel = data.amountInsuredTravel;
        this.clockTime = data.clockTime;
    }

    preload() {
        this.load.image("Tile6", "assets/tiled/Tile6 - Bonus shop.png");
        this.load.tilemapTiledJSON("level4random", "assets/tiled/level4random.json");
    }

    create() {
        this.cameras.main.fadeIn(500);
        // Add player to current scene
        if (this.gender == "male") {
            this.player = new MalePlayer(this, 110, 140);
        } else if (this.gender == "female") {
            this.player = new FemalePlayer(this, 110, 140);
        }
        this.cameras.main.startFollow(this.player);

        //map
        this.level4random = this.add.tilemap("level4random");
        this.physics.world.setBounds(0, 0, this.level4random.widthInPixels, this.level4random.heightInPixels);
        this.building = this.level4random.addTilesetImage("A4", "building", 32, 32);
        this.doors = this.level4random.addTilesetImage("doors", "doors", 32, 32);
        this.roadDeco = this.level4random.addTilesetImage("Tile2", "roadDeco", 32, 32);
        this.hotDogLayer = this.level4random.addTilesetImage("Tile3", "hotDogLayer", 32, 32);
        this.treesLayer = this.level4random.addTilesetImage("Tile4", "treesLayer", 32, 32);
        this.tile6 = this.level4random.addTilesetImage("Tile6", "Tile6", 32, 32);
        this.newRoad = this.level4random.addTilesetImage("new road", "newRoad", 32, 32);

        this.roadFloor = this.level4random.createStaticLayer("floor", this.newRoad, 0, 0).setDepth(-3);
        this.buildingsLayer = this.level4random.createStaticLayer("buildings", this.treesLayer, 0, 0).setDepth(-2);
        this.roofsLayer = this.level4random.createStaticLayer("roofs", this.building, 0, 0).setDepth(-1);
        this.tile2Layer = this.level4random.createStaticLayer("tile2", this.roadDeco, 0, 0);
        this.tile3Layer = this.level4random.createStaticLayer("tile3", this.hotDogLayer, 0, 0).setDepth(-1);
        this.tile4Layer = this.level4random.createStaticLayer("Tile4", this.treesLayer, 0, 0);
        this.tile6Layer = this.level4random.createStaticLayer("Tile6", this.tile6, 0, 0).setDepth(-1);
        this.doorsLayer = this.level4random.createStaticLayer("doors", this.doors, 0, 0);


        // Collisions based on layer.
        this.roadFloor.setCollisionByProperty({ collides: true });
        // Add collisions.
        this.physics.add.collider(this.player, this.roadFloor);
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

        //Coin spawning
        let coins = this.physics.add.group();
        const createCoin = (x, y) => {
            let c = new GoldCoin(this, x, y);
            coins.add(c);
        }
        createCoin(128, 22);
        createCoin(128, 325);
        createCoin(211, 469);
        createCoin(451, 329);
        createCoin(587, 249);
        const getCoin = (p, c) => {
            this.moneyBags += 200;
            this.scoreBoard.setText('FWD$: ' + this.moneyBags);
            this.moneyChange = this.add.text(600, 60, "+ 200", { fontSize: '24px', fontFamily: "arcade_classic", fill: '#00ff4a' }).setScrollFactor(0);
            this.tweens.add({
                targets: this.moneyChange,
                alpha: { from: 1, to: 0 },
                duration: 4000,
                ease: 'Power2'
            });
            c.destroy();
        }
        this.physics.add.overlap(this.player, coins, getCoin);
        //End coin spawning
    }
    update() {
        if (this.moneyBags < 0) {
            this.player.vel = 0;
        }
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
            this.roadFloor.setTileLocationCallback(3, 12, 5, 1, function () {
                if (self.amountInsuredFood == 0 && self.popUp === false) {
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
                            content: self.add.text(0, 0, 'You have contracted a minor case of food poisoning!\n\nUnfortunately, you did not insure at all and lost a bit of money.', {
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
                            content: self.add.text(0, 0, 'You have contracted a major case of food poisoning!\n\nUnfortunately, you did not insure at all and lost a lot of money.', {
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
                } else if (self.amountInsuredFood == 1250 && self.popUp === false) {
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
                            content: self.add.text(0, 0, 'You have contracted a minor case of food poisoning!\n\nLucky for you, you insured the right amount and got back more money!', {
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
                            content: self.add.text(0, 0, 'You have contracted a major case of food poisoning!\n\nUnfortunately, you did not insure enough and lost more money.', {
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
                } else if (self.amountInsuredFood == 2500 && self.popUp === false) {
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
                            content: self.add.text(0, 0, 'You have contracted a minor case of food poisoning!\n\nUnfortunately, you insured more than needed but at least you got some of the money back!', {
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
                            content: self.add.text(0, 0, 'You have contracted a major case of food poisoning!\n\nLucky for you, you insured heavily and got back more money!', {
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
            this.roadFloor.setTileLocationCallback(18, 7, 1, 3, function () {
                self.cameras.main.fadeOut(1000);
                if (self.endMap === false) {
                    self.endMap = true;
                    self.cameras.main.on('camerafadeoutcomplete', function () {
                        self.scene.start('Level5', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clock.now });
                    });
                }
            });
        };
        if (this.popUp2 === false) {
            var self = this;
            this.roadFloor.setTileLocationCallback(13, 13, 5, 1, function () {
                if (self.amountInsuredTravel == 0 && self.popUp2 === false) {
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
                            content: self.add.text(0, 0, 'Your flight will be delayed!\n\nUnfortunately, you did not insure at all and lost a bit of money.', {
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
                            content: self.add.text(0, 0, 'Your flight has been cancelled!\n\nUnfortunately, you did not insure at all and lost a lot of money.', {
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
                } else if (self.amountInsuredTravel == 1250 && self.popUp2 === false) {
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
                            content: self.add.text(0, 0, 'Your flight will be delayed!\n\nLucky for you, you insured the right amount and got back more money!', {
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
                            content: self.add.text(0, 0, 'Your flight has been cancelled!\n\nUnfortunately, you did not insure enough and lost more money.', {
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
                } else if (self.amountInsuredTravel == 2500 && self.popUp2 === false) {
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
                            content: self.add.text(0, 0, 'Your flight will be delayed!\n\nUnfortunately, you insured more than needed but at least you got some of the money back!', {
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
                            content: self.add.text(0, 0, 'Your flight has been cancelled!\n\nLucky for you, you insured heavily and got back more money!', {
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
