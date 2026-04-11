/**
 * Updates boss tracking and movement against the current character target.
 * It combines facing logic with horizontal and vertical follow behavior.
 */
Endboss.prototype.updateBehavior = function (character) {
    if (!this.canUpdateBehavior(character)) {
        return;
    }

    this.updateDirection(character);

    if (!this.canMoveDuringBehavior()) {
        return;
    }

    this.updateHorizontalMovement(character);
    this.updateVerticalMovement(character);
};

/**
 * Checks whether combat behavior may run for the current frame and target.
 * It keeps updateBehavior focused on movement instead of guard clauses.
 */
Endboss.prototype.canUpdateBehavior = function (character) {
    return Boolean(character) && this.introFinished && !this.isDead() && !this.isRemoved;
};

/**
 * Checks whether the boss is currently allowed to move during behavior updates.
 * It is shared by updateBehavior and reflects attack, hurt, and intro wait state.
 */
Endboss.prototype.canMoveDuringBehavior = function () {
    return this.canMove && !this.isAttacking && (!this.isHurtAnimating || this.moveWhileHurt);
};

/**
 * Updates the facing direction so the boss looks toward the tracked character.
 * It supports movement and attack rendering with the same center-point logic.
 */
Endboss.prototype.updateDirection = function (character) {
    const bossCenter = this.getBossTrackingCenterX();
    const characterCenter = this.getCharacterTrackingCenterX(character);
    this.otherDirection = characterCenter > bossCenter;
};

/**
 * Moves the boss horizontally toward the character while respecting a dead zone.
 * It is called from updateBehavior after the movement guards are cleared.
 */
Endboss.prototype.updateHorizontalMovement = function (character) {
    const bossCenter = this.getBossTrackingCenterX();
    const characterCenter = this.getCharacterTrackingCenterX(character);

    if (characterCenter < bossCenter - 5) {
        this.x -= this.movementSpeed;
        return;
    }

    if (characterCenter > bossCenter + 5) {
        this.x += this.movementSpeed;
    }
};

/**
 * Returns the horizontal center used for boss tracking and facing logic.
 * It keeps center calculations consistent across movement and attack checks.
 */
Endboss.prototype.getBossTrackingCenterX = function () {
    return this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
};

/**
 * Returns the tracked character center used by boss follow calculations.
 * It mirrors the boss center helper so both movement axes use the same basis.
 */
Endboss.prototype.getCharacterTrackingCenterX = function (character) {
    return character.x + character.hitboxOffsetX + character.hitboxWidth / 2;
};

/**
 * Moves the boss toward the character on the Y axis using hitbox centers.
 * It relies on the center helpers and clamps the final result into boss bounds.
 */
Endboss.prototype.updateVerticalMovement = function (character) {
    const bossCenterY = this.getBossTrackingCenterY();
    const targetCenterY = this.getCharacterTrackingCenterY(character) + this.verticalTargetOffset;
    const verticalDelta = targetCenterY - bossCenterY;

    if (Math.abs(verticalDelta) <= this.verticalTrackingTolerance) {
        return;
    }

    this.y += verticalDelta < 0 ? -this.verticalMovementSpeed : this.verticalMovementSpeed;
    this.clampVerticalPosition();
};

/**
 * Returns the Y center of the boss hitbox used for vertical tracking.
 * It keeps the large sprite size from distorting follow calculations.
 */
Endboss.prototype.getBossTrackingCenterY = function () {
    return this.y + this.hitboxOffsetY + this.hitboxHeight / 2;
};

/**
 * Returns the relevant character hitbox center used during vertical tracking.
 * It is paired with getBossTrackingCenterY for symmetric targeting math.
 */
Endboss.prototype.getCharacterTrackingCenterY = function (character) {
    const hitboxOffsetY = character.hitboxOffsetY ?? 0;
    const hitboxHeight = character.hitboxHeight ?? character.height ?? 0;
    return character.y + hitboxOffsetY + hitboxHeight / 2;
};

/**
 * Clamps the boss Y position into the configured combat movement range.
 * It is called after every vertical move to prevent drifting outside the arena.
 */
