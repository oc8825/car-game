import Phaser from 'phaser';
import startScreen from './startScreen';
import instructionOne from './instructionOne';
import chooseCar from './chooseCar';
import levelOne from './levelOne';
import levelTwo from './levelTwo';
import levelThree from './levelThree';
import levelBonus from './levelBonus';
import youWin from './youWin';



class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); 
    }
}

const buildPhaserGame = ({ parent }) => {
    let scaleMode;

    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
        scaleMode = Phaser.Scale.ENVELOP; 
    }
    else {
        scaleMode = Phaser.Scale.FIT;
    }
    
    const baseConfig = {
        type: Phaser.AUTO,
        width: 1080,  
        height: 1920, 
        scale: { 
            mode: scaleMode, 
            autoCenter: Phaser.Scale.CENTER_BOTH, 
        },
        scene: [startScreen, instructionOne, chooseCar, levelOne, levelTwo, levelThree, levelBonus, youWin, GameScene], // add game scenes here
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
