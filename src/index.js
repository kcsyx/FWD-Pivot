import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import Model from './Model';
import InstructionsScene from './Scenes/InstructionsScene';
import Level1 from './Scenes/Level1';
import Level1Random from './Scenes/Level1Random';
import Level2 from './Scenes/Level2';
import Level2Random from './Scenes/Level2Random';
import Level3 from './Scenes/Level3';
import Level3Random from './Scenes/Level3Random';
import Level4 from './Scenes/Level4';
import Level4Random from './Scenes/Level4Random';
import Level5 from './Scenes/Level5';
import Level5Random from './Scenes/Level5Random';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Instructions', InstructionsScene);
    this.scene.add('Level1', Level1);
    this.scene.add('Level1Random', Level1Random);
    this.scene.add('Level2', Level2);
    this.scene.add('Level2Random', Level2Random);
    this.scene.add('Level3', Level3);
    this.scene.add('Level3Random', Level3Random);
    this.scene.add('Level4', Level4);
    this.scene.add('Level4Random', Level4Random);
    this.scene.add('Level5', Level5);
    this.scene.add('Level5Random', Level5Random);
    this.scene.start('Boot');
  }
}

window.game = new Game();