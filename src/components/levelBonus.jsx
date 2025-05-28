import { TiltControl } from '/src/components/handlers/TiltControl'; // Import TiltControl
import { handleItemCollision } from '/src/components/handlers/collisionHandlers';
import { winScreen, restartLevel } from '/src/components/handlers/levelSceneHandlers';
import { spawnSpecificItem } from '/src/components/handlers/spawnHandlers';
import { preloadAssets } from '/src/components/handlers/preloadHandler';
import { setInventory, showInventory } from '/src/components/handlers/inventoryHandler';
import { loadSounds } from '/src/components/handlers/soundHandler';

export default class levelBonus extends Phaser.Scene {
    constructor() {
        super({ key: 'levelBonus' });
        this.ground = null;
        this.car = null;
        this.speedY = 1;

        this.level = "B";
        this.timerText = null;
        this.timerEvent = null;
        this.timeLeft = 25;
        this.score;

        this.orientation = null;

        this.laneChangeCooldown = false;
        this.currentLaneIndex = 1;

        this.isRestarting = false;
        this.levelCompleted = false;
        this.isScorePaused = false;
        this.isTiltEnabled = false;

        this.itemTypes = ['hat', 'socks', 'foamFinger', 'shirt', 'waterBottle'];
        this.itemSpawnIntervals = {
            hat: 1000,
            socks: 1500,
            foamFinger: 2000,
            shirt: 2500,
            waterBottle: 3000,
        };

        this.emitter;
        this.speed2 = 0;
        this.speedDown = 0;

    }

    init(data) {
        this.score = data.score || 0;
        this.selectedCarIndex = data.selectedCarIndex || 0;
        this.isScorePaused = false;

    }

    preload() {
        preloadAssets(this);

    }

    create() {

        loadSounds(this);
        showInventory();
        setInventory(this);

        this.scene.pause();
        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        this.tiltControl.enableTiltControls(() => {
            this.scene.start();
        });

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

        this.items = this.physics.add.group();

        // car sprite
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 7 / 8, selectedCarColor);
        this.car.setScale(0.6);
        this.car.setOrigin(0.5, 0.5);

        this.physics.add.collider(this.car, this.items, (car, item) => {
            handleItemCollision(this, car, item);
        }, null, this);

        this.scoreText = this.add.text(925, 150, `${this.score}`, {
            fontSize: '100px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.scoreText.setDepth(100);

        // Initial positioning
        this.updateScoreText();

        const initialFormattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.timerText = this.add.text(555, 32, `${initialFormattedTime}`, { fontSize: '70px', fill: 'white', fontStyle: 'bold' });
        this.timerText.setDepth(10);

        this.levelText = this.add.text(145, 105, '3', { fontSize: '95px', fill: 'white', fontStyle: 'bold' });
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

        testText.destroy(); // Cleanup
    }

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

        // cleanup for off-screen
        this.items.getChildren().forEach(item => {
            if (item && item.y > this.scale.height) {
                item.destroy();
            }
        });

        if (this.timeLeft == 0) {
            winScreen(this)
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
