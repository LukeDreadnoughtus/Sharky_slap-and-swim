class AudioManager {
    STORAGE_KEY = 'sharki_audio_muted';

    SOUND_PATHS = {
        intro_bubble_sound: 'audio/intro_bubble_sound.mp3',
        bite_sound: 'audio/bite_sound.mp3',
        bottle_sound: 'audio/bottle_sound.mp3',
        bubble_sound: 'audio/bubble_sound.mp3',
        coin_sound: 'audio/coin_sound.mp3',
        electricity_sound: 'audio/electricity_sound.mp3',
        elevator_sound: 'audio/elevator_sound.mp3',
        monster_roar_sound: 'audio/monster_roar_sound.mp3',
        poison_sound: 'audio/poison_sound.mp3',
        slap_sound: 'audio/slap_sound.mp3'
    };

    baseAudios = {};
    activeEffectAudios = new Set();
    lastPlayedAt = {};
    muted = false;
    introAudio = null;
    introLoopActive = false;
    gameplayAudio = null;
    gameplayLoopActive = false;
    introFadeTimeout = null;
    introUnlockPending = false;
    introVolume = 0.4;

    /**
     * Creates the audio manager and wires the shared boot sequence.
     * It cooperates with preloadSounds and registerUnlockListeners.
     */
    constructor() {
        this.muted = this.loadMuteState();
        this.preloadSounds();
        this.applyMuteState();
        this.registerUnlockListeners();
    }

    /**
     * Returns the configured default volume for one named sound.
     * It is reused by preloadSounds, play, and gameplay loop updates.
     */
    getDefaultVolume(name) {
        const volumes = {
            intro_bubble_sound: 0.4,
            bite_sound: 0.6,
            bottle_sound: 0.6,
            bubble_sound: 0.5,
            coin_sound: 0.55,
            electricity_sound: 0.65,
            elevator_sound: 0.3,
            monster_roar_sound: 0.75,
            poison_sound: 0.6,
            slap_sound: 0.6
        };

        return volumes[name] ?? 1;
    }

    /**
     * Checks whether the start screen is still visible in the DOM.
     * It supports intro loop logic and mute-state recovery.
     */
    isStartScreenVisible() {
        const startScreen = document.getElementById('startscreen');
        return Boolean(startScreen && !startScreen.classList.contains('startscreen--hide'));
    }

    /**
     * Clears a pending intro fade timeout before a new audio action starts.
     * It is shared by startIntroLoop, stopIntroLoopWithFade, and handleIntroEnded.
     */
    clearIntroFadeTimeout() {
        if (!this.introFadeTimeout) {
            return;
        }

        clearTimeout(this.introFadeTimeout);
        this.introFadeTimeout = null;
    }

    /**
     * Stops every currently active effect instance and resets the cache.
     * It works together with stopAll when the game leaves the action state.
     */
    stopAllEffects() {
        this.activeEffectAudios.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });

        this.activeEffectAudios.clear();
    }

    /**
     * Stops intro, gameplay, and effect audio in one shared cleanup call.
     * It coordinates the dedicated loop stop methods and effect cleanup.
     */
    stopAll() {
        this.stopIntroLoopWithFade(0);
        this.stopGameplayLoop();
        this.stopAllEffects();
    }

    /**
     * Toggles the mute state and persists it for the next session.
     * It delegates the actual sync work to applyMuteState and saveMuteState.
     */
    toggleMute() {
        this.muted = !this.muted;
        this.applyMuteState();
        this.saveMuteState();
        return this.muted;
    }

    /**
     * Applies an explicit mute state and stores the updated preference.
     * It keeps UI-triggered changes aligned with applyMuteState.
     */
    setMuted(isMuted) {
        this.muted = Boolean(isMuted);
        this.applyMuteState();
        this.saveMuteState();
    }
}
