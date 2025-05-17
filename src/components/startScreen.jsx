export default class startScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'startScreen' });
    }

    preload() {
        this.load.image('startBackground', '/assets/images/startBackground.png');
    }

    create() {

        this.hideInventory();

        let background = this.add.image(0, 0, 'startBackground');
        background.setOrigin(0, 0);  // Ensure the image starts at (0,0)
        background.setDisplaySize(this.scale.width, this.scale.height);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        

        /* add a title
        const titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Arctic\nAll-Stars', {
            fontSize: '64px',  // Font size 
            fill: '#B3D9FF',    // Text color
            align: 'center',    // Align the text to the center
            fontStyle: 'bold',    // Optional: make the text bold
            stroke: '#00001B',        // Outline color
            strokeThickness: 4       // Thickness of the outline
        }).setOrigin(0.5);  // Center the text horizontally

        this.startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.75, 'startButton').setInteractive();
        this.startButton.setScale(0.5);

        this.startButton.on('pointerdown', () => {
            this.scene.start('levelOne'); 
        });
        
    }

    hideInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'none'; 
        }
    }
    */
}
}
