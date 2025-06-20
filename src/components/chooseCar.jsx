import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from './handlers/levelSceneHandlers';

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
        this.time.delayedCall(1, () => {

            // determine visible safe area
            const padding = 50;
            const cam = this.cameras.main;
            const leftEdge = cam.scrollX;
            const rightEdge = cam.scrollX + cam.width;
            const bottomEdge = cam.scrollY + cam.height;
            const centerX = cam.midPoint.x;
            const centerY = cam.midPoint.y;

            // background
            let background = this.add.image(0, 0, 'chooseCarBackground');
            background.setOrigin(0, 0);
            background.setDisplaySize(this.scale.width, this.scale.height);
            background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

            // car
            this.carSprite = this.add.sprite(centerX, centerY, this.carColors[this.selectedCarIndex]);
            this.carSprite.setScale(2);

            // left arrow button
            const arrowScale = 0.35;
            const arrowWidth = this.textures.get('leftArrow').getSourceImage().width * arrowScale;
            const safeLeft = leftEdge + arrowWidth + padding;
            this.leftArrow = this.add.image(safeLeft, centerY, 'leftArrow').setInteractive();
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
            const safeRight = rightEdge - arrowWidth - padding;
            this.rightArrow = this.add.image(safeRight, centerY, 'rightArrow').setInteractive();
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
            const playButtonHeight = this.textures.get('playButton').getSourceImage().height * playButtonScale;
            const safeBottom = bottomEdge - playButtonHeight - padding;
            this.playButton = this.add.image(centerX, safeBottom, 'playButton').setInteractive();
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
        });
    }

    cycleCar() {
        this.carSprite.setTexture(this.carColors[this.selectedCarIndex]);
    }
}

