const LEVEL_2_ENEMIES = [
    ...Array.from({ length: 3 }, () => ({ variant: 'transition2', spawnAllLanes: true })),
    ...Array.from({ length: 5 }, () => ({
        variant: 'jelly_lila',
        y: 200,
        width: 110,
        height: 110,
        hitboxOffsetX: 18,
        hitboxOffsetY: 16,
        hitboxWidth: 70,
        hitboxHeight: 78,
        minSpeed: 0.15,
        maxSpeed: 0.65,
        movementPattern: 'vertical',
        verticalRange: 110,
        verticalSpeed: 1
    })),
    ...Array.from({ length: 5 }, () => ({
        variant: 'jelly_yellow',
        y: 300,
        width: 120,
        height: 120,
        hitboxOffsetX: 18,
        hitboxOffsetY: 16,
        hitboxWidth: 78,
        hitboxHeight: 84,
        minSpeed: 0.2,
        maxSpeed: 0.75
    }))
];

/**
 * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
 * - Gehört zur Levellogik für level2 und setzt Spielfeld-Inhalte zusammen.
 * - Greift dabei auf level zu.
 */

function createLevel2() {
    const level = new Level([
        ...createEnemies(LEVEL_2_ENEMIES, ENEMY_MIN_DISTANCE, ENEMY_START_X, ENEMY_END_X),
        new Endboss({
            energy: 150,
            x: 819 * 11 + 120,
            speed: 0.5,
            movementSpeed: 3.5,
            introFrameDuration: 100,
            introWaitTime: 1800,
            moveWhileHurt: true
        })
    ],
    createBackgroundObjects('L'),
    createCoins(25, 260, COIN_START_X, COIN_END_X, 340),
    [
        new BossTrigger(BOSS_TRIGGER_X, 110, 300)
    ],
    createPoisonBubbles(9, 220, POISON_BUBBLE_START_X, POISON_BUBBLE_END_X, 330)
    );

    level.level_end_x = 819 * 12;
    level.character_max_x = 819 * 11;
    return level;
}

const level2 = createLevel2();
