class MovableObject extends DrawableObject {
    speed = 0.15;

    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;

    hitboxOffsetX = 0;
    hitboxOffsetY = 0;
    hitboxWidth = this.width;
    hitboxHeight = this.height;
    collidable = true;

    energy = 100;
    lastHit = 0;

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit isAboveGround zusammen.
     * - Greift dabei auf world zu.
     */

    applyGravity(){
        setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (this.isAboveGround() || this.speedY > 0 ) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    isAboveGround(){
        return this.y < 150;
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    isColliding(mo){
        if (!this.collidable || !mo.collidable) {
            return false;
        }

        return this.x + this.hitboxOffsetX + this.hitboxWidth > mo.x + mo.hitboxOffsetX &&
               this.y + this.hitboxOffsetY + this.hitboxHeight > mo.y + mo.hitboxOffsetY &&
               this.x + this.hitboxOffsetX < mo.x + mo.hitboxOffsetX + mo.hitboxWidth &&
               this.y + this.hitboxOffsetY < mo.y + mo.hitboxOffsetY + mo.hitboxHeight;
    }

    hit(damage = 5){
        if (this.isDead()) {
            return;
        }

        this.energy -= damage;

        if (this.energy < 0) {
            this.energy = 0;
        }

        if (this.energy === 0) {
            if (typeof this.onDeath === 'function') {
                this.onDeath();
            }
            return;
        }

        this.lastHit = new Date().getTime();
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    isDead(){
        return this.energy == 0;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    disableHitbox() {
        this.collidable = false;
    }

    /**
     * - Spielt Medien ab oder lädt benötigte Ressourcen.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     */

    moveRight(){
        console.log('Moving right');
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um movable objects und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit isDead zusammen.
     * - Greift dabei auf world zu.
     */

    moveLeft(){
        setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (this.isDead() || this.isRemoved) {
                return;
            }
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
