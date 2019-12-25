import 'phaser';
import config from '../Config/config';
import Player from '../Objects/Player';
import FPlayer from '../Objects/FPlayer';

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
        if (this.gender == "male") {
            new Player(this, 300, 300);
        } else if (this.gender == "female") {
            new FPlayer(this, 300, 300);
        }
    }

};
