const COIN_START_X = 350;
const BOSS_TRIGGER_X = 819 * 11 - 60;
const COIN_END_X = BOSS_TRIGGER_X - 180;
const POISON_BUBBLE_START_X = 500;
const POISON_BUBBLE_END_X = 819 * 11 - 120;
const ENEMY_START_X = 450;
const ENEMY_END_X = BOSS_TRIGGER_X - 140;
const ENEMY_MIN_DISTANCE = 220;
const LEVEL_1_ENEMIES = [
    ...Array.from({ length: 11 }, () => ({ variant: 'default', spawnAllLanes: true })),
    ...Array.from({ length: 9 }, () => ({ variant: 'transition2', spawnAllLanes: true })),
    ...Array.from({ length: 5 }, () => ({
        variant: 'jelly_lila',
        y: 180,
        width: 110,
        height: 110,
        hitboxOffsetX: 18,
        hitboxOffsetY: 16,
        hitboxWidth: 70,
        hitboxHeight: 78,
        minSpeed: 0.15,
        maxSpeed: 0.65,
        movementPattern: 'vertical',
        verticalRange: 150,
        verticalSpeed: 1
    }))
];

/**
 * Creates the first level with its standard boss and collectible setup.
 * It delegates common assembly to buildLevel so only level-specific data stays here.
 */
function createLevel1() {
    return buildLevel(LEVEL_1_ENEMIES, getLevel1BossConfig(), 'D', 7);
}

/**
 * Returns the boss settings used by the first level factory.
 * It keeps createLevel1 short and mirrors the later level config helpers.
 */
function getLevel1BossConfig() {
    return { energy: 100, x: 819 * 11 + 120 };
}

const level1 = createLevel1();
