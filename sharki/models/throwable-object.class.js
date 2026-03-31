class ThrowableObject extends MovableObject {
    IMAGES_BUBBLE = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/Bubble.png'
    ];

    IMAGES_POISON_BUBBLE = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
    ];

    width = 45;
    height = 45;
    speedX = 12;
    speedY = -8;
    gravity = 0.45;
    direction = 1;
    isRemoved = false;
    alreadyHit = false;
    damage = 2;
    bubbleType = 'normal';

    hitboxOffsetX = 8;
    hitboxOffsetY = 8;
    hitboxWidth = 28;
    hitboxHeight = 28;

    constructor(x, y, direction = 1, bubbleType = 'normal'){
        const imagePath = bubbleType === 'poison'
            ? 'sharki/img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
            : 'sharki/img/1.Sharkie/4.Attack/Bubble trap/Bubble.png';

        super().loadImage(imagePath);
        this.loadImages(this.IMAGES_BUBBLE);
        this.loadImages(this.IMAGES_POISON_BUBBLE);
        this.x = x;
        this.y = y;
        this.startY = y;
        this.direction = direction;
        this.bubbleType = bubbleType;
        this.damage = bubbleType === 'poison' ? 10 : 2;
        this.animate();
    }

    animate() {
        this.flightInterval = setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (this.isRemoved) {
                clearInterval(this.flightInterval);
                return;
            }

            this.x += this.speedX * this.direction;
            this.y += this.speedY;
            this.speedY += this.gravity;

            if (this.y > this.startY + 140) {
                this.remove();
            }
        }, 1000 / 60);
    }

    remove() {
        this.isRemoved = true;
        this.collidable = false;
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
        this.width = 0;
        this.height = 0;
    }
}
