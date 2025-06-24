import { preloadAssets } from '/src/components/handlers/preloadHandler';

const BASE_GAME_HEIGHT = 1920;

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // loading text
        this.add.text(this.scale.width / 2, BASE_GAME_HEIGHT / 2, 'Loading...', {
            fontSize: '55px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // load assets for entire game during this scene
        preloadAssets(this);
    }

    create() {
        // send to actual start screen once done loading
        this.scene.start('startScreen');
    }
}