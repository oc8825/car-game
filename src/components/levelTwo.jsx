import { TiltControl } from '/src/components/handlers/TiltControl'; 
import { handleObstacleCollision, handleItemCollision } from '/src/components/handlers/collisionHandlers';
import { showLevelUpScene, restartLevel } from '/src/components/handlers/levelSceneHandlers';
import { spawnSpecificObstacle, spawnSpecificItem } from '/src/components/handlers/spawnHandlers';
import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { setInventory, showInventory } from '/src/components/handlers/inventoryHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';

export default class levelTwo extends Phaser.Scene {
    constructor() {
        super({ key: 'levelTwo' });

        this.ground = null;
        this.car = null;
        this.speedY = 1;

        this.levelCompleted = false;
        this.level = 2;
        this.timerText = null;
        this.timerEvent = null;
        this.timeLeft = 2;
        this.score;

        this.orientation = null;

        this.laneChangeCooldown = false;
        this.currentLaneIndex = 1;

        this.isRestarting = false;
        this.isScorePaused = false;
        this.isTiltEnabled = false;

        this.slipTime = 0;
        this.slipDuration = 600;
        this.isSlipping = false;

        this.obstacleTypes = ['oil1', 'oil2', 'block1', 'block2', 'cone', 'spikes'];
        this.obstacleSpawnIntervals = {
            oil1: 2000,
            oil2: 3000,
            cone: 4500,
            block1: 6000,
            block2: 6500,
            spikes: 4000,
        };

        this.itemTypes = ['hat', 'socks', 'foamFinger', 'shirt'];
        this.itemSpawnIntervals = {
            hat: 2000,
            socks: 3000,
            foamFinger: 3500,
            shirt: 4000,
        };

        this.emitter;
        this.speed2 = 0;
        this.speedDown = 0;

    }

    init(data) {
        this.score = data.score || 0;
        this.selectedCarIndex = data.selectedCarIndex || 0;
        this.isScorePaused = false;
        this.timeLeft = 2; 
        this.isRestarting = false;
        this.levelCompleted = false;
        this.currentLaneIndex = 1;
    }

    preload() {
        preloadAssets(this);

    }

    create() {

      /* this.scene.pause();
        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        this.tiltControl.enableTiltControls(() => {
            this.scene.resume();
        });
        */
       
        loadSounds(this);
        showInventory();
        setInventory(this);

        // background
        this.ground = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            "ground"
        );

        // create lanes and start snowball in middle lane
        this.lanes = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        this.currentLaneIndex = 1;
        this.targetX = this.lanes[this.currentLaneIndex];

        const carColors = ['carRed', 'carOrange', 'carYellow', 'carGreen', 'carBlue', 'carPurple'];
        const selectedCarColor = carColors[this.selectedCarIndex];

