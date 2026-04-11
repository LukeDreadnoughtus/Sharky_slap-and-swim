/**
 * Disables combat collision and starts the boss death flow once energy reaches zero.
 * It is invoked by MovableObject.hit through the onDeath callback path.
 */
Endboss.prototype.onDeath = function () {
    this.disableHitbox();
    this.canMove = false;
    this.startDeathAnimation();
};

/**
 * Starts the death animation once and clears any active attack or hurt state.
 * It prepares the timer that renderDeathFrame uses until the boss gets removed.
 */
Endboss.prototype.startDeathAnimation = function () {
    if (this.deathAnimationStarted) {
        return;
    }

    this.resetDeathState();
    this.startDeathAnimationLoop();
};

/**
 * Clears all action-specific state before the boss death frames start rendering.
 * It supports startDeathAnimation so the timer logic stays compact.
 */
Endboss.prototype.resetDeathState = function () {
    this.deathAnimationStarted = true;
    this.isAttacking = false;
    this.isHurtAnimating = false;
    this.attackAnimationStarted = false;
    this.hurtAnimationStarted = false;
    this.attackFrameIndex = 0;
    this.hurtFrameIndex = 0;
    this.currentImage = 0;
};

/**
 * Creates the death animation interval and delegates each tick to renderDeathFrame.
 * It keeps startDeathAnimation short and mirrors the intro timer structure.
 */
Endboss.prototype.startDeathAnimationLoop = function () {
    let frameIndex = 0;
    const deathInterval = setInterval(() => {
        if (this.world && !this.world.isRunning()) {
            return;
        }

        frameIndex = this.renderDeathFrame(frameIndex, deathInterval);
    }, 180);
};

/**
 * Renders one death frame and schedules removal once the sequence finishes.
 * It returns the next frame index so startDeathAnimationLoop can stay tiny.
 */
Endboss.prototype.renderDeathFrame = function (frameIndex, deathInterval) {
    if (frameIndex >= this.IMAGES_DEAD.length) {
        clearInterval(deathInterval);
        this.scheduleRemoval();
        return frameIndex;
    }

    const path = this.IMAGES_DEAD[frameIndex];
    this.img = this.imageCache[path];
    return frameIndex + 1;
};

/**
 * Marks the boss as removed shortly after the last death frame is displayed.
 * It is triggered by renderDeathFrame when the final sprite has been shown.
 */
Endboss.prototype.scheduleRemoval = function () {
    setTimeout(() => {
        this.isRemoved = true;
    }, 600);
};

/**
 * Starts the recurring boss animation loop for idle, hurt, and attack states.
 * It delegates state selection so the interval body stays short and readable.
 */
Endboss.prototype.animate = function () {
    setInterval(() => {
        if (this.world && !this.world.isRunning()) {
            return;
        }

        this.renderAnimationState();
    }, 120);
};

/**
 * Renders the current boss animation state after the shared loop ticks.
 * It exits during intro and death states, then prioritizes attack over hurt.
 */
Endboss.prototype.renderAnimationState = function () {
    if (!this.introFinished || this.isDead() || this.isRemoved) {
        return;
    }

    if (this.renderAttackState() || this.renderHurtState()) {
        return;
    }

    this.playAnimation(this.IMAGES_WALKING);
};

/**
 * Handles attack animation rendering and reports whether it consumed the frame.
 * It is checked first so attack visuals override idle or hurt visuals.
 */
Endboss.prototype.renderAttackState = function () {
    if (!this.isAttacking) {
        return false;
    }

    this.ensureAttackAnimationState();
    this.playAttackAnimation();
    return true;
};

/**
 * Initializes attack frame indexes before the first attack frame is rendered.
 * It supports renderAttackState and keeps frame-reset logic in one place.
 */
Endboss.prototype.ensureAttackAnimationState = function () {
    if (this.attackAnimationStarted) {
        return;
    }

    this.attackAnimationStarted = true;
    this.attackFrameIndex = 0;
};

/**
 * Handles hurt animation rendering and reports whether it consumed the frame.
 * It runs after attack state so hurt animation only shows when no attack is active.
 */
Endboss.prototype.renderHurtState = function () {
    if (!this.isHurtAnimating) {
        return false;
    }

    this.ensureHurtAnimationState();
    this.playHurtAnimation();
    return true;
};

/**
 * Initializes hurt frame indexes before the first hurt frame is rendered.
 * It supports renderHurtState and mirrors the attack animation setup.
 */
Endboss.prototype.ensureHurtAnimationState = function () {
    if (this.hurtAnimationStarted) {
        return;
    }

    this.hurtAnimationStarted = true;
    this.hurtFrameIndex = 0;
};
