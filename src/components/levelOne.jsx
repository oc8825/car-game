import { TiltControl } from '/src/components/handlers/TiltControl';
import { handleObstacleCollision, handleItemCollision } from '/src/components/handlers/collisionHandlers';
import { showLevelUpScene, restartLevel, lockOrientation } from '/src/components/handlers/levelSceneHandlers';
import { spawnSpecificObstacle, spawnSpecificItem } from '/src/components/handlers/spawnHandlers';
import { loadSounds } from '/src/components/handlers/soundHandler';
import { slip } from '/src/components/handlers/animationHandlers'

export default class levelOne extends Phaser.Scene {
    constructor() {
        super({ key: 'levelOne' });
        this.ground = null;
        this.car = null;
        this.speedY = 1;
        this.test = false;
        this.scoreDigitLength = 1;

        this.levelCompleted = false;
        this.score = 0;
        this.level = 1;
        this.timerText = null;
        this.timerEvent = null;
        this.timeLeft = 20;

        this.orientation = null;
        this.selectedCarIndex = null;

        this.laneChangeCooldown = false;
        this.currentLaneIndex = 1;
        this.isTiltEnabled = false;

        this.isRestarting = false;
        this.isScorePaused = false;
        this.restarting;

        // flags so pausing/resuming for turning on tilt and portrait lock don't conflict
        this.isPausedForTilt = false;
        this.isPausedForOrientation = false;

        this.slipTime = 0;
        this.slipDuration = 600;
        this.isSlipping = false;

        this.obstacleTypes = ['oil1', 'cone'];
        this.obstacleSpawnIntervals = {
            oil1: 2598,
            oil2: 2278,
            oil3: 2464,
            cone: 1651,
        };

        this.itemTypes = ['hat', 'socks'];
        this.itemSpawnIntervals = {
            hat: 2967,
            socks: 3343,
            foamFinger: 4098,
            shirt: 4376,
            waterBottle: 4460,
        };

        this.emitter;
        this.speed2 = 0;
        this.speedDown = 0;

    }

    init(data) {
        this.score = data.score || 0;
        this.timeLeft = 20; 
        this.isRestarting = false;
        this.levelCompleted = false;
        this.isScorePaused = false;
        this.currentLaneIndex = 1;
        this.selectedCarIndex = data?.selectedCarIndex || 0;
    }

    preload() {
    }

    create() {

        if (this.restarting) {
            this.scene.restart();
        }

        loadSounds(this);

        lockOrientation(this);

        // enable tilting
        this.isPausedForTilt = true;
        this.scene.pause();
        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        if (!this.tiltControl.hasEnabledTilt && !this.tiltControl.hasDisabledTilt) {
            // have not yet enabled or disabled, so ask permission
            this.tiltControl.enableTiltControls(() => {
                this.scene.start();
            });
        }
        else {
            // already enabled or disabled, so use previous answer
            this.tiltControl.enableTiltControlsIfPreviouslyEnabled();
        }


        this.levelUpSound.play();

        // background
        this.ground = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            "ground"
        );

        // finish line
        this.time.delayedCall(17530, () => {
            const finishLine = this.physics.add.image(this.scale.width / 2, -600, 'finishLine');
            finishLine.setVelocityY(500);
        });

        // sound effect on winning level
        /* Use delayed call rather than playing when this.levelCompleted = true
        because then it immediately starts next level */  
        this.time.delayedCall(20000, () => {
            this.winGameSound.play();
        });

        // create lanes and start car in middle lane
        this.lanes = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        this.currentLaneIndex = 1;
        this.targetX = this.lanes[this.currentLaneIndex];

