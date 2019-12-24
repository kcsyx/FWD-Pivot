import 'phaser';
import config from '../Config/config';
import Player from '../Objects/Player';

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGame');
    }

    init(data) {
        this.gender = data.gender;
    }

    preload() {
        console.log(this.gender);
    }

    create() {
        // Add player to current scene
        new Player(this, 300, 300);
    }

};
