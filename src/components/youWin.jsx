import { loadSounds } from '/src/components/handlers/soundHandler';
import { lockOrientation } from '/src/components/handlers/levelSceneHandlers';

export default class youWin extends Phaser.Scene {
    constructor() {
        super({ key: 'youWin' });
    }

    preload() {

    }

    create(data) {

        loadSounds(this);

        lockOrientation(this);

        this.prizeSound.play();

        // set background depending on score
        const score = data.score || 0;
        let backgroundKey = '0Win';
        if (score >= 0 && score < 100) {
            backgroundKey = '0Win';
        } else if (score >= 100 && score < 143) {
            backgroundKey = '100Win';
        } else if (score == 143) {
            backgroundKey = '143Win';
        } else if (score > 143 && score < 150) {
            backgroundKey = '100Win';
        }else if (score >= 150 && score < 200) {
            backgroundKey = '150Win';
        } else if (score >= 200 && score < 250) {
            backgroundKey = '200Win';
        } else if (score >= 250 && score < 300) {
            backgroundKey = '250Win';
        } else if (score >= 300 && score < 350) {
            backgroundKey = 'lamboWin';
        } else if (score >= 350){
            this.scene.start('prizeWheel');
        }
        let background = this.add.image(0, 0, backgroundKey);
        background.setOrigin(0, 0);  
        background.setDisplaySize(this.scale.width, this.scale.height);  
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        // play again button
        const playAgainButton = this.add.sprite(this.scale.width / 2, this.scale.height *.85, 'playAgain')
            .setInteractive()
            .setDepth(250);
        playAgainButton.on('pointerdown', () => {
            this.isRestarting = false;

            this.scene.stop('levelOne');
            this.scene.stop('levelTwo');
            this.scene.stop('levelThree');
            this.scene.stop('levelChallenge');
            this.scene.stop('levelBonus');
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
