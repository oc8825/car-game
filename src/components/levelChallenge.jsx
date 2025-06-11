import { winScreenFromChallenge } from './handlers/levelSceneHandlers';
import { loadSounds } from '/src/components/handlers/soundHandler';
import { bonusLevel } from '/src/components/handlers/levelSceneHandlers';

export default class levelChallenge extends Phaser.Scene {
    constructor() {
        super({ key: 'levelChallenge' });
    }

    init(data) {
        this.score = data.score || 0;
        this.commands = ['Turn Left', 'Turn Right', 'Honk'];
        this.currentCommand = '';
        this.commandText = null;
        this.responseTimer = null;
        this.commandsLeft = 10;
        this.strikes = 0;
        this.maxStrikes = 3;
        this.timeBar = null;
        this.strikeIcons = [];
        this.inputLocked = false; 
        this.isFirstCommand = true;
        this.isGameOver = false;
    }

    preload() {
        
    }

    create() {
        loadSounds(this);

        let background = this.add.image(0, 0, 'challengeBackground');
            background.setOrigin(0, 0);
            background.setDisplaySize(this.scale.width, this.scale.height);
            background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        this.steeringWheel = this.add.sprite(this.scale.width / 2, this.scale.height * .72, 'steeringWheel');

        this.timeBar = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.33, 300, 30, 0xffffff).setOrigin(0.5);

        this.scoreText = this.add.text(this.scale.width / 2, this.scale.height * 0.2, `Instructions Left: ${this.commandsLeft}`, {
            fontSize: '45px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5,0);

        //strike feature
        const strikeSize = 85;
        const strikeSpacing = 90;
        const totalWidth = (this.maxStrikes - 1) * strikeSpacing;
        const startX = this.scale.width / 2 - totalWidth / 2;
        const strikeY = this.steeringWheel.y + this.steeringWheel.displayHeight / 2 + 80;

        for (let i = 0; i < this.maxStrikes; i++) {
            const icon = this.add.text(startX + i * strikeSpacing, strikeY, '\n⬜', {
                fontSize: `${strikeSize}px`,
                color: '#ffffff'
            }).setOrigin(0.5, 0.5);
            this.strikeIcons.push(icon);
        }

        this.input.keyboard.on('keydown', (event) => {
            this.handleInput(event.code);
        });
        this.scheduleNextCommand();
    }

    scheduleNextCommand() {
        if (this.isGameOver) return;
        
        if (this.commandsLeft <= 0) {
            this.winGame();
            return;
        }

        this.time.delayedCall(500, () => {
            this.showNextCommand();
        });
    }

    showNextCommand() {
        if (this.isGameOver) return;
        
        this.currentCommand = Phaser.Utils.Array.GetRandom(this.commands);

        if (this.commandText) this.commandText.destroy();

        this.commandText = this.add.text(this.scale.width / 2, this.scale.height * 0.25, this.currentCommand, {
            fontSize: '100px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5, 0);

        this.timeBar.setVisible(true);
        if (this.timeBarTween) {
            this.timeBarTween.stop();
        }
        this.timeBar.scaleX = 1;

        // Give player a longer time on the first command to understand game
        const duration = this.isFirstCommand ? 2000 : 1250;

        this.timeBarTween = this.tweens.add({
            targets: this.timeBar,
            scaleX: 0,
            duration: duration,
            ease: 'Linear'
        });

        if (this.responseTimer) this.responseTimer.remove();
        this.responseTimer = this.time.delayedCall(duration, () => {
            if (this.commandText) {
                this.commandText.destroy();
                this.commandText = null;
            }
            this.applyStrikeWithPause();
        }, [], this);

        this.isFirstCommand = false;
    }

    handleInput(keyCode) {
        if (this.inputLocked || this.isGameOver) return; 
        this.inputLocked = true;    

        let correct = false;

        if (this.currentCommand === 'Turn Left' && keyCode === 'ArrowLeft') {
            correct = true;
            this.animateSteeringWheel('left');
            this.skidSound.play();
        } else if (this.currentCommand === 'Turn Right' && keyCode === 'ArrowRight') {
            correct = true;
            this.animateSteeringWheel('right');
            this.skidSound.play();
        } else if (this.currentCommand === 'Honk' && keyCode === 'Space') {
            correct = true;
            this.animateSteeringWheel('honk');
            this.hornSound.play();
        }

        if (this.responseTimer) {
            this.responseTimer.remove();
            this.responseTimer = null;
        }

        if (correct) {
            if (this.commandText) {
                this.commandText.destroy();
                this.commandText = null;
            }
            this.timeBar.setVisible(false);

            this.commandsLeft--;
            this.scoreText.setText(`Commands Left: ${this.commandsLeft}`);

            this.time.delayedCall(300, () => {
                this.inputLocked = false; 
                this.scheduleNextCommand();
            });

        } else {
            if (this.commandText) {
                this.commandText.destroy();
                this.commandText = null;
            }
            this.applyStrikeWithPause();
        }
    }

    applyStrikeWithPause() {
        this.timeBar.setVisible(false);
        this.wrongSound.play();

        if (this.strikes < this.maxStrikes) {
            this.strikeIcons[this.strikes].setText('\n❌');
            this.strikes++;
        }

        if (this.strikes >= this.maxStrikes) {
            this.gameOver();
        } else {
            this.time.delayedCall(500, () => {
                this.inputLocked = false;
                this.scheduleNextCommand();
            });
        }
    }

    animateSteeringWheel(action) {
        if (action === 'left') {
            this.tweens.add({
                targets: this.steeringWheel,
                angle: -30,
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        } else if (action === 'right') {
            this.tweens.add({
                targets: this.steeringWheel,
                angle: 30,
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        } else if (action === 'honk') {
            this.tweens.add({
                targets: this.steeringWheel,
                scale: 1.3,
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        if (this.timeBarTween) this.timeBarTween.stop();
        if (this.responseTimer) this.responseTimer.remove();
        
        winScreenFromChallenge(this);
    }

    winGame() {
        bonusLevel(this, 'levelBonus', this.score, this.selectedCarIndex);
    }

    update() {
    }
}
