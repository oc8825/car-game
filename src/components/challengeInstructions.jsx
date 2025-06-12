import { loadSounds } from '/src/components/handlers/soundHandler';
import { challengeLevel } from './handlers/levelSceneHandlers';

export default class challengeInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'challengeInstructions' });

        this.score;
        this.selectedCarIndex;
    }

    init(data) {
        this.score = data.score || 0;
        this.selectedCarIndex = data.selectedCarIndex || 0;
    }

    preload() {
 
    }

    create() {

        loadSounds(this);
        let background;
        if (this.sys.game.device.os.desktop) {
            background = this.add.image(0, 0, 'desktopBufferBackground');
        } else {
            background = this.add.image(0, 0, 'mobileBufferBackground');
        }
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.73, 'startButton').setInteractive();
        this.startButton.setScale(0.75);

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
