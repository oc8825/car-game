import { preloadAssets } from '/src/components/handlers/preloadHandler';

export default class youWin extends Phaser.Scene {
    constructor() {
        super({ key: 'youWin' });
    }

    preload() {
        preloadAssets(this);

    }

    create() {

        this.hideInventory();

        let background = this.add.image(0, 0, 'winBackground');
        background.setOrigin(0, 0);  // Ensure the image starts at (0,0)
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'You Win!', { fontSize: '48px', fontWeight: '1500', fill: '#fff' }).setOrigin(0.5);

    }

    hideInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'none';
        }
    }

}
