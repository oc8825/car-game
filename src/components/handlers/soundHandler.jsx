export const loadSounds = (scene) => {
    scene.collectSound = scene.sound.add('collect');
    scene.crashSound = scene.sound.add('crash');
    scene.gameOverSound = scene.sound.add('gameOver');
    scene.levelUpSound = scene.sound.add('levelUp');
    scene.oilSlipSound = scene.sound.add('oilSlip');
    scene.winGameSound = scene.sound.add('winGame');
    scene.prizeSound = scene.sound.add('prize');
    scene.startBeepsSound = scene.sound.add('startBeeps');
    scene.losePointsSound = scene.sound.add('losePoints');
    scene.gameStartSound = scene.sound.add('gameStart');
    scene.clickSound = scene.sound.add('click');
    scene.selectSound = scene.sound.add('select');

}