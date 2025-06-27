import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from '/src/components/handlers/levelSceneHandlers';

const BASE_GAME_HEIGHT = 1920;

export default class prizeWheelWin extends Phaser.Scene {
    constructor() {
        super({ key: 'prizeWheelWin' });

        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
    }

    preload() {
    }

    create(data) {
        loadSounds(this);

        lockOrientation(this);
        
        // set background and sound effect depending on result from wheel
        // const score = data.score || 0;
        let backgroundKey = 'EOWin';
        if (data.prize.includes('Jess')) {
            backgroundKey = 'jessWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Gautam')) {
            backgroundKey = 'gautamWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Thomas')) {
            backgroundKey = 'thomasWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Jimmy')) {
            backgroundKey = 'jimmyWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Vaidhy')) {
            backgroundKey = 'vaidhyWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Brandon')) {
            backgroundKey = 'brandonWin';
            this.prizeSound.play();
        } else if (data.prize.includes('Cali')) {
            backgroundKey = 'caliWin';
            this.prizeSound.play();
        } else if (data.prize.includes('ErikaandOwen')) {
            backgroundKey = 'EOWin';
            this.youLostSound.play();
        }
        let background = this.add.image(0, 0, backgroundKey);
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        // play again button
        const playAgainButton = this.add.sprite(this.scale.width / 2, BASE_GAME_HEIGHT *.85, 'playAgain')
            .setInteractive()
            .setDepth(250);
        playAgainButton.on('pointerdown', () => {
            this.isRestarting = false;
            this.scene.stop('levelOne');
            this.scene.stop('levelTwo');
            this.scene.stop('levelThree');
            this.scene.stop('levelChallenge');
            this.scene.stop('levelBonus');
            this.scene.stop('prizeWheel');
            this.scene.stop();
            this.scene.start('chooseCar');
        });
        playAgainButton.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });
        playAgainButton.on('pointerout', () => {
            this.input.setDefaultCursor('auto');
        });
    }

}
