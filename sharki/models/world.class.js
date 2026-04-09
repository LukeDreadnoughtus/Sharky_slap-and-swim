class World {
    character = new Character();
    level = createLevel1();

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    poisonStatusBar = new PoisonStatusBar();
    throwableObjects = [];
    collectedCoins = 0;
    collectedPoisonBubbles = 0;
    maxPoisonBubbles = 5;
    isPaused = false;
    isDestroyed = false;
    hasHandledCharacterDeath = false;
    hasHandledEndbossDeath = false;
    resultDialogTimeout = null;
    onCharacterDeath = null;
    onEndbossDeath = null;
    renderScale = 1;

    constructor(canvas, keyboard, callbacks = {}, levelFactory = createLevel1){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = levelFactory();
        this.onCharacterDeath = callbacks.onCharacterDeath ?? null;
        this.onEndbossDeath = callbacks.onEndbossDeath ?? null;
        this.draw();
        this.setWorld();
        this.CheckCollisions();
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf world, level zu.
     */

    setWorld(){
        this.character.world = this;

        const allWorldObjects = [
            ...this.level.enemies,
            ...this.level.coins,
            ...this.level.poisonBubbles,
            ...this.level.backgroundObjects,
            ...this.level.bossTriggers
        ];

        allWorldObjects.forEach((object) => {
            object.world = this;
        });
    }

    setRenderScale(scale = 1) {
        this.renderScale = scale > 0 ? scale : 1;
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    isRunning() {
        return !this.isPaused && !this.isDestroyed;
    }

    /**
     * - Beendet, leert oder setzt einen Ablauf wieder zurück.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    pause() {
        this.isPaused = true;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    resume() {
        this.isPaused = false;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    destroy() {
        this.isDestroyed = true;
        this.isPaused = true;

        if (this.resultDialogTimeout) {
            clearTimeout(this.resultDialogTimeout);
            this.resultDialogTimeout = null;
        }
    }

    /**
     * - Prüft Kollisionen, Treffer oder andere Spielbedingungen.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit isRunning, handleCharacterDeath zusammen.
     * - Greift dabei auf level, Audio zu.
     */

    CheckCollisions(){
        setInterval(() => {
            if (!this.isRunning()) {
                return;
            }

            this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
            this.throwableObjects = this.throwableObjects.filter(bubble => !bubble.isRemoved);

            if (this.character.isDead()) {
                this.handleCharacterDeath();
                return;
            }

            this.level.bossTriggers.forEach((trigger) => {
                if (!trigger.isActivated && this.character.isColliding(trigger)) {
                    trigger.activate();
                    this.startBossFight();
                }
            });

            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Endboss) {
                    enemy.updateBehavior(this.character);

                    if (enemy.isDead()) {
                        this.handleEndbossDeath();
                    }
                }

                if (this.character.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        this.handleEndbossCollision(enemy);
                    } else if (!this.character.isHurt()) {
                        const damageType = this.getDamageTypeForEnemy(enemy);
                        this.character.hit(enemy.damage ?? 5, damageType);
                        this.statusBar.setPercentage(this.character.energy);

                        if (window.gameAudio) {
                            if (damageType === 'electric') {
                                window.gameAudio.play('electricity_sound', { cooldown: 250 });
                            } else {
                                window.gameAudio.play('poison_sound', { cooldown: 250 });
                            }
                        }
                    }
                }

                this.checkSlapHit(enemy);
            });

            this.level.coins.forEach((coin) => {
                if (!coin.collected && this.character.isColliding(coin)) {
                    coin.collect();
                    this.collectedCoins++;
                    this.coinStatusBar.setCollectedCoins(this.collectedCoins);

                    if (window.gameAudio) {
                        window.gameAudio.play('coin_sound', { cooldown: 80 });
                    }
                }
            });

            this.level.poisonBubbles.forEach((poisonBubble) => {
                if (poisonBubble.collected || this.collectedPoisonBubbles >= this.maxPoisonBubbles) {
                    return;
                }

                if (this.character.isColliding(poisonBubble)) {
                    poisonBubble.collect();
                    this.addPoisonBubbleToInventory();

                    if (window.gameAudio) {
                        window.gameAudio.play('bottle_sound', { cooldown: 80 });
                    }
                }
            });

            this.checkThrowableCollisions();
        }, 50);
    }

    /**
     * - Reagiert auf ein Ereignis und verarbeitet die passende Folgeaktion.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit queueResultDialog zusammen.
     */

    handleCharacterDeath() {
        if (this.hasHandledCharacterDeath) {
            return;
        }

        this.hasHandledCharacterDeath = true;
        this.queueResultDialog(this.onCharacterDeath);
    }

    /**
     * - Reagiert auf ein Ereignis und verarbeitet die passende Folgeaktion.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit queueResultDialog zusammen.
     */

    handleEndbossDeath() {
        if (this.hasHandledEndbossDeath || this.hasHandledCharacterDeath) {
            return;
        }

        this.hasHandledEndbossDeath = true;
        this.queueResultDialog(this.onEndbossDeath);
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit pause zusammen.
     */

    queueResultDialog(callback) {
        if (this.resultDialogTimeout || typeof callback !== 'function') {
            return;
        }

        this.resultDialogTimeout = setTimeout(() => {
            if (this.isDestroyed) {
                return;
            }

            this.pause();
            callback();
            this.resultDialogTimeout = null;
        }, 3000);
    }

    /**
     * - Reagiert auf ein Ereignis und verarbeitet die passende Folgeaktion.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf Audio zu.
     */

    handleEndbossCollision(endboss) {
        if (!endboss || !endboss.canStartAttack() || this.character.isHurt()) {
            return;
        }

        const attackStarted = endboss.startAttack();

        if (!attackStarted) {
            return;
        }

        if (window.gameAudio) {
            window.gameAudio.play('bite_sound', { cooldown: 150 });
        }

        this.character.hit(endboss.damage ?? 8);
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    getDamageTypeForEnemy(enemy) {
        if (!enemy || typeof enemy.variant !== 'string') {
            return 'poison';
        }

        return enemy.variant.startsWith('jelly_') ? 'electric' : 'poison';
    }

    /**
     * - Prüft Kollisionen, Treffer oder andere Spielbedingungen.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    checkSlapHit(enemy) {
        const slapHitbox = this.character.getSlapHitbox();

        if (!slapHitbox || this.character.slapTargetsHit.has(enemy)) {
            return;
        }

        const slapHitsEnemy =
            slapHitbox.x + slapHitbox.width > enemy.x + enemy.hitboxOffsetX &&
            slapHitbox.y + slapHitbox.height > enemy.y + enemy.hitboxOffsetY &&
            slapHitbox.x < enemy.x + enemy.hitboxOffsetX + enemy.hitboxWidth &&
            slapHitbox.y < enemy.y + enemy.hitboxOffsetY + enemy.hitboxHeight;

        if (!slapHitsEnemy) {
            return;
        }

        enemy.hit(5);
        this.character.slapTargetsHit.add(enemy);
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    spawnBubbleShot() {
        this.spawnThrowableBubble('normal');
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    spawnPoisonBubbleShot() {
        this.spawnThrowableBubble('poison');
    }

    spawnThrowableBubble(type = 'normal') {
        const spawn = this.character.getBubbleSpawnPosition();
        const bubble = new ThrowableObject(spawn.x, spawn.y, spawn.direction, type);
        bubble.world = this;
        bubble.otherDirection = spawn.direction < 0;
        this.throwableObjects.push(bubble);
    }

    /**
     * - Prüft Kollisionen, Treffer oder andere Spielbedingungen.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf level, Audio zu.
     */

    checkThrowableCollisions() {
        this.throwableObjects.forEach((bubble) => {
            if (bubble.isRemoved || bubble.alreadyHit) {
                return;
            }

            this.level.enemies.forEach((enemy) => {
                if (bubble.isRemoved || enemy.isRemoved || !bubble.isColliding(enemy)) {
                    return;
                }

                enemy.hit(bubble.damage);
                bubble.alreadyHit = true;

                if (window.gameAudio) {
                    if (bubble.bubbleType === 'poison') {
                        window.gameAudio.play('poison_sound', { cooldown: 80 });
                    } else {
                        window.gameAudio.play('bubble_sound', { cooldown: 80 });
                    }
                }

                bubble.remove();
            });
        });
    }

    /**
     * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit requestAnimationFrame, addObjectsToMap zusammen.
     * - Greift dabei auf level, canvas zu.
     */

    draw(){
        if (this.isDestroyed) {
            return;
        }

        if (this.isPaused) {
            requestAnimationFrame(() => this.draw());
            return;
        }

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bossTriggers);

        this.ctx.translate(-this.camera_x, 0);

        this.addtoMap(this.statusBar);
        this.addtoMap(this.coinStatusBar);
        this.addtoMap(this.poisonStatusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.poisonBubbles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;

        /**
         * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
         * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
         * - Hängt direkt mit draw zusammen.
         */

        requestAnimationFrame(function() {
            self.draw();
        });
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit addtoMap zusammen.
     */

    addObjectsToMap(objects){
        objects.forEach(o => {
            if (!o.isRemoved) {
                this.addtoMap(o);
            }
        });
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit draw, flipImage zusammen.
     */

    addtoMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if(mo.otherDirection){
            this.flipImageBack(mo);
        }

        mo.drawAttackLine(this.ctx);
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    addPoisonBubbleToInventory() {
        if (this.collectedPoisonBubbles >= this.maxPoisonBubbles) {
            return false;
        }

        this.collectedPoisonBubbles++;
        this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
        return true;
    }

    removePoisonBubbleFromInventory(amount = 1) {
        this.collectedPoisonBubbles = Math.max(0, this.collectedPoisonBubbles - amount);
        this.poisonStatusBar.setCollectedPoisonBubbles(this.collectedPoisonBubbles);
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf level, Audio zu.
     */

    startBossFight() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!endboss) {
            return;
        }

        if (window.gameAudio) {
            window.gameAudio.play('monster_roar_sound');
        }

        endboss.startIntro();
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um world und arbeitet nah an den Spielobjekten.
     */

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
