export default class levelOne extends Phaser.Scene {
constructor() {
        super({ key: 'levelOne'});
        this.ground = null;
        this.car = null;
        this.speedY = 1;

        this.orientation = null;
        this.snowballTarget = 10;
        this.levelCompleted = false;
        this.score = 0;
        this.level = 1;
        this.overlay = null;
     
        this.spawnObstacleEvent = null;
        this.spawnSnowAdderEvent = null;
        this.tiltControlsActive = false;
        this.isRestarting = false;
        
    }

    preload() {
        // load game assets
        this.load.image('ground', '/src/assets/images/background.png');
        
        // snowball poof animation
        for (let i = 1; i <= 12; i++) {
            this.load.image(`poof${i}`, `/src/assets/images/poof/poof${i}.png`);
        }
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
        this.car = this.physics.add.sprite(this.lanes[this.currentLaneIndex], this.scale.height * 3/4, 'car');
        this.car.setScale(0.2);
        this.car.setOrigin(0.5,0.5);

        this.obstacles = this.physics.add.group();
        this.items = this.physics.add.group();

        this.spawnObstacleEvent = this.time.addEvent({ delay: 2000, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.spawnItemEvent = this.time.addEvent({ delay: 1500, callback: this.spawnItem, callbackScope: this, loop: true });
    
        this.physics.add.collider(this.car, this.obstacles, this.handleObstacleCollision, null, this);
        this.physics.add.collider(this.car, this.items, this.handleItemCollision, null, this);

        this.score = 0;

        /*display score
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.setDepth(10); // score will display above game
*/

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
    
        // check if DeviceMotionEvent is supported 
        const isTiltSupported =
            typeof DeviceMotionEvent !== 'undefined' &&
            (navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone'));

        if (isTiltSupported) {
            this.scene.pause();
            // Tilt Control button
            const enableTiltButton = document.createElement('button');
            enableTiltButton.innerText = 'Enable Tilt Controls';
            enableTiltButton.style.position = 'absolute';
            enableTiltButton.style.top = '50%';
            enableTiltButton.style.left = '50%';
            enableTiltButton.style.transform = 'translate(-50%, -50%)';
            enableTiltButton.style.fontSize = '20px';
            enableTiltButton.style.padding = '10px 20px';
            enableTiltButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            enableTiltButton.style.color = '#fff';
            enableTiltButton.style.border = 'none';
            enableTiltButton.style.cursor = 'pointer';
            document.body.appendChild(enableTiltButton);

            // create cooldown for lane changes so cna only change one lane per tilt
            this.laneChangeCooldown = false;

            enableTiltButton.addEventListener('click', () => {
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                    // request permission for accelerometer access on iOS
                    DeviceMotionEvent.requestPermission()
                        .then(response => {
                            if (response === 'granted') {
                                console.log('Permission granted for tilt controls!');
                                window.addEventListener('devicemotion', this.handleMotion.bind(this));
                                document.body.removeChild(enableTiltButton);
                                this.scene.resume(); // remove button
                            } else {
                                console.error('Permission denied for tilt controls.');
                                alert('Permission denied. Tilt controls are unavailable.');
                            }
                        })
                        .catch(error => {
                            console.error('Error requesting permission:', error);
                            alert('Unable to enable tilt controls. ' + error);
                        });
                } else {
                    // non-iOS devices 
                    console.log('Tilt controls enabled (no permission required).');
                    window.addEventListener('devicemotion', this.handleMotion.bind(this));
                    document.body.removeChild(enableTiltButton);
                }
            });
        } else {
            console.log('Tilt controls are not supported on this device.');
        }

    }

 handleMotion(event) {
        let tilt;
        const tiltThreshold = 1; // sensitivity

        // get screen orientation angle
        const angle = screen.orientation.angle;

        if (angle === 90) {
            // landscape (rotated right)
            tilt = -event.accelerationIncludingGravity.y; // invert y-axis
        } else if (angle === -90 || angle === 270) {
            // landscape (rotated left)
            tilt = event.accelerationIncludingGravity.y; // keep y-axis
        } else {
            // portrait mode
            tilt = event.accelerationIncludingGravity.x; // invert x-axis
        }

        if (!this.laneChangeCooldown) {
            if (tilt > tiltThreshold) {
                this.changeLane(1); // move right
                this.startCooldown();
            } else if (tilt < -tiltThreshold) {
                this.changeLane(-1); // move left
                this.startCooldown();
            }
        }
    }

    startCooldown() {
        this.laneChangeCooldown = true;

        // reset cooldown after 300ms 
        this.time.delayedCall(300, () => {
            this.laneChangeCooldown = false;
        });
    }

    changeLane(direction) {
        // update lane index and ensure it stays within bounds
        this.currentLaneIndex = Phaser.Math.Clamp(
            this.currentLaneIndex + direction,
            0,
            this.lanes.length - 1
        );

        // move car to new lane
        this.targetX = this.lanes[this.currentLaneIndex];
    }


 handleObstacleCollision(car, obstacle) {
        car.body.setVelocity(0, 0);  // no obstacle movement
        car.body.setBounce(0);       // no bounce
        car.body.setFriction(0);     // no friction
        
        // update score
        this.score -= 1;
        this.scoreText.setText('Score: ' + this.score);
        
        /* poof animation
        const poofSprite = this.add.sprite(car.x, car.y, 'poof1');
        poofSprite.setScale(2);
        poofSprite.play('poof');
        */
        
        obstacle.destroy(); // disappear
    }

    handleItemCollision(car, item) {
        car.body.setVelocity(0, 0);
        car.body.setBounce(0);
        car.body.setFriction(0);

        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);

        /* glow effect
        snowball.setTint(0xB0E0FF); // light blue tint
        this.time.delayedCall(300, () => {
            snowball.clearTint(); // remove tint
        });
        */

        /* smooth expansion
        this.tweens.add({
            targets: snowball,
            scale: snowball.scaleX + 0.03,
            duration: 300,
            ease: 'Sine.easeInOut',
        });
        */

        item.destroy();

    }

     spawnObstacle() {
      //  if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);

        //must implement this into spawnItem
        const obstacleTypes = ['football', 'baseballbat', 'net', 'basketball'];
        const randomObstacleType = Phaser.Math.RND.pick(obstacleTypes);

        const obstacle = this.obstacles.create(randomX, 0, randomObstacleType);

        if (randomObstacleType === 'baseballbat') {
            obstacle.setScale(0.15);
            obstacle.setVelocityY(115);
            obstacle.rotationSpeed = 0.02;
        } else if (randomObstacleType === 'basketball') {
            obstacle.rotationSpeed = 0.01;
            obstacle.setScale(0.15);
            obstacle.setVelocityY(200);
        } else if (randomObstacleType === 'net') {
            obstacle.setScale(0.3);
            obstacle.setVelocityY(300);
        } else if (randomObstacleType === 'football') {
            obstacle.setScale(0.1);
            obstacle.setVelocityY(250);
            obstacle.rotationSpeed = 0.02;
        }
    }

    spawnItem() {

       // if(this.levelCompleted) return;

        const xPositions = [this.scale.width / 6, this.scale.width / 2, this.scale.width * 5 / 6];
        const randomX = Phaser.Math.RND.pick(xPositions);  // randomly pick one of the x positions

        const item = this.items.create(randomX, 0, 'snowAdderImage'); // spawn at top
        snowAdder.setScale(0.1); // scale the snowAdder down
        snowAdder.setVelocityY(150); // make the obstacle move downward
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
                this.car.x += Math.sign(this.targetX - this.snowball.x) * moveAmount; // move closer
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

        //need to debug for "snowball"
        if (this.score >= this.snowballTarget && !this.levelCompleted) {
            this.levelCompleted = true;
            this.showLevelUpScene();
        } else if (this.score < 0){
            this.restartLevel();
        }

    }

     showLevelUpScene(){
        this.physics.pause();

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        this.overlay.fillRect(0, 0, this.scale.width, this.scale.height);

        this.nextLevelButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'nextLevelButton')
        .setInteractive();
        this.nextLevelButton.on('pointerdown', () => {
            this.scene.start('LevelOnePartTwo');
        });

        const levelUpText = this.add.text(this.scale.width / 2, this.scale.height / 3, 'Level Complete!', {
            fontSize: '48px',
            fill: '#fff',
            align: 'center'
        });
        levelUpText.setOrigin(0.5);
    
    }

