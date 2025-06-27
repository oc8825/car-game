import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from '/src/components/handlers/levelSceneHandlers';

const BASE_GAME_HEIGHT = 1920;

export default class startScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'startScreen' });

        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
    }

    preload() {
    }

    create() {
        loadSounds(this);

        lockOrientation(this);

        // background
        let background = this.add.image(0, 0, 'startBackground');
        background.setOrigin(0, 0); 
        background.setDisplaySize(this.scale.width, BASE_GAME_HEIGHT); 
        background.setScale(Math.max(this.scale.width / background.width, BASE_GAME_HEIGHT / background.height));

        // play button
        this.playButton = this.add.image(this.scale.width / 2, BASE_GAME_HEIGHT * 0.7, 'playButton').setInteractive();
        this.playButton.setScale(0.7);
        this.playButton.on('pointerdown', () => {
            this.scene.start('instructionsScreen');
            this.gameStartSound.play();
        });
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.8);  
            this.input.setDefaultCursor('pointer');

        });
        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.7);  
            this.input.setDefaultCursor('auto');

        });
    }

}
