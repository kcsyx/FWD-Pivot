import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Model';
import InstructionsScene from './Scenes/InstructionsScene';
import Level1 from './Scenes/Level1';
import Level1Random from './Scenes/Level1Random';
import Level2 from './Scenes/Level2';
import Level2Random from './Scenes/Level2Random';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Instructions', InstructionsScene);
    this.scene.add('Level1', Level1);
    this.scene.add('Level1Random', Level1Random);
    this.scene.add('Level2', Level2);
    this.scene.add('Level2Random', Level2Random);
    this.scene.start('Boot');
  }
}

window.game = new Game();