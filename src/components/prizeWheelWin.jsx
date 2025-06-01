import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';
import { hideInventory } from '/src/components/handlers/inventoryHandler';

export default class prizeWheelWin extends Phaser.Scene {
    constructor() {
        super({ key: 'prizeWheelWin' });
    }

    preload() {
        preloadAssets(this);

    }

    create(data) {
        loadSounds(this);
        
        const score = data.score || 50;
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

        hideInventory(this);

        let background = this.add.image(0, 0, backgroundKey);
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

    }

}
