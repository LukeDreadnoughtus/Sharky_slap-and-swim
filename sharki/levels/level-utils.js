const BOTTOM_LANE_Y = 310;
const MIDDLE_LANE_Y = 200;
const TOP_LANE_Y = 90;
const ALL_LANES = [BOTTOM_LANE_Y, MIDDLE_LANE_Y, TOP_LANE_Y];

/**
 * Returns one random lane Y value from the original level layout.
 * It supports collectable and enemy factories with the classic swim heights.
 */
function getRandomLaneY() {
    const index = Math.floor(Math.random() * ALL_LANES.length);
    return ALL_LANES[index];
}

/**
 * Builds the configured number of coin pickups with legacy lane placement.
 * It delegates the spacing logic to createCollectables to keep level files short.
 */
function createCoins(count, minDistance, startX, endX, y) {
    return createCollectables(Coin, count, minDistance, startX, endX, y, true);
}

/**
 * Builds heart pickups with the same lane distribution used by coin spawns.
 * It supports buildLevel so healing items follow the existing pickup flow.
 */
function createHearts(count, minDistance, startX, endX, y) {
    return createCollectables(Heart, count, minDistance, startX, endX, y, true);
}

/**
 * Builds poison bubble pickups and keeps the original random left and right art.
 * It reuses createCollectables before mapping the spawned positions to sprite variants.
 */
function createPoisonBubbles(count, minDistance, startX, endX, y) {
    const pickups = createCollectables(PoisonBubble, count, minDistance, startX, endX, y, true);
    return pickups.map((bubble) => createPoisonPickupVariant(bubble));
}

/**
 * Creates one poison pickup with a random sprite direction at the same position.
 * It supports createPoisonBubbles without mixing spawn and sprite selection work.
 */
function createPoisonPickupVariant(bubble) {
    const imagePath = Math.random() < 0.5 ? PoisonBubble.IMAGE_LEFT : PoisonBubble.IMAGE_RIGHT;
    return new PoisonBubble(bubble.x, bubble.y, imagePath);
}

/**
 * Creates collectables with original free-space distribution and optional lane randomization.
 * It supports coin and poison pickup factories while preserving the old spawn behavior.
 */
function createCollectables(ClassRef, count, minDistance, startX, endX, y, randomizeLane = false) {
    const positions = buildSpawnPositions(count, minDistance, startX, endX);
    return positions.map((x) => new ClassRef(x, getSpawnY(y, randomizeLane)));
}

/**
 * Creates enemy instances with the original spacing, speed, and lane rules.
 * It supports all level factories and keeps refactored files aligned with old gameplay.
 */
function createEnemies(enemyConfigs, minDistance, startX, endX) {
    const configs = shuffleConfigs(enemyConfigs);
    const positions = buildSpawnPositions(configs.length, minDistance, startX, endX);
    return configs.map((config, index) => createEnemyFromConfig(config, positions[index]));
}

/**
 * Builds one enemy from a level config while preserving legacy lane and speed defaults.
 * It supports createEnemies so config mapping stays separate from spacing calculations.
 */
function createEnemyFromConfig(config, x) {
    const spawnY = config.spawnAllLanes ? getRandomLaneY() : (config.y ?? BOTTOM_LANE_Y);
    const speed = config.speed ?? getEnemySpeed(config);
    return new Shark({ ...config, x, y: spawnY, speed });
}

/**
 * Returns one randomized enemy speed inside the configured range.
 * It supports createEnemyFromConfig and mirrors the previous level balancing.
 */
function getEnemySpeed(config) {
    const minSpeed = config.minSpeed ?? 0.15;
    const maxSpeed = config.maxSpeed ?? 0.65;
    const range = Math.max(0, maxSpeed - minSpeed);
    return minSpeed + Math.random() * range;
}

/**
 * Returns one spawn Y value and optionally randomizes the lane for pickups.
 * It supports createCollectables without duplicating the lane decision.
 */
function getSpawnY(y, randomizeLane) {
    return randomizeLane ? getRandomLaneY() : y;
}

/**
 * Shuffles level configs so enemy variants keep the same random distribution as before.
 * It supports createEnemies before X positions are assigned to the spawned objects.
 */
