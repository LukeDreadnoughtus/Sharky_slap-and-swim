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

    isRunning() {
        return !this.isPaused && !this.isDestroyed;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    destroy() {
        this.isDestroyed = true;
        this.isPaused = true;

        if (this.resultDialogTimeout) {
            clearTimeout(this.resultDialogTimeout);
            this.resultDialogTimeout = null;
        }
    }

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
                        this.character.hit(enemy.damage ?? 5);
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }

                this.checkSlapHit(enemy);
            });

            this.level.coins.forEach((coin) => {
                if (!coin.collected && this.character.isColliding(coin)) {
                    coin.collect();
                    this.collectedCoins++;
                    this.coinStatusBar.setCollectedCoins(this.collectedCoins);
                }
            });

            this.level.poisonBubbles.forEach((poisonBubble) => {
                if (poisonBubble.collected || this.collectedPoisonBubbles >= this.maxPoisonBubbles) {
                    return;
                }

                if (this.character.isColliding(poisonBubble)) {
                    poisonBubble.collect();
                    this.addPoisonBubbleToInventory();
                }
            });

            this.checkThrowableCollisions();
        }, 50);
    }

    handleCharacterDeath() {
        if (this.hasHandledCharacterDeath) {
            return;
        }

        this.hasHandledCharacterDeath = true;
        this.queueResultDialog(this.onCharacterDeath);
    }

    handleEndbossDeath() {
        if (this.hasHandledEndbossDeath || this.hasHandledCharacterDeath) {
            return;
        }

        this.hasHandledEndbossDeath = true;
        this.queueResultDialog(this.onEndbossDeath);
    }

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

    handleEndbossCollision(endboss) {
        if (!endboss || !endboss.canStartAttack() || this.character.isHurt()) {
            return;
        }

        const attackStarted = endboss.startAttack();

        if (!attackStarted) {
            return;
        }

        this.character.hit(endboss.damage ?? 8);
        this.statusBar.setPercentage(this.character.energy);
    }

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

    spawnBubbleShot() {
        this.spawnThrowableBubble('normal');
    }

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
                bubble.remove();
            });
        });
    }

    draw(){
        if (this.isDestroyed) {
            return;
        }

        if (this.isPaused) {
            requestAnimationFrame(() => this.draw());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            if (!o.isRemoved) {
                this.addtoMap(o);
            }
        });
    }

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

    startBossFight() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!endboss) {
            return;
        }

        endboss.startIntro();
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
