AudioManager.prototype.preloadSounds = function () {
    /**
     * Preloads base audio objects and prepares intro and gameplay tracks.
     * It works with configureIntroAudio and configureGameplayAudio.
     */
    Object.entries(this.SOUND_PATHS).forEach(([name, path]) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = this.getDefaultVolume(name);
        this.baseAudios[name] = audio;
    });

    this.configureIntroAudio();
    this.configureGameplayAudio();
};

AudioManager.prototype.configureIntroAudio = function () {
    /**
     * Prepares the non-looping intro source and its ended callback.
     * It is used once during preloadSounds and later by intro controls.
     */
    this.introAudio = this.baseAudios.intro_bubble_sound;

    if (!this.introAudio) {
        return;
    }

    this.introAudio.loop = false;
    this.introAudio.volume = this.muted ? 0 : this.introVolume;
    this.introAudio.muted = this.muted;
    this.introAudio.addEventListener('ended', () => this.handleIntroEnded());
};

AudioManager.prototype.configureGameplayAudio = function () {
    /**
     * Prepares the looping gameplay source with its default volume.
     * It is called from preloadSounds before gameplay loop methods run.
     */
    this.gameplayAudio = this.baseAudios.elevator_sound;

    if (!this.gameplayAudio) {
        return;
    }

    this.gameplayAudio.loop = true;
    this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');
    this.gameplayAudio.muted = this.muted;
};

AudioManager.prototype.registerUnlockListeners = function () {
    /**
     * Registers input listeners that retry intro playback after browser blocks.
     * It cooperates with handleUnlockInteraction and startIntroLoop.
     */
    const unlock = () => this.handleUnlockInteraction();
    ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
        window.addEventListener(eventName, unlock, { passive: true });
    });
};

AudioManager.prototype.handleUnlockInteraction = function () {
    /**
     * Restarts the intro loop after the first eligible user interaction.
     * It is called by registerUnlockListeners when autoplay was blocked.
     */
    if (!this.introUnlockPending || !this.isStartScreenVisible()) {
        return;
    }

    this.introUnlockPending = false;
    this.startIntroLoop();
};

AudioManager.prototype.canPlay = function (name, cooldown = 0) {
    /**
     * Checks mute and cooldown state before a sound effect is cloned.
     * It supports play so rapid collisions do not spam audio.
     */
    if (this.muted) {
        return false;
    }

    return this.isCooldownReady(name, cooldown);
};

/**
 * Checks and stores the playback timestamp for one sound effect cooldown.
 * It keeps canPlay within the size rule while preserving cooldown behavior.
 */
AudioManager.prototype.isCooldownReady = function (name, cooldown = 0) {
    const now = Date.now();
    const lastPlayedAt = this.lastPlayedAt[name] ?? 0;

    if (cooldown > 0 && now - lastPlayedAt < cooldown) {
        return false;
    }

    this.lastPlayedAt[name] = now;
    return true;
};

AudioManager.prototype.play = function (name, options = {}) {
    /**
     * Clones and plays a single effect instance with optional cooldown control.
     * It relies on canPlay and createEffectAudio for safe playback.
     */
    const { cooldown = 0, volume = this.getDefaultVolume(name) } = options;

    if (!this.canPlay(name, cooldown)) {
        return null;
    }

    return this.playEffectAudio(name, volume);
};

AudioManager.prototype.playEffectAudio = function (name, volume) {
    /**
     * Creates one playable effect instance and starts playback immediately.
     * It is the internal effect branch behind play.
     */
    const effectAudio = this.createEffectAudio(name, volume);

    if (!effectAudio) {
        return null;
    }

    effectAudio.play().catch(() => this.cleanupEffectAudio(effectAudio));
    return effectAudio;
};

AudioManager.prototype.createEffectAudio = function (name, volume) {
    /**
     * Builds a cloned effect node and registers its cleanup callbacks.
     * It is shared by playEffectAudio and the effect cleanup helpers.
     */
    const baseAudio = this.baseAudios[name];

    if (!baseAudio) {
        return null;
    }

    const effectAudio = this.cloneEffectAudio(baseAudio, volume);
    this.registerEffectCleanup(effectAudio);
    this.activeEffectAudios.add(effectAudio);
    return effectAudio;
};

/**
 * Clones one base audio node and applies volume and mute settings to it.
 * It supports createEffectAudio before cleanup listeners are attached.
 */
AudioManager.prototype.cloneEffectAudio = function (baseAudio, volume) {
    const effectAudio = baseAudio.cloneNode(true);
    effectAudio.volume = volume;
    effectAudio.muted = this.muted;
    return effectAudio;
};

AudioManager.prototype.registerEffectCleanup = function (effectAudio) {
    /**
     * Attaches ended and pause listeners so cloned effects clean themselves up.
     * It supports createEffectAudio and active effect bookkeeping.
     */
    const cleanup = () => this.cleanupEffectAudio(effectAudio);
    effectAudio._cleanupHandler = cleanup;
    effectAudio.addEventListener('ended', cleanup);
    effectAudio.addEventListener('pause', cleanup);
};

AudioManager.prototype.cleanupEffectAudio = function (effectAudio) {
    /**
     * Removes one cloned effect from the active pool and detaches listeners.
     * It is triggered after playback ends or when play fails.
     */
    this.activeEffectAudios.delete(effectAudio);

    if (effectAudio._cleanupHandler) {
        effectAudio.removeEventListener('ended', effectAudio._cleanupHandler);
        effectAudio.removeEventListener('pause', effectAudio._cleanupHandler);
        delete effectAudio._cleanupHandler;
    }
};
