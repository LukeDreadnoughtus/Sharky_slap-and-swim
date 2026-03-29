class Level{
    enemies;
    backgroundObjects;
    coins;
    bossTriggers;
    poisonBubbles;
    level_end_x = 2200;

    constructor(enemies, backgroundObjects, coins = [], bossTriggers = [], poisonBubbles = []){
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bossTriggers = bossTriggers;
        this.poisonBubbles = poisonBubbles;
    }
}
