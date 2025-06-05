import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';

export default class youWin extends Phaser.Scene {
    constructor() {
        super({ key: 'youWin' });
    }

    preload() {
        preloadAssets(this);

    }

    create(data) {

        loadSounds(this);
        this.prizeSound.play();

        const score = data.score || 50;
        let backgroundKey = '0Win';

        if (score >= 0 && score < 75) {
            backgroundKey = '0Win';
        } else if (score >= 75 && score < 100) {
            backgroundKey = '75Win';
        } else if (score >= 100 && score < 150) {
            backgroundKey = '100Win';
        } else if (score >= 150 && score < 175) {
            backgroundKey = '150Win';
        } else if (score >= 175 && score < 200) {
            backgroundKey = '175Win';
        } else if (score >= 200 && score < 225) {
            backgroundKey = 'lamboWin';
        } else if (score >= 225){
            this.scene.start('prizeWheel');
        }

        let background = this.add.image(0, 0, backgroundKey);
        background.setOrigin(0, 0);  
        background.setDisplaySize(this.scale.width, this.scale.height);  
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

    }

}