function shuffleConfigs(enemyConfigs) {
    return [...enemyConfigs].sort(() => Math.random() - 0.5);
}

/**
 * Builds randomized X positions while preserving the original free-space distribution.
 * It is shared by enemy and pickup factories so spacing stays consistent across levels.
 */
function buildSpawnPositions(count, minDistance, startX, endX) {
    const total = getSpawnAmount(count, minDistance, startX, endX);
    const state = createSpawnState(total, minDistance, startX, endX);
    return Array.from({ length: total }, () => takeNextSpawnPosition(state));
}

/**
 * Returns how many objects can fit inside the configured range with the given distance.
 * It supports buildSpawnPositions before the free-space state is initialized.
 */
function getSpawnAmount(count, minDistance, startX, endX) {
    const range = endX - startX;
    const maxAmount = Math.floor(range / minDistance) + 1;
    return Math.min(count, maxAmount);
}

/**
 * Creates the mutable spacing state used by the legacy spawn distribution.
 * It supports buildSpawnPositions and keeps the loop helper focused on one step.
 */
function createSpawnState(total, minDistance, startX, endX) {
    const range = endX - startX;
    const freeSpace = Math.max(0, range - (total - 1) * minDistance);
    return { currentX: startX, freeSpace, minDistance, total, index: 0 };
}

/**
 * Advances the spawn state by one randomized step and returns the next X value.
 * It supports buildSpawnPositions with the same spacing logic as the pre-refactor code.
 */
function takeNextSpawnPosition(state) {
    const remaining = state.total - state.index - 1;
    const maxOffset = state.freeSpace - remaining;
    const randomOffset = maxOffset > 0 ? Math.random() * maxOffset : 0;
    state.currentX += randomOffset;
    state.freeSpace -= randomOffset;
    state.index += 1;
    const x = state.currentX;
    state.currentX += state.minDistance;
    return x;
}

/**
 * Builds background layers for the selected theme using the original segment order.
 * It delegates per-layer expansion so buildLevel does not repeat nested loops.
 */
function createBackgroundObjects(themePrefix = 'D', segmentCount = 12, segmentWidth = 820) {
    const layers = ['5. Water', '4.Fondo 2', '3.Fondo 1', '2. Floor'];
    return layers.flatMap((layer) => createBackgroundLayer(themePrefix, layer, segmentCount, segmentWidth));
}

/**
 * Creates one repeated background layer with alternating image indices per segment.
 * It supports createBackgroundObjects and preserves the old parallax alignment.
 */
function createBackgroundLayer(themePrefix, layer, segmentCount, segmentWidth) {
    return Array.from({ length: segmentCount + 1 }, (_, index) => {
        const segment = index - 1;
        const imageIndex = (segment + 1) % 2 === 0 ? 2 : 1;
        const path = `sharki/img/3. Background/Layers/${layer}/${themePrefix}${imageIndex}.png`;
        return new BackgroundObject(path, segment * segmentWidth);
    });
}

/**
 * Builds a complete level instance from shared content factories and boundary settings.
 * It is reused by all concrete level files so only level-specific data stays there.
 */
function buildLevel(enemyConfigs, endbossConfig, themePrefix, poisonCount, heartCount) {
    const enemies = [...createEnemies(enemyConfigs, ENEMY_MIN_DISTANCE, ENEMY_START_X, ENEMY_END_X), new Endboss(endbossConfig)];
    const coins = createCoins(25, 350, COIN_START_X, COIN_END_X, 200);
    const hearts = createHearts(heartCount, 240, COIN_START_X, COIN_END_X, 200);
    const triggers = [new BossTrigger(BOSS_TRIGGER_X, 110, 300)];
    const poison = createPoisonBubbles(poisonCount, 500, POISON_BUBBLE_START_X, POISON_BUBBLE_END_X, 200);
    return finalizeLevel(new Level(enemies, createBackgroundObjects(themePrefix), coins, triggers, poison, hearts));
}

/**
 * Applies the common level boundaries after the content arrays were created.
 * It supports buildLevel and keeps the level factory return statement compact.
 */
function finalizeLevel(level) {
    level.level_end_x = 819 * 12;
    level.character_max_x = 819 * 11;
    return level;
}
