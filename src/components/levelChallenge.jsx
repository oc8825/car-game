import { loadSounds } from '/src/components/handlers/soundHandler';
import { winScreenFromChallenge, bonusLevel, lockOrientation, pause } from '/src/components/handlers/levelSceneHandlers';

const BASE_GAME_HEIGHT = 1920;

export default class levelChallenge extends Phaser.Scene {
    constructor() {
        super({ key: 'levelChallenge' });

        this.levelCompleted = false;

        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
        this.isPausedByUser = false;
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
        this.levelCompleted = false;
    }

    preload() {
    }

    create() {
        loadSounds(this);

        lockOrientation(this);

        // background
        let background = this.add.image(0, 0, 'challengeBackground');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setScale(Math.max(this.scale.width / background.width, this.scale.height / background.height));

        // steering wheel sprite
        this.steeringWheel = this.add.sprite(this.scale.width / 2, BASE_GAME_HEIGHT * .7, 'steeringWheel');
        this.steeringWheel.setScale(1.2);

        // time bar displaying how long player has to react
        this.timeBar = this.add.rectangle(this.scale.width / 2, BASE_GAME_HEIGHT * 0.33, 300, 30, 0xffffff).setOrigin(0.5);

        // display intructions for player to execute
        this.instructionText = this.add.text(this.scale.width / 2, BASE_GAME_HEIGHT * 0.2, `Instructions Left: ${this.commandsLeft}`, {
            fontSize: '45px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5,0);

        // display starting blank strike boxes
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

        // handle user reaction for desktop
        this.input.keyboard.on('keydown', (event) => {
            this.handleInput(event.code);
        });

        // handle user reaction for mobile
        this.input.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.startTime = pointer.downTime;
        });
        this.input.on('pointerup', (pointer) => {
            const deltaX = pointer.x - this.startX;
            const deltaY = pointer.y - this.startY;
            const duration = pointer.upTime - this.startTime;

            const minSwipeDistance = 50;
            const maxSwipeDuration = 1000;
            const maxTapDistance = 20;

            if (duration < maxSwipeDuration) {
                // swipe
                if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX < 0) {
                        this.handleInput('ArrowLeft');
                    } else {
                        this.handleInput('ArrowRight');
                    }
                }
                // tap
                else if (Math.abs(deltaX) < maxTapDistance && Math.abs(deltaY) < maxTapDistance) {
                    this.handleInput('Space');
                }
            }
        });
        
        // pause button
        this.pauseButton = this.add.image(this.scale.width * .91, BASE_GAME_HEIGHT * .05, 'pauseButton').setInteractive();
        this.pauseButton.setScale(1.25);
        this.pauseButton.setAlpha(0.7);
        this.pauseButton.setDepth(150);
        this.pauseButton.on('pointerdown', () => {
            if (!this.isPausedByUser && !this.isRestarting && !this.levelCompleted) {
                pause(this);
            }
        });
        
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.isPausedByUser && !this.isRestarting && !this.levelCompleted) {
                pause(this);
            }
        });

        this.scheduleNextCommand();
    }

    // check if new intruction needed and call helper showNextCommand if so
    scheduleNextCommand() {
        if (this.isGameOver) return;
        
        if (this.commandsLeft <= 0) {
            this.levelCompleted = true;
            this.winGame();
            return;
        }

        this.time.delayedCall(500, () => {
            this.showNextCommand();
        });
    }

    // reset instruction, timer for player to respond in, and time bar displaying that time
    showNextCommand() {
        if (this.isGameOver) return;
        
        this.currentCommand = Phaser.Utils.Array.GetRandom(this.commands);

        if (this.commandText) this.commandText.destroy();

        this.commandText = this.add.text(this.scale.width / 2, BASE_GAME_HEIGHT * 0.25, this.currentCommand, {
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
            this.applyStrike();
        }, [], this);

        this.isFirstCommand = false;
        this.inputLocked = false;
    }

    // react to correct or incorrect response based on user reaction keyCode
    handleInput(keyCode) {
        if (this.inputLocked || this.isGameOver || this.levelCompleted || this.isPausedByUser) return; 
        this.inputLocked = true;    

        let correct = false;

        // animate and set correct when reaction matches instruction
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

        // after a response, get rid of the timer
        if (this.responseTimer) {
            this.responseTimer.remove();
            this.responseTimer = null;
        }

        // correct response
        if (correct) {
            if (this.commandText) {
                this.commandText.destroy();
                this.commandText = null;
            }
            this.timeBar.setVisible(false);

            this.commandsLeft--;
            this.instructionText.setText(`Instructions Left: ${this.commandsLeft}`);

            this.time.delayedCall(300, () => { 
                this.scheduleNextCommand();
            });

        } 
        // incorrect response
        else {
            if (this.commandText) {
                this.commandText.destroy();
                this.commandText = null;
            }
            this.applyStrike();
        }
    }

    // User pressed wrong button or timed out, give them a strike and
    // slight delay before next instructions
    applyStrike() {
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
                this.scheduleNextCommand();
            });
        }
    }

    // briefly turn steering wheel left, right, or enlarge depedning on action
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
                scale: 1.4,
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    // if lose challenge, skip bonus level and give prize based on the player's
    // score at the end of level three
    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        if (this.timeBarTween) this.timeBarTween.stop();
        if (this.responseTimer) this.responseTimer.remove();
        
        winScreenFromChallenge(this);
    }

    // start bonus level if beat challenge
    winGame() {
        bonusLevel(this, 'levelBonus', this.score, this.selectedCarIndex);
    }

    update() {
    }
}
