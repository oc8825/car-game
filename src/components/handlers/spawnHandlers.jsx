export function spawnSpecificObstacle(scene, type, obstacles, xPosition, level, speedFactor) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const obstacle = obstacles.create(xPosition, 300, type);
    obstacle.setScale(0.35);
    obstacle.setDepth(45);

    // set base velocity depending on level
    let velocityY = 500 * speedFactor;
    if (level === 2) {
        velocityY = 650 * speedFactor;
    } else if (level === 3) {
        velocityY = 800 * speedFactor;
    }

    // all obstacles move same speed as background, except tire moves
    // toward player
    switch (type) {
        case 'oil1':
        case 'oil2':
        case 'oil3':
        case 'cone':
        case 'block1':
        case 'block2':
        case 'block3':
        case 'spikes':
            obstacle.setVelocityY(velocityY);
            break;
        case 'tire':
            obstacle.setVelocityY(velocityY + 250);
            obstacle.rotationSpeed = 0.07;
            break;
    }
}

export function spawnSpecificItem(scene, type, items, xPosition, level, speedFactor) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const item = items.create(xPosition, 300, type);
    item.setScale(0.35);
    item.setDepth(45);

    // set base velocity depending on level
    let velocityY = 500 * speedFactor;
    if (level === 2) {
        velocityY = 650 * speedFactor;
    } else if (level === 3) {
        velocityY = 800 * speedFactor;
    }

    // all items move same speed as background, except foam finger and
    // water bottle move towards player
    switch (type) {
        case 'hat':
        case 'socks':
        case 'shirt':
            item.setVelocityY(velocityY);
            break;
        case 'foamFinger':
            item.setVelocityY(velocityY + 100);
            break;
        case 'waterBottle':
            item.setVelocityY(velocityY + 200);
    }
}
