/**
 * Starts the boss intro and prepares the frame-by-frame entrance animation.
 * It initializes the state that finishIntro completes after the last intro frame.
 */
Endboss.prototype.startIntro = function () {
    if (this.introStarted) {
        return;
    }

    this.resetIntroState();
    this.startIntroInterval();
};

/**
 * Resets the intro-related flags and places the boss at the intro start.
 * It is called by startIntro before the timed animation begins.
 */
Endboss.prototype.resetIntroState = function () {
    this.isVisible = true;
    this.introStarted = true;
    this.introFinished = false;
    this.isWaitingAfterIntro = false;
    this.canMove = false;
    this.collidable = false;
    this.currentImage = 0;
    this.introImageIndex = 0;
    this.x = this.introStartX;
    this.img = this.imageCache[this.IMAGES_INTRODUCE[0]];
};

/**
 * Creates the intro timer that advances images and boss position together.
 * It keeps startIntro short and hands the frame work to updateIntroFrame.
 */
Endboss.prototype.startIntroInterval = function () {
    const distance = this.introStartX - this.targetX;
    this.introInterval = setInterval(() => {
        if (this.world && !this.world.isRunning()) {
            return;
        }

        this.updateIntroFrame(distance);
    }, this.introFrameDuration);
};

/**
 * Advances one intro frame and finishes the sequence when it reaches the end.
 * It is triggered on every intro interval tick created by startIntroInterval.
 */
Endboss.prototype.updateIntroFrame = function (distance) {
    this.setCurrentIntroImage();
    this.updateIntroPosition(distance);
    this.introImageIndex++;

    if (this.introImageIndex >= this.IMAGES_INTRODUCE.length) {
        this.completeIntroSequence();
    }
};

/**
 * Applies the currently indexed intro sprite if a frame is still available.
 * It supports updateIntroFrame without mixing sprite lookup and movement logic.
 */
Endboss.prototype.setCurrentIntroImage = function () {
    const path = this.IMAGES_INTRODUCE[this.introImageIndex];

    if (!path) {
        return;
    }

    this.img = this.imageCache[path];
};

/**
 * Moves the boss from the intro offset back to the actual combat position.
 * It works with updateIntroFrame so image playback and movement stay synchronized.
 */
Endboss.prototype.updateIntroPosition = function (distance) {
    const progress = Math.min(1, (this.introImageIndex + 1) / this.IMAGES_INTRODUCE.length);
    this.x = this.introStartX - distance * progress;
};

/**
 * Stops the intro timer and hands control to the post-intro waiting phase.
 * It is called by updateIntroFrame when the last intro image has been shown.
 */
Endboss.prototype.completeIntroSequence = function () {
    clearInterval(this.introInterval);
    this.introInterval = null;
    this.x = this.targetX;
    this.finishIntro();
};

/**
 * Switches the boss from intro mode into the short post-intro delay.
 * It shows the idle frame immediately and lets enableMovementAfterIntro resume combat.
 */
Endboss.prototype.finishIntro = function () {
    this.introFinished = true;
    this.isWaitingAfterIntro = true;
    this.collidable = true;
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_WALKING[0]];
    this.enableMovementAfterIntro();
};

/**
 * Delays boss movement for the configured intro pause after the entrance.
 * It finalizes finishIntro while still respecting paused or finished worlds.
 */
Endboss.prototype.enableMovementAfterIntro = function () {
    setTimeout(() => {
        if (!this.canResumeAfterIntro()) {
            return;
        }

        this.isWaitingAfterIntro = false;
        this.canMove = true;
    }, this.introWaitTime);
};

/**
 * Checks whether the boss may leave the intro wait and enter active combat.
 * It is used by enableMovementAfterIntro before mutating the movement flags.
 */
Endboss.prototype.canResumeAfterIntro = function () {
    if (this.world && !this.world.isRunning()) {
        return false;
    }

    return !this.isDead() && !this.isRemoved;
};
