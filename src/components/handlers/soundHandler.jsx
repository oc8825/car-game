export const loadSounds = (scene) => {
    scene.collectSound = scene.sound.add('collect', { volume: 0.5 } );
    scene.crashSound = scene.sound.add('crash', { volume: 0.5 });
    scene.gameOverSound = scene.sound.add('gameOver', { volume: 0.5 });
    scene.levelUpSound = scene.sound.add('levelUp', { volume: 0.5 });
    scene.oilSlipSound = scene.sound.add('oilSlip', { volume: 0.5 });
    scene.winGameSound = scene.sound.add('winGame', { volume: 0.5 });
    scene.prizeSound = scene.sound.add('prize', { volume: 0.5 });
    scene.startBeepsSound = scene.sound.add('startBeeps', { volume: 0.5 });
    scene.losePointsSound = scene.sound.add('losePoints', { volume: 0.5 });
    scene.gameStartSound = scene.sound.add('gameStart', { volume: 0.5 });
    scene.clickSound = scene.sound.add('click', { volume: 0.5 });
    scene.selectSound = scene.sound.add('select', { volume: 0.5 });

}