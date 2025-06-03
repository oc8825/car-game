import Phaser from 'phaser';
import startScreen from './startScreen';
import instructionOne from './instructionOne';
import chooseCar from './chooseCar';
import levelOne from './levelOne';
import levelTwo from './levelTwo';
import levelThree from './levelThree';
import levelBonus from './levelBonus';
import prizeWheel from './prizeWheel';
import youWin from './youWin';
import prizeWheelWin from './prizeWheelWin';
import levelChallenge from './levelChallenge';
import bonusBuffer from './bonusBuffer';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); 
    }
}

const buildPhaserGame = ({ parent }) => {
    let scaleMode;

    // take up entire screen on mobile-like, portrait devices, fit within
    // screen on others
    scaleMode = Phaser.Scale.FIT;
    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth*1.4 && window.innerHeight < window.innerWidth*2.3) {
        scaleMode = Phaser.Scale.ENVELOP; 
    }
    
    const baseConfig = {
        type: Phaser.AUTO,
        width: 1080,  
        height: 1920, 
        scale: { 
            mode: scaleMode, 
            autoCenter: Phaser.Scale.CENTER_BOTH, 
        },
        scene: [startScreen, instructionOne, chooseCar, levelOne, levelTwo, levelThree, levelBonus, bonusBuffer, levelChallenge, prizeWheel, prizeWheelWin, youWin, GameScene], // add game scenes here
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0 },
            },
        },
        parent, 
    };

    return new Phaser.Game(baseConfig);
};

export { buildPhaserGame };
