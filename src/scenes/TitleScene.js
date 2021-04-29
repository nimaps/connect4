import 'phaser';
import config from '../config/config'
import Button from '../objects/Button';
 
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }

  create () {

      // Game
  this.gameButton = new Button(this, config.width/2, config.height/2 - 100, 'blueButton1', 'blueButton2', 'Play', 'Game');
 
 
  // Credits
  this.creditsButton = new Button(this, config.width/2, config.height/2 + 0, 'blueButton1', 'blueButton2', 'Credits', 'Credits');
  }
};