        // car sprite
        const carColors = ['carRed', 'carOrange', 'carYellow', 'carGreen', 'carBlue', 'carPurple'];
        const selectedCarColor = carColors[this.selectedCarIndex];
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 7 / 8, selectedCarColor);
        this.car.setScale(0.6);
        this.car.setOrigin(0.5, 0.5);
        this.car.setDepth(50);

        // set up item and obstacle collisions
        this.obstacles = this.physics.add.group();
        this.items = this.physics.add.group();
        this.physics.add.overlap(this.car, this.obstacles, (car, obstacle) => {
            handleObstacleCollision(this, car, obstacle);
        }, null, this);
        this.physics.add.overlap(this.car, this.items, (car, item) => {
            handleItemCollision(this, car, item);
        }, null, this);

        // initial score and score update
        this.scoreText = this.add.text(890, 150, '0', {
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

        // initial time and time update
        const initialFormattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText = this.add.text(555, 32, `${initialFormattedTime}`, { fontSize: '70px', fill: 'white', fontStyle: 'bold' });
        this.timerText.setDepth(10);
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // initial level
        this.levelText = this.add.text(170, 105, '1', { fontSize: '95px', fill: 'white', fontStyle: 'bold' });
        this.levelText.setDepth(100);

        // scoreboard
        this.scoreboard = this.add.image(this.scale.width / 2, 130, 'scoreboard');
        this.scoreboard.setScale(1);
        this.scoreboard.setDepth(1);

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

        // spawn obstacles
        Object.entries(this.obstacleSpawnIntervals).forEach(([type, interval]) => {
            const obstacleSpawnEvent = this.time.addEvent({
                delay: interval,
                callback: () => {
                    const laneX = Phaser.Utils.Array.GetRandom(this.lanes);
                    if (this.isLaneClearForObstacle(laneX)) {
                        spawnSpecificObstacle(this, type, this.obstacles, laneX, 1)
                    }
                },
                callbackScope: this,
                loop: true
            });

            this.time.delayedCall(17030, () => {
                obstacleSpawnEvent.remove(false); 
            });
        });

        // spawn items
        Object.entries(this.itemSpawnIntervals).forEach(([type2, interval]) => {
            const itemSpawnEvent = this.time.addEvent({
                delay: interval,
                callback: () => {
                    const laneX = Phaser.Utils.Array.GetRandom(this.lanes);
                    if (this.isLaneClearForItem(laneX)) {
                        spawnSpecificItem(this, type2, this.items, laneX, 1)
                    }
                },
                callbackScope: this,
                loop: true
            });

            this.time.delayedCall(17030, () => {
                itemSpawnEvent.remove(false); 
            });
        });

        // display points update when hit collectible
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
        const speed = 1000; // in pixels per second
        const threshold = 1;
        const distance = Math.abs(this.car.x - this.targetX); 
        // move if car not at the target position
        if (distance > threshold) {
            const moveAmount = speed * this.game.loop.delta / 1000;
            if (distance <= moveAmount) {
                this.car.x = this.targetX;
            } else {
                this.car.x += Math.sign(this.targetX - this.car.x) * moveAmount; // move closer
            }
        } else {
            this.car.x = this.targetX;
        }

        if (!this.isRestarting && !this.levelCompleted) {
            const groundScrollSpeed = 500; // in pixels per second
            const pixelsPerFrame = (groundScrollSpeed * this.game.loop.delta) / 1000;
            this.ground.tilePositionY -= pixelsPerFrame;
        }

        //slipping
        slip(this);

        // cleanup for off-screen
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

        // handle switching levels or restarting
        if (this.timeLeft == 0) {
            showLevelUpScene(this, 'levelTwo', 2, this.score, this.selectedCarIndex);
        } else if (this.timeLeft == 0 && this.isRestarting) {
            restartLevel(this);
        }

        // update score and level
        this.scoreText.setText(`${this.score}`);
        this.levelText.setText(`${this.level}`);
    }

    changeLane(direction) {
        this.currentLaneIndex = Phaser.Math.Clamp(
            this.currentLaneIndex + direction,
            0,
            this.lanes.length - 1
        );

        this.targetX = this.lanes[this.currentLaneIndex];
    }

    isLaneClearForObstacle(laneX) {
        let minYDistance = this.car.height;
        let xBuffer = this.car.height;
        let spawnY = 300;
        const closeObstacle = this.obstacles.getChildren().some(obj =>
            Math.abs(obj.x - laneX) < xBuffer && Math.abs(obj.y - spawnY) < minYDistance
        );
        const closeItem = this.items.getChildren().some(obj =>
            obj.x === laneX && Math.abs(obj.y - spawnY) < minYDistance
        );
        return !(closeObstacle || closeItem);
    }

    isLaneClearForItem(laneX) {
        let minDistance = 250;
        let spawnY = 300;
        const closeObstacle = this.obstacles.getChildren().some(obj =>
            Math.abs(obj.x - laneX) < 10 && Math.abs(obj.y - spawnY) < minDistance
        );
        const closeItem = this.items.getChildren().some(obj =>
            Math.abs(obj.x - laneX) < 10 && Math.abs(obj.y - spawnY) < minDistance
        );
        return !(closeObstacle || closeItem);
    }

}
