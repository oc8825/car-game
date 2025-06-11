import { loadSounds } from '/src/components/handlers/soundHandler';

export default class instructionOne extends Phaser.Scene {
    constructor() {
        super({ key: 'instructionOne' });
    }

    preload() {

    }

    create() {
        loadSounds(this);

        let background = this.add.image(0, 0, 'backgroundTwo').setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.chooseCarButton = this.add.image(540, 1000, 'chooseCarButton').setInteractive();
        this.chooseCarButton.setScale(1.5);

        this.chooseCarButton.on('pointerdown', () => {
            this.scene.start('chooseCar');
            this.gameStartSound.play();
        });

        this.chooseCarButton.on('pointerover', () => {
            this.chooseCarButton.setScale(1.6);  // Increase the size
            this.input.setDefaultCursor('pointer');
        });

        this.chooseCarButton.on('pointerout', () => {
            this.chooseCarButton.setScale(1.5);  // Return to original size
            this.input.setDefaultCursor('auto');
        });

    }


}

