import { TiltControl } from './TiltControl'; // Import TiltControl

export default class levelOne extends Phaser.Scene {
    constructor() {
        super({ key: 'levelOne' });
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
        this.load.image('cone', '/src/assets/images/cone.png');
        this.load.image('car', '/src/assets/images/car.png');
        this.load.image('hat', '/src/assets/images/hat.png');
        this.load.image('socks', '/src/assets/images/socks.png');
        this.load.image('scoreboard', '/src/assets/images/scoreboard.png');

    }

    create() {

        this.setInventory();
        this.showInventory();

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

        this.spawnObstacleEvent = this.time.addEvent({ delay: 2000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.spawnItemEvent = this.time.addEvent({ delay: 1500, callback: this.spawnItem, callbackScope: this, loop: true });

        this.physics.add.collider(this.car, this.obstacles, this.handleObstacleCollision, null, this);
        this.physics.add.collider(this.car, this.items, this.handleItemCollision, null, this);

        this.score = 0;

        // set up controls for lane switching
        this.targetX = this.lanes[this.currentLaneIndex];

        this.scoreboard = this.add.image(this.scale.width / 2, 130, 'scoreboard');
        this.scoreboard.setScale(1);

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

     setInventory() {
        this.slot1 = document.getElementById('slot-1');
        this.slot2 = document.getElementById('slot-2');
        this.slot3 = document.getElementById('slot-3');
        this.slot4 = document.getElementById('slot-4');
        this.slot5 = document.getElementById('slot-5');

        this.slot1.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
        this.slot2.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
        this.slot3.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
        this.slot4.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
        this.slot5.style.backgroundImage = 'url(/src/assets/images/qMark.png)';

    }

    showInventory() {
        const inventoryBox = document.getElementById('inventory-box');
        if (inventoryBox) {
            inventoryBox.style.display = 'flex'; // Restore flex display
        }
    }

    handleObstacleCollision(car, obstacle) {
        // Stop the car's movement on collision
        car.body.setVelocity(0, 0);
        car.body.setBounce(0);       // No bounce
        car.body.setFriction(0);     // No friction

        obstacle.destroy(); // Destroy the obstacle on collision
    }

    handleItemCollision(car, item) {
        // Stop the car's movement on collision
        car.body.setVelocity(0, 0);
        car.body.setBounce(0);       // No bounce
        car.body.setFriction(0);     // No friction
      
        const itemKey = item.texture.key;
        item.destroy(); // Destroy the item on collision

        if (itemKey == "hat") {
            this.slot1.style.backgroundImage = `url(/src/assets/images/hat.png)`
        } else if (itemKey == "socks") {
            this.slot2.style.backgroundImage = `url(/src/assets/images/socks.png)`
        }
        item.destroy(); // Destroy the item on collision
    }

    spawnObstacle() {
        //  if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);

        //must implement this into spawnItem
        const obstacleTypes = ['oil1', 'oil2', 'oil3', 'cone'];
        const randomObstacleType = Phaser.Math.RND.pick(obstacleTypes);

        const obstacle = this.obstacles.create(randomX, 300, randomObstacleType);

        if (randomObstacleType === 'oil1') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(115);
        } else if (randomObstacleType === 'oil2') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(200);
        } else if (randomObstacleType === 'oil3') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'cone') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        }
    }

    spawnItem() {

        // if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);  // randomly pick one of the x positions

        const itemTypes = ['hat', 'socks'];
        const randomItemType = Phaser.Math.RND.pick(itemTypes);

        const item = this.items.create(randomX, 300, randomItemType);

        if (randomItemType === 'hat') {
            item.setScale(0.3);
            item.setVelocityY(115);
        } else if (randomItemType === 'socks') {
            item.rotationSpeed = 0.1;
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