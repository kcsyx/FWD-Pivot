import 'phaser';
import Button from '../Objects/Button';
import config from '../Config/config';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // load images
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "instructions2");
    this.background.setOrigin(0, 0);
  }

  create() {
    this.gender = undefined;
    this.avatar = 'defaultAvatar';
    this.avatarImage = this.add.image(config.width / 2, config.height / 2, this.avatar);
    console.log("Gender:" + this.gender);
    this.chooseGender = this.add.text(190, config.height / 2 - 260, 'CHOOSE YOUR GENDER', { fontSize: 48, fontFamily: "arcade_classic" });
    // this.genderText = this.add.text(275, config.height/2 - 170, 'Gender:', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderMale = this.add.text(275, config.height / 2 - 170, 'Male', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderFemale = this.add.text(445, config.height / 2 - 170, 'Female', { fontSize: 24, fontFamily: "arcade_classic" });

    this.genderMale.setInteractive();
    this.genderFemale.setInteractive();

    this.genderMale.on('pointerdown', function () {
      this.gender = "male";
      this.genderMale.setColor("#173028");
      this.genderFemale.setColor("white");
      this.avatar = 'maleAvatar';
      this.avatarImage.destroy();
      this.avatarImage = this.add.image(config.width / 2, config.height / 2, this.avatar);
      if (this.gender = "male") {
        this.playButton = new Button(this, 400, config.height / 2 + 170, 'blueButton1', 'blueButton2', 'Play', 'Instructions', { gender: this.gender });
      }
      console.log("Gender: " + this.gender);
    }.bind(this));

    this.genderFemale.on('pointerdown', function () {
      this.gender = "female";
      this.genderFemale.setColor("#173028");
      this.genderMale.setColor("white");
      this.avatar = 'femaleAvatar';
      this.avatarImage.destroy();
      this.avatarImage = this.add.image(config.width / 2, config.height / 2, this.avatar);
      if (this.gender = "female") {
        this.playButton = new Button(this, 400, config.height / 2 + 170, 'blueButton1', 'blueButton2', 'Play', 'Instructions', { gender: this.gender });
      }
      console.log("Gender: " + this.gender);
    }.bind(this));

    // For future lifestages
    // this.lifestageText = this.add.text(250, 290, 'Life Stage', { fontSize: 24, fontFamily: "arcade_classic" });

    this.menuButton = new Button(this, 400, config.height / 2 + 240, 'blueButton1', 'blueButton2', 'Back', 'Title');

  }
};
