import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from '/src/components/handlers/levelSceneHandlers';

export default class prizeWheel extends Phaser.Scene {
  constructor() {
    super('prizeWheel');
  }

  preload() {

  }

  create() {
    loadSounds(this);

    lockOrientation(this);

    // background
    let background = this.add.image(0, 0, 'prizeWheelBackground');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.scale.width, this.scale.height);
    background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // all parts of wheel
    this.wheel = this.add.image(centerX, centerY, 'wheel').setOrigin(0.5);
    this.wheel.setDepth(1);
    this.wheel.setScale(1.62);

    this.wheelbackground = this.add.image(centerX, centerY, 'wheelBackdrop').setOrigin(0.5);
    this.wheelbackground.setDepth(1);
    this.wheelbackground.setScale(1.8225);

    this.pin = this.add.image(centerX + 4, centerY - 323, 'pin').setOrigin(0.5); // 400 too high
    this.pin.setDepth(2);
    this.pin.setScale(0.4);

    // position spin button and give it functionality
    this.spinButton = this.add.image(centerX, centerY, 'spinButton').setOrigin(0.5).setInteractive();
    this.spinButton.setDepth(3);
    this.spinButton.setScale(0.324);
    this.spinButton.on('pointerdown', () => {
      if (!this.hasSpun) {  
        this.spinWheel();
        this.wheelSpinSound.play();
        this.hasSpun = true;  
        this.spinButton.setInteractive(false);  
      }
    });
    this.spinButton.on('pointerover', () => {
      if (!this.hasSpun) {
        this.spinButton.setScale(0.4);
        this.input.setDefaultCursor('pointer');
      }
    });
    this.spinButton.on('pointerout', () => {
      if (!this.hasSpun) {
        this.spinButton.setScale(0.38);
        this.input.setDefaultCursor('auto');
      }
    });
    this.isSpinning = false;
    this.hasSpun = false;  
  }

  spinWheel() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    const rounds = Phaser.Math.Between(2, 4); // random number of full spins
    const extraDegrees = Phaser.Math.Between(0, 360); // random amount of extra rotation
    const totalDegrees = rounds * 360 + extraDegrees;

    this.tweens.add({
      targets: this.wheel,
      angle: totalDegrees,
      duration: 5000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        const result = this.getPrize(extraDegrees);
        this.isSpinning = false;

        this.scene.start('prizeWheelWin', { prize: result });
      },
    });
  }

  getPrize(angle) {
    const sectors = 8;
    const sectorAngle = 360 / sectors;

    const normalizedAngle = (360 - angle + sectorAngle / 2) % 360;

    const index = Math.floor(normalizedAngle / sectorAngle);

    const prizes = [
      "Jess",
      "Jimmy",
      "Cali",
      "Gautam",
      "Brandon",
      "Vaidhy",
      "ErikaandOwen",
      "Thomas"
    ];

    return prizes[index];
  }
}
