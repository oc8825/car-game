const BASE_GAME_HEIGHT = 1920;

export function showLevelUpScene(scene, nextLevelKey, nextLevelNumber, score, selectedCarIndex) {
    if (scene.levelCompleted) return;

    // set flags and pause game flow
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();
    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display level up message
    const levelUpText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2.5,
        `Level ${nextLevelNumber} Starting In:`, {
        fontSize: '65px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    // create countdown and start next level after three seconds
    const countdownText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2, '3', {
        fontSize: '90px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    countdownText.setOrigin(0.5);
    countdownText.setDepth(250);
    let countdownValue = 3;
    scene.time.addEvent({
        delay: 1000,
        repeat: 1,
        callback: () => {
            countdownValue--;
            countdownText.setText(countdownValue.toString());
        }
    });
    scene.time.delayedCall(3000, () => {
        countdownText.destroy();
        levelUpText.destroy();

        scene.levelCompleted = false;
        scene.scene.stop(scene.scene.key);
        scene.scene.start(nextLevelKey, {
            score: score,
            selectedCarIndex,
        });
    });
}


export function restartLevel(scene) {
    if (scene.isRestarting) return;

    // set flags and pause game flow
    scene.isRestarting = true;
    scene.isScorePaused = true;
    scene.levelCompleted = false;
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();
    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(220);

    // display restart message
    scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT *.4, 'CRASH!', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    // display score
    scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT * .455 , `Score: ${scene.score}`, {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    // restart button pauses previous scenes and starts back over at chooseCar
    const restartButton = scene.add.sprite(scene.scale.width / 2, BASE_GAME_HEIGHT * .55, 'restartButton')
        .setInteractive()
        .setDepth(250);
    restartButton.on('pointerdown', () => {
        scene.isRestarting = false;

        scene.scene.stop('levelOne');
        scene.scene.stop('levelTwo');
        scene.scene.stop();

        scene.scene.start('chooseCar');
    });
    restartButton.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer');
    });
    restartButton.on('pointerout', () => {
        scene.input.setDefaultCursor('auto');
    });
}

export function winScreen(scene) {
    if (scene.levelCompleted) return;

    // set flags and pause game flow
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();
    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display win message
    const winText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2.5,
        "Check out what you won!", {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    winText.setOrigin(0.5);
    winText.setDepth(250);

    // button to claim prize
    scene.prizeButton = scene.add.sprite(scene.scale.width / 2, BASE_GAME_HEIGHT / 2, 'prizeButton')
        .setInteractive().setDepth(250);
    scene.prizeButton.on('pointerdown', () => {
        scene.isRestarting = false;
        scene.scene.start('youWin', { score: scene.score });
    });
    scene.prizeButton.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
    });
    scene.prizeButton.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
    });

}

export function winScreenFromChallenge(scene) {
    if (scene.levelCompleted) return;

    // set flags and pause game flow
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display win message (challenge failed, but can still claim prize with current score)
    const winText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2.5,
        "Challenge level failed,\n but check out\nwhat you won!", {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    winText.setOrigin(0.5);
    winText.setDepth(250);

    // button to claim prize
    scene.prizeButton = scene.add.sprite(scene.scale.width / 2, BASE_GAME_HEIGHT / 2, 'prizeButton')
        .setInteractive().setDepth(250);
    scene.prizeButton.on('pointerdown', () => {
        scene.isRestarting = false;
        scene.scene.start('youWin', { score: scene.score });
    });
    scene.prizeButton.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
    });
    scene.prizeButton.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
    });

}

