import { TiltControl } from '/src/components/handlers/TiltControl';
import { handleItemCollision } from '/src/components/handlers/collisionHandlers';
import { winScreen, restartLevel, lockOrientation, pause } from '/src/components/handlers/levelSceneHandlers';
import { spawnSpecificItem } from '/src/components/handlers/spawnHandlers';
import { loadSounds } from '/src/components/handlers/soundHandler';

const BASE_GAME_HEIGHT = 1920;

export default class levelBonus extends Phaser.Scene {
    constructor() {
        super({ key: 'levelBonus' });
        
        this.ground = null;
        this.car = null;

        this.scoreDigitLength = 1;
        this.score;
        this.isScorePaused = false;
        this.emitter;

        this.levelCompleted = false;
        this.level = "B";
        this.isRestarting = false;

        this.timerText = null;
        this.timerEvent = null;
        this.timeLeft = 25;

        this.laneChangeCooldown = false;
        this.currentLaneIndex = 1;
        this.isTiltEnabled = false;

        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;
        this.isPausedByUser = false;

        this.itemTypes = ['hat', 'socks', 'foamFinger', 'shirt', 'waterBottle'];
        this.itemSpawnIntervals = {
            hat: 1000,
            socks: 1500,
            foamFinger: 2000,
            shirt: 2500,
            waterBottle: 3000,
        };
    }

    init(data) {
        this.score = data.score || 0;
        this.selectedCarIndex = data.selectedCarIndex || 0;
        this.isScorePaused = false;
        this.timeLeft = 25;
        this.isRestarting = false;
        this.levelCompleted = false;
        this.currentLaneIndex = 1;
    }

    preload() {
    }

    create() {
        loadSounds(this);

        lockOrientation(this);

        // enable tilting
        this.scene.pause();
        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        this.tiltControl.enableTiltControlsIfPreviouslyEnabled();

        this.newLevelSound.play();

        // background
        this.ground = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            "ground"
        );

        // finish line
        this.time.delayedCall(23469, () => {
            const finishLine = this.physics.add.image(this.scale.width / 2, -600, 'finishLine');
            finishLine.setVelocityY(800 * this.game.config.speedFactor);
        });

        // sound effect on winning level
        /* Use delayed call rather than playing when this.levelCompleted = true
        because then it immediately starts next level */  
        this.time.delayedCall(25000, () => {
            this.winLevelSound.play();
        });

        // create lanes and start car in middle lane
        this.lanes = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        this.currentLaneIndex = 1;
        this.targetX = this.lanes[this.currentLaneIndex];

