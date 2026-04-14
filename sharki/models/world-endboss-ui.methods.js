/**
 * Shows the boss HUD and syncs it with the current boss energy value.
 * It is called by startBossFight right when the trigger starts the intro.
 */
World.prototype.showEndbossStatusBar = function () {
    if (!this.endbossStatusBar) {
        return;
    }

    this.endbossStatusBar.isVisible = true;
    this.syncEndbossStatusBar(this.endboss);
};

/**
 * Refreshes the boss HUD after boss damage or boss setup changed.
 * It is reused by slap, projectile, and boss spawn logic.
 */
World.prototype.syncEndbossStatusBar = function (enemy) {
    if (!(enemy instanceof Endboss) || !this.endbossStatusBar) {
        return;
    }

    this.endbossStatusBar.setPercentage(enemy.energy);
};
