import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', 'assets/pivotlogo.png');
  }

  create() {
    //HACK TO PRELOAD A CUSTOM FONT
    this.add.text(0, 0, "hack", { font: "1px arcade_classic", fill: "#FFFFFF" });
    this.scene.start('Preloader');
  }
};