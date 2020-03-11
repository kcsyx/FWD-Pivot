import 'phaser';

export default class GoldCoin extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'goldcoin');

    this.scene = scene;

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setPosition(x, y);

  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.anims.play('coinspin', true);
  }

}