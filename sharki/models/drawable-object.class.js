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
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Shark || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
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

    if (!this.isSlapping) {
        return;
    }

    if (this.slapImageIndex < 3 || this.slapImageIndex > 5) {
        return;
    }

    let lineLength = 80;
    let startX = this.x + this.width - 120;
    let endX = startX + lineLength;
    let lineY = this.y + this.height * 0.65;

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red";
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