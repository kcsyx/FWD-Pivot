import 'phaser';
import Button from '../Objects/Button';
import config from '../Config/config';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  preload () {
    // load images
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
  }

  create () {
    this.gender = undefined;
    console.log("Gender:" + this.gender);
    
    this.genderText = this.add.text(250, 190, 'Gender', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderMale = this.add.text(350, 190, 'Male', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderFemale = this.add.text(425, 190, 'Female', { fontSize: 24, fontFamily: "arcade_classic" });

    this.genderMale.setInteractive();
    this.genderFemale.setInteractive();

    this.genderMale.on('pointerdown', function () {
      this.gender = "male";
      this.genderMale.setColor("red");
      this.genderFemale.setColor("white");
      console.log("Gender:" + this.gender);
    }.bind(this));

    this.genderFemale.on('pointerdown', function () {
      this.gender = "female";
      this.genderFemale.setColor("red");
      this.genderMale.setColor("white");
      console.log("Gender:" + this.gender);
    }.bind(this));

    this.lifestageText = this.add.text(250, 290, 'Life Stage', { fontSize: 24, fontFamily: "arcade_classic" });
    
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');

  }
};
