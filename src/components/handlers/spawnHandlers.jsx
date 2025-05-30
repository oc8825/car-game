export function spawnSpecificObstacle(scene, type, obstacles) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const xPositions = [scene.scale.width / 6, scene.scale.width / 2, scene.scale.width * 5 / 6];
    const randomX = Phaser.Math.RND.pick(xPositions);

    const obstacle = obstacles.create(randomX, 300, type);
    obstacle.setScale(0.34);


    switch (type) {
        case 'oil1':
        case 'oil2':
        case 'oil3':
            obstacle.setVelocityY(500);
            break;
        case 'cone':
            obstacle.setVelocityY(500);
            break;
        case 'block1':
        case 'block2':
        case 'block3':
            obstacle.setVelocityY(500);
            break;
        case 'tire':
            obstacle.setVelocityY(800);
            obstacle.rotationSpeed = 0.07;
            break;
        case 'spikes':
            obstacle.setVelocityY(500);
            break;

    }
}

export function spawnSpecificItem(scene, type, items) {
    if (scene.levelCompleted) return;
    if (scene.isRestarting) return;

    const xPositions = [scene.scale.width / 6, scene.scale.width / 2, scene.scale.width * 5 / 6];
    const randomX = Phaser.Math.RND.pick(xPositions);

    const item = items.create(randomX, 300, type);
    item.setScale(0.35);

    switch (type) {
        case 'hat':
            item.setVelocityY(500);
            break;
        case 'socks':
            item.setVelocityY(500);
            break;
        case 'shirt':
            item.setVelocityY(500);
            break;
        case 'foamFinger':
            item.setVelocityY(500);
            item.rotationSpeed = 0.01;
            break;
        case 'waterBottle':
            item.setVelocityY(500);
    }
}
