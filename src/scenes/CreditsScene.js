import 'phaser';
import config from '../config/config'
 
export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super('Credits');
  }
 
  preload () {
   
  }
 
  create () {
    this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '35px', fill: '#000000' });
    this.madeByText = this.add.text(0, 0, 'Smile A Happy Smile :)', { fontSize: '30px', fill: '#000000' });
    this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);
     
    Phaser.Display.Align.In.Center(
      this.creditsText,
      this.zone
    );
     
    Phaser.Display.Align.In.Center(
      this.madeByText,
      this.zone
    );
     
    this.madeByText.setY(400);

    // this.creditsTween = this.tweens.add({
    //     targets: this.creditsText,
    //     y: -100,
    //     ease: 'Power1',
    //     duration: 3000,
    //     delay: 1500,
    //     onComplete: function () {
    //       this.destroy;
    //     }
    //   });
       
    //   this.madeByTween = this.tweens.add({
    //     targets: this.madeByText,
    //     y: -300,
    //     ease: 'Power1',
    //     duration: 8000,
    //     delay: 1500,
    //     onComplete: function () {
    //       this.madeByTween.destroy;
    //       this.scene.start('Title');
    //     }.bind(this)
    //   });

      this.menuButton = this.add.sprite(500, 500, 'blueButton1').setInteractive();
      this.menuText = this.add.text(0, 0, 'Menu', { fontSize: '32px', fill: '#fff' });
      Phaser.Display.Align.In.Center(this.menuText, this.menuButton);
 
      this.menuButton.on('pointerdown', function (pointer) {
        this.scene.start('Title');
      }.bind(this));
  }
};