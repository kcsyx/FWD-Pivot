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
        //download min file instead https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js change url to local file
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: '../Plugins/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
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
        //end tentative map

        // KEY INTERACTION
        this.interacted = false;
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //Initialize moneybags
        this.moneyBags = 5000;
        this.scoreBoard = this.add.text(600, 40, "Cash: "+this.moneyBags, {fontSize: '24px', fontFamily: "arcade_classic", fill: '#fff'}).setScrollFactor(0);
    }
    update() {
        //Interaction 1 this.interacted
        if (this.interacted === false) {
            var self = this;
            this.tablesLayer.setTileLocationCallback(24, 18, 1, 1, function () {
                if (self.player.direction == "right" && self.keyE.isDown && self.interacted === false) {
                    console.log("Interacted!");
                    self.interacted = true;
                    self.player.vel = 0;
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
                        content: self.add.text(0, 0, 'DESCRIPTION ', {
                            fontSize: '24px'
                        }),
                        choices: [
                            createLabel(self, 'Do not insure'),
                            createLabel(self, 'Insure $1000'),
                            createLabel(self, 'Insure $2000')
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
                            console.log(index, button.text);
                            dialog.destroy();
                            if(index == 0) {
                                self.moneyBags = self.moneyBags;
                            } else if(index == 1){
                                self.moneyBags -= 1000;
                            } else if(index == 2){
                                self.moneyBags -= 2000;
                            }
                            self.scoreBoard.setText('Cash: '+self.moneyBags);
                            self.player.vel = 200;
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
        //Interaction 2 this.interacted2?
        //If interacted and interacted2 == true then next scene fade in ('nextScene', {gender:this.gender, moneyBags:this.moneybags, amountInsuredCS: this.amountCS, amountInsuredEP: this.amountEP})
    }

};
