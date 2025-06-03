export function spawnSpecificObstacle(scene, type, obstacles, xPosition, level) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const obstacle = obstacles.create(xPosition, 300, type);
    obstacle.setScale(0.34);
    obstacle.setDepth(45);

    // set base velocity depending on level
    let velocityY = 500;
    if (level === 2) {
        velocityY = 650;
    } else if (level === 3) {
        velocityY = 800;
    }


    switch (type) {
        case 'oil1':
        case 'oil2':
        case 'oil3':
            obstacle.setVelocityY(velocityY);
            break;
        case 'cone':
            obstacle.setVelocityY(velocityY);
            break;
        case 'block1':
        case 'block2':
        case 'block3':
            obstacle.setVelocityY(velocityY);
            break;
        case 'tire':
            obstacle.setVelocityY(velocityY + 250);
            obstacle.rotationSpeed = 0.07;
            break;
        case 'spikes':
            obstacle.setVelocityY(velocityY);
            break;

    }
}

export function spawnSpecificItem(scene, type, items, xPosition, level) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const item = items.create(xPosition, 300, type);
    item.setScale(0.34);
    item.setDepth(45);

    // set base velocity depending on level
    let velocityY = 500;
    if (level === 2) {
        velocityY = 650;
    } else if (level === 3) {
        velocityY = 800;
    }

    switch (type) {
        case 'hat':
            item.setVelocityY(velocityY);
            break;
        case 'socks':
            item.setVelocityY(velocityY);
            break;
        case 'shirt':
            item.setVelocityY(velocityY);
            break;
        case 'foamFinger':
            item.setVelocityY(velocityY + 100);
            item.rotationSpeed = 0.01;
            break;
        case 'waterBottle':
            item.setVelocityY(velocityY + 200);
    }
}
