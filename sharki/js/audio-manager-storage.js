AudioManager.prototype.loadMuteState = function () {
    /**
     * Reads the saved mute flag from local storage.
     * It feeds the constructor so the initial audio state stays consistent.
     */
    try {
        return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch (error) {
        return false;
    }
};

AudioManager.prototype.saveMuteState = function () {
    /**
     * Persists the current mute state for later sessions.
     * It is triggered by toggleMute and setMuted after applyMuteState.
     */
    try {
        localStorage.setItem(this.STORAGE_KEY, String(this.muted));
    } catch (error) {
        // Ignore storage access issues in private or blocked contexts.
    }
};

AudioManager.prototype.applyMuteState = function () {
    /**
     * Synchronizes mute flags and loop playback with the current setting.
     * It coordinates intro and gameplay loops after user or boot changes.
     */
    this.syncIntroMuteState();
    this.syncGameplayMuteState();
    this.syncEffectMuteState();
};

AudioManager.prototype.syncIntroMuteState = function () {
    /**
     * Updates intro audio flags and restarts the loop when needed.
     * It supports applyMuteState and startIntroLoop recovery on unmute.
     */
    if (!this.introAudio) {
        return;
    }

    this.introAudio.muted = this.muted;
    this.introAudio.volume = this.muted ? 0 : this.introVolume;

    if (this.shouldResumeIntroLoop()) {
        this.startIntroLoop();
    }
};

AudioManager.prototype.shouldResumeIntroLoop = function () {
    /**
     * Decides whether the intro loop should resume after a mute change.
     * It is evaluated by syncIntroMuteState before restarting playback.
     */
    return !this.muted
        && this.introLoopActive
        && this.introAudio
        && this.introAudio.paused
        && this.isStartScreenVisible();
};

AudioManager.prototype.syncGameplayMuteState = function () {
    /**
     * Updates gameplay audio flags and optionally resumes or pauses music.
     * It complements syncIntroMuteState inside applyMuteState.
     */
    if (!this.gameplayAudio) {
        return;
    }

    this.applyGameplayMuteSettings();
    this.handleGameplayMutePlayback();
};

/**
 * Applies mute and volume values to the gameplay audio source.
 * It supports syncGameplayMuteState before playback decisions are evaluated.
 */
AudioManager.prototype.applyGameplayMuteSettings = function () {
    this.gameplayAudio.muted = this.muted;
    this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');
};

/**
 * Resumes or pauses gameplay music after mute settings were synchronized.
 * It keeps syncGameplayMuteState focused on the high-level mute flow.
 */
AudioManager.prototype.handleGameplayMutePlayback = function () {
    if (this.shouldResumeGameplayLoop()) {
        this.startGameplayLoop();
    }

    if (this.muted) {
        this.gameplayAudio.pause();
    }
};

AudioManager.prototype.shouldResumeGameplayLoop = function () {
    /**
     * Checks whether gameplay music should restart after a mute change.
     * It prevents applyMuteState from starting music on the start screen.
     */
    return !this.muted
        && this.gameplayLoopActive
        && this.gameplayAudio
        && this.gameplayAudio.paused
        && !this.isStartScreenVisible();
};

AudioManager.prototype.syncEffectMuteState = function () {
    /**
     * Pushes the mute flag to all currently active effect instances.
     * It completes applyMuteState after intro and gameplay updates.
     */
    this.activeEffectAudios.forEach((audio) => {
        audio.muted = this.muted;
    });
};

window.gameAudio = new AudioManager();
