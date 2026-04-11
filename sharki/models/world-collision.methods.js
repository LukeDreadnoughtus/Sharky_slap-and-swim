/**
 * Starts the shared collision loop for enemies, pickups, and projectiles.
 * It delegates each frame to focused handlers so the timer body stays small.
 */
World.prototype.CheckCollisions = function () {
    setInterval(() => {
        if (!this.isRunning()) {
            return;
        }

        this.runCollisionFrame();
    }, 50);
};

/**
 * Runs one collision frame in the same order as the original game flow.
 * It is called by CheckCollisions on every collision update tick.
 */
World.prototype.runCollisionFrame = function () {
    this.cleanupRemovedObjects();

    if (this.handleCharacterDeathState()) {
        return;
    }

    this.checkBossTriggers();
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkPoisonBubblePickups();
    this.checkThrowableCollisions();
};

/**
 * Removes objects already marked as deleted from active update arrays.
 * It is called at the start of runCollisionFrame before fresh checks run.
 */
World.prototype.cleanupRemovedObjects = function () {
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.isRemoved);
    this.throwableObjects = this.throwableObjects.filter((bubble) => !bubble.isRemoved);
};

/**
 * Processes the character death branch and stops further collision work.
 * It supports runCollisionFrame by returning whether the loop should stop.
 */
World.prototype.handleCharacterDeathState = function () {
    if (!this.character.isDead()) {
        return false;
    }

    this.handleCharacterDeath();
    return true;
};

/**
 * Activates boss triggers once the character enters their collision area.
 * It supports the collision loop and starts the boss intro once.
 */
World.prototype.checkBossTriggers = function () {
    this.level.bossTriggers.forEach((trigger) => {
        if (trigger.isActivated || !this.character.isColliding(trigger)) {
            return;
        }

        trigger.activate();
        this.startBossFight();
    });
};

/**
 * Updates endboss state, contact damage, and slap hits for each enemy.
 * It coordinates enemy-specific handlers inside the collision loop.
 */
World.prototype.checkEnemyCollisions = function () {
    this.level.enemies.forEach((enemy) => {
        this.updateEndbossState(enemy);
        this.handleEnemyContact(enemy);
        this.checkSlapHit(enemy);
    });
};

/**
 * Updates endboss behavior and death handling for one enemy instance.
 * It is called by checkEnemyCollisions before contact checks happen.
 */
World.prototype.updateEndbossState = function (enemy) {
    if (!(enemy instanceof Endboss)) {
        return;
    }

    enemy.updateBehavior(this.character);

    if (enemy.isDead()) {
        this.handleEndbossDeath();
    }
};

/**
 * Routes a direct character collision to the correct enemy handler.
 * It supports checkEnemyCollisions for normal enemies and the endboss.
 */
World.prototype.handleEnemyContact = function (enemy) {
    if (!this.character.isColliding(enemy)) {
        return;
    }

    if (enemy instanceof Endboss) {
        this.handleEndbossCollision(enemy);
        return;
    }

    this.handleRegularEnemyCollision(enemy);
};

/**
 * Applies damage and audio feedback for a non-boss enemy collision.
 * It is used by handleEnemyContact after collision detection succeeds.
 */
World.prototype.handleRegularEnemyCollision = function (enemy) {
    if (this.character.isHurt()) {
        return;
    }

    const damageType = this.getDamageTypeForEnemy(enemy);
    this.character.hit(enemy.damage ?? 5, damageType);
    this.statusBar.setPercentage(this.character.energy);
    this.playEnemyDamageSound(damageType);
};

/**
 * Plays the matching hurt sound for poison or electric damage.
 * It supports handleRegularEnemyCollision after health was updated.
 */
World.prototype.playEnemyDamageSound = function (damageType) {
    if (!window.gameAudio) {
        return;
    }

    const soundName = damageType === 'electric' ? 'electricity_sound' : 'poison_sound';
    window.gameAudio.play(soundName, { cooldown: 250 });
};

/**
 * Collects coins, updates the status bar, and plays the pickup sound.
 * It is one pickup branch inside the shared collision loop.
 */
World.prototype.checkCoinCollisions = function () {
    this.level.coins.forEach((coin) => {
        if (coin.collected || !this.character.isColliding(coin)) {
            return;
        }

        coin.collect();
        this.collectedCoins += 1;
        this.coinStatusBar.setCollectedCoins(this.collectedCoins);
        window.gameAudio?.play('coin_sound', { cooldown: 80 });
    });
};

