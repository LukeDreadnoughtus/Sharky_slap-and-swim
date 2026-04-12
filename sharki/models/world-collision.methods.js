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

World.prototype.cleanupRemovedObjects = function () {
    /**
     * Removes objects already marked as deleted from active update arrays.
     * It is called at the start of CheckCollisions before fresh checks run.
     */
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.isRemoved);
    this.throwableObjects = this.throwableObjects.filter((bubble) => !bubble.isRemoved);
};

World.prototype.handleCharacterDeathState = function () {
    /**
     * Processes the character death branch and stops further collision work.
     * It supports CheckCollisions by returning whether the loop should stop.
     */
    if (!this.character.isDead()) {
        return false;
    }

    this.handleCharacterDeath();
    return true;
};

World.prototype.checkBossTriggers = function () {
    /**
     * Activates boss triggers once the character enters their collision area.
     * It supports the collision loop and starts the boss intro once.
     */
    this.level.bossTriggers.forEach((trigger) => {
        if (trigger.isActivated || !this.character.isColliding(trigger)) {
            return;
        }

        trigger.activate();
        this.startBossFight();
    });
};

World.prototype.checkEnemyCollisions = function () {
    /**
     * Updates endboss state, contact damage, and slap hits for each enemy.
     * It coordinates enemy-specific handlers inside the collision loop.
     */
    this.level.enemies.forEach((enemy) => {
        this.updateEndbossState(enemy);
        this.handleEnemyContact(enemy);
        this.checkSlapHit(enemy);
    });
};

World.prototype.updateEndbossState = function (enemy) {
    /**
     * Updates endboss behavior and death handling for one enemy instance.
     * It is called by checkEnemyCollisions before contact checks happen.
     */
    if (!(enemy instanceof Endboss)) {
        return;
    }

    enemy.updateBehavior(this.character);

    if (enemy.isDead()) {
        this.handleEndbossDeath();
    }
};

World.prototype.handleEnemyContact = function (enemy) {
    /**
     * Routes a direct character collision to the correct enemy handler.
     * It supports checkEnemyCollisions for normal enemies and the endboss.
     */
    if (!this.character.isColliding(enemy)) {
        return;
    }

    if (enemy instanceof Endboss) {
        this.handleEndbossCollision(enemy);
        return;
    }

    this.handleRegularEnemyCollision(enemy);
};

World.prototype.handleRegularEnemyCollision = function (enemy) {
    /**
     * Applies damage and audio feedback for a non-boss enemy collision.
     * It is used by handleEnemyContact after collision detection succeeds.
     */
    if (this.character.isHurt()) {
        return;
    }

    const damageType = this.getDamageTypeForEnemy(enemy);
    this.character.hit(enemy.damage ?? 5, damageType);
    this.statusBar.setPercentage(this.character.energy);
    this.playEnemyDamageSound(damageType);
};

World.prototype.playEnemyDamageSound = function (damageType) {
    /**
     * Plays the matching hurt sound for poison or electric damage.
     * It supports handleRegularEnemyCollision after health was updated.
     */
    if (!window.gameAudio) {
        return;
    }

    const soundName = damageType === 'electric' ? 'electricity_sound' : 'poison_sound';
    window.gameAudio.play(soundName, { cooldown: 250 });
};

