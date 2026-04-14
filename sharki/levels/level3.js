const LEVEL_3_ENEMIES = [
    ...Array.from({ length: 7 }, () => ({
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
    ...Array.from({ length: 9 }, () => ({
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
        verticalRange: 165,
        verticalSpeed: 1.35
    })),
    ...Array.from({ length: 11 }, () => ({
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
        verticalRange: 160,
        verticalSpeed: 1.7
    })),
    ...Array.from({ length: 21 }, () => ({
        variant: 'transition3',
        spawnAllLanes: true,
        minSpeed: 0.2,
        maxSpeed: 0.7
    }))
];

/**
 * Creates the third level with the strongest boss and densest enemy spread.
 * It uses buildLevel so only level-three balancing values stay in this file.
 */
function createLevel3() {
    return buildLevel(LEVEL_3_ENEMIES, getLevel3BossConfig(), 'L', 11, 20);
}

/**
 * Returns the boss settings used by the third level factory.
 * It keeps createLevel3 within the size rule and groups boss tuning in one place.
 */
function getLevel3BossConfig() {
    return {
        energy: 200,
        x: 819 * 11 + 120,
        speed: 0.5,
        movementSpeed: 5.0,
        verticalMovementSpeed: 3.3,
        introFrameDuration: 100,
        introWaitTime: 1800,
        moveWhileHurt: true
    };
}

const level3 = createLevel3();
