import { preloadAssets } from '/src/components/handlers/preloadHandler';

const BASE_GAME_HEIGHT = 1920;

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // loading text
        this.loadingText = document.createElement('div');
        this.loadingText.innerText = 'Loading...';
        this.loadingText.style.position = 'absolute';
        this.loadingText.style.top = '50%';
        this.loadingText.style.left = '50%';
        this.loadingText.style.transform = 'translate(-50%, -50%)';
        this.loadingText.style.fontSize = '20px';
        this.loadingText.style.color = '#fff';
        this.loadingText.style.zIndex = '100';
        this.loadingText.style.display = 'block';
        this.loadingText.style.textAlign = 'center';
        document.body.appendChild(this.loadingText);

        // load assets for entire game during this scene
        preloadAssets(this);
    }

    create() {
        // send to actual start screen once done loading
        if (this.loadingText) {
            this.loadingText.remove();
        }
        this.scene.start('startScreen');
    }
}