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
        this.cameras.main.fadeIn(1000);

        this.background.setInteractive();
        this.background.on('pointerdown', function () {
            this.scene.start('MainGame', { gender: this.gender });
        }.bind(this));
    }

};
