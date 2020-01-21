import 'phaser';

export default class MalePlayer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'maleplayer');

    this.scene = scene;

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setScale(1.5);
    this.setPosition(x, y);
    this.body.setCollideWorldBounds(true);

    this.keys = scene.input.keyboard.addKeys('W,S,A,D,UP,LEFT,RIGHT,DOWN,E');
    this.lastAnim = null;
    this.vel = 200;
    this.direction = 'down';
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // movement and animation
    this.body.setVelocity(0);
    let animationName = null;

    // standing
    let currentDirection = this.direction;
    animationName = 'malestand-' + currentDirection;
    
    // all the ways the player can move.
    let left = this.keys.A.isDown || this.keys.LEFT.isDown || this.scene.gamepad && this.scene.gamepad.left;
    let right = this.keys.D.isDown || this.keys.RIGHT.isDown || this.scene.gamepad && this.scene.gamepad.right;
    let up = this.keys.W.isDown || this.keys.UP.isDown || this.scene.gamepad && this.scene.gamepad.up;
    let down = this.keys.S.isDown || this.keys.DOWN.isDown || this.scene.gamepad && this.scene.gamepad.down;

    // moving
    if (left) {
      this.direction = 'left';
      this.body.setVelocityX(-this.vel);
      animationName = "malewalk-left";
    } else if (right) {
      this.direction = 'right';
      this.body.setVelocityX(this.vel);
      animationName = "malewalk-right";
    }

    if (up) {
      this.direction = 'up';
      this.body.setVelocityY(-this.vel);
      animationName = 'malewalk-up';
    } else if (down) {
      this.direction = 'down';
      this.body.setVelocityY(this.vel);
      animationName = 'malewalk-down';
    }

    if (this.lastAnim !== animationName) {
      this.lastAnim = animationName;
      this.anims.play(animationName, true);
    }

    // diagonal movement
    this.body.velocity.normalize().scale(this.vel);
  }

}