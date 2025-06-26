const BASE_GAME_HEIGHT = 1920;

export function showLevelUpScene(scene, nextLevelKey, nextLevelNumber, score, selectedCarIndex) {
    if (scene.levelCompleted) return;
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;

    // pause game flow
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen and display level up message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);
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


export function restartLevel(scene) {
    if (scene.isRestarting) return;
    scene.isRestarting = true;
    scene.isScorePaused = true;
    scene.levelCompleted = false;

    // pause game flow
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen and display restart message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(220);
    scene.add.text(scene.scale.width / 2, BASE_GAME_HEIGHT *.4, 'CRASH!', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

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
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;

    // pause game flow
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.items) scene.items.clear(true, true)

    // gray out screen and display win message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);
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
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;

    // pause game flow
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.items) scene.items.clear(true, true)

    // gray out screen and display win message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);
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
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;

    // pause game flow
    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    // gray out screen and display entering-challenge-level message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);
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

    // gray out screen and display bonus level message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);
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
    
    // gray out screen and display please rotate message
    const overlay = scene.add.graphics();
    overlay.fillStyle(0xeaeaea);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(300);

    // use DOM so can actually center text
    const pauseText = document.createElement('div');
    pauseText.innerText = 'PAUSED!';
    pauseText.style.position = 'absolute';
    pauseText.style.top = '30%';
    pauseText.style.left = '50%';
    pauseText.style.transform = 'translate(-50%, -50%)';
    pauseText.style.fontSize = '45px';
    pauseText.style.color = '#000';
    pauseText.style.zIndex = '301';
    pauseText.style.display = 'none';
    pauseText.style.fontWeight = 'bold';
    document.body.appendChild(pauseText);

    const rotateText = document.createElement('div');
    rotateText.innerText = 'Please rotate device\nto portrait to continue';
    rotateText.style.position = 'absolute';
    rotateText.style.top = '70%';
    rotateText.style.left = '50%';
    rotateText.style.transform = 'translate(-50%, -50%)';
    rotateText.style.fontSize = '25px';
    rotateText.style.color = '#000';
    rotateText.style.zIndex = '301';
    rotateText.style.display = 'none';
    rotateText.style.textAlign = 'center';
    document.body.appendChild(rotateText);

    scene.isPausedForOrientation = false;
    
    // if in landscape on mobile, pause until back in portrait
    const checkOrientation = () => {
        const isMobile = !scene.sys.game.device.os.desktop;
        const isLandscape = window.innerWidth > window.innerHeight;

        if (isMobile && isLandscape) {
            if (!scene.isPausedForOrientation) {
                scene.scene.pause();
                scene.isPausedForOrientation = true;
            }
            overlay.setVisible(true);
            pauseText.style.display = 'block';
            rotateText.style.display = 'block';
        }
        else {
            if (scene.isPausedForOrientation) {
                scene.isPausedForOrientation = false;
                
                if (!scene.isPausedForTilt) {
                    scene.scene.resume();
                }
            }
            overlay.setVisible(false);
            pauseText.style.display = 'none';
            rotateText.style.display = 'none';
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