Endboss.prototype.clampVerticalPosition = function () {
    this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
};

/**
 * Checks whether a new boss attack may begin on the current frame.
 * It gates attack start so the animation loop only triggers valid attacks.
 */
Endboss.prototype.canStartAttack = function () {
    const elapsed = new Date().getTime() - this.lastAttackTime;
    return this.introFinished && !this.isWaitingAfterIntro && !this.isDead()
        && !this.isRemoved && !this.isAttacking && !this.isHurtAnimating
        && elapsed >= this.attackCooldown;
};

/**
 * Starts the boss attack sequence and resets its animation state.
 * It is triggered by world combat logic before animate renders attack frames.
 */
Endboss.prototype.startAttack = function () {
    if (!this.canStartAttack()) {
        return false;
    }

    this.isAttacking = true;
    this.attackAnimationStarted = false;
    this.attackFrameIndex = 0;
    this.canMove = false;
    this.lastAttackTime = new Date().getTime();
    return true;
};

/**
 * Renders one attack frame and restores movement when the sequence ends.
 * It is called by animate after ensureAttackAnimationState prepared the frame index.
 */
Endboss.prototype.playAttackAnimation = function () {
    if (this.attackFrameIndex >= this.IMAGES_ATTACK.length) {
        this.finishAttackAnimation();
        return;
    }

    const path = this.IMAGES_ATTACK[this.attackFrameIndex];
    this.img = this.imageCache[path];
    this.attackFrameIndex++;
};

/**
 * Resets the attack animation state after the final attack frame is shown.
 * It keeps playAttackAnimation under the function-length limit.
 */
Endboss.prototype.finishAttackAnimation = function () {
    this.isAttacking = false;
    this.attackAnimationStarted = false;
    this.attackFrameIndex = 0;
    this.currentImage = 0;
    this.restoreMovementAfterAction();
};

/**
 * Applies boss damage and starts the hurt sequence when it survives the hit.
 * It extends MovableObject.hit and hands the animation work to startHurtAnimation.
 */
Endboss.prototype.hit = function (damage = 5) {
    if (this.isDead() || this.isRemoved) {
        return;
    }

    MovableObject.prototype.hit.call(this, damage);

    if (!this.isDead()) {
        this.startHurtAnimation();
    }
};

/**
 * Starts the hurt state unless attack flow or intro flow currently blocks it.
 * It prepares the frame indexes that playHurtAnimation consumes.
 */
Endboss.prototype.startHurtAnimation = function () {
    if (this.isAttacking || this.isHurtAnimating || !this.introFinished) {
        return;
    }

    this.isHurtAnimating = true;
    this.hurtAnimationStarted = false;
    this.hurtFrameIndex = 0;
    this.canMove = this.moveWhileHurt;
};

/**
 * Renders one hurt frame and restores normal movement when the sequence ends.
 * It is driven by animate after ensureHurtAnimationState resets the frame index.
 */
Endboss.prototype.playHurtAnimation = function () {
    if (this.hurtFrameIndex >= this.IMAGES_HURT.length) {
        this.finishHurtAnimation();
        return;
    }

    const path = this.IMAGES_HURT[this.hurtFrameIndex];
    this.img = this.imageCache[path];
    this.hurtFrameIndex++;
};

/**
 * Clears the hurt animation flags after the final hurt frame has played.
 * It keeps playHurtAnimation short while preserving the old boss behavior.
 */
Endboss.prototype.finishHurtAnimation = function () {
    this.isHurtAnimating = false;
    this.hurtAnimationStarted = false;
    this.hurtFrameIndex = 0;
    this.currentImage = 0;
    this.restoreMovementAfterAction();
};

/**
 * Restores boss movement after an attack or hurt sequence if combat still allows it.
 * It is shared by finishAttackAnimation and finishHurtAnimation.
 */
Endboss.prototype.restoreMovementAfterAction = function () {
    if (!this.isDead() && !this.isRemoved && !this.isWaitingAfterIntro) {
        this.canMove = true;
    }
};
