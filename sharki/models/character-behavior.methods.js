Character.prototype.animate = function () {
    /**
     * Starts movement and animation intervals for the playable character.
     * It coordinates updateCharacterMovement and updateCharacterAnimation.
     */
    setInterval(() => this.updateCharacterMovement(), 1000 / 60);
    setInterval(() => this.updateCharacterAnimation(), 80);
};

Character.prototype.updateCharacterMovement = function () {
    /**
     * Updates movement, attacks, and camera position for one frame tick.
     * It supports animate and delegates input-specific branches to helpers.
     */
    if (!this.hasMovementContext() || this.isDead()) {
        return;
    }

    if (!this.isBubbleAttacking) {
        this.handleHorizontalMovement();
        this.handleVerticalMovement();
    }

    this.clampVerticalPosition();
    this.handleAttackInputs();
    this.world.camera_x = -this.x + 100;
};

Character.prototype.hasMovementContext = function () {
    /**
     * Checks whether the world, keyboard, and level references are available.
     * It keeps the movement and animation intervals short and safe.
     */
    return Boolean(this.world && this.world.keyboard && this.world.level);
};

Character.prototype.handleHorizontalMovement = function () {
    /**
     * Applies left and right swimming movement from the current keyboard state.
     * It is the horizontal branch used by updateCharacterMovement.
     */
    if (this.world.keyboard.RIGHT && this.x < this.world.level.character_max_x) {
        this.x = Math.min(this.x + this.speed, this.world.level.character_max_x);
        this.otherDirection = false;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
    }
};

Character.prototype.handleVerticalMovement = function () {
    /**
     * Applies up and down swimming movement from the current keyboard state.
     * It complements handleHorizontalMovement inside the movement tick.
     */
    if (this.world.keyboard.UP) {
        this.swimUp();
    }

    if (this.world.keyboard.DOWN) {
        this.swimDown();
    }
};

Character.prototype.handleAttackInputs = function () {
    /**
     * Starts slap or projectile attacks from the current keyboard state.
     * It is called by updateCharacterMovement after position updates.
     */
    if (this.world.keyboard.SPACE && !this.isSlapping && !this.isBubbleAttacking) {
        this.slap();
    }

    if (this.world.keyboard.S) {
        this.startBubbleAttack();
    }

    if (this.world.keyboard.D) {
        this.startPoisonBubbleAttack();
    }
};

Character.prototype.updateCharacterAnimation = function () {
    /**
     * Selects and plays the correct animation state for the current frame.
     * It is the visual update branch used by animate.
     */
    if (!this.world || !this.world.keyboard) {
        return;
    }

    if (this.isDead()) return this.playDeathAnimationOnce();
    if (this.isHurt()) return this.playAnimation(this.getCurrentHurtImages());
    if (this.isBubbleAttacking) return this.playBubbleAttackAnimation();
    if (this.isSlapping) return this.playSlapAnimationFrame();
    this.playMovementOrIdleAnimation();
};

Character.prototype.playMovementOrIdleAnimation = function () {
    /**
     * Plays swimming frames while input is active, otherwise the idle loop.
     * It complements updateCharacterAnimation after combat states are checked.
     */
    const moving = this.world.keyboard.RIGHT
        || this.world.keyboard.LEFT
        || this.world.keyboard.UP
        || this.world.keyboard.DOWN;

    this.playAnimation(moving ? this.IMAGES_SWIM : this.IMAGES_WALKING);
};

Character.prototype.playSlapAnimationFrame = function () {
    /**
     * Advances the slap animation and resets melee state after the last frame.
     * It supports updateCharacterAnimation during active slap attacks.
     */
    const path = this.IMAGES_SLAP[this.slapImageIndex];
    this.img = this.imageCache[path];
    this.slapImageIndex += 1;

    if (this.slapImageIndex >= this.IMAGES_SLAP.length) {
        this.resetSlapState();
    }
};

Character.prototype.resetSlapState = function () {
    /**
     * Clears slap state after the slap animation has finished.
     * It is called by playSlapAnimationFrame once the sequence ends.
     */
    this.isSlapping = false;
    this.slapImageIndex = 0;
    this.currentImage = 0;
    this.slapTargetsHit.clear();
};

