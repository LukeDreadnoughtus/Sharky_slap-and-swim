class Coin extends MovableObject {
    IMAGES = [
        'sharki/img/4. Marcadores/1. Coins/3.png',
        'sharki/img/4. Marcadores/1. Coins/4.png',
        'sharki/img/4. Marcadores/1. Coins/1.png',
        'sharki/img/4. Marcadores/1. Coins/2.png'
    ];

    width = 40;
    height = 40;
    collected = false;

    hitboxOffsetX = 4;
    hitboxOffsetY = 4;
    hitboxWidth = 32;
    hitboxHeight = 32;

    constructor(x, y) {
        super().loadImage('sharki/img/4. Marcadores/1. Coins/3.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.collected) {
                this.playAnimation(this.IMAGES);
            }
        }, 140);
    }

    collect() {
        this.collected = true;
        this.width = 0;
        this.height = 0;
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
    }
}
