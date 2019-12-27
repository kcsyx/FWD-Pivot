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
    }

    create() {
        // Add player to current scene
        if (this.gender == "male") {
            new MalePlayer(this, 300, 300);
        } else if (this.gender == "female") {
            new FemalePlayer(this, 300, 300);
        }
    }

};
