import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px arcade_classic',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px arcade_classic',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    }.bind(this));

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('background', 'assets/ui/background.png');
    this.load.image('blueButton1', 'assets/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/ui/blue_button03.png');
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');
    this.load.audio('bgMusic', ['assets/awesomeness.wav']);
    this.load.image('defaultAvatar', 'assets/default.png');
    this.load.image('maleAvatar', 'assets/male.png');
    this.load.image('femaleAvatar', 'assets/female.png');
    this.load.image('instructions', 'assets/instructions.png');
    this.load.image('instructions2', 'assets/instructions2.png');
    this.load.image('marker', "assets/questmarker.png");
    this.load.spritesheet('maleplayer', 'assets/samplesprite.png', { frameWidth: 34, frameHeight: 34 });
    this.load.spritesheet('femaleplayer', 'assets/femalesamplesprite.png', { frameWidth: 34, frameHeight: 34 });
  }

  create() {
    // Male player animations
    this.anims.create({
      key: 'malestand-left',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 8, end: 8 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malestand-right',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 11, end: 11 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malestand-up',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 2, end: 2 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malestand-down',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 5, end: 5 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malewalk-left',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 6, end: 8 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malewalk-right',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 9, end: 11 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malewalk-up',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 0, end: 2 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'malewalk-down',
      frames: this.anims.generateFrameNumbers('maleplayer', { start: 3, end: 5 }),
      frameRate: 13,
      repeat: -1
    });

    //Female player animations
    this.anims.create({
      key: 'femalestand-left',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 8, end: 8 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalestand-right',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 11, end: 11 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalestand-up',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 2, end: 2 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalestand-down',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 5, end: 5 }),
      frameRate: 13,
      repeat: -1
    });
    
    this.anims.create({
      key: 'femalewalk-left',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 6, end: 8 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalewalk-right',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 9, end: 11 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalewalk-up',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 0, end: 2 }),
      frameRate: 13,
      repeat: -1
    });

    this.anims.create({
      key: 'femalewalk-down',
      frames: this.anims.generateFrameNumbers('femaleplayer', { start: 3, end: 5 }),
      frameRate: 13,
      repeat: -1
    });
  }

  ready() {
    this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
};
