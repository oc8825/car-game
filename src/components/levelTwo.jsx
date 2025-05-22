import { TiltControl } from '/src/components/handlers/TiltControl'; // Import TiltControl
import { handleObstacleCollision, handleItemCollision } from '/src/components/handlers/collisionHandlers';
import { showLevelUpScene, restartLevel } from '/src/components/handlers/levelSceneHandlers';
import { spawnSpecificObstacle, spawnSpecificItem } from '/src/components/handlers/spawnHandlers';
import { preloadAssets } from '/src/components/handlers/preloadHandler';

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

        this.obstacleTypes = ['oil1', 'oil2', 'oil3', 'block1', 'block2', 'block3', 'cone'];
        this.obstacleSpawnIntervals = {
            oil1: 3000,
            oil2: 3500,
            oil3: 4000,
            cone: 5000,
            block1: 5000,
            block2: 5000,
            block3: 5000,
        };

        this.itemTypes = ['hat', 'socks', 'foamFinger', 'shirt'];
        this.itemSpawnIntervals = {
            hat: 2000,
            socks: 3500,
            foamFinger: 4000,
            shirt: 4000,
        };

    }

    init(data) {
        this.score = data.score || 0;
        this.isScorePaused = false;
    }

    preload() {
           preloadAssets(this);

     
    }

    create() {

        this.scene.pause();
        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        this.tiltControl.enableTiltControls(() => {
            this.scene.start();
        });

        this.showInventory();
        this.setInventory();

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

        // car sprite
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 7 / 8, 'car');
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

        this.scoreText = this.add.text(900, 100, `${this.score}`, { fontSize: '100px', fill: 'white', fontStyle: 'bold' });
        this.scoreText.setDepth(100);

        const initialFormattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText = this.add.text(555, 32, `${initialFormattedTime}`, { fontSize: '70px', fill: 'white', fontStyle: 'bold' });
        this.timerText.setDepth(10);

        this.levelText = this.add.text(145, 105, '2', { fontSize: '95px', fill: 'white', fontStyle: 'bold' });
        this.levelText.setDepth(100);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.scoreEvent = this.time.addEvent({
            delay: 2000,  // Every 2 seconds
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
    }

    incrementScore() {
        if (!this.isScorePaused) {
            this.score += 1;
            this.scoreText.setText(`${this.score}`);
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
            this.ground.tilePositionY -= 2;
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
            showLevelUpScene(this, 'levelThree', 3, this.score); // or 'levelThree', 3 for levelTwo.jsx
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

    showInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'flex'; // Restore flex display
        }
    }

    setInventory() {
        this.slot1 = document.getElementById('slot-1');
        this.slot2 = document.getElementById('slot-2');
        this.slot3 = document.getElementById('slot-3');
        this.slot4 = document.getElementById('slot-4');
        this.slot5 = document.getElementById('slot-5');
    }

    hideInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'none';
        }
    }
}
