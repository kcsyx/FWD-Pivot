import 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
    });

    //  You can either do this:
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    //  Set some default physics properties
    this.setScale(2);
    scene.physics.world.setBoundsCollision();
    //TODO: Collision
    this.body.setCollideWorldBounds(true);
    this.vel = 160;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const keys = this.keys;
    if (keys.left.isDown) {
      this.body.setVelocityX(-this.vel);
      this.anims.play('left', true);
    } else if (keys.right.isDown) {
      this.body.setVelocityX(this.vel);
      this.anims.play('right', true);
    }

    if (keys.up.isDown) {
      this.body.setVelocityY(-this.vel);
      this.anims.play('up', true);
    } else if (keys.down.isDown) {
      this.body.setVelocityY(this.vel);
      this.anims.play('down', true);
    }
    if (!keys.up.isDown && !keys.down.isDown) {
      this.body.setVelocityY(0);
    }
    if (!keys.left.isDown && !keys.right.isDown) {
      this.body.setVelocityX(0);
    }
    if (!keys.left.isDown && !keys.right.isDown && !keys.up.isDown && !keys.down.isDown) {
      this.anims.stop();
    }
  }
}