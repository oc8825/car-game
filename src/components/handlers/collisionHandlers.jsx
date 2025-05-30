import { restartLevel } from './levelSceneHandlers';
import { emit, confetti, explosion } from './animationHandlers'

export function handleObstacleCollision(scene, car, obstacle) {
    car.body.setVelocity(0, 0);
    car.body.setBounce(0);
    car.body.setFriction(0);

    const obstacleKey = obstacle.texture.key;

    switch (obstacleKey) {
        case 'oil1':
        case 'oil2':
        case 'oil3':
            restartLevel(scene);
            scene.oilSlipSound.play();
            scene.gameOverSound.play();
            break;
        case 'cone':
        case 'block1':
        case 'block2':
        case 'block3':
            restartLevel(scene);
            scene.crashSound.play();
            scene.gameOverSound.play();
            explosion(scene, obstacle.x, obstacle.y);
            break;
        case 'tire':
        case 'spikes':
            scene.score -= 5;
            scene.losePointsSound.play();
            emit(scene, 'minusFive', obstacle.x, obstacle.y);
            explosion(scene, obstacle.x, obstacle.y);
            break;
        default:
            restartLevel(scene);
            break;
    }

    obstacle.destroy(); 
}

export function handleItemCollision(scene, car, item) {
    car.body.setVelocity(0, 0);
    car.body.setBounce(0);
    car.body.setFriction(0);

    const itemKey = item.texture.key;

    
    switch (itemKey) {
        case 'hat':
            scene.slot1.style.backgroundImage = `url(/src/assets/images/hat.png)`;
            scene.score += 1;
            scene.collectSound.play();
            emit(scene, 'plusOne', item.x, item.y);
            confetti(scene, item.x, item.y);
            break;
        case 'socks':
            scene.slot2.style.backgroundImage = `url(/src/assets/images/socks.png)`;
            scene.score += 2;
            scene.collectSound.play();
            emit(scene, 'plusTwo', item.x, item.y);
            confetti(scene, item.x, item.y);
            break;
        case 'shirt':
            scene.slot3.style.backgroundImage = `url(/src/assets/images/shirt.png)`;
            scene.score += 3;
            scene.collectSound.play();
            emit(scene, 'plusThree', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
        case 'foamFinger':
            scene.slot4.style.backgroundImage = `url(/src/assets/images/foamFinger.png)`;
            scene.score += 4;
            scene.collectSound.play();
            emit(scene, 'plusFour', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
        case 'waterBottle':
            scene.slot5.style.backgroundImage = `url(/src/assets/images/waterBottle.png)`;
            scene.score += 5;
            scene.collectSound.play();
            emit(scene, 'plusFive', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
    }

    item.destroy();
}

