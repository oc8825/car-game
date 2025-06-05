import { restartLevel } from './levelSceneHandlers';
import { emit, confetti, explosion } from './animationHandlers'

export function handleObstacleCollision(scene, car, obstacle) {
    const obstacleKey = obstacle.texture.key;

    switch (obstacleKey) {
        case 'oil1':
        case 'oil2':
        case 'oil3':
            scene.isSlipping = true;
            scene.slipTime = 0;
            scene.score -= 5;
            if (scene.score < 0) {
                scene.score = 0;
            }
            scene.losePointsSound.play();
            emit(scene, 'minusFive', obstacle.x, obstacle.y);
            break;
        case 'cone':
            scene.isSlipping = true;
            scene.slipTime = 0;
            scene.losePointsSound.play();
            scene.score -= 5;
            if (scene.score < 0) {
                scene.score = 0;
            }
            emit(scene, 'minusFive', obstacle.x, obstacle.y);
            break;
        case 'block1':
        case 'block2':
        case 'block3':
        case 'tire':
        case 'spikes':
            restartLevel(scene);
            scene.crashSound.play();
            scene.gameOverSound.play();
            explosion(scene, obstacle.x, obstacle.y);
            break;
        default:
            restartLevel(scene);
            break;
    }

    obstacle.destroy();
}

export function handleItemCollision(scene, car, item) {
    const itemKey = item.texture.key;

    switch (itemKey) {
        case 'hat':
            scene.score += 1;
            scene.collectSound.play();
            emit(scene, 'plusOne', item.x, item.y);
            confetti(scene, item.x, item.y);
            break;
        case 'socks':
            scene.score += 2;
            scene.collectSound.play();
            emit(scene, 'plusTwo', item.x, item.y);
            confetti(scene, item.x, item.y);
            break;
        case 'shirt':
            scene.score += 3;
            scene.collectSound.play();
            emit(scene, 'plusThree', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
        case 'foamFinger':
            scene.score += 4;
            scene.collectSound.play();
            emit(scene, 'plusFour', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
        case 'waterBottle':
            scene.score += 5;
            scene.collectSound.play();
            emit(scene, 'plusFive', item.x, item.y);
            confetti(scene, item.x, item.y);

            break;
    }

    item.destroy();
}

