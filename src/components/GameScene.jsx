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
    
    // on desktop and more horizontal mobile devices, use FIT  mode and 16:9 aspect ratio
    let baseGameHeight = 1920;
    let scaleMode = Phaser.Scale.FIT;
    let centerMode = Phaser.Scale.CENTER_BOTH;
    // on mobile devices, use WIDTH_CONTROLS_HEIGHT and more buffer on bottom that can be cut off
    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth*1.4 && window.innerHeight < window.innerWidth*2.25) {
        scaleMode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT; 
        baseGameHeight = 2440;
        centerMode = Phaser.Scale.CENTER_HORIZONTALLY;
    }
    // if loads on an iphone in landscape, still use mobile settings so looks good when rotate to portrait
    // can't guarantee good portrait behavior on android devices, so just do this for iphone
    // other devices loaded in landscape will default to FIT mode
    if (navigator.userAgent.toLowerCase().includes('iphone')) {
        scaleMode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT; 
        baseGameHeight = 2440;
        centerMode = Phaser.Scale.CENTER_HORIZONTALLY;
    }
    
    const config = {
        type: Phaser.AUTO,
        width: BASE_GAME_WIDTH,  
        height: baseGameHeight, 
        scale: { 
            mode: scaleMode, 
            autoCenter: centerMode,  
            width: BASE_GAME_WIDTH,  
            height: baseGameHeight, 
        },
        transparent: true,
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

    const resizeCanvasStyle = () => {
        const canvas = game.canvas;
        if (!canvas) return;

        canvas.style.width = '100dvw';
        canvas.style.height = '100dvh';
        canvas.style.display = 'block';
    };

    resizeCanvasStyle();
    window.addEventListener('resize', resizeCanvasStyle);
    window.addEventListener('orientationchange', resizeCanvasStyle);
    window.addEventListener('load', () => {
        setTimeout(resizeCanvasStyle, 100);
    });
    return game;
};

export { buildPhaserGame };
