export function showLevelUpScene(scene, nextLevelKey, nextLevelNumber, score, selectedCarIndex) {
    if (scene.levelCompleted) return;
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

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        `Level ${nextLevelNumber} Starting In:`, {
        fontSize: '65px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    const countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '3', {
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

    scene.physics.pause();
    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;

    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.obstacles) scene.obstacles.clear(true, true);
    if (scene.items) scene.items.clear(true, true);

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(220);

    const restartButton = scene.add.sprite(scene.scale.width / 2, scene.scale.height * .55, 'restartButton')
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

    const loseText = scene.add.text(scene.scale.width / 2, scene.scale.height *.4, 'CRASH!', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);

    const scoreText = scene.add.text(scene.scale.width / 2, scene.scale.height * .455 , `Score: ${scene.score}`, {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(250);
}

export function winScreen(scene) {
    if (scene.levelCompleted) return;
    scene.levelCompleted = true;
    scene.isScorePaused = true;
    scene.isRestarting = false;

    scene.physics.pause();

    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.items) scene.items.clear(true, true)

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        "Check out what you won!", {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    scene.prizeButton = scene.add.sprite(scene.scale.width / 2, scene.scale.height / 2, 'prizeButton')
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

    scene.physics.pause();

    if (scene.timerEvent) scene.timerEvent.paused = true;
    if (scene.scoreEvent) scene.scoreEvent.paused = true;
    if (scene.car) scene.car.setVelocity(0, 0);
    if (scene.tiltControl) scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    if (scene.items) scene.items.clear(true, true)

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        "Challenge level failed,\n but check out\nwhat you won!", {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    scene.prizeButton = scene.add.sprite(scene.scale.width / 2, scene.scale.height / 2, 'prizeButton')
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

export function chalBufferLevel(scene, nextLevelKey, score, selectedCarIndex) {
    if (scene.levelCompleted) return;
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

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        'CHALLENGE LEVEL INCOMING!', {
        fontSize: '55px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    const countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '3', {
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

export function challengeLevel(scene, nextLevelKey, score, selectedCarIndex) {
    scene.scene.start(nextLevelKey, {
            score: score,
            selectedCarIndex,
        });
}

export function bonusLevel(scene, nextLevelKey, score, selectedCarIndex) {
    scene.input.keyboard.removeAllListeners();

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        'BONUS LEVEL INCOMING!', {
        fontSize: '60px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    const countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '3', {
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
