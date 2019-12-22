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
    this.avatar = 'defaultAvatar';
    this.avatarImage = this.add.image(config.width/2, config.height/2, this.avatar);
    console.log("Gender:" + this.gender);
    
    this.genderText = this.add.text(250, config.height/2 - 200, 'Gender:', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderMale = this.add.text(350, config.height/2 - 200, 'Male', { fontSize: 24, fontFamily: "arcade_classic" });
    this.genderFemale = this.add.text(425, config.height/2 - 200, 'Female', { fontSize: 24, fontFamily: "arcade_classic" });

    this.genderMale.setInteractive();
    this.genderFemale.setInteractive();

    this.genderMale.on('pointerdown', function () {
      this.gender = "male";
      this.genderMale.setColor("red");
      this.genderFemale.setColor("white");
      this.avatar = 'maleAvatar';
      this.avatarImage.destroy();
      this.avatarImage = this.add.image(config.width/2, config.height/2, this.avatar);
      if (this.gender = "male") {
        this.playButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Play', 'Instructions', {gender: this.gender});
      }
      console.log("Gender: " + this.gender);
    }.bind(this));

    this.genderFemale.on('pointerdown', function () {
      this.gender = "female";
      this.genderFemale.setColor("red");
      this.genderMale.setColor("white");
      this.avatar = 'femaleAvatar';
      this.avatarImage.destroy();
      this.avatarImage = this.add.image(config.width/2, config.height/2, this.avatar);
      if (this.gender = "female") {
        this.playButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Play', 'Instructions', {gender: this.gender});
      }
      console.log("Gender: " + this.gender);
    }.bind(this));

    // For future lifestages
    // this.lifestageText = this.add.text(250, 290, 'Life Stage', { fontSize: 24, fontFamily: "arcade_classic" });
  
    this.menuButton = new Button(this, 150, 50, 'blueButton1', 'blueButton2', 'Back', 'Title');

  }
};