export function chalInstructionsLevel(scene, nextLevelKey, score, selectedCarIndex) {
    if (scene.levelCompleted) return;

    // set flags and pause game flow
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();
    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display message that user is entering challenge level
    const levelUpText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2.5,
        'CHALLENGE LEVEL INCOMING!', {
        fontSize: '55px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    // create countdown and switch to challenge instructions after three seconds
    const countdownText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2, '3', {
        fontSize: '90px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    countdownText.setOrigin(0.5);
    countdownText.setDepth(250);
    let countdownValue = 3;
    scene.time.addEvent({
        delay: 1000,
        repeat: 2,
        callback: () => {
            countdownValue--;
            countdownText.setText(countdownValue.toString());
        }
    });
    scene.time.delayedCall(3000, () => {
        countdownText.destroy();
        levelUpText.destroy();

        scene.levelCompleted = false;
        scene.scene.stop(scene.scene.key);
        scene.scene.start(nextLevelKey, {
            score: score,
            selectedCarIndex,
        });
    });

}

// no countdown or button needed, start challenge level immediately
export function challengeLevel(scene, nextLevelKey, score, selectedCarIndex) {
    scene.scene.start(nextLevelKey, {
            score: score,
            selectedCarIndex,
        });
}

export function bonusLevel(scene, nextLevelKey, score, selectedCarIndex) {
    scene.input.keyboard.removeAllListeners();

    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display bonus level message
    const levelUpText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2.5,
        'BONUS LEVEL INCOMING!', {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    // create countdown and start bonus level after three seconds
    const countdownText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT / 2, '3', {
        fontSize: '90px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    countdownText.setOrigin(0.5);
    countdownText.setDepth(250);
    let countdownValue = 3;
    scene.time.addEvent({
        delay: 1000,
        repeat: 2,
        callback: () => {
            countdownValue--;
            countdownText.setText(countdownValue.toString());
        }
    });
    scene.time.delayedCall(3000, () => {
        countdownText.destroy();
        levelUpText.destroy();

        scene.scene.stop(scene.scene.key);
        scene.scene.start(nextLevelKey, {
            score: score,
            selectedCarIndex,
        });
    });
}

export const lockOrientation = (scene) => {
    if(scene._orientationOverlay) return;

    // don't just darken screen, but fully cover it
    const overlay = scene.add.graphics();
    overlay.fillStyle(0xeaeaea);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(350);

    // use DOM so can actually center text
    // display paused message
    const pauseText = document.createElement('div');
    pauseText.innerText = 'PAUSED!';
    pauseText.style.position = 'absolute';
    pauseText.style.top = '40%';
    pauseText.style.left = '50%';
    pauseText.style.transform = 'translate(-50%, -50%)';
    pauseText.style.fontSize = '45px';
    pauseText.style.color = '#000';
    pauseText.style.zIndex = '351';
    pauseText.style.display = 'none';
    pauseText.style.fontWeight = 'bold';
    document.body.appendChild(pauseText);

    // ask user to rotate back to portrait
    const rotateText = document.createElement('div');
    rotateText.innerText = 'Please rotate device\nto portrait to continue';
    rotateText.style.position = 'absolute';
    rotateText.style.top = 'calc(40% + 80px)';
    rotateText.style.left = '50%';
    rotateText.style.transform = 'translate(-50%, -50%)';
    rotateText.style.fontSize = '25px';
    rotateText.style.color = '#000';
    rotateText.style.zIndex = '351';
    rotateText.style.display = 'none';
    rotateText.style.textAlign = 'center';
    document.body.appendChild(rotateText);

    scene.isPausedForOrientation = false;
    
    // if in landscape on device that rotates, pause until back in portrait
    const checkOrientation = () => {
        const isLandscape = window.innerWidth > window.innerHeight;

        // check for devices that are able to rotate to portrait
        const canRotate = 'orientation' in screen || 'DeviceOrientationEvent' in window;
        const isLikelyMobile = () => {
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const ua = navigator.userAgent.toLowerCase();
            return hasTouch && (/android|iphone|ipad|ipod/.test(ua) || 
            (screen.orientation && typeof screen.orientation.lock === 'function'));
        };
        const fixedOrientationDevice = () => {
            const ua = navigator.userAgent.toLowerCase();
            return (
                ua.includes('crkey') ||
                ua.includes('smart-tv') ||
                ua.includes('netcast') ||
                ua.includes('tizen') ||
                ua.includes('googletv') ||
                ua.includes('roku') ||
                ua.includes('firetv')
            );
        };
        const shouldEnforcePortrait = isLikelyMobile() && canRotate && !fixedOrientationDevice();

        if (shouldEnforcePortrait && isLandscape) {
            // in landscape on device that can rotate, pause scene
            if (!scene.isPausedForOrientation) {
                scene.scene.pause();
                scene.isPausedForOrientation = true;
            }

            // display pause and rotate messages
            overlay.setVisible(true);
            pauseText.style.display = 'block';
            rotateText.style.display = 'block';
            
            // hide tilt control messages/buttons if needed
            if (scene.tiltControl) {
                if (scene.tiltControl.prompt) {
                    scene.tiltControl.prompt.style.display = 'none';
                }
                if (scene.tiltControl.enableTiltButton) {
                    scene.tiltControl.enableTiltButton.style.display = 'none';
                }
                if (scene.tiltControl.disableTiltButton) {
                    scene.tiltControl.disableTiltButton.style.display = 'none';
                }
            }
        }
        else {
            // no longer need to be paused, resume scene
            if (scene.isPausedForOrientation) {
                scene.isPausedForOrientation = false;
                
                if (!scene.isPausedForTilt) {
                    scene.scene.resume();
                }
            }

            // hide pause and rotate messages
            overlay.setVisible(false);
            pauseText.style.display = 'none';
            rotateText.style.display = 'none';

            // re-display tilt control messages/buttons if needed
            if (scene.tiltControl) {
                if (scene.tiltControl.prompt) {
                    scene.tiltControl.prompt.style.display = 'block';
                }
                if (scene.tiltControl.enableTiltButton) {
                    scene.tiltControl.enableTiltButton.style.display = 'block';
                }
                if (scene.tiltControl.disableTiltButton) {
                    scene.tiltControl.disableTiltButton.style.display = 'block';
                }
            }
        }
    };

    scene._orientationCheckHandler = checkOrientation

    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    checkOrientation();

    // remove so we don't have multiple listeners acting on orienatation changes
    scene.events.once('shutdown', () => {
        window.removeEventListener('orientationchange', scene._orientationCheckHandler);
        window.removeEventListener('resize', scene._orientationCheckHandler);
        scene._orientationOverlay = null;
        scene._orientationCheckHandler = null;
    });

    scene._orientationOverlay = true;
};

export function pause (scene) {
    scene.physics.pause();
    scene.time.paused = true;
    scene.isPausedByUser = true;
    if (scene.timeBarTween) {
        scene.timeBarTween.pause();
    }
    
    // gray out screen
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    // display paused message
    const pauseText = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT *.4, 'PAUSED', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    // display score
    const scoretext = scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT * .455 , `Score: ${scene.score}`, {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    // resume button
    const resumeButton = scene.add.sprite(scene.scale.width / 2, BASE_GAME_HEIGHT * .6, 'resumeButton').setInteractive().setDepth(250);
    resumeButton.on('pointerdown', (pointer, localX, localY, event) => {
        // ensure pressing resume doesn't also change lanes
        event.stopPropagation();

        // remove pause screen elements and resume game
        overlay.destroy();
        resumeButton.destroy();
        scoretext.destroy();
        pauseText.destroy();
        scene.physics.resume();
        scene.time.paused = false;
        scene.isPausedByUser = false;
        if (scene.timeBarTween) {
            scene.timeBarTween.resume();
        }
    });
    resumeButton.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
    });
    resumeButton.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
    });
}