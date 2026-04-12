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
     * Starts gravity updates and only applies them while the world is running.
     * It delegates the movement check so the timer callback stays small.
     */
    applyGravity() {
        setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            this.applyGravityStep();
        }, 1000 / 25);
    }

    /**
     * Applies one gravity step when the object is still airborne or moving upward.
     * It is called by applyGravity on every gravity tick.
     */
    applyGravityStep() {
        if (!this.isAboveGround() && this.speedY <= 0) {
            return;
        }

        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Reports whether the object is still above the default water floor threshold.
     * It is used by applyGravityStep before vertical motion is updated.
     */
    isAboveGround() {
        return this.y < 150;
    }

    /**
     * Checks hitbox overlap between this object and another movable object.
     * It first validates collision flags before comparing the four hitbox edges.
     */
    isColliding(mo) {
        if (!this.collidable || !mo.collidable) {
            return false;
        }

        return this.hasHorizontalCollision(mo) && this.hasVerticalCollision(mo);
    }

    /**
     * Checks whether the horizontal hitbox ranges of two objects overlap.
     * It supports isColliding so the main collision method stays short.
     */
    hasHorizontalCollision(mo) {
        return this.x + this.hitboxOffsetX + this.hitboxWidth > mo.x + mo.hitboxOffsetX
            && this.x + this.hitboxOffsetX < mo.x + mo.hitboxOffsetX + mo.hitboxWidth;
    }

    /**
     * Checks whether the vertical hitbox ranges of two objects overlap.
     * It supports isColliding and mirrors the horizontal edge checks.
     */
    hasVerticalCollision(mo) {
        return this.y + this.hitboxOffsetY + this.hitboxHeight > mo.y + mo.hitboxOffsetY
            && this.y + this.hitboxOffsetY < mo.y + mo.hitboxOffsetY + mo.hitboxHeight;
    }

    /**
     * Applies incoming damage, clamps energy, and triggers onDeath when needed.
     * It is reused by character, enemies, and boss classes before their own reactions run.
     */
    hit(damage = 5) {
        if (this.isDead()) {
            return;
        }

        this.energy = Math.max(0, this.energy - damage);

        if (this.energy === 0) {
            this.handleDeathHit();
            return;
        }

        this.lastHit = new Date().getTime();
    }

    /**
     * Calls the optional death callback after hit reduced energy to zero.
     * It keeps hit short while preserving the existing shared death hook.
     */
    handleDeathHit() {
        if (typeof this.onDeath === 'function') {
            this.onDeath();
        }
    }

    /**
     * Reports whether the object was hit within the recent hurt cooldown window.
     * It is typically used by animation code to pick a temporary hurt state.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Reports whether the object has no energy left and counts as dead.
     * It is shared by damage, movement, and animation decisions across the project.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Disables collisions for objects that should no longer participate in combat.
     * It is typically called from onDeath handlers before removal happens.
     */
    disableHitbox() {
        this.collidable = false;
    }

    /**
     * Advances to the next cached image in the provided animation sequence.
     * It is the common animation helper used by character, enemies, and boss classes.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Keeps the placeholder right-move hook available for future behavior changes.
     * It stays minimal because current gameplay only uses leftward enemy movement.
     */
    moveRight() {
        console.log('Moving right');
    }

    /**
     * Starts the recurring left-movement loop for horizontally moving objects.
     * It delegates the single step to moveLeftStep so the interval body stays short.
     */
    moveLeft() {
        setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            this.moveLeftStep();
        }, 1000 / 60);
    }

    /**
     * Applies one leftward movement step while the object is still active.
     * It is used by moveLeft and respects death and removal state.
     */
    moveLeftStep() {
        if (this.isDead() || this.isRemoved) {
            return;
        }

        this.x -= this.speed;
    }
}
