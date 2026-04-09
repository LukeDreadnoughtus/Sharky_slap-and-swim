class PoisonBubble extends MovableObject {
    static IMAGE_LEFT = 'sharki/img/4. Marcadores/Posi%23U00f3n/Light - Left.png';
    static IMAGE_RIGHT = 'sharki/img/4. Marcadores/Posi%23U00f3n/Light - Right.png';

    width = 45;
    height = 55;
    collected = false;

    hitboxOffsetX = 6;
    hitboxOffsetY = 6;
    hitboxWidth = 33;
    hitboxHeight = 43;

    constructor(x, y, imagePath = PoisonBubble.IMAGE_LEFT) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.imagePath = imagePath;
        this.variant = imagePath === PoisonBubble.IMAGE_RIGHT ? 'right' : 'left';
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um poison bubble und arbeitet nah an den Spielobjekten.
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
