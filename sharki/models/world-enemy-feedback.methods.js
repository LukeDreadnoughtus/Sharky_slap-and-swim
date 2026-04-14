/**
 * Applies player damage to one enemy and triggers non-lethal hit feedback.
 * It centralizes enemy.hit usage for slap and projectile collision handlers.
 */
World.prototype.applyEnemyDamage = function (enemy, damage) {
    if (!enemy || enemy.isRemoved) {
        return;
    }

    const previousEnergy = enemy.energy;
    enemy.hit(damage);
    this.syncEndbossStatusBar(enemy);

    if (!this.shouldShowEnemyHitFeedback(enemy, previousEnergy)) {
        return;
    }

    enemy.startHitFeedback();
};

/**
 * Reports whether one enemy should blink after the recent player hit.
 * It keeps applyEnemyDamage focused on the shared damage workflow.
 */
World.prototype.shouldShowEnemyHitFeedback = function (enemy, previousEnergy) {
    const tookDamage = typeof previousEnergy === 'number' && enemy.energy < previousEnergy;

    return enemy instanceof Shark && tookDamage && !enemy.isDead();
};
