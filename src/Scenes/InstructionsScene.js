import 'phaser';
import config from '../Config/config';

export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super('Instructions');
    }

    init(data) {
        this.gender = data.gender;
    }

    preload() {
        // load images
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "instructions");
        this.background.setOrigin(0, 0);
    }

    create() {
        this.cameras.main.fadeIn(500);
        this.background.setInteractive();
        this.backgroundClicked = false;
        this.nextScene = false;
        if (this.backgroundClicked == false) {
            var self = this;
            this.background.on('pointerdown', function () {
                self.backgroundClicked = true;
                self.background.disableInteractive();
                self.cameras.main.fadeIn(500);
                self.instructions2 = self.add.tileSprite(0, 0, config.width, config.height, "instructions2");
                self.instructions2.setInteractive();
                self.instructions2.setOrigin(0, 0);
                var textGameObject = self.add.text(20, 40, 'text', { align: 'center', fontSize: '48px', fontFamily: "arcade_classic", fill: '#fff', wordWrap: { width: 780, useAdvancedWrap: false } });
                var typing = self.plugins.get('rexTextTyping').add(textGameObject, {
                    speed: 35,
                    typeMode: 0
                });
                typing.start('WELCOME  TO  PIVOT! THE  GOAL  OF  THIS  GAME  IS  TO  EARN  AS  MUCH  MONEY  AS  POSSIBLE.\nTRY  TO  SPEND  YOUR  MONEY  WISELY  AND  AVOID  GOING  IN  DEBT.\n\nHAVE  FUN!\n\nCLICK  ANYWHERE  TO  START');
                typing.on('complete', function (typing, txt) {
                    if (self.nextScene == false) {
                        self.nextScene = true;
                        self.instructions2.on('pointerup', function () {
                            self.scene.start('Level1', { gender: self.gender });
                        })
                    }
                });
            }.bind(this));
        }
    }
};
