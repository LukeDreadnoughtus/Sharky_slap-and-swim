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

function createLevel1() {
    const level = new Level([
        ...createEnemies(LEVEL_1_ENEMIES, ENEMY_MIN_DISTANCE, ENEMY_START_X, ENEMY_END_X),
        new Endboss({ energy: 100, x: 819 * 11 + 120 })
    ],
    createBackgroundObjects('D'),
    createCoins(14, 260, COIN_START_X, COIN_END_X, 340),
    [
        new BossTrigger(BOSS_TRIGGER_X, 110, 300)
    ],
    createPoisonBubbles(7, 220, POISON_BUBBLE_START_X, POISON_BUBBLE_END_X, 330)
    );

    level.level_end_x = 819 * 12;
    level.character_max_x = 819 * 11;
    return level;
}

const level1 = createLevel1();