    restartLevel() {
        if (this.isRestarting) return; // If already restarting, exit early

        this.isRestarting = true; // Prevent further calls until reset
    
        // Pause gameplay
        this.physics.pause();
    
        // Create a semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7); // Semi-transparent black
        overlay.fillRect(0, 0, this.scale.width, this.scale.height); // Draw the rectangle to cover the screen
        overlay.setDepth(10); // Ensure overlay is above other objects
    
        // Display the initial message
        const loseText = this.add.text(this.scale.width / 2, this.scale.height / 3, 'Level Failed!', {
            fontSize: '48px',
            fill: '#fff',
            align: 'center'
        });
        loseText.setOrigin(0.5);
        loseText.setDepth(11); // Ensure text is above the overlay
    
        // Countdown logic
        const countdownText = this.add.text(this.scale.width / 2, this.scale.height / 2, '3', {
            fontSize: '64px',
            fill: '#fff',
            align: 'center'
        });
        countdownText.setOrigin(0.5);
        countdownText.setDepth(11); // Ensure countdown text is above the overlay
    
        let countdownValue = 3;
        const countdownTimer = this.time.addEvent({
            delay: 1000, // 1 second per countdown step
            repeat: 2,   // Repeat 2 more times (for 2 and 1)
            callback: () => {
                countdownValue--;
                countdownText.setText(countdownValue.toString()); // Update the countdown text
            }
        });
    
        // Schedule the restart after the countdown finishes
        this.time.delayedCall(3000, () => {
            // Clear the countdown text and update the message
            countdownText.destroy();
            loseText.setText('Restarting...');
    
            // Restart the scene after a small delay
            this.time.delayedCall(500, () => {
                this.isRestarting = false; // Reset the flag
                this.scene.restart(); // Restart the scene
            });
        });
    }
    
}
