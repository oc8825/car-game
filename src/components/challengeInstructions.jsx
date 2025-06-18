import { loadSounds } from '/src/components/handlers/soundHandler';
import { challengeLevel, lockOrientation } from './handlers/levelSceneHandlers';

export default class challengeInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'challengeInstructions' });

        // won't need score and selectedCarIndex in this scene,
        // but need to pass to future scenes
        this.score;
        this.selectedCarIndex;

        // flags so pausing/resuming for turning on tilt and portrait lock don't conflict
        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
    }

    init(data) {
        this.score = data.score || 0;
        this.selectedCarIndex = data.selectedCarIndex || 0;
        
    }

    preload() {
 
    }

    create() {

        loadSounds(this);

        lockOrientation(this);

        // show different instructions based on playing with keys on
        // desktop or touch on mobile
        let background;
        if (this.sys.game.device.os.desktop) {
            background = this.add.image(0, 0, 'desktopChallengeInstructions');
        } else {
            background = this.add.image(0, 0, 'mobileChallengeInstructions');
        }
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.73, 'startButton').setInteractive();
        this.startButton.setScale(0.75);

        // button to start challenge level
        this.startButton.on('pointerdown', () => {
            challengeLevel(this, 'levelChallenge', this.score, this.selectedCarIndex);
            this.gameStartSound.play();
        });
        this.startButton.on('pointerover', () => {
            this.startButton.setScale(0.78);
            this.input.setDefaultCursor('pointer');

        });
        this.startButton.on('pointerout', () => {
            this.startButton.setScale(0.75);
            this.input.setDefaultCursor('auto');

        });
    }

}
