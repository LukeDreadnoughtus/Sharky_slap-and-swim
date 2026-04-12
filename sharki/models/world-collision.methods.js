World.prototype.CheckCollisions = function () {
    /**
     * Runs the shared collision loop for enemies, pickups, and projectiles.
     * It coordinates focused collision handlers on a fixed update interval.
     */
    setInterval(() => {
        if (!this.isRunning()) {
            return;
        }

        this.cleanupRemovedObjects();
        if (this.handleCharacterDeathState()) {
            return;
        }

        this.checkBossTriggers();
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkPoisonBubblePickups();
        this.checkThrowableCollisions();
    }, 50);
};

    /**
     * Removes objects already marked as deleted from active update arrays.
     * It is called at the start of CheckCollisions before fresh checks run.
     */
World.prototype.cleanupRemovedObjects = function () {
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.isRemoved);
    this.throwableObjects = this.throwableObjects.filter((bubble) => !bubble.isRemoved);
};

    /**
     * Processes the character death branch and stops further collision work.
     * It supports CheckCollisions by returning whether the loop should stop.
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
     * It supports CheckCollisions and the poison projectile mechanic.
     */
World.prototype.checkPoisonBubblePickups = function () {
    this.level.poisonBubbles.forEach((poisonBubble) => {
        if (this.shouldSkipPoisonBubblePickup(poisonBubble)) {
            return;
        }

        if (!this.character.isColliding(poisonBubble)) {
            return;
        }

        poisonBubble.collect();
        this.addPoisonBubbleToInventory();
        window.gameAudio?.play('bottle_sound', { cooldown: 80 });
    });
};

    /**
     * Checks whether one poison bubble pickup should be ignored.
     * It keeps checkPoisonBubblePickups focused on the happy path.
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
    if (!endboss || !endboss.canStartAttack() || this.character.isHurt()) {
        return;
    }

    if (!endboss.startAttack()) {
        return;
    }

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

    /**
     * Applies slap damage when the active slap hitbox overlaps one enemy.
     * It cooperates with Character.getSlapHitbox and enemy.hit.
     */
World.prototype.checkSlapHit = function (enemy) {
    const slapHitbox = this.character.getSlapHitbox();

    if (!slapHitbox || this.character.slapTargetsHit.has(enemy)) {
        return;
    }

    if (!this.isSlapHitboxOverlappingEnemy(slapHitbox, enemy)) {
        return;
    }

    enemy.hit(5);
    this.character.slapTargetsHit.add(enemy);
};

    /**
     * Checks a slap hitbox against one enemy hitbox rectangle.
     * It keeps checkSlapHit focused on state changes.
     */
World.prototype.isSlapHitboxOverlappingEnemy = function (slapHitbox, enemy) {
    return slapHitbox.x + slapHitbox.width > enemy.x + enemy.hitboxOffsetX
        && slapHitbox.y + slapHitbox.height > enemy.y + enemy.hitboxOffsetY
        && slapHitbox.x < enemy.x + enemy.hitboxOffsetX + enemy.hitboxWidth
        && slapHitbox.y < enemy.y + enemy.hitboxOffsetY + enemy.hitboxHeight;
};

    /**
     * Spawns a normal bubble projectile from the character.
     * It delegates the actual projectile creation to spawnThrowableBubble.
     */
World.prototype.spawnBubbleShot = function () {
    this.spawnThrowableBubble('normal');
};

    /**
     * Spawns a poison bubble projectile from the character.
     * It complements spawnBubbleShot for the poison inventory mechanic.
     */
World.prototype.spawnPoisonBubbleShot = function () {
    this.spawnThrowableBubble('poison');
};

    /**
     * Creates one throwable bubble and adds it to the active projectile list.
     * It is used by the character attack flow after animation completion.
     */
World.prototype.spawnThrowableBubble = function (type = 'normal') {
    const spawn = this.character.getBubbleSpawnPosition();
    const bubble = new ThrowableObject(spawn.x, spawn.y, spawn.direction, type);
    bubble.world = this;
    bubble.otherDirection = spawn.direction < 0;
    this.throwableObjects.push(bubble);
};

    /**
     * Applies projectile hits to enemies and removes bubbles after contact.
     * It is the projectile branch inside the collision loop.
     */
World.prototype.checkThrowableCollisions = function () {
    this.throwableObjects.forEach((bubble) => {
        if (bubble.isRemoved || bubble.alreadyHit) {
            return;
        }

        this.level.enemies.forEach((enemy) => this.handleThrowableHit(bubble, enemy));
    });
};

    /**
     * Resolves one projectile hit against one enemy when they overlap.
     * It supports checkThrowableCollisions across all active enemies.
     */
World.prototype.handleThrowableHit = function (bubble, enemy) {
    if (bubble.isRemoved || enemy.isRemoved || !bubble.isColliding(enemy)) {
        return;
    }

    enemy.hit(bubble.damage);
    bubble.alreadyHit = true;
    this.playBubbleImpactSound(bubble.bubbleType);
    bubble.remove();
};

    /**
     * Plays the projectile impact sound for normal or poison bubbles.
     * It is used by handleThrowableHit after damage was applied.
     */
World.prototype.playBubbleImpactSound = function (bubbleType) {
    if (!window.gameAudio) {
        return;
    }

    const soundName = bubbleType === 'poison' ? 'poison_sound' : 'bubble_sound';
    window.gameAudio.play(soundName, { cooldown: 80 });
};

    /**
     * Adds one poison bubble to the inventory and updates the status bar.
     * It is used by pickup collisions before poison shots are fired later.
     */
World.prototype.addPoisonBubbleToInventory = function () {
    if (this.collectedPoisonBubbles >= this.maxPoisonBubbles) {
        return false;
    }

    this.collectedPoisonBubbles += 1;
    this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
    return true;
};

    /**
     * Removes poison bubbles from the inventory and refreshes the status bar.
     * It supports poison projectile firing after attack animations finish.
     */
World.prototype.removePoisonBubbleFromInventory = function (amount = 1) {
    this.collectedPoisonBubbles = Math.max(0, this.collectedPoisonBubbles - amount);
    this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
};

    /**
     * Finds the endboss, plays the roar, and starts the intro sequence.
     * It is triggered once from boss trigger collisions.
     */
World.prototype.startBossFight = function () {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

    if (!endboss) {
        return;
    }

    window.gameAudio?.play('monster_roar_sound');
    endboss.startIntro();
};
