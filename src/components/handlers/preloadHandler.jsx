export function preloadAssets(scene) {
   const format = (path) => import.meta.env.BASE_URL + path;

   scene.load.audio('crash', format('src/assets/audio/crash.mp3'));
   scene.load.audio('collect', format('src/assets/audio/collect.mp3'));
   scene.load.audio('gameOver', format('src/assets/audio/gameOver.mp3'));
   scene.load.audio('levelUp', format('src/assets/audio/levelUp.mp3'));
   scene.load.audio('losePoints', format('src/assets/audio/losePoints.mp3'));
   scene.load.audio('oilSlip', format('src/assets/audio/oilSlip.mp3'));
   scene.load.audio('prize', format('src/assets/audio/prize.mp3'));
   scene.load.audio('startBeeps', format('src/assets/audio/startBeeps.mp3'));
   scene.load.audio('winGame', format('src/assets/audio/winGame.wav'));
   scene.load.audio('gameStart', format('src/assets/audio/gameStart.mp3'));
   scene.load.audio('select', format('src/assets/audio/selectCar.mp3'));
   scene.load.audio('wrong', format('src/assets/audio/wrong.mp3'));
   scene.load.audio('skid', format('src/assets/audio/skid.mp3'));
   scene.load.audio('horn', format('src/assets/audio/horn.mp3'));
   scene.load.audio('click', format('src/assets/audio/click.mp3'));
   scene.load.image('finishLine', format('src/assets/images/finishLine.png'));
   scene.load.audio('wheelSpin', format('src/assets/audio/wheelSpin.mp3'));
   scene.load.audio('youLost', format('src/assets/audio/youLost.mp3'));
   scene.load.image('ground', format('src/assets/images/background.png'));
   scene.load.image('oil1', format('src/assets/images/oil1.png'));
   scene.load.image('oil2', format('src/assets/images/oil2.png'));
   scene.load.image('oil3', format('src/assets/images/oil3.png'));
   scene.load.image('block1', format('src/assets/images/block1.png'));
   scene.load.image('block2', format('src/assets/images/block2.png'));
   scene.load.image('block3', format('src/assets/images/block3.png'));
   scene.load.image('hat', format('src/assets/images/hat.png'));
   scene.load.image('socks', format('src/assets/images/socks.png'));
   scene.load.image('shirt', format('src/assets/images/shirt.png'));
   scene.load.image('foamFinger', format('src/assets/images/foamFinger.png'));
   scene.load.image('cone', format('src/assets/images/cone.png'));
   scene.load.image('spikes', format('src/assets/images/spikes.png'));
   scene.load.image('tire', format('src/assets/images/tire.png'));
   scene.load.image('waterBottle', format('src/assets/images/waterBottle.png'));
   scene.load.image('prizeButton', format('src/assets/images/prizeButton.png'))
   scene.load.image('mobileInstructions', format('src/assets/images/mobileInstructions.png'));
   scene.load.image('desktopInstructions', format('src/assets/images/desktopInstructions.png'));
   scene.load.audio('gameStart', format('src/assets/audio/gameStart.mp3'));
   scene.load.image('scoreboard', format('src/assets/images/scoreboard.png'));
   scene.load.image('restartButton', format('src/assets/images/restartButton.png'));
   scene.load.image('startBackground', format('src/assets/images/startBackground.png'));
   scene.load.image('playButton', format('src/assets/images/playButton.png'));
   scene.load.image('rightArrow', format('src/assets/images/rightArrow.png'));
   scene.load.image('leftArrow', format('src/assets/images/leftArrow.png'));
   scene.load.image('lamboWin', format('src/assets/images/lamboWin.png'));
   scene.load.image('chooseCarButton', format('src/assets/images/chooseCarButton.png'));
   scene.load.image('chooseCarBackground', format('src/assets/images/chooseCarBackground.png'));
   scene.load.image('carBlue', format('src/assets/images/carBlue.png'));
   scene.load.image('carOrange', format('src/assets/images/carOrange.png'));
   scene.load.image('carPurple', format('src/assets/images/carPurple.png'));
   scene.load.image('carGreen', format('src/assets/images/carGreen.png'));
   scene.load.image('carRed', format('src/assets/images/carRed.png'));
   scene.load.image('carYellow', format('src/assets/images/carYellow.png'));
   scene.load.image('0Win', format('src/assets/images/0Win.png'));
   scene.load.image('100Win', format('src/assets/images/100Win.png'));
   scene.load.image('150Win', format('src/assets/images/150Win.png'));
   scene.load.image('200Win', format('src/assets/images/200Win.png'));
   scene.load.image('250Win', format('src/assets/images/250Win.png'));
   scene.load.image('vaidhyWin', format('src/assets/images/vaidhyWin.png'));
   scene.load.image('plusOne', format('src/assets/animations/collecting/plusOne.png'));
   scene.load.image('plusTwo', format('src/assets/animations/collecting/plusTwo.png'));
   scene.load.image('plusThree', format('src/assets/animations/collecting/plusThree.png'));
   scene.load.image('plusFour', format('src/assets/animations/collecting/plusFour.png'));
   scene.load.image('plusFive', format('src/assets/animations/collecting/plusFive.png'));
   scene.load.image('minusFive', format('src/assets/animations/collecting/minusFive.png'));
   scene.load.image('jimmyWin', format('src/assets/images/jimmyWin.png'));
   scene.load.image('caliWin', format('src/assets/images/caliWin.png'));
   scene.load.image('jessWin', format('src/assets/images/jessWin.png'));
   scene.load.image('thomasWin', format('src/assets/images/thomasWin.png'));
   scene.load.image('brandonWin', format('src/assets/images/brandonWin.png'));
   scene.load.image('gautamWin', format('src/assets/images/gautamWin.png'));
   scene.load.image('prizeWheelBackground', format('src/assets/images/prizeWheelBackground.png'));
   scene.load.image('pin', format('src/assets/images/pin.png'));
   scene.load.image('spinButton', format('src/assets/images/spinButton.png'));
   scene.load.image('wheel', format('src/assets/images/prizeWheel.png'));
   scene.load.image('wheelBackdrop', format('src/assets/images/wheelBackdrop.png'));
   scene.load.image('EOWin', format('src/assets/images/EOWin.png'));
   scene.load.image('steeringWheel', format('src/assets/images/steeringWheel.png'));
   scene.load.image('startButton', format('src/assets/images/startButton.png'));
   scene.load.image('mobileChallengeInstructions', format('src/assets/images/mobileChallengeInstructions.png'));
   scene.load.image('desktopChallengeInstructions', format('src/assets/images/desktopChallengeInstructions.png'));
   scene.load.image('playAgain', format('src/assets/images/playAgain.png'));
   scene.load.image('challengeBackground', format('src/assets/images/challengeBackground.png'));

   for (let i = 1; i <= 40; i++) {
      scene.load.image(`confetti${i}`, format(`src/assets/animations/confetti/confetti (${i}).png`));
   }

   for (let i = 1; i <= 11; i++) {
      scene.load.image(`explosion${i}`, format(`src/assets/animations/explosion/explosion (${i}).png`));
   }
}