World.prototype.checkCoinCollisions = function () {
    /**
     * Collects coins, updates the status bar, and plays the pickup sound.
     * It is one pickup branch inside the shared collision loop.
     */
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

World.prototype.checkPoisonBubblePickups = function () {
    /**
     * Collects poison bubbles while respecting the inventory limit.
     * It supports CheckCollisions and the poison projectile mechanic.
     */
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

World.prototype.shouldSkipPoisonBubblePickup = function (poisonBubble) {
    /**
     * Checks whether one poison bubble pickup should be ignored.
     * It keeps checkPoisonBubblePickups focused on the happy path.
     */
    return poisonBubble.collected || this.collectedPoisonBubbles >= this.maxPoisonBubbles;
};

World.prototype.handleCharacterDeath = function () {
    /**
     * Queues the character result dialog only once after death.
     * It supports the collision loop through handleCharacterDeathState.
     */
    if (this.hasHandledCharacterDeath) {
        return;
    }

    this.hasHandledCharacterDeath = true;
    this.queueResultDialog(this.onCharacterDeath);
};

World.prototype.handleEndbossDeath = function () {
    /**
     * Queues the endboss result dialog only when the character survived.
     * It is called by updateEndbossState after the boss dies.
     */
    if (this.hasHandledEndbossDeath || this.hasHandledCharacterDeath) {
        return;
    }

    this.hasHandledEndbossDeath = true;
    this.queueResultDialog(this.onEndbossDeath);
};

World.prototype.queueResultDialog = function (callback) {
    /**
     * Delays one result callback so the ending animation can breathe.
     * It is shared by character and endboss death handlers.
     */
    if (this.resultDialogTimeout || typeof callback !== 'function') {
        return;
    }

    this.resultDialogTimeout = setTimeout(() => this.runResultDialog(callback), 3000);
};

World.prototype.runResultDialog = function (callback) {
    /**
     * Executes one queued result callback unless the world was destroyed.
     * It finalizes queueResultDialog after the configured delay.
     */
    if (this.isDestroyed) {
        return;
    }

    this.pause();
    callback();
    this.resultDialogTimeout = null;
};

World.prototype.handleEndbossCollision = function (endboss) {
    /**
     * Starts an endboss attack and applies bite damage to the character.
     * It is used by handleEnemyContact for boss collisions only.
     */
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

World.prototype.getDamageTypeForEnemy = function (enemy) {
    /**
     * Returns the damage type used for the given enemy instance.
     * It supports collision sounds and hurt animation selection.
     */
    if (!enemy || typeof enemy.variant !== 'string') {
        return 'poison';
    }

    return enemy.variant.startsWith('jelly_') ? 'electric' : 'poison';
};

World.prototype.checkSlapHit = function (enemy) {
    /**
     * Applies slap damage when the active slap hitbox overlaps one enemy.
     * It cooperates with Character.getSlapHitbox and enemy.hit.
     */
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

World.prototype.isSlapHitboxOverlappingEnemy = function (slapHitbox, enemy) {
    /**
     * Checks a slap hitbox against one enemy hitbox rectangle.
     * It keeps checkSlapHit focused on state changes.
     */
    return slapHitbox.x + slapHitbox.width > enemy.x + enemy.hitboxOffsetX
        && slapHitbox.y + slapHitbox.height > enemy.y + enemy.hitboxOffsetY
        && slapHitbox.x < enemy.x + enemy.hitboxOffsetX + enemy.hitboxWidth
        && slapHitbox.y < enemy.y + enemy.hitboxOffsetY + enemy.hitboxHeight;
};

World.prototype.spawnBubbleShot = function () {
    /**
     * Spawns a normal bubble projectile from the character.
     * It delegates the actual projectile creation to spawnThrowableBubble.
     */
    this.spawnThrowableBubble('normal');
};

World.prototype.spawnPoisonBubbleShot = function () {
    /**
     * Spawns a poison bubble projectile from the character.
     * It complements spawnBubbleShot for the poison inventory mechanic.
     */
    this.spawnThrowableBubble('poison');
};

World.prototype.spawnThrowableBubble = function (type = 'normal') {
    /**
     * Creates one throwable bubble and adds it to the active projectile list.
     * It is used by the character attack flow after animation completion.
     */
    const spawn = this.character.getBubbleSpawnPosition();
    const bubble = new ThrowableObject(spawn.x, spawn.y, spawn.direction, type);
    bubble.world = this;
    bubble.otherDirection = spawn.direction < 0;
    this.throwableObjects.push(bubble);
};

World.prototype.checkThrowableCollisions = function () {
    /**
     * Applies projectile hits to enemies and removes bubbles after contact.
     * It is the projectile branch inside the collision loop.
     */
    this.throwableObjects.forEach((bubble) => {
        if (bubble.isRemoved || bubble.alreadyHit) {
            return;
        }

        this.level.enemies.forEach((enemy) => this.handleThrowableHit(bubble, enemy));
    });
};

World.prototype.handleThrowableHit = function (bubble, enemy) {
    /**
     * Resolves one projectile hit against one enemy when they overlap.
     * It supports checkThrowableCollisions across all active enemies.
     */
    if (bubble.isRemoved || enemy.isRemoved || !bubble.isColliding(enemy)) {
        return;
    }

    enemy.hit(bubble.damage);
    bubble.alreadyHit = true;
    this.playBubbleImpactSound(bubble.bubbleType);
    bubble.remove();
};

World.prototype.playBubbleImpactSound = function (bubbleType) {
    /**
     * Plays the projectile impact sound for normal or poison bubbles.
     * It is used by handleThrowableHit after damage was applied.
     */
    if (!window.gameAudio) {
        return;
    }

    const soundName = bubbleType === 'poison' ? 'poison_sound' : 'bubble_sound';
    window.gameAudio.play(soundName, { cooldown: 80 });
};

World.prototype.addPoisonBubbleToInventory = function () {
    /**
     * Adds one poison bubble to the inventory and updates the status bar.
     * It is used by pickup collisions before poison shots are fired later.
     */
    if (this.collectedPoisonBubbles >= this.maxPoisonBubbles) {
        return false;
    }

    this.collectedPoisonBubbles += 1;
    this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
    return true;
};

World.prototype.removePoisonBubbleFromInventory = function (amount = 1) {
    /**
     * Removes poison bubbles from the inventory and refreshes the status bar.
     * It supports poison projectile firing after attack animations finish.
     */
    this.collectedPoisonBubbles = Math.max(0, this.collectedPoisonBubbles - amount);
    this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
};

World.prototype.startBossFight = function () {
    /**
     * Finds the endboss, plays the roar, and starts the intro sequence.
     * It is triggered once from boss trigger collisions.
     */
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);

    if (!endboss) {
        return;
    }

    window.gameAudio?.play('monster_roar_sound');
    endboss.startIntro();
};
