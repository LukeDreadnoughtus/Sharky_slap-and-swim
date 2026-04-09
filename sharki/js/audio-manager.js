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
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit preloadSounds, registerUnlockListeners zusammen.
     */

    constructor() {
        this.muted = this.loadMuteState();
        this.preloadSounds();
        this.applyMuteState();
        this.registerUnlockListeners();
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit getDefaultVolume, handleIntroEnded zusammen.
     * - Greift dabei auf Audio zu.
     */

    preloadSounds() {
        Object.entries(this.SOUND_PATHS).forEach(([name, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = this.getDefaultVolume(name);
            this.baseAudios[name] = audio;
        });

        this.introAudio = this.baseAudios.intro_bubble_sound;
        if (this.introAudio) {
            this.introAudio.loop = false;
            this.introAudio.volume = this.muted ? 0 : this.introVolume;
            this.introAudio.muted = this.muted;
            this.introAudio.addEventListener('ended', () => this.handleIntroEnded());
        }

        this.gameplayAudio = this.baseAudios.elevator_sound;
        if (this.gameplayAudio) {
            this.gameplayAudio.loop = true;
            this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');
            this.gameplayAudio.muted = this.muted;
        }
    }

    loadMuteState() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    saveMuteState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, String(this.muted));
        } catch (error) {
            // localStorage nicht verfügbar
        }
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit isStartScreenVisible, startIntroLoop zusammen.
     */

    registerUnlockListeners() {
        const unlock = () => {
            if (!this.introUnlockPending || !this.isStartScreenVisible()) {
                return;
            }

            this.introUnlockPending = false;
            this.startIntroLoop();
        };

        ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
            window.addEventListener(eventName, unlock, { passive: true });
        });
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Greift dabei auf DOM zu.
     */

    isStartScreenVisible() {
        const startScreen = document.getElementById('startscreen');
        return Boolean(startScreen && !startScreen.classList.contains('startscreen--hide'));
    }

    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
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

    canPlay(name, cooldown = 0) {
        if (this.muted) {
            return false;
        }

        const now = Date.now();
        const lastPlayedAt = this.lastPlayedAt[name] ?? 0;

        if (cooldown > 0 && now - lastPlayedAt < cooldown) {
            return false;
        }

        this.lastPlayedAt[name] = now;
        return true;
    }

    play(name, options = {}) {
        const { cooldown = 0, volume = this.getDefaultVolume(name) } = options;

        if (!this.canPlay(name, cooldown)) {
            return null;
        }

        const baseAudio = this.baseAudios[name];

        if (!baseAudio) {
            return null;
        }

        const effectAudio = baseAudio.cloneNode(true);
        effectAudio.volume = volume;
        effectAudio.muted = this.muted;

        const cleanup = () => {
            this.activeEffectAudios.delete(effectAudio);
            effectAudio.removeEventListener('ended', cleanup);
            effectAudio.removeEventListener('pause', cleanup);
        };

        effectAudio.addEventListener('ended', cleanup);
        effectAudio.addEventListener('pause', cleanup);
        this.activeEffectAudios.add(effectAudio);

        effectAudio.play().catch(() => {
            cleanup();
        });

        return effectAudio;
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit clearIntroFadeTimeout zusammen.
     * - Greift dabei auf Audio zu.
     */

    startIntroLoop() {
        if (!this.introAudio) {
            return;
        }

        this.clearIntroFadeTimeout();
        this.introLoopActive = true;
        this.introAudio.volume = this.muted ? 0 : this.introVolume;
        this.introAudio.muted = this.muted;

        if (!this.introAudio.paused) {
            return;
        }

        this.introAudio.currentTime = 0;
        this.introAudio.play().catch(() => {
            this.introUnlockPending = true;
        });
    }

    stopIntroLoopWithFade(fadeDuration = 1200) {
        if (!this.introAudio) {
            return;
        }

        this.introLoopActive = false;
        this.introUnlockPending = false;
        this.clearIntroFadeTimeout();

        if (this.introAudio.paused) {
            this.introAudio.currentTime = 0;
            this.introAudio.volume = this.muted ? 0 : this.introVolume;
            return;
        }

        const remainingTimeMs = Math.max(0, ((this.introAudio.duration || 0) - this.introAudio.currentTime) * 1000);
        const fadeDelay = Math.max(0, remainingTimeMs - fadeDuration);

        this.introFadeTimeout = setTimeout(() => {
            this.fadeAudioOut(this.introAudio, fadeDuration, () => {
                this.introAudio.pause();
                this.introAudio.currentTime = 0;
                this.introAudio.volume = this.muted ? 0 : this.introVolume;
            });
        }, fadeDelay);
    }

    /**
     * - Reagiert auf ein Ereignis und verarbeitet die passende Folgeaktion.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit clearIntroFadeTimeout zusammen.
     * - Greift dabei auf Audio zu.
     */

    handleIntroEnded() {
        this.clearIntroFadeTimeout();

        if (!this.introAudio) {
            return;
        }

        if (!this.introLoopActive || this.muted) {
            this.introAudio.currentTime = 0;
            this.introAudio.volume = this.muted ? 0 : this.introVolume;
            return;
        }

        this.introAudio.currentTime = 0;
        this.introAudio.volume = this.introVolume;
        this.introAudio.play().catch(() => {
            this.introUnlockPending = true;
        });
    }

    fadeAudioOut(audio, duration = 800, onComplete = null) {
        if (!audio) {
            return;
        }

        const startVolume = audio.volume;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            audio.volume = Math.max(0, startVolume * (1 - progress));

            if (progress < 1 && !audio.paused) {
                requestAnimationFrame(step);
                return;
            }

            if (typeof onComplete === 'function') {
                onComplete();
            }
        };

        requestAnimationFrame(step);
    }

    /**
     * - Beendet, leert oder setzt einen Ablauf wieder zurück.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     */

    clearIntroFadeTimeout() {
        if (this.introFadeTimeout) {
            clearTimeout(this.introFadeTimeout);
            this.introFadeTimeout = null;
        }
    }


    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit getDefaultVolume zusammen.
     * - Greift dabei auf Audio zu.
     */

    startGameplayLoop() {
        if (!this.gameplayAudio) {
            return;
        }

        this.gameplayLoopActive = true;
        this.gameplayAudio.muted = this.muted;
        this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');

        if (!this.gameplayAudio.paused) {
            return;
        }

        this.gameplayAudio.currentTime = 0;
        this.gameplayAudio.play().catch(() => {});
    }

    /**
     * - Beendet, leert oder setzt einen Ablauf wieder zurück.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     */

    stopGameplayLoop() {
        if (!this.gameplayAudio) {
            return;
        }

        this.gameplayLoopActive = false;
        this.gameplayAudio.pause();
        this.gameplayAudio.currentTime = 0;
    }

    /**
     * - Beendet, leert oder setzt einen Ablauf wieder zurück.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     */

    stopAllEffects() {
        this.activeEffectAudios.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeEffectAudios.clear();
    }

    /**
     * - Beendet, leert oder setzt einen Ablauf wieder zurück.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit stopGameplayLoop, stopAllEffects zusammen.
     */

    stopAll() {
        this.stopIntroLoopWithFade(0);
        this.stopGameplayLoop();
        this.stopAllEffects();
    }

    /**
     * - Schaltet einen Modus oder UI-Zustand gezielt um.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit applyMuteState zusammen.
     */

    toggleMute() {
        this.muted = !this.muted;
        this.applyMuteState();
        this.saveMuteState();
        return this.muted;
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit applyMuteState zusammen.
     */

    setMuted(isMuted) {
        this.muted = Boolean(isMuted);
        this.applyMuteState();
        this.saveMuteState();
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Gehört zur Steuerlogik von audio manager und verbindet UI, Audio oder Spielstart.
     * - Hängt direkt mit isStartScreenVisible, startIntroLoop zusammen.
     */

    applyMuteState() {
        if (this.introAudio) {
            this.introAudio.muted = this.muted;
            this.introAudio.volume = this.muted ? 0 : this.introVolume;

            if (!this.muted && this.introLoopActive && this.introAudio.paused && this.isStartScreenVisible()) {
                this.startIntroLoop();
            }
        }

        if (this.gameplayAudio) {
            this.gameplayAudio.muted = this.muted;
            this.gameplayAudio.volume = this.getDefaultVolume('elevator_sound');

            if (!this.muted && this.gameplayLoopActive && this.gameplayAudio.paused && !this.isStartScreenVisible()) {
                this.startGameplayLoop();
            }

            if (this.muted) {
                this.gameplayAudio.pause();
            }
        }

        this.activeEffectAudios.forEach((audio) => {
            audio.muted = this.muted;
        });
    }
}

window.gameAudio = new AudioManager();