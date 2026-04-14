const LEVEL_2_ENEMIES = [
    ...Array.from({ length: 9 }, () => ({ variant: 'transition2', spawnAllLanes: true })),
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
    ...Array.from({ length: 6 }, () => ({
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
 * Creates the second level with a faster boss and updated enemy mix.
 * It uses buildLevel so the file only contains data that is unique to level two.
 */
function createLevel2() {
    return buildLevel(LEVEL_2_ENEMIES, getLevel2BossConfig(), 'L', 9, 10);
}

/**
 * Returns the boss settings used by the second level factory.
 * It separates tuning values from createLevel2 and mirrors the other level files.
 */
function getLevel2BossConfig() {
    return {
        energy: 150,
        x: 819 * 11 + 120,
        speed: 0.5,
        movementSpeed: 3.5,
        introFrameDuration: 100,
        introWaitTime: 1800,
        moveWhileHurt: true
    };
}

const level2 = createLevel2();
