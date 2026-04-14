/**
 * Collects hearts only while the character can still regain energy.
 * It complements the pickup loop beside coin and poison checks.
 */
World.prototype.checkHeartCollisions = function () {
    this.level.hearts.forEach((heart) => {
        if (this.shouldSkipHeartPickup(heart)) {
            return;
        }

        heart.collect();
        this.character.restoreEnergy(20);
        this.statusBar.setPercentage(this.character.energy);
        window.gameAudio?.play('coin_sound', { cooldown: 80 });
    });
};

/**
 * Blocks heart collection when the pickup is gone or health is already full.
 * It keeps checkHeartCollisions focused on the successful pickup branch.
 */
World.prototype.shouldSkipHeartPickup = function (heart) {
    return heart.collected
        || this.character.energy >= 100
        || !this.character.isColliding(heart);
};
