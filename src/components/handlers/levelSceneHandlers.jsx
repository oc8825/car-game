import { hideInventory } from "./inventoryHandler";

export function showLevelUpScene(scene, nextLevelKey, nextLevelNumber, score, selectedCarIndex) {
    if (scene.levelCompleted) return;
    scene.levelCompleted = true;
    scene.isScorePaused = true;

    scene.physics.pause();
    scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    scene.obstacles.clear(true, true);
    scene.items.clear(true, true);

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        `Level ${nextLevelNumber} Starting In...`, {
        fontSize: '75px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    hideInventory(scene);

    const countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '3', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });

    countdownText.setOrigin(0.5);
    countdownText.setDepth(250);

    let countdownValue = 3;
    scene.time.addEvent({
        delay: 1000, // 1 second per countdown step
        repeat: 2,   // Repeat 2 more times (for 2 and 1)
        callback: () => {
            countdownValue--;
            countdownText.setText(countdownValue.toString()); // Update the countdown text
        }
    });

    scene.time.delayedCall(3000, () => {
        // Clear the countdown text and update the message
        countdownText.destroy();
        levelUpText.setText('GO!');
        levelUpText.setFontSize('200px');
        levelUpText.setFontStyle('bold');
        levelUpText.setOrigin(0.5);

        // Restart the scene after a small delay
        scene.time.delayedCall(500, () => {
            scene.levelCompleted = false;
            scene.scene.start(nextLevelKey, {
                score: score,
                selectedCarIndex,
                inventory: {
                    slot1: scene.slot1?.style?.backgroundImage,
                    slot2: scene.slot2?.style?.backgroundImage,
                    slot3: scene.slot3?.style?.backgroundImage,
                    slot4: scene.slot4?.style?.backgroundImage,
                    slot5: scene.slot5?.style?.backgroundImage,
                }
            });
        });
    });

}

export function restartLevel(scene) {
    if (scene.isRestarting) return;
    scene.isRestarting = true;
    scene.isScorePaused = true;
    scene.levelCompleted = false;

    scene.physics.pause();
    scene.timerEvent.paused = true;
    scene.car.setVelocity(0, 0);
    scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    scene.obstacles.clear(true, true);
    scene.items.clear(true, true);

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7); // Semi-transparent black
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height); // Draw the rectangle to cover the screen
    overlay.setDepth(220); // Ensure overlay is above other objects

    scene.restartButton = scene.add.sprite(scene.scale.width / 2, scene.scale.height / 2, 'restartButton')
        .setInteractive().setDepth(250);
    scene.restartButton.on('pointerdown', () => {
        scene.isRestarting = false;
        scene.scene.start('chooseCar');
        scene.gameStart.play();
        scene.restarting = true;
    });

    scene.restartButton.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
    });

    scene.restartButton.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
    });

    const loseText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5, 'Game Over!', {
        fontSize: '75px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    loseText.setOrigin(0.5);
    loseText.setDepth(250);

    hideInventory(scene);
}

export function winScreen(scene) {
    if (scene.levelCompleted) return;
    scene.levelCompleted = true;
    scene.isScorePaused = true;

    scene.items.clear(true, true);

    scene.physics.pause();
    scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        "Check out what you won!", {
        fontSize: '75px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    hideInventory(scene);

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

export function bonusLevel(scene, nextLevelKey, score, selectedCarIndex) {
    if (scene.levelCompleted) return;
    scene.levelCompleted = true;
    scene.isScorePaused = true;

    scene.obstacles.clear(true, true);
    scene.items.clear(true, true);

    scene.physics.pause();
    scene.tiltControl.disableTiltControls();
    scene.input.keyboard.removeAllListeners();

    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);
    overlay.setDepth(200);

    const levelUpText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2.5,
        'BONUS Level Starting In...', {
        fontSize: '75px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(250);

    hideInventory(scene);

    const countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '3', {
        fontSize: '100px',
        fill: '#fff',
        align: 'center',
        fontStyle: 'bold'
    });

    countdownText.setOrigin(0.5);
    countdownText.setDepth(250);

    let countdownValue = 3;
    scene.time.addEvent({
        delay: 1000, // 1 second per countdown step
        repeat: 2,   // Repeat 2 more times (for 2 and 1)
        callback: () => {
            countdownValue--;
            countdownText.setText(countdownValue.toString()); // Update the countdown text
        }
    });

    scene.time.delayedCall(3000, () => {
        // Clear the countdown text and update the message
        countdownText.destroy();
        levelUpText.setText('GO!');
        levelUpText.setFontSize('200px');
        levelUpText.setFontStyle('bold');
        levelUpText.setOrigin(0.5);

        // Restart the scene after a small delay
        scene.time.delayedCall(500, () => {
            scene.levelCompleted = false;
            scene.scene.start(nextLevelKey, {
                score: score,
                selectedCarIndex,
                inventory: {
                    slot1: scene.slot1?.style?.backgroundImage,
                    slot2: scene.slot2?.style?.backgroundImage,
                    slot3: scene.slot3?.style?.backgroundImage,
                    slot4: scene.slot4?.style?.backgroundImage,
                    slot5: scene.slot5?.style?.backgroundImage,
                }
            });
        });
    });

}