        // car sprite
        const carColors = ['carRed', 'carOrange', 'carYellow', 'carGreen', 'carBlue', 'carPurple'];
        const selectedCarColor = carColors[this.selectedCarIndex];
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], BASE_GAME_HEIGHT * 7 / 8, selectedCarColor);
        this.car.setScale(0.6);
        this.car.setOrigin(0.5, 0.5);
        this.car.setDepth(50);

        // set up item collisions (no obstacles in bonus level)
        this.items = this.physics.add.group();
        this.physics.add.overlap(this.car, this.items, (car, item) => {
            handleItemCollision(this, car, item);
        }, null, this);

        // initial score and setting up score increment
        this.scoreText = this.add.text(890, 150, `${this.score}`, {
            fontSize: '100px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.scoreText.setDepth(100);
        this.updateScoreText();
        this.scoreEvent = this.time.addEvent({
            delay: 2000, 
            callback: this.incrementScore,
            callbackScope: this,
            loop: true
        });        

        // initial time and setting up time update
        const initialFormattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText = this.add.text(555, 32, `${initialFormattedTime}`, { fontSize: '70px', fill: 'white', fontStyle: 'bold' });
        this.timerText.setDepth(51);
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // initial level
        this.levelText = this.add.text(170, 105, 'B', { fontSize: '95px', fill: 'white', fontStyle: 'bold' });
        this.levelText.setDepth(100);

        // scoreboard
        this.scoreboard = this.add.image(this.scale.width / 2, 128, 'scoreboard');
        this.scoreboard.setScale(1);
        this.scoreboard.setDepth(50);

        // set up controls for lane switching
        this.targetX = this.lanes[this.currentLaneIndex];
        this.input.keyboard.on('keydown-LEFT', () => {
            this.changeLane(-1);
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.changeLane(1);
        });
        this.input.on('pointerdown', (pointer) => {
            if (this.levelCompleted) return;
            if (this.isRestarting) return;
            
            if (pointer.x < this.scale.width / 2) {
                this.changeLane(-1);
            } else {
                this.changeLane(1);
            }
        });

        // spawn items
        Object.entries(this.itemSpawnIntervals).forEach(([type2, interval]) => {
            const itemSpawnEvent = this.time.addEvent({
                delay: interval,
                callback: () => {
                    const laneX = Phaser.Utils.Array.GetRandom(this.lanes);
                    if (this.isLaneClearForItem(laneX)) {
                        spawnSpecificItem(this, type2, this.items, laneX, 3, this.game.config.speedFactor)
                    }
                },
                callbackScope: this,
                loop: true
            });
            // stop spawning items before finish line appears
            this.time.delayedCall(22969, () => {
                itemSpawnEvent.remove(false); 
            });
        });

        // display points update when hit collectible
        this.emitter = this.add.particles(0, 0, 'plusOne', {
            speed: { min: 50 * this.game.config.speedFactor, max: 200 * this.game.config.speedFactor },
            gravityY: 200,
            scale: { start: 0.1, end: 0.15 },
            duration: 300,
            blendMode: 'ADD',
            emitting: false
        });

        // pause button
        this.pauseButton = this.add.image(this.scale.width * .93, BASE_GAME_HEIGHT * .17, 'pauseButton').setInteractive();
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
    }

    // helper method to reformat score
    updateScoreText() {
        const rectWidth = 130;
        const rectHeight = 100;

        const baseFontSize = 100;
        const minFontSize = 10;

        // use testText to determine max font size that can fit in rectangle
        const testText = this.add.text(0, 0, `${this.score}`, {
            fontSize: `${baseFontSize}px`,
            fontStyle: 'bold'
        }).setVisible(false);

        let currentSize = baseFontSize;
        testText.setFontSize(`${currentSize}px`);

        while ((testText.width > rectWidth - 10 || testText.height > rectHeight - 10) && currentSize > minFontSize) {
            currentSize -= 2;
            testText.setFontSize(`${currentSize}px`);
        }

        this.scoreText.setFontSize(`${currentSize}px`);
        this.scoreText.setText(`${this.score}`);

        testText.destroy();
    }

    // update score and call helper to reformat it
    incrementScore() {
        if (!this.isScorePaused) {
            const newScore = this.score + 1;
            const newLength = `${newScore}`.length;

            if (newLength !== this.scoreDigitLength) {
                this.scoreDigitLength = newLength;
                this.score = newScore;
                this.updateScoreText(); // font size
            } else {
                this.score = newScore;
                this.scoreText.setText(`${this.score}`); // update text
            }
        }
    }

    // update and reformat time
    updateTimer() {
        this.timeLeft -= 1;

        const formattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText.setText(`${formattedTime}`);

        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
        }
    }

    update() {
        // move car towards desired position
        const speed = 1000 * this.game.config.speedFactor; // pixels per second of car side-to-side speed
        const threshold = 1;
        const distance = Math.abs(this.car.x - this.targetX);
        if (distance > threshold) {
            const moveAmount = speed * this.game.loop.delta / 1000;
            if (distance <= moveAmount) {
                this.car.x = this.targetX;
            } else {
                this.car.x += Math.sign(this.targetX - this.car.x) * moveAmount;
            }
        } else {
            this.car.x = this.targetX;
        }

        // scroll background
        if (!this.isRestarting && !this.levelCompleted && !this.isPausedByUser) {
            const groundScrollSpeed = 800 * this.game.config.speedFactor; // pixels per second of background speed
            const pixelsPerFrame = (groundScrollSpeed * this.game.loop.delta) / 1000;
            this.ground.tilePositionY -= pixelsPerFrame;
        }

        // cleanup for off-screen
        this.items.getChildren().forEach(item => {
            if (item && item.y > this.scale.height) {
                item.destroy();
            }
        });

        // handle switching levels or restarting
        if (this.timeLeft == 0) {
            winScreen(this)
        } else if (this.timeLeft == 0 && this.isRestarting) {
            restartLevel(this);
        }

        this.scoreText.setText(`${this.score}`);
    }

    // set targetX based on direction we want to change lanes in
    changeLane(direction) {
        if (this.isPausedByUser) return;
        this.currentLaneIndex = Phaser.Math.Clamp(
            this.currentLaneIndex + direction,
            0,
            this.lanes.length - 1
        );

        this.targetX = this.lanes[this.currentLaneIndex];
    }

    // check if lane is clear for item (can't have anything too close vertically)
    isLaneClearForItem(laneX) {
        let minDistance = 200;
        let spawnY = 300;
        const closeItem = this.items.getChildren().some(obj =>
            Math.abs(obj.x - laneX) < 10 && Math.abs(obj.y - spawnY) < minDistance
        );
        return !(closeItem);
    }

}
