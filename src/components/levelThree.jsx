import { TiltControl } from './TiltControl'; // Import TiltControl

export default class levelThree extends Phaser.Scene {
    constructor() {
        super({ key: 'levelThree' });
        this.ground = null;
        this.car = null;
        this.speedY = 1;

        this.orientation = null;

        this.timeTarget = 20;

        this.levelCompleted = false;

        this.score = 0;
        this.level = 1;

        this.overlay = null;

        this.spawnObstacleEvent = null;
        this.spawnItemEvent = null;

        this.tiltControlsActive = false;
        this.laneChangeCooldown = false;
        this.currentLaneIndex = 1;

        this.isRestarting = false;
    }

    preload() {
        // load game assets
        this.load.image('ground', '/src/assets/images/background.png');
        this.load.image('oil1', '/src/assets/images/oil1.png');
        this.load.image('oil2', '/src/assets/images/oil2.png');
        this.load.image('oil3', '/src/assets/images/oil3.png');
        this.load.image('block1', '/src/assets/images/block1.png');
        this.load.image('block2', '/src/assets/images/block2.png');
        this.load.image('block3', '/src/assets/images/block3.png');
        this.load.image('car', '/src/assets/images/car.png');
        this.load.image('hat', '/src/assets/images/hat.png');
        this.load.image('socks', '/src/assets/images/socks.png');
        this.load.image('shirt', '/src/assets/images/shirt.png');
        this.load.image('foamFinger', '/src/assets/images/foamFinger.png');
        this.load.image('cone', '/src/assets/images/cone.png');
        this.load.image('spikes', '/src/assets/images/spikes.png');
        this.load.image('tire', '/src/assets/images/tire.png');
        this.load.image('waterBottle', '/src/assets/images/waterBottle.png');

    }

    create() {

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
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 3 / 4, 'car');
        this.car.setScale(0.6);
        this.car.setOrigin(0.5, 0.5);

        this.obstacles = this.physics.add.group();
        this.items = this.physics.add.group();

        this.spawnObstacleEvent = this.time.addEvent({ delay: 2000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.spawnItemEvent = this.time.addEvent({ delay: 1500, callback: this.spawnItem, callbackScope: this, loop: true });

        this.physics.add.collider(this.car, this.obstacles, this.handleObstacleCollision, null, this);
        this.physics.add.collider(this.car, this.items, this.handleItemCollision, null, this);

        this.score = 0;

        // set up controls for lane switching
        this.targetX = this.lanes[this.currentLaneIndex];

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

        this.tiltControl = new TiltControl(this, (direction) => this.changeLane(direction));
        this.tiltControl.enableTiltControls();
    }

    handleObstacleCollision(car, obstacle) {
        car.body.setVelocity(0, 0);  // no obstacle movement
        car.body.setBounce(0);       // no bounce
        car.body.setFriction(0);     // no friction
        obstacle.destroy(); // disappear
    }

    handleItemCollision(car, item) {
        car.body.setVelocity(0, 0);
        car.body.setBounce(0);
        car.body.setFriction(0);

        item.destroy();

    }

    spawnObstacle() {
        //  if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);

        //must implement this into spawnItem
        const obstacleTypes = ['oil1', 'oil2', 'oil3', 'cone', 'block1', 'block2', 'block3','tire','spikes'];
        const randomObstacleType = Phaser.Math.RND.pick(obstacleTypes);

        const obstacle = this.obstacles.create(randomX, 0, randomObstacleType);

        if (randomObstacleType === 'oil1') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(115);
        } else if (randomObstacleType === 'oil2') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(200);
        } else if (randomObstacleType === 'oil3') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'block1') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'block2') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'block3') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'cone') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'tire') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
            obstacle.rotationSpeeed = 0.02;
        } else if (randomObstacleType === 'spikes') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        }
    }

    spawnItem() {
        // if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);  // randomly pick one of the x positions

        const itemTypes = ['hat', 'socks', 'shirt', 'foamFinger','waterBottle'];
        const randomItemType = Phaser.Math.RND.pick(itemTypes);

        const item = this.items.create(randomX, 0, randomItemType);

        if (randomItemType === 'hat') {
            item.setScale(0.3);
            item.setVelocityY(115);
        } else if (randomItemType === 'socks') {
            item.rotationSpeed = 0.01;
            item.setScale(0.3);
            item.setVelocityY(200);
        } else if (randomItemType === 'shirt') {
            item.setScale(0.3);
            item.setVelocityY(200);
        } else if (randomItemType === 'foamFinger') {
            item.rotationSpeed = 0.01;
            item.setScale(0.3);
            item.setVelocityY(200);
        }
        else if (randomItemType === 'waterBottle') {
            item.setScale(0.3);
            item.setVelocityY(200);
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

        this.ground.tilePositionY -= 2;

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