        // car sprite
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 7 / 8, selectedCarColor);
        this.car.setScale(0.6);
        this.car.setOrigin(0.5, 0.5);

        this.obstacles = this.physics.add.group();
        this.items = this.physics.add.group();

        this.physics.add.collider(this.car, this.obstacles, (car, obstacle) => {
            handleObstacleCollision(this, car, obstacle);
        }, null, this);

        this.physics.add.collider(this.car, this.items, (car, item) => {
            handleItemCollision(this, car, item);
        }, null, this);

        this.scoreText = this.add.text(890, 150, `${this.score}`, {
            fontSize: '100px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.scoreText.setDepth(100);

        this.updateScoreText();

        const initialFormattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText = this.add.text(555, 32, `${initialFormattedTime}`, { fontSize: '70px', fill: 'white', fontStyle: 'bold' });
        this.timerText.setDepth(10);

        this.levelText = this.add.text(170, 105, '2', { fontSize: '95px', fill: 'white', fontStyle: 'bold' });
        this.levelText.setDepth(100);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.scoreEvent = this.time.addEvent({
            delay: 2000,  
            callback: this.incrementScore,
            callbackScope: this,
            loop: true
        });

        // set up controls for lane switching
        this.targetX = this.lanes[this.currentLaneIndex];

        this.scoreboard = this.add.image(this.scale.width / 2, 130, 'scoreboard');
        this.scoreboard.setScale(1);
        this.scoreboard.setDepth(1);

        this.input.keyboard.on('keydown-LEFT', () => {
            this.changeLane(-1);
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            this.changeLane(1);
        });

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x < this.scale.width / 2) {
                this.changeLane(-1);
            } else {
                this.changeLane(1);
            }
        });

        Object.entries(this.obstacleSpawnIntervals).forEach(([type, interval]) => {
            this.time.addEvent({
                delay: interval,
                callback: () => spawnSpecificObstacle(this, type, this.obstacles),
                callbackScope: this,
                loop: true
            });
        });

        Object.entries(this.itemSpawnIntervals).forEach(([type2, interval]) => {
            this.time.addEvent({
                delay: interval,
                callback: () => spawnSpecificItem(this, type2, this.items),
                callbackScope: this,
                loop: true
            });
        });

        this.emitter = this.add.particles(0, 0, 'plusOne', {
            speed: { min: 50, max: 200 },
            gravityY: 200,
            scale: { start: 0.1, end: 0.15 },
            duration: 300,
            blendMode: 'ADD',
            emitting: false
        });
    }

    updateScoreText() {
        const rectWidth = 130;
        const rectHeight = 100;

        const baseFontSize = 100;
        const minFontSize = 10;

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

    incrementScore() {
        if (!this.isScorePaused) {
            const newScore = this.score + 1;
            const newLength = `${newScore}`.length;

            if (newLength !== this.scoreDigitLength) {
                this.scoreDigitLength = newLength;
                this.score = newScore;
                this.updateScoreText();
            } else {
                this.score = newScore;
                this.scoreText.setText(`${this.score}`); 
            }
        }
    }

    updateTimer() {
        this.timeLeft -= 1;

        const formattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText.setText(`${formattedTime}`);

        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
        }
    }

    update() {

        // update snowball position if needed
        const speed = 1000; // pixels per second
        const threshold = 1; // snap threshold for close distances
        const distance = Math.abs(this.car.x - this.targetX); // calculate distance to target
        // only move if the snowball isn't already at the target position
        if (distance > threshold) {
            // interpolate towards the target position
            const moveAmount = speed * this.game.loop.delta / 1000;
            // esnure we don't overshoot the target position
            if (distance <= moveAmount) {
                this.car.x = this.targetX; // snap to target
            } else {
                this.car.x += Math.sign(this.targetX - this.car.x) * moveAmount; // move closer
            }
        } else {
            this.car.x = this.targetX; // snap to target
        }

         if (!this.isRestarting && !this.levelCompleted) {
            const groundScrollSpeed = 500; // pixels per second
            const pixelsPerFrame = (groundScrollSpeed * this.game.loop.delta) / 1000;
            this.ground.tilePositionY -= pixelsPerFrame;
        }

        //slipping
        if (this.isSlipping) {
            this.slipTime += this.game.loop.delta;
            const wiggleAngle = Math.sin(this.slipTime * 0.01) * 20;
            this.car.setAngle(wiggleAngle);

            if (this.slipTime > this.slipDuration) {
                this.isSlipping = false;
                this.car.setAngle(0);
            }
        }

        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle && obstacle.y > this.scale.height) {
                obstacle.destroy();
            } else if (obstacle.rotationSpeed) {
                obstacle.rotation += obstacle.rotationSpeed;
            }
        });

        this.items.getChildren().forEach(item => {
            if (item && item.y > this.scale.height) {
                item.destroy();
            }
        });

        if (this.timeLeft == 0) {
            this.levelUpSound.play({ volume: 0.5 });
             showLevelUpScene(this, 'levelThree', 3, this.score, this.selectedCarIndex);
        } else if (this.timeLeft == 0 && this.isRestarting) {
            restartLevel(this);
        }

        this.scoreText.setText(`${this.score}`);
        this.levelText.setText(`${this.level}`);
    }

    changeLane(direction) {
        // update lane index and ensure it stays within bounds
        this.currentLaneIndex = Phaser.Math.Clamp(
            this.currentLaneIndex + direction,
            0,
            this.lanes.length - 1
        );

        // move snowball to new lane
        this.targetX = this.lanes[this.currentLaneIndex];
    }
}
