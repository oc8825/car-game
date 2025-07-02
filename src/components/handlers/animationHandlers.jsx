// points update when hit collectible animation
export function emit(scene, texture, x, y) {
    if (!scene.emitter) return;
    scene.emitter.setTexture(texture);
    scene.emitter.emitParticleAt(x, y);
}

// confetti animation
export function confetti(scene, x, y) {
    scene.anims.create({
        key: 'confetti',
        frames: [
            { key: 'confetti1' },
            { key: 'confetti2' },
            { key: 'confetti3' },
            { key: 'confetti4' },
            { key: 'confetti5' },
            { key: 'confetti6' },
            { key: 'confetti7' },
            { key: 'confetti8' },
            { key: 'confetti9' },
            { key: 'confetti10' },
            { key: 'confetti11' },
            { key: 'confetti12' },
            { key: 'confetti13' },
            { key: 'confetti14' },
            { key: 'confetti15' },
            { key: 'confetti16' },
            { key: 'confetti17' },
            { key: 'confetti18' },
            { key: 'confetti19' },
            { key: 'confetti20' },
            { key: 'confetti21' },
            { key: 'confetti22' },
            { key: 'confetti23' },
            { key: 'confetti24' },
            { key: 'confetti25' },
            { key: 'confetti26' },
            { key: 'confetti27' },
            { key: 'confetti28' },
            { key: 'confetti29' },
            { key: 'confetti30' },
            { key: 'confetti31' },
            { key: 'confetti32' },
            { key: 'confetti33' },
            { key: 'confetti34' },
            { key: 'confetti35' },
            { key: 'confetti36' },
            { key: 'confetti37' },
            { key: 'confetti38' },
            { key: 'confetti39' },
            { key: 'confetti40' },
        ],
        frameRate: 40,
        hideOnComplete: true,
    });

    const confettiSprite = scene.add.sprite(x, y, 'confetti1');
    confettiSprite.setScale(1.5);
    confettiSprite.play('confetti');

}

// explosion animation
export function explosion(scene, x, y) {
    scene.anims.create({
        key: 'explosion',
        frames: [
            { key: 'explosion1' },
            { key: 'explosion2' },
            { key: 'explosion3' },
            { key: 'explosion4' },
            { key: 'explosion5' },
            { key: 'explosion6' },
            { key: 'explosion7' },
            { key: 'explosion8' },
            { key: 'explosion9' },
            { key: 'explosion10' },
            { key: 'explosion11' },

        ],
        frameRate: 40,
        hideOnComplete: true,
    });

    const explosionSprite = scene.add.sprite(x, y, 'explosion1');
    explosionSprite.setScale(1.5);
    explosionSprite.play('explosion');
}

// manually rotate car as using sprite from scene rather than creating new one
export function slip(scene) {
    if (scene.isSlipping) {
        scene.slipTime += scene.game.loop.delta;
        const wiggleAngle = Math.sin(scene.slipTime * 0.01) * 20;
        scene.car.setAngle(wiggleAngle);

        if (scene.slipTime > scene.slipDuration) {
            scene.isSlipping = false;
            scene.car.setAngle(0);
        }
    }
}

