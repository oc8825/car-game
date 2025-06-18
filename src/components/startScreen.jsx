import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from '/src/components/handlers/levelSceneHandlers';

export default class startScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'startScreen' });

        // flags so pausing/resuming for turning on tilt and portrait lock don't conflict
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
        background.setDisplaySize(this.scale.width, this.scale.height); 
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        // play button
        this.playButton = this.add.image(this.scale.width / 2, this.scale.height * 0.75, 'playButton').setInteractive();
        this.playButton.setScale(0.5);
        this.playButton.on('pointerdown', () => {
            this.scene.start('instructionsScreen');
            this.gameStartSound.play();
        });
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.6);  
            this.input.setDefaultCursor('pointer');

        });
        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.5);  
            this.input.setDefaultCursor('auto');

        });
    }

}
