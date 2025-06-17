import Phaser from 'phaser';
import loadingScreen from './loadingScreen';
import startScreen from './startScreen';
import instructionsScreen from './instructionsScreen';
import chooseCar from './chooseCar';
import levelOne from './levelOne';
import levelTwo from './levelTwo';
import levelThree from './levelThree';
import levelBonus from './levelBonus';
import prizeWheel from './prizeWheel';
import youWin from './youWin';
import prizeWheelWin from './prizeWheelWin';
import levelChallenge from './levelChallenge';
import challengeInstructions from './challengeInstructions';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); 
    }
}

const buildPhaserGame = ({ parent }) => {
    const BASE_GAME_WIDTH = 1080;
    const BASE_GAME_HEIGHT = 1920;
    
    let scaleMode;

    // take up entire screen on mobile-like, portrait devices, fit within
    // screen on others
    scaleMode = Phaser.Scale.FIT;
    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth*1.4 && window.innerHeight < window.innerWidth*2.3) {
        scaleMode = Phaser.Scale.ENVELOP; 
    }
    
    const config = {
        type: Phaser.AUTO,
        width: BASE_GAME_WIDTH,  
        height: BASE_GAME_HEIGHT, 
        scale: { 
            mode: scaleMode, 
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: BASE_GAME_WIDTH,  
            height: BASE_GAME_HEIGHT, 
        },
        scene: [loadingScreen, startScreen, instructionsScreen, chooseCar, levelOne, levelTwo, levelThree, levelBonus, challengeInstructions, levelChallenge, prizeWheel, prizeWheelWin, youWin, GameScene],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0 },
            },
        },
        parent, 
    };

    const game = new Phaser.Game(config);

    // keeping base width and height, size to inner width and height so it
    // doesn't get covered by search bars / UI elements on mobile
    const resizeCanvasToViewport = () => {
        const canvas = game.canvas;
        if (canvas) {
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        }
        game.scale.resize(window.innerWidth, window.innerHeight);
    };

    // resize on load and whenever screen size/dimensions change
    window.addEventListener('resize', resizeCanvasToViewport);
    window.addEventListener('orientationchange', resizeCanvasToViewport);
    window.addEventListener('load', () => {
        setTimeout(resizeCanvasToViewport, 100); 
    });

    return game;
};

export { buildPhaserGame };
