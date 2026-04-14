/**
 * Renders one animation frame and schedules the next one recursively.
 * It delegates paused and active states to focused render helpers.
 */
World.prototype.draw = function () {
    if (this.isDestroyed) {
        return;
    }

    if (this.shouldRenderPausedFrame()) {
        this.scheduleNextFrame();
        return;
    }

    this.renderActiveFrame();
    this.scheduleNextFrame();
};

/**
 * Checks whether the current render pass should skip active drawing work.
 * It keeps draw short while preserving the paused-world behavior.
 */
World.prototype.shouldRenderPausedFrame = function () {
    return this.isPaused;
};

/**
 * Schedules the next world render frame through requestAnimationFrame.
 * It is reused by draw for paused and active render passes alike.
 */
World.prototype.scheduleNextFrame = function () {
    requestAnimationFrame(() => this.draw());
};

/**
 * Renders the full active frame with canvas prep and both layer passes.
 * It is called by draw whenever the world is not paused.
 */
World.prototype.renderActiveFrame = function () {
    this.prepareCanvas();
    this.drawBackgroundLayer();
    this.drawForegroundLayer();
};

/**
 * Resets the canvas transform, clears the frame, and applies render scale.
 * It is the first step inside renderActiveFrame before layer rendering starts.
 */
World.prototype.prepareCanvas = function () {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);
};

/**
 * Draws background objects and boss triggers in camera space.
 * It is the background pass used by renderActiveFrame before UI bars are drawn.
 */
World.prototype.drawBackgroundLayer = function () {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.bossTriggers);
    this.ctx.translate(-this.camera_x, 0);
};

/**
 * Draws UI bars and active gameplay objects in the correct order.
 * It is the foreground pass used by renderActiveFrame after the background layer.
 */
World.prototype.drawForegroundLayer = function () {
    this.addtoMap(this.statusBar);
    this.addtoMap(this.coinStatusBar);
    this.addtoMap(this.poisonStatusBar);
    this.addtoMap(this.endbossStatusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addtoMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.hearts);
    this.addObjectsToMap(this.level.poisonBubbles);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
};

/**
 * Draws each non-removed object from one array onto the map.
 * It supports both background and foreground render passes.
 */
World.prototype.addObjectsToMap = function (objects) {
    objects.forEach((object) => this.addtoMap(object));
};

/**
 * Draws one object and mirrors its sprite when it faces the opposite direction.
 * It is used by addObjectsToMap for every drawable world object.
 */
World.prototype.addtoMap = function (mo) {
    if (!mo || mo.isRemoved) {
        return;
    }

    if (mo.otherDirection) {
        this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    mo.drawAttackLine(this.ctx);
    if (mo.otherDirection) {
        this.flipImageBack(mo);
    }
};

/**
 * Mirrors one object before drawing while keeping its world X value intact.
 * It is paired with flipImageBack inside addtoMap.
 */
World.prototype.flipImage = function (mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
};

/**
 * Restores the canvas transform and original X value after mirrored drawing.
 * It finalizes the mirrored branch started by flipImage.
 */
World.prototype.flipImageBack = function (mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
};
