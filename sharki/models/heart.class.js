class Heart extends MovableObject {
    IMAGE = 'sharki/img/4. Marcadores/heart-red.svg';

    width = 40;
    height = 40;
    collected = false;
    hitboxOffsetX = 5;
    hitboxOffsetY = 5;
    hitboxWidth = 30;
    hitboxHeight = 30;

    /**
     * Creates one heart pickup and loads the shared sprite asset.
     * It follows the same pickup pattern used by Coin and PoisonBubble.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGE);
        this.x = x;
        this.y = y;
    }

    /**
     * Removes the heart from gameplay after the character restored energy.
     * It is triggered by World.checkHeartCollisions after a valid pickup.
     */
    collect() {
        this.collected = true;
        this.isRemoved = true;
        this.collidable = false;
        this.width = 0;
        this.height = 0;
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
    }
}
