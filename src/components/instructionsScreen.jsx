import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from './handlers/levelSceneHandlers';

const BASE_GAME_HEIGHT = 1920;

export default class instructionsScren extends Phaser.Scene {
    constructor() {
        super({ key: 'instructionsScreen' });

        // flags so pausing/resuming for turning on tilt and portrait lock don't conflict
        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
    }

    preload() {

    }

    create() {
        loadSounds(this);

        lockOrientation(this);

        // give different instructions based on playing with keys on 
        // desktop or touch on mobile
        let background;
        if (this.sys.game.device.os.desktop) {
            background = this.add.image(0, 0, 'desktopInstructions');
        } else {
            background = this.add.image(0, 0, 'mobileInstructions');
        }
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, BASE_GAME_HEIGHT);  // Set the background size to fit the screen
        background.setScale(Math.max(this.scale.width / background.width, BASE_GAME_HEIGHT / background.height));

        // choose car button
        this.chooseCarButton = this.add.image(this.scale.width / 2, BASE_GAME_HEIGHT * 0.56, 'chooseCarButton').setInteractive();
        this.chooseCarButton.setScale(1.5);
        this.chooseCarButton.on('pointerdown', () => {
            this.scene.start('chooseCar');
            this.gameStartSound.play();
        });
        this.chooseCarButton.on('pointerover', () => {
            this.chooseCarButton.setScale(1.6);
            this.input.setDefaultCursor('pointer');
        });
        this.chooseCarButton.on('pointerout', () => {
            this.chooseCarButton.setScale(1.5); 
            this.input.setDefaultCursor('auto');
        });

    }


}

