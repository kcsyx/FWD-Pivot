import 'phaser';
import rexuiplugin from '../Plugins/rexuiplugin.min.js';
import ClockPlugin from '../Plugins/clock-plugin.js';
import TextTypingPlugin from '../Plugins/texttyping-plugin.js';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      //SET TO TRUE to see  hitboxes
      debug: false,

      gravity: { y: 0 }
    }
  },
  plugins: {
    global: [{
      key: 'rexTextTyping',
      plugin: TextTypingPlugin,
      start: true
    }, {
      key: 'rexClock',
      plugin: ClockPlugin,
      start: true
    }],
    scene: [{
      key: 'rexUI',
      plugin: rexuiplugin,
      mapping: 'rexUI'
    },
      // ...
    ]
  }
};
