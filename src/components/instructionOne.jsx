export default class instructionOne extends Phaser.Scene {
    constructor() {
        super({ key: 'instructionOne' });
    }

    preload() {
        console.log("loading...");
        this.load.image('backgroundTwo', '/src/assets/images/backgroundTwo.png');
    }

    create() {
        this.hideInventory();

        let background = this.add.image(0, 0, 'backgroundTwo').setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.playButton = this.add.image(540, 1000, 'playButton').setInteractive();
        this.playButton.setScale(0.5);

        this.playButton.on('pointerdown', () => {
            this.scene.start('levelOne');
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

