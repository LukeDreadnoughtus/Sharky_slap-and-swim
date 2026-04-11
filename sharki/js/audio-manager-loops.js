AudioManager.prototype.startIntroLoop = function () {
    /**
     * Starts the intro track and retries after a user gesture if blocked.
     * It works with clearIntroFadeTimeout and handleIntroEnded.
     */
    if (!this.introAudio) {
        return;
    }

    this.activateIntroLoop();

    if (this.introAudio.paused) {
        this.playIntroAudio();
    }
};

/**
 * Applies the shared intro-loop state before intro playback starts or resumes.
 * It keeps startIntroLoop within the configured function-length rule.
 */
AudioManager.prototype.activateIntroLoop = function () {
    this.clearIntroFadeTimeout();
    this.introLoopActive = true;
    this.prepareIntroAudio();
};

AudioManager.prototype.prepareIntroAudio = function () {
    /**
     * Applies the current intro volume and mute values before playback.
     * It is shared by startIntroLoop and stopIntroLoopWithFade.
     */
    this.introAudio.volume = this.muted ? 0 : this.introVolume;
    this.introAudio.muted = this.muted;
};

AudioManager.prototype.playIntroAudio = function () {
    /**
     * Resets and starts the intro source from the beginning.
     * It is reused by startIntroLoop and intro ended handling.
     */
    this.introAudio.currentTime = 0;
    this.introAudio.play().catch(() => {
        this.introUnlockPending = true;
    });
};

AudioManager.prototype.stopIntroLoopWithFade = function (fadeDuration = 1200) {
    /**
     * Stops the intro loop, optionally fading the tail of the track first.
     * It coordinates timing helpers before pause and reset are applied.
     */
    if (!this.introAudio) return;
    this.deactivateIntroLoop();

    if (this.introAudio.paused) {
        this.resetIntroAudio();
        return;
    }

    this.scheduleIntroFade(fadeDuration);
};

/**
 * Clears intro loop flags before the remaining stop or fade work continues.
 * It supports stopIntroLoopWithFade and keeps state changes in one place.
 */
AudioManager.prototype.deactivateIntroLoop = function () {
    this.introLoopActive = false;
    this.introUnlockPending = false;
    this.clearIntroFadeTimeout();
};

AudioManager.prototype.resetIntroAudio = function () {
    /**
     * Resets the intro source to its starting position and base volume.
     * It is shared by stopIntroLoopWithFade and fade completion.
     */
    this.introAudio.currentTime = 0;
    this.introAudio.volume = this.muted ? 0 : this.introVolume;
};

AudioManager.prototype.scheduleIntroFade = function (fadeDuration) {
    /**
     * Schedules the intro fade to start shortly before the clip ends.
     * It is the timed branch used by stopIntroLoopWithFade.
     */
    const remainingMs = this.getRemainingIntroTimeMs();
    const fadeDelay = Math.max(0, remainingMs - fadeDuration);

    this.introFadeTimeout = setTimeout(() => {
        this.fadeAudioOut(this.introAudio, fadeDuration, () => this.finishIntroFade());
    }, fadeDelay);
};

AudioManager.prototype.getRemainingIntroTimeMs = function () {
    /**
     * Returns the remaining intro playback time in milliseconds.
     * It helps scheduleIntroFade start the fade near the natural ending.
     */
    const duration = this.introAudio?.duration || 0;
    const currentTime = this.introAudio?.currentTime || 0;
    return Math.max(0, (duration - currentTime) * 1000);
};

AudioManager.prototype.finishIntroFade = function () {
    /**
     * Finalizes the intro fade by pausing and resetting the source.
     * It is passed as the completion callback to fadeAudioOut.
     */
    this.introAudio.pause();
    this.resetIntroAudio();
};

AudioManager.prototype.handleIntroEnded = function () {
    /**
     * Restarts the intro track while the start screen is active and unmuted.
     * It works together with startIntroLoop after each completed pass.
     */
    this.clearIntroFadeTimeout();
    if (!this.introAudio) return;

    if (!this.shouldReplayIntro()) {
        this.resetIntroAudio();
        return;
    }

    this.restartIntroAfterEnd();
};

/**
 * Restarts intro playback after the ended event confirmed another loop is allowed.
 * It keeps handleIntroEnded focused on loop decisions instead of playback details.
 */
AudioManager.prototype.restartIntroAfterEnd = function () {
    this.introAudio.volume = this.introVolume;
    this.playIntroAudio();
};

AudioManager.prototype.shouldReplayIntro = function () {
    /**
     * Checks whether the intro should loop again after the track ended.
     * It separates handleIntroEnded decisions from playback actions.
     */
    return this.introLoopActive && !this.muted;
};

AudioManager.prototype.fadeAudioOut = function (audio, duration = 800, onComplete = null) {
    /**
     * Fades one audio node to silence and then runs an optional callback.
     * It supports intro fade-outs without interrupting the rest of the manager.
     */
    if (!audio) {
        return;
    }

    const startVolume = audio.volume;
    const startTime = performance.now();
    requestAnimationFrame((now) => this.stepFadeOut(audio, startVolume, startTime, duration, onComplete, now));
};

AudioManager.prototype.stepFadeOut = function (audio, startVolume, startTime, duration, onComplete, now) {
    /**
     * Processes one animation-frame step of the fade-out sequence.
     * It recursively continues the fade for fadeAudioOut until completion.
     */
    const progress = this.getFadeProgress(startTime, duration, now);
    audio.volume = Math.max(0, startVolume * (1 - progress));

    if (progress < 1 && !audio.paused) {
        requestAnimationFrame((time) => this.stepFadeOut(audio, startVolume, startTime, duration, onComplete, time));
        return;
    }

    this.finishFadeCallback(onComplete);
};

/**
 * Returns the normalized progress value for one fade step update.
 * It supports stepFadeOut so the frame callback stays compact.
 */
AudioManager.prototype.getFadeProgress = function (startTime, duration, now) {
    return Math.min(1, (now - startTime) / duration);
};

/**
 * Executes the optional fade completion callback once the fade fully finished.
 * It is used by stepFadeOut after no more animation frames are required.
 */
AudioManager.prototype.finishFadeCallback = function (onComplete) {
    if (typeof onComplete === 'function') {
        onComplete();
    }
};

AudioManager.prototype.startGameplayLoop = function () {
    /**
     * Starts the gameplay music loop with its shared base settings.
     * It works with stopGameplayLoop and mute-state synchronization.
     */
    if (!this.gameplayAudio) {
        return;
    }

    this.prepareGameplayLoop();

    if (this.gameplayAudio.paused) {
        this.playGameplayAudio();
    }
};

/**
 * Applies loop flags and audio settings before gameplay music playback starts.
 * It keeps startGameplayLoop within the requested function-size limit.
 */
AudioManager.prototype.prepareGameplayLoop = function () {
    this.gameplayLoopActive = true;
    this.gameplayAudio.muted = this.muted;
    this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');
};

/**
 * Starts gameplay music from the beginning and ignores browser playback rejections.
 * It is called by startGameplayLoop once the shared state is prepared.
 */
AudioManager.prototype.playGameplayAudio = function () {
    this.gameplayAudio.currentTime = 0;
    this.gameplayAudio.play().catch(() => {});
};

AudioManager.prototype.stopGameplayLoop = function () {
    /**
     * Stops and rewinds the gameplay music loop.
     * It is used by stopAll and when the start screen becomes active again.
     */
    if (!this.gameplayAudio) {
        return;
    }

    this.gameplayLoopActive = false;
    this.gameplayAudio.pause();
    this.gameplayAudio.currentTime = 0;
};
