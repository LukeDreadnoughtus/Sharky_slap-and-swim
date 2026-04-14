class Level{
    enemies;
    backgroundObjects;
    coins;
    hearts;
    bossTriggers;
    poisonBubbles;
    level_end_x = 2200;
    character_max_x = 2200;

    constructor(
        enemies,
        backgroundObjects,
        coins = [],
        bossTriggers = [],
        poisonBubbles = [],
        hearts = []
    ) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bossTriggers = bossTriggers;
        this.poisonBubbles = poisonBubbles;
        this.hearts = hearts;
    }
}
