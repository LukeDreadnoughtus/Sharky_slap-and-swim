class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 300;
    height = 150;
    width = 100;

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx){
        if (this.isRemoved || !this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if (this.isRemoved) {
            return;
        }

        if (!this.collidable || this.hitboxWidth <= 0 || this.hitboxHeight <= 0) {
            return;
        }

        if (this instanceof Character || this instanceof Shark || this instanceof Endboss || this instanceof Coin || this instanceof PoisonBubble || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.hitboxOffsetX,
                this.y + this.hitboxOffsetY,
                this.hitboxWidth,
                this.hitboxHeight
            );
            ctx.stroke();
        }
    }

    drawAttackLine(ctx) {
        if (!(this instanceof Character)) {
            return;
        }

        const hitbox = this.getSlapHitbox();

        if (!hitbox) {
            return;
        }

        const startX = this.otherDirection ? hitbox.x + hitbox.width : hitbox.x;
        const endX = this.otherDirection ? hitbox.x : hitbox.x + hitbox.width;
        const lineY = hitbox.y + hitbox.height / 2;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'red';
        ctx.moveTo(startX, lineY);
        ctx.lineTo(endX, lineY);
        ctx.stroke();
    }

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
