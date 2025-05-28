import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';
import { hideInventory } from '/src/components/handlers/inventoryHandler';

export default class chooseCar extends Phaser.Scene {
    constructor() {
        super({ key: 'chooseCar' });
        this.selectedCarIndex = 0;
        this.carColors = ['carRed', 'carOrange', 'carYellow', 'carGreen', 'carBlue', 'carPurple'];
        this.highlightSprite = null;
    }

    preload() {
        preloadAssets(this);
    }

    create() {
        loadSounds(this);
        hideInventory(this);

        let background = this.add.image(0, 0, 'chooseCarBackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.carSprite = this.add.sprite(this.scale.width / 2, this.scale.height * 0.52, this.carColors[this.selectedCarIndex]);
        this.carSprite.setScale(2);

        this.leftArrow = this.add.image(this.scale.width * 0.1, this.scale.height * 0.5, 'leftArrow').setInteractive();
        this.leftArrow.setScale(0.35);
        this.leftArrow.on('pointerdown', () => {
            this.selectedCarIndex = (this.selectedCarIndex - 1 + this.carColors.length) % this.carColors.length;
            this.cycleCar();
            this.clickSound.play();
        });

        this.leftArrow.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        this.leftArrow.on('pointerout', () => {
            this.input.setDefaultCursor('auto');
        });

        this.rightArrow = this.add.image(this.scale.width * 0.9, this.scale.height * 0.5, 'rightArrow').setInteractive();
        this.rightArrow.setScale(0.35);
        this.rightArrow.on('pointerdown', () => {
            this.selectedCarIndex = (this.selectedCarIndex + 1) % this.carColors.length;
            this.cycleCar();
            this.clickSound.play();
        });

        this.rightArrow.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        this.rightArrow.on('pointerout', () => {
            this.input.setDefaultCursor('auto');
        });

        this.playButton = this.add.image(this.scale.width / 2, this.scale.height * 0.9, 'playButton').setInteractive();
        this.playButton.setScale(0.65);

        this.playButton.on('pointerdown', () => {
            if (this.selectedCarIndex >= 0) {
                this.scene.start('levelOne', { selectedCarIndex: this.selectedCarIndex });
                this.gameStartSound.play();
            } else {
                alert('Please select a car first!');
            }
        });

        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.75);
            this.input.setDefaultCursor('pointer');
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.65);
            this.input.setDefaultCursor('auto');
        });

    }

    cycleCar() {
        this.carSprite.setTexture(this.carColors[this.selectedCarIndex]);
    }
}

