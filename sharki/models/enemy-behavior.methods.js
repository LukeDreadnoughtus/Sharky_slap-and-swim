/**
 * Starts the enemy movement timer and the recurring animation timer.
 * It orchestrates state selection while the class file only stores setup data.
 */
Shark.prototype.animate = function () {
    this.startMovement();
    setInterval(() => {
        if (this.world && !this.world.isRunning()) {
            return;
        }

        this.renderEnemyState();
    }, 120);
};

/**
 * Renders the correct enemy state for the current frame of the game loop.
 * It prioritizes death handling before the walking animation keeps playing.
 */
Shark.prototype.renderEnemyState = function () {
    if (this.isRemoved) {
        return;
    }

    if (this.isDead()) {
        this.triggerDeathAnimation();
        return;
    }

    this.playAnimation(this.IMAGES_WALKING);
};

/**
 * Starts the correct movement loop for the configured enemy pattern.
 * It delegates to horizontal or vertical movement helpers.
 */
Shark.prototype.startMovement = function () {
    if (this.movementPattern === 'vertical') {
        this.moveVertically();
        return;
    }

    this.moveLeft();
};

/**
 * Moves vertically configured enemies between their upper and lower bounds.
 * It delegates the bound handling so the interval callback stays compact.
 */
Shark.prototype.moveVertically = function () {
    setInterval(() => {
        if (!this.canMoveVertically()) {
            return;
        }

        this.y += this.verticalSpeed * this.verticalDirection;
        this.applyVerticalBounds();
    }, 1000 / 60);
};

/**
 * Checks whether the vertical movement loop may update the enemy position.
 * It is shared by moveVertically to keep the timer body readable.
 */
Shark.prototype.canMoveVertically = function () {
    if (this.world && !this.world.isRunning()) {
        return false;
    }

    return !this.isDead() && !this.isRemoved && !this.isMovementBlocked();
};

/**
 * Applies the configured vertical bounds and flips direction at each edge.
 * It keeps moveVertically short and centralizes the bounce logic.
 */
Shark.prototype.applyVerticalBounds = function () {
    const upperLimit = this.minY ?? (this.baseY - this.verticalRange);
    const lowerLimit = this.maxY ?? (this.baseY + this.verticalRange);

    if (this.y >= lowerLimit) {
        this.y = lowerLimit;
        this.verticalDirection = -1;
        return;
    }

    if (this.y <= upperLimit) {
        this.y = upperLimit;
        this.verticalDirection = 1;
    }
};

/**
 * Disables collisions once the enemy reaches zero energy.
 * It is called from MovableObject.hit through the shared death callback.
 */
Shark.prototype.onDeath = function () {
    this.disableHitbox();
};

/**
 * Starts the death animation only once after the enemy has died.
 * It is triggered by renderEnemyState instead of mixing checks into animate.
 */
Shark.prototype.triggerDeathAnimation = function () {
    if (!this.deathAnimationStarted) {
        this.startDeathAnimation();
    }
};

/**
 * Begins the death sequence and schedules the later removal from the world.
 * It delegates frame rendering so the setup logic stays small.
 */
Shark.prototype.startDeathAnimation = function () {
    this.deathAnimationStarted = true;
    this.currentImage = 0;
    this.startDeathAnimationLoop();
    this.scheduleEnemyRemoval();
};

/**
 * Creates the death interval and lets renderDeathFrame advance the sprite flow.
 * It mirrors the boss death structure and keeps setup separate from playback.
 */
Shark.prototype.startDeathAnimationLoop = function () {
    let frameIndex = 0;
    const deathInterval = setInterval(() => {
        if (this.world && !this.world.isRunning()) {
            return;
        }

        frameIndex = this.renderDeathFrame(frameIndex, deathInterval);
    }, 200);
};

/**
 * Renders one death frame and adjusts Y movement during the death sequence.
 * It returns the next frame index so the interval code stays very short.
 */
Shark.prototype.renderDeathFrame = function (frameIndex, deathInterval) {
    if (frameIndex >= this.IMAGES_DEAD.length) {
        clearInterval(deathInterval);
        return frameIndex;
    }

    this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
    this.updateDeathPosition(frameIndex);
    return frameIndex + 1;
};

/**
 * Moves the enemy slightly up on the first death frame and then sinks it down.
 * It is used by renderDeathFrame to preserve the previous death animation feel.
 */
Shark.prototype.updateDeathPosition = function (frameIndex) {
    this.y += frameIndex === 0 ? -20 : 10;
};

/**
 * Removes the enemy after its death animation had time to finish on screen.
 * It is started by startDeathAnimation right after the interval is created.
 */
Shark.prototype.scheduleEnemyRemoval = function () {
    setTimeout(() => {
        this.isRemoved = true;
    }, 4000);
};
