import { preloadAssets } from '/src/components/handlers/preloadHandler';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // loading text
        const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading...', {
            fontSize: '55px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        preloadAssets(this);
    }

    create() {
        this.scene.start('startScreen');
    }
}