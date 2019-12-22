import 'phaser';
import config from '../Config/config';

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
    }

};
