export default class startScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'startScreen' });
    }

    preload() {
        this.load.image('startBackground', '/src/assets/images/background1.png');
        this.load.image('playButton', '/src/assets/images/playButton.png');
    }

    create() {

        this.hideInventory();

        let background = this.add.image(0, 0, 'startBackground');
        background.setOrigin(0, 0);  // Ensure the image starts at (0,0)
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.playButton = this.add.image(this.scale.width / 2, this.scale.height * 0.75, 'playButton').setInteractive();
        this.playButton.setScale(0.5);

        this.playButton.on('pointerdown', () => {
            this.scene.start('instructionOne');
        });

        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.6);  // Increase the size
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.5);  // Return to original size
        });
    }

    hideInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'none';
        }
    }

}