/**
 * Collects poison bubbles while respecting the inventory limit.
 * It supports runCollisionFrame and the poison projectile mechanic.
 */
World.prototype.checkPoisonBubblePickups = function () {
    this.level.poisonBubbles.forEach((poisonBubble) => {
        if (!this.canCollectPoisonBubble(poisonBubble)) {
            return;
        }

        this.collectPoisonBubble(poisonBubble);
    });
};

/**
 * Checks whether one poison bubble pickup may currently be collected.
 * It supports checkPoisonBubblePickups before inventory or collision changes happen.
 */
World.prototype.canCollectPoisonBubble = function (poisonBubble) {
    if (this.shouldSkipPoisonBubblePickup(poisonBubble)) {
        return false;
    }

    return this.character.isColliding(poisonBubble);
};

/**
 * Applies the poison bubble pickup effects and updates the inventory state.
 * It is called by checkPoisonBubblePickups after canCollectPoisonBubble succeeds.
 */
World.prototype.collectPoisonBubble = function (poisonBubble) {
    poisonBubble.collect();
    this.addPoisonBubbleToInventory();
    window.gameAudio?.play('bottle_sound', { cooldown: 80 });
};

/**
 * Checks whether one poison bubble pickup should be ignored.
 * It keeps canCollectPoisonBubble focused on the happy path.
 */
World.prototype.shouldSkipPoisonBubblePickup = function (poisonBubble) {
    return poisonBubble.collected || this.collectedPoisonBubbles >= this.maxPoisonBubbles;
};

/**
 * Queues the character result dialog only once after death.
 * It supports the collision loop through handleCharacterDeathState.
 */
World.prototype.handleCharacterDeath = function () {
    if (this.hasHandledCharacterDeath) {
        return;
    }

    this.hasHandledCharacterDeath = true;
    this.queueResultDialog(this.onCharacterDeath);
};

/**
 * Queues the endboss result dialog only when the character survived.
 * It is called by updateEndbossState after the boss dies.
 */
World.prototype.handleEndbossDeath = function () {
    if (this.hasHandledEndbossDeath || this.hasHandledCharacterDeath) {
        return;
    }

    this.hasHandledEndbossDeath = true;
    this.queueResultDialog(this.onEndbossDeath);
};

/**
 * Delays one result callback so the ending animation can breathe.
 * It is shared by character and endboss death handlers.
 */
World.prototype.queueResultDialog = function (callback) {
    if (this.resultDialogTimeout || typeof callback !== 'function') {
        return;
    }

    this.resultDialogTimeout = setTimeout(() => this.runResultDialog(callback), 3000);
};

/**
 * Executes one queued result callback unless the world was destroyed.
 * It finalizes queueResultDialog after the configured delay.
 */
World.prototype.runResultDialog = function (callback) {
    if (this.isDestroyed) {
        return;
    }

    this.pause();
    callback();
    this.resultDialogTimeout = null;
};

/**
 * Starts an endboss attack and applies bite damage to the character.
 * It is used by handleEnemyContact for boss collisions only.
 */
World.prototype.handleEndbossCollision = function (endboss) {
    if (!this.canRunEndbossCollision(endboss)) {
        return;
    }

    if (!endboss.startAttack()) {
        return;
    }

    this.applyEndbossCollisionDamage(endboss);
};

/**
 * Checks whether a boss contact may currently trigger the bite attack flow.
 * It keeps handleEndbossCollision focused on the actual damage sequence.
 */
World.prototype.canRunEndbossCollision = function (endboss) {
    return Boolean(endboss) && endboss.canStartAttack() && !this.character.isHurt();
};

/**
 * Applies bite damage and audio after the boss attack was successfully started.
 * It is called by handleEndbossCollision after startAttack succeeded.
 */
World.prototype.applyEndbossCollisionDamage = function (endboss) {
    window.gameAudio?.play('bite_sound', { cooldown: 150 });
    this.character.hit(endboss.damage ?? 8);
    this.statusBar.setPercentage(this.character.energy);
};

/**
 * Returns the damage type used for the given enemy instance.
 * It supports collision sounds and hurt animation selection.
 */
World.prototype.getDamageTypeForEnemy = function (enemy) {
    if (!enemy || typeof enemy.variant !== 'string') {
        return 'poison';
    }

    return enemy.variant.startsWith('jelly_') ? 'electric' : 'poison';
};
