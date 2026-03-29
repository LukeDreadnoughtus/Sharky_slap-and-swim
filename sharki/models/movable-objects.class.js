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

    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0 ) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 150;
    }

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

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    isDead(){
        return this.energy == 0;
    }

    disableHitbox() {
        this.collidable = false;
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight(){
        console.log('Moving right');
    }

    moveLeft(){
        setInterval(() => {
            if (this.isDead() || this.isRemoved) {
                return;
            }
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
