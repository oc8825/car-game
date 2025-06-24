export const loadSounds = (scene) => {
    // all sounds have been preloaded, now add them to given specific scene
    scene.collectSound = scene.sound.add('collect', { volume: 0.1 });
    scene.crashSound = scene.sound.add('crash', { volume: 0.1 });
    scene.gameOverSound = scene.sound.add('gameOver', { volume: 0.1 });
    scene.newLevelSound = scene.sound.add('newLevel', { volume: 0.1 });
    scene.winLevelSound = scene.sound.add('winLevel', { volume: 0.1 });
    scene.prizeSound = scene.sound.add('prize', { volume: 0.1 });
    scene.losePointsSound = scene.sound.add('losePoints', { volume: 0.1 });
    scene.gameStartSound = scene.sound.add('gameStart', { volume: 0.1 });
    scene.clickSound = scene.sound.add('click', { volume: 0.1 });
    scene.wheelSpinSound = scene.sound.add('wheelSpin', { volume: 0.1 });
    scene.youLostSound = scene.sound.add('youLost', { volume: 0.1 });
    scene.skidSound = scene.sound.add('skid', { volume: 0.1 });
    scene.hornSound = scene.sound.add('horn', { volume: 0.1 });
    scene.wrongSound = scene.sound.add('wrong', { volume: 0.1 });
}