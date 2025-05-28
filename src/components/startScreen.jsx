import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';
import { hideInventory } from '/src/components/handlers/inventoryHandler';

export default class startScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'startScreen' });
    }

    preload() {
        preloadAssets(this);

    }

    create() {

        loadSounds(this);
        hideInventory(this);

        let background = this.add.image(0, 0, 'startBackground');
        background.setOrigin(0, 0);  // Ensure the image starts at (0,0)
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.playButton = this.add.image(this.scale.width / 2, this.scale.height * 0.75, 'playButton').setInteractive();
        this.playButton.setScale(0.5);

        this.playButton.on('pointerdown', () => {
            this.scene.start('instructionOne');
            this.gameStartSound.play();
        });

        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.6);  // Increase the size
            this.input.setDefaultCursor('pointer');

        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.5);  // Return to original size
            this.input.setDefaultCursor('auto');

        });
    }

}
