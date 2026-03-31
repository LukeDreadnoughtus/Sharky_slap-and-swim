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

        currentX += randomOffset;
        enemies.push(new Shark({
            ...shuffledConfigs[i],
            x: currentX,
            speed: 0.15 + Math.random() * 0.5
        }));

        currentX += minDistance;
        freeSpace -= randomOffset;
    }

    return enemies;
}

const COIN_START_X = 350;
const BOSS_TRIGGER_X = 819 * 11 - 60;
const COIN_END_X = BOSS_TRIGGER_X - 180;
const POISON_BUBBLE_START_X = 500;
const POISON_BUBBLE_END_X = 819 * 11 - 120;
const ENEMY_START_X = 450;
const ENEMY_END_X = BOSS_TRIGGER_X - 140;
const ENEMY_MIN_DISTANCE = 220;
const LEVEL_1_ENEMIES = [
    ...Array.from({ length: 7 }, () => ({ variant: 'default' })),
    ...Array.from({ length: 3 }, () => ({ variant: 'transition2' }))
];

const level1 = new Level([
    ...createEnemies(LEVEL_1_ENEMIES, ENEMY_MIN_DISTANCE, ENEMY_START_X, ENEMY_END_X),
    new Endboss({ energy: 100, x: 819 * 11 + 120 })
],
[
    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', -819),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', -819),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', -819),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', -819),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 0),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 0),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 0),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 0),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 819 * 2),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 819 *2),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 819 * 2),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 819 *2 ),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819*3),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819*3),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819*3),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819*3),

        new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 819*4),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 819*4),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 819*4),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 819*4),

        new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819*5),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819*5),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819*5),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819*5),

        new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 819*6),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 819*6),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 819*6),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 819*6),

        new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819*7),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819*7),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819*7),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819*7),

        new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 819*8),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 819*8),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 819*8),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 819*8),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819*9),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819*9),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819*9),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819*9),

    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D1.png', 819*10),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D1.png', 819*10),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D1.png', 819*10),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D1.png', 819*10),
    
    new BackgroundObject('sharki/img/3. Background/Layers/5. Water/D2.png', 819*11),
    new BackgroundObject('sharki/img/3. Background/Layers/4.Fondo 2/D2.png', 819*11),
    new BackgroundObject('sharki/img/3. Background/Layers/3.Fondo 1/D2.png', 819*11),
    new BackgroundObject('sharki/img/3. Background/Layers/2. Floor/D2.png', 819*11)
] ,
createCoins(14, 260, COIN_START_X, COIN_END_X, 340),
[
    new BossTrigger(BOSS_TRIGGER_X, 110, 300)
],
createPoisonBubbles(7, 220, POISON_BUBBLE_START_X, POISON_BUBBLE_END_X, 330)
);


level1.level_end_x = 819 * 12;
