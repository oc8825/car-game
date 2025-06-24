import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from './handlers/levelSceneHandlers';

const BASE_GAME_HEIGHT = 1920;

export default class chooseCar extends Phaser.Scene {
    constructor() {
        super({ key: 'chooseCar' });
        this.selectedCarIndex = 0;
        this.carColors = ['carRed', 'carOrange', 'carYellow', 'carGreen', 'carBlue', 'carPurple'];

        // flags so pausing/resuming for turning on tilt and portrait lock don't conflict
        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
    }

    preload() {
        
    }

    create() {
        loadSounds(this);

        lockOrientation(this);

        // delay by one frame so camera is accurate


            // background
            let background = this.add.image(0, 0, 'chooseCarBackground');
            background.setOrigin(0, 0);
            background.setDisplaySize(this.scale.width, BASE_GAME_HEIGHT);
            background.setScale(Math.max(this.scale.width / background.width, BASE_GAME_HEIGHT / background.height));

            // car
            this.carSprite = this.add.sprite(this.scale.width/2, BASE_GAME_HEIGHT / 2, this.carColors[this.selectedCarIndex]);
            this.carSprite.setScale(2);

            // left arrow button
            const arrowScale = 0.35;
            this.leftArrow = this.add.image(this.scale.width*.15, BASE_GAME_HEIGHT / 2, 'leftArrow').setInteractive();
            this.leftArrow.setScale(arrowScale);
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

            // right arrow button
            this.rightArrow = this.add.image(this.scale.width*.85, BASE_GAME_HEIGHT / 2, 'rightArrow').setInteractive();
            this.rightArrow.setScale(arrowScale);
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

            // play button
            const playButtonScale = 0.65;
            this.playButton = this.add.image(this.scale.width / 2, BASE_GAME_HEIGHT * .8, 'playButton').setInteractive();
            this.playButton.setScale(playButtonScale);
            this.playButton.on('pointerdown', () => {
                if (this.selectedCarIndex >= 0) {
                    this.scene.start('levelOne', { selectedCarIndex: this.selectedCarIndex });
                    this.gameStartSound.play();
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

