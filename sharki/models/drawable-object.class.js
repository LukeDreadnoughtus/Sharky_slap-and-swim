class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 300;
    height = 150;
    width = 100;
    static SHOW_DEBUG_VISUALS = false;

    /**
     * - Spielt Medien ab oder lädt benötigte Ressourcen.
     * - Liegt im Modellbereich rund um drawable object und arbeitet nah an den Spielobjekten.
     */

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
     * - Liegt im Modellbereich rund um drawable object und arbeitet nah an den Spielobjekten.
     */

    draw(ctx){
        if (this.isRemoved || !this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
     * - Liegt im Modellbereich rund um drawable object und arbeitet nah an den Spielobjekten.
     */

    drawFrame(ctx){
        if (this.isRemoved || !DrawableObject.SHOW_DEBUG_VISUALS) {
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

    /**
     * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
     * - Liegt im Modellbereich rund um drawable object und arbeitet nah an den Spielobjekten.
     */

    drawAttackLine(ctx) {
        if (!(this instanceof Character) || !DrawableObject.SHOW_DEBUG_VISUALS) {
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

    /**
     * - Spielt Medien ab oder lädt benötigte Ressourcen.
     * - Liegt im Modellbereich rund um drawable object und arbeitet nah an den Spielobjekten.
     */

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
