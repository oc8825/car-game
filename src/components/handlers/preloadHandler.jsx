export function preloadAssets(scene) {
   // preload sound effects
   scene.load.audio('crash', 'assets/audio/crash.mp3');
   scene.load.audio('collect', 'assets/audio/collect.mp3');
   scene.load.audio('gameOver', 'assets/audio/gameOver.mp3');
   scene.load.audio('newLevel', 'assets/audio/newLevel.mp3');
   scene.load.audio('losePoints', 'assets/audio/losePoints.mp3');
   scene.load.audio('prize', 'assets/audio/prize.mp3');
   scene.load.audio('winLevel', 'assets/audio/winLevel.wav');
   scene.load.audio('gameStart', 'assets/audio/gameStart.mp3');
   scene.load.audio('wrong', 'assets/audio/wrong.mp3');
   scene.load.audio('skid', 'assets/audio/skid.mp3');
   scene.load.audio('horn', 'assets/audio/horn.mp3');
   scene.load.audio('click', 'assets/audio/click.mp3');
   scene.load.audio('wheelSpin', 'assets/audio/wheelSpin.mp3');
   scene.load.audio('youLost', 'assets/audio/youLost.mp3');

   // preload image assets
   scene.load.image('finishLine', 'assets/images/finishLine.png');
   scene.load.image('ground', 'assets/images/background.png');
   scene.load.image('oil1', 'assets/images/oil1.png');
   scene.load.image('oil2', 'assets/images/oil2.png');
   scene.load.image('oil3', 'assets/images/oil3.png');
   scene.load.image('block1', 'assets/images/block1.png');
   scene.load.image('block2', 'assets/images/block2.png');
   scene.load.image('block3', 'assets/images/block3.png');
   scene.load.image('hat', 'assets/images/hat.png');
   scene.load.image('socks', 'assets/images/socks.png');
   scene.load.image('shirt', 'assets/images/shirt.png');
   scene.load.image('foamFinger', 'assets/images/foamFinger.png');
   scene.load.image('cone', 'assets/images/cone.png');
   scene.load.image('spikes', 'assets/images/spikes.png');
   scene.load.image('tire', 'assets/images/tire.png');
   scene.load.image('waterBottle', 'assets/images/waterBottle.png');
   scene.load.image('prizeButton', 'assets/images/prizeButton.png');
   scene.load.image('mobileInstructions', 'assets/images/mobileInstructions.png');
   scene.load.image('desktopInstructions', 'assets/images/desktopInstructions.png');
   scene.load.audio('gameStart', 'assets/audio/gameStart.mp3');
   scene.load.image('scoreboard', 'assets/images/scoreboard.png');
   scene.load.image('restartButton', 'assets/images/restartButton.png');
   scene.load.image('startBackground', 'assets/images/startBackground.png');
   scene.load.image('tempBackground', 'assets/images/tempBackground.png');
   scene.load.image('playButton', 'assets/images/playButton.png');
   scene.load.image('rightArrow', 'assets/images/rightArrow.png');
   scene.load.image('leftArrow', 'assets/images/leftArrow.png');
   scene.load.image('lamboWin', 'assets/images/lamboWin.png');
   scene.load.image('chooseCarButton', 'assets/images/chooseCarButton.png');
   scene.load.image('chooseCarBackground', 'assets/images/chooseCarBackground.png');
   scene.load.image('carBlue', 'assets/images/carBlue.png');
   scene.load.image('carOrange', 'assets/images/carOrange.png');
   scene.load.image('carPurple', 'assets/images/carPurple.png');
   scene.load.image('carGreen', 'assets/images/carGreen.png');
   scene.load.image('carRed', 'assets/images/carRed.png');
   scene.load.image('carYellow', 'assets/images/carYellow.png');
   scene.load.image('0Win', 'assets/images/0Win.png');
   scene.load.image('100Win', 'assets/images/100Win.png');
   scene.load.image('143Win', 'assets/images/143Win.png');
   scene.load.image('150Win', 'assets/images/150Win.png');
   scene.load.image('200Win', 'assets/images/200Win.png');
   scene.load.image('250Win', 'assets/images/250Win.png');
   scene.load.image('vaidhyWin', 'assets/images/vaidhyWin.png');
   scene.load.image('plusOne', 'assets/animations/collecting/plusOne.png');
   scene.load.image('plusTwo', 'assets/animations/collecting/plusTwo.png');
   scene.load.image('plusThree', 'assets/animations/collecting/plusThree.png');
   scene.load.image('plusFour', 'assets/animations/collecting/plusFour.png');
   scene.load.image('plusFive', 'assets/animations/collecting/plusFive.png');
   scene.load.image('minusFive', 'assets/animations/collecting/minusFive.png');
   scene.load.image('jimmyWin', 'assets/images/jimmyWin.png');
   scene.load.image('caliWin', 'assets/images/caliWin.png');
   scene.load.image('jessWin', 'assets/images/jessWin.png');
   scene.load.image('thomasWin', 'assets/images/thomasWin.png');
   scene.load.image('brandonWin', 'assets/images/brandonWin.png');
   scene.load.image('gautamWin', 'assets/images/gautamWin.png');
   scene.load.image('prizeWheelBackground', 'assets/images/prizeWheelBackground.png');
   scene.load.image('pin', 'assets/images/pin.png');
   scene.load.image('spinButton', 'assets/images/spinButton.png');
   scene.load.image('wheel', 'assets/images/prizeWheel.png');
   scene.load.image('wheelBackdrop', 'assets/images/wheelBackdrop.png');
   scene.load.image('EOWin', 'assets/images/EOWin.png');
   scene.load.image('steeringWheel', 'assets/images/steeringWheel.png');
   scene.load.image('startButton', 'assets/images/startButton.png');
   scene.load.image('mobileChallengeInstructions', 'assets/images/mobileChallengeInstructions.png');
   scene.load.image('desktopChallengeInstructions', 'assets/images/desktopChallengeInstructions.png');
   scene.load.image('playAgain', 'assets/images/playAgain.png');
   scene.load.image('challengeBackground', 'assets/images/challengeBackground.png');
   scene.load.image('pauseButton', 'assets/images/pauseButton.png');
   scene.load.image('resumeButton', 'assets/images/resumeButton.png');

   // preload all frames for animations
   for (let i = 1; i <= 40; i++) {
      scene.load.image(`confetti${i}`, `assets/animations/confetti/confetti (${i}).png`);
   }
   for (let i = 1; i <= 11; i++) {
      scene.load.image(`explosion${i}`, `assets/animations/explosion/explosion (${i}).png`);
   }
}