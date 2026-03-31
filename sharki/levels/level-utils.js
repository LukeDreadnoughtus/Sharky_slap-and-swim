function createCollectables(CollectableClass, amount, minDistance, startX, endX, y) {
    let collectables = [];
    let range = endX - startX;
    let maxAmount = Math.floor(range / minDistance) + 1;
    let collectableAmount = Math.min(amount, maxAmount);
    let freeSpace = Math.max(0, range - (collectableAmount - 1) * minDistance);
    let currentX = startX;

    for (let i = 0; i < collectableAmount; i++) {
        let remainingCollectables = collectableAmount - i - 1;
        let maxRandomOffset = freeSpace - remainingCollectables;
        let randomOffset = maxRandomOffset > 0 ? Math.random() * maxRandomOffset : 0;

        currentX += randomOffset;
        collectables.push(new CollectableClass(currentX, y));

        currentX += minDistance;
        freeSpace -= randomOffset;
    }

    return collectables;
}

function createCoins(amount, minDistance, startX, endX, y) {
    return createCollectables(Coin, amount, minDistance, startX, endX, y);
}

function createPoisonBubbles(amount, minDistance, startX, endX, y) {
    let positions = createCollectables(PoisonBubble, amount, minDistance, startX, endX, y);

    return positions.map((bubble) => {
        let imagePath = Math.random() < 0.5
            ? PoisonBubble.IMAGE_LEFT
            : PoisonBubble.IMAGE_RIGHT;

        return new PoisonBubble(bubble.x, bubble.y, imagePath);
    });
}

function createEnemies(enemyConfigs, minDistance, startX, endX) {
    let enemies = [];
    let range = endX - startX;
    let maxAmount = Math.floor(range / minDistance) + 1;
    let enemyAmount = Math.min(enemyConfigs.length, maxAmount);
    let freeSpace = Math.max(0, range - (enemyAmount - 1) * minDistance);
    let currentX = startX;
    let shuffledConfigs = [...enemyConfigs].sort(() => Math.random() - 0.5);

    for (let i = 0; i < enemyAmount; i++) {
        let remainingEnemies = enemyAmount - i - 1;
        let maxRandomOffset = freeSpace - remainingEnemies;
        let randomOffset = maxRandomOffset > 0 ? Math.random() * maxRandomOffset : 0;
        let config = shuffledConfigs[i];
        let minSpeed = config.minSpeed ?? 0.15;
        let maxSpeed = config.maxSpeed ?? 0.65;

        currentX += randomOffset;
        enemies.push(new Shark({
            ...config,
            x: currentX,
            speed: config.speed ?? (minSpeed + Math.random() * Math.max(0, maxSpeed - minSpeed))
        }));

        currentX += minDistance;
        freeSpace -= randomOffset;
    }

    return enemies;
}

function createBackgroundObjects(themePrefix = 'D', segmentCount = 12, segmentWidth = 819) {
    const layers = [
        '5. Water',
        '4.Fondo 2',
        '3.Fondo 1',
        '2. Floor'
    ];
    const backgroundObjects = [];

    for (let i = -1; i < segmentCount; i++) {
        const imageIndex = (i + 1) % 2 === 0 ? 2 : 1;
        const x = i * segmentWidth;

        layers.forEach((layer) => {
            backgroundObjects.push(
                new BackgroundObject(`sharki/img/3. Background/Layers/${layer}/${themePrefix}${imageIndex}.png`, x)
            );
        });
    }

    return backgroundObjects;
}
