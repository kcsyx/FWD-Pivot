import 'phaser';
import rexuiplugin from '../Plugins/rexuiplugin.min.js';

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
  },    
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: rexuiplugin,
        mapping: 'rexUI'
    },
    // ...
    ]
}
};
