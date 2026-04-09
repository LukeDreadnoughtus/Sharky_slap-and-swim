const LEVEL_3_ENEMIES = [
    ...Array.from({ length: 3 }, () => ({
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
    })),
    ...Array.from({ length: 5 }, () => ({
        variant: 'jelly_green',
        y: 255,
        width: 115,
        height: 115,
        hitboxOffsetX: 18,
        hitboxOffsetY: 16,
        hitboxWidth: 72,
        hitboxHeight: 80,
        minSpeed: 0.15,
        maxSpeed: 0.65,
        movementPattern: 'vertical',
        verticalRange: 130,
        verticalSpeed: 1.35
    })),
    ...Array.from({ length: 7 }, () => ({
        variant: 'jelly_pink',
        y: 250,
        width: 120,
        height: 120,
        hitboxOffsetX: 18,
        hitboxOffsetY: 16,
        hitboxWidth: 76,
        hitboxHeight: 84,
        minSpeed: 0.15,
        maxSpeed: 0.65,
        damage: 8,
        movementPattern: 'vertical',
        verticalRange: 145,
        verticalSpeed: 1.7
    })),
    ...Array.from({ length: 7 }, () => ({
        variant: 'transition3',
        minSpeed: 0.2,
        maxSpeed: 0.7
    }))
];

/**
 * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
 * - Gehört zur Levellogik für level3 und setzt Spielfeld-Inhalte zusammen.
 * - Greift dabei auf level zu.
 */

function createLevel3() {
    const level = new Level([
        ...createEnemies(LEVEL_3_ENEMIES, ENEMY_MIN_DISTANCE, ENEMY_START_X, ENEMY_END_X),
        new Endboss({
            energy: 200,
            x: 819 * 11 + 120,
            speed: 0.5,
            movementSpeed: 5.0,
            introFrameDuration: 100,
            introWaitTime: 1800,
            moveWhileHurt: true
        })
    ],
    createBackgroundObjects('L'),
    createCoins(44, 260, COIN_START_X, COIN_END_X, 340),
    [
        new BossTrigger(BOSS_TRIGGER_X, 110, 300)
    ],
    createPoisonBubbles(11, 220, POISON_BUBBLE_START_X, POISON_BUBBLE_END_X, 330)
    );

    level.level_end_x = 819 * 12;
    level.character_max_x = 819 * 11;
    return level;
}

const level3 = createLevel3();
