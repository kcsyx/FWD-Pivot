import 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      //SET TO TRUE to see  hitboxes
      debug: true,
      
      gravity: { y: 0 }
    }
  }
};
