import Phaser from 'phaser';
import startScreen from './startScreen';
import instructionOne from './instructionOne';
import levelOne from './levelOne';
import levelTwo from './levelTwo';
import levelThree from './levelThree';
import youWin from './youWin';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); 
    }
}

const buildPhaserGame = ({ parent }) => {
    const baseConfig = {
        type: Phaser.AUTO,
        width: 1080,  
        height: 1920, 
        scale: { 
            mode: Phaser.Scale.FIT, 
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, 
        },
        scene: [startScreen, instructionOne, levelOne, levelTwo, levelThree, youWin, GameScene], // add game scenes here
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
