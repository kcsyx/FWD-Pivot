import 'phaser';
import config from '../Config/config';

export default class QuizInstructionsScene extends Phaser.Scene {
    constructor() {
        super('QuizInstructions');
    }

    init(data) {
        this.gender = data.gender;
        this.moneyBags = data.moneyBags;
        this.clockTime = data.clockTime;
    }

    preload() {
        // load images
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "instructions2");
        this.background.setOrigin(0, 0);
    }

    create() {
        this.cameras.main.fadeIn(500);
        var self = this;
        this.nextScene = false;
        var textGameObject = this.add.text(10, 40, 'text', { align: 'center', fontSize: '48px', fontFamily: "arcade_classic", fill: '#fff', wordWrap: { width: 780, useAdvancedWrap: false } });
        var typing = this.plugins.get('rexTextTyping').add(textGameObject, {
            speed: 30,
            typeMode: 0
        });
        typing.start('YOU  HAVE  COMPLETED  ALL  SCENARIOS!\n\nTHERE  WILL  BE  A  SHORT  QUIZ  IN  THE  NEXT  SECTION. EACH  QUESTION  IS  WORTH  350  FWD$!\n\nGOOD  LUCK!\n\nCLICK  ANYWHERE  TO  START');
        typing.on('complete', function (typing, txt) {
            if (self.nextScene == false) {
                self.nextScene = true;
                self.input.on('pointerup', function () {
                    self.scene.start('QuizLevel1', { gender: self.gender, moneyBags: self.moneyBags, clockTime: self.clockTime });
                })
            }
        });
    }
}