Character.prototype.playBubbleAttackAnimation = function () {
    /**
     * Advances the projectile attack animation or finalizes it at the end.
     * It cooperates with finishBubbleAttack to spawn the projectile.
     */
    const images = this.getCurrentBubbleAttackImages();

    if (this.bubbleAttackFrameIndex >= images.length) {
        this.finishBubbleAttack();
        return;
    }

    const path = images[this.bubbleAttackFrameIndex];
    this.img = this.imageCache[path];
    this.bubbleAttackFrameIndex += 1;
};

Character.prototype.finishBubbleAttack = function () {
    /**
     * Resets the projectile attack state and asks the world to spawn a shot.
     * It completes playBubbleAttackAnimation after the last frame.
     */
    const attackType = this.bubbleAttackType;
    this.resetBubbleAttackState();

    if (!this.world) {
        return;
    }

    if (attackType === 'poison') {
        return this.finishPoisonBubbleAttack();
    }

    this.world.spawnBubbleShot();
};

Character.prototype.resetBubbleAttackState = function () {
    /**
     * Clears projectile attack flags and resets animation counters.
     * It supports finishBubbleAttack before the world spawns a projectile.
     */
    this.isBubbleAttacking = false;
    this.bubbleAttackFrameIndex = 0;
    this.bubbleAttackType = null;
    this.currentImage = 0;
};

Character.prototype.finishPoisonBubbleAttack = function () {
    /**
     * Consumes one poison bubble and spawns the poison projectile.
     * It is the poison-specific branch used by finishBubbleAttack.
     */
    if (this.world.collectedPoisonBubbles <= 0) {
        return;
    }

    this.world.removePoisonBubbleFromInventory(1);
    this.world.spawnPoisonBubbleShot();
};

Character.prototype.playDeathAnimationOnce = function () {
    /**
     * Plays the death animation once and then holds the final frame.
     * It supports updateCharacterAnimation after the character has died.
     */
    this.initializeDeathAnimation();

    if (this.deathImageIndex >= this.IMAGES_DEAD.length) {
        return this.showFinalDeathFrame();
    }

    const path = this.IMAGES_DEAD[this.deathImageIndex];
    this.img = this.imageCache[path];
    this.deathImageIndex += 1;
    this.deathAnimationFinished = this.deathImageIndex >= this.IMAGES_DEAD.length;
};

Character.prototype.initializeDeathAnimation = function () {
    /**
     * Resets death animation counters the first time the death state renders.
     * It keeps playDeathAnimationOnce focused on frame advancement.
     */
    if (this.deathAnimationStarted) {
        return;
    }

    this.deathAnimationStarted = true;
    this.deathAnimationFinished = false;
    this.deathImageIndex = 0;
    this.currentImage = 0;
};

Character.prototype.showFinalDeathFrame = function () {
    /**
     * Locks the sprite on the final death frame after the animation ends.
     * It is the terminal branch used by playDeathAnimationOnce.
     */
    const lastImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
    this.img = this.imageCache[lastImage];
    this.deathAnimationFinished = true;
};

Character.prototype.hit = function (damage = 5, type = 'poison') {
    /**
     * Applies damage, selects the hurt animation, and enters death state if needed.
     * It extends MovableObject.hit with character-specific behavior.
     */
    if (this.isDead()) {
        return;
    }

    this.hurtAnimationType = type === 'electric' ? 'electric' : 'poison';
    MovableObject.prototype.hit.call(this, damage);

    if (this.isDead() || this.energy <= 20) {
        this.energy = 0;
        this.triggerDeathState();
    }
};

Character.prototype.triggerDeathState = function () {
    /**
     * Resets combat state and notifies the optional death callback once.
     * It is called by hit when the character has no remaining energy.
     */
    this.lastHit = 0;
    this.resetSlapState();
    this.resetBubbleAttackState();
    this.deathAnimationStarted = false;
    this.deathAnimationFinished = false;
    this.deathImageIndex = 0;

    if (typeof this.onDeath === 'function') {
        this.onDeath();
    }
};
