import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';

export default class levelLifeline extends Phaser.Scene {
    constructor() {
        super({ key: 'levelLifeline' });
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
    }

    preload() {
        preloadAssets(this);
    }

    create() {
        loadSounds(this);

        this.steeringWheel = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'steeringWheel');

        this.timeBar = this.add.rectangle(this.scale.width / 2, this.scale.height * 0.1, 300, 30, 0xff4444).setOrigin(0.5);

        this.scoreText = this.add.text(20, 20, `Commands Left: ${this.commandsLeft}`, {
            fontSize: '60px',
            color: '#ffffff'
        });

        //strike feature
        const strikeSize = 85;
        const strikeSpacing = 90;
        const totalWidth = (this.maxStrikes - 1) * strikeSpacing;
        const startX = this.scale.width / 2 - totalWidth / 2;
        const strikeY = this.steeringWheel.y + this.steeringWheel.displayHeight / 2 + 40;

        for (let i = 0; i < this.maxStrikes; i++) {
            const icon = this.add.text(startX + i * strikeSpacing, strikeY, '⬜', {
                fontSize: `${strikeSize}px`,
                color: '#ffffff'
            }).setOrigin(0.5, 0);
            this.strikeIcons.push(icon);
        }

        this.input.keyboard.on('keydown', (event) => {
            this.handleInput(event.code);
        });
        this.scheduleNextCommand();
    }

    scheduleNextCommand() {
        if (this.commandsLeft <= 0) {
            this.winGame();
            return;
        }

        this.time.delayedCall(500, () => {
            this.showNextCommand();
        });
    }

    showNextCommand() {
        this.currentCommand = Phaser.Utils.Array.GetRandom(this.commands);

        if (this.commandText) this.commandText.destroy();

        this.commandText = this.add.text(this.scale.width / 2, this.scale.height * 0.2, this.currentCommand, {
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);


        //time bar animation
        this.timeBar.setScale(1, 1);
        this.tweens.add({
            targets: this.timeBar,
            scaleX: 0,
            duration: 1000,
            ease: 'Linear'
        });

        //need to debug generating a new command after failed (+ voiding current failed command)
        if (this.responseTimer) this.responseTimer.remove();
        this.responseTimer = this.time.delayedCall(1000, () => {
            this.applyStrike();
        }, [], this);
    }

    handleInput(keyCode) {
        let correct = false;

        if (this.currentCommand === 'Turn Left' && keyCode === 'ArrowLeft') {
            correct = true;
            this.animateSteeringWheel('left');
        } else if (this.currentCommand === 'Turn Right' && keyCode === 'ArrowRight') {
            correct = true;
            this.animateSteeringWheel('right');
        } else if (this.currentCommand === 'Honk' && keyCode === 'Space') {
            correct = true;
            this.animateSteeringWheel('honk');
        }

        if (correct) {
            if (this.responseTimer) this.responseTimer.remove();
            this.commandsLeft--;
            this.scoreText.setText(`Commands Left: ${this.commandsLeft}`);
            this.scheduleNextCommand();
        } else {
            this.applyStrike();
        }
    }

    applyStrike() {
        if (this.responseTimer) this.responseTimer.remove();

        //update strike
        if (this.strikes < this.maxStrikes) {
            this.strikeIcons[this.strikes].setText('❌');
            this.strikes++;
        }

        if (this.strikes >= this.maxStrikes) {
            this.gameOver();
        } else {
            this.scheduleNextCommand();
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
        this.scene.restart({ score: 0 });
    }

    winGame() {
        //lifeline round = level to achieve bonus round
        this.scene.start('bonusLevel', { score: this.score + 1 });
    }

    update() {
    }
}
