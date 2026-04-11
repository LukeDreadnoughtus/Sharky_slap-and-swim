
const BASE_CANVAS_WIDTH = 820;
const BASE_CANVAS_HEIGHT = 480;
const MOBILE_BREAKPOINT = 1024;
const MOBILE_CONTROLS_HEIGHT = 92;
const MAX_DESKTOP_STAGE_RATIO = 1;

/**
 * - Prüft einen Zustand oder liefert eine boolesche Aussage.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 */

function isTouchViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * - Prüft einen Zustand oder liefert eine boolesche Aussage.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport zusammen.
 */

function isPortraitTouchDevice() {
    return isTouchViewport() && window.innerHeight > window.innerWidth;
}

/**
 * - Liest Daten aus und gibt einen passenden Wert zurück.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 */

function getViewportMetrics() {
    const viewport = window.visualViewport;
    const width = Math.max(Math.round((viewport && viewport.width) || window.innerWidth || BASE_CANVAS_WIDTH), 280);
    const height = Math.max(Math.round((viewport && viewport.height) || window.innerHeight || BASE_CANVAS_HEIGHT), 180);
    return { width, height };
}

/**
 * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit getViewportMetrics zusammen.
 * - Greift dabei auf DOM zu.
 */

function syncViewportCssVars() {
    const { width, height } = getViewportMetrics();
    document.documentElement.style.setProperty('--vvh', `${height}px`);
    document.documentElement.style.setProperty('--app-height', `${height}px`);
    document.documentElement.style.setProperty('--vvw', `${width}px`);
    document.documentElement.style.setProperty('--safe-top', `${Math.max(0, Math.round((window.visualViewport && window.visualViewport.offsetTop) || 0))}px`);
}

/**
 * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport, isPortraitTouchDevice zusammen.
 * - Greift dabei auf world, canvas, DOM zu.
 */

function syncGameViewport() {
    const gameWrapper = getGameWrapper();
    const targetCanvas = document.getElementById('canvas');
    const title = document.querySelector('h1');

    if (!gameWrapper || !targetCanvas) {
        return;
    }

    const nativeFullscreenActive = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    const fullscreenMode = nativeFullscreenActive || pseudoFullscreenActive;
    const touchLandscapeMode = isTouchViewport() && !isPortraitTouchDevice();
    syncViewportCssVars();
    const { width: viewportWidth, height: viewportHeight } = getViewportMetrics();
    const titleVisible = title && window.getComputedStyle(title).display !== 'none' && window.getComputedStyle(title).visibility !== 'hidden';
    const titleHeight = titleVisible ? title.offsetHeight + 20 : 0;
    const safeTop = Math.max(0, Math.round((window.visualViewport && window.visualViewport.offsetTop) || 0));
    const safeBottomInset = Math.max(0, Math.round((window.innerHeight || viewportHeight) - viewportHeight - safeTop));
    const safeHorizontalInset = Math.max(0, Math.round(((window.innerWidth || viewportWidth) - viewportWidth) / 2));
    const stagePaddingX = touchLandscapeMode ? Math.max(8, safeHorizontalInset + 6) : 12;
    const stagePaddingTop = touchLandscapeMode ? Math.max(8, safeTop + 4) : 10;
    const stagePaddingBottom = touchLandscapeMode ? Math.max(8, safeBottomInset + 4) : 10;
    const controlsReservedHeight = touchLandscapeMode ? MOBILE_CONTROLS_HEIGHT + safeBottomInset : 0;
    const baseAspectRatio = BASE_CANVAS_WIDTH / BASE_CANVAS_HEIGHT;

    let stageWidth = BASE_CANVAS_WIDTH;
    let stageHeight = BASE_CANVAS_HEIGHT;
    let renderWidth = BASE_CANVAS_WIDTH;
    let renderHeight = BASE_CANVAS_HEIGHT;
    let canvasTopOffset = 0;

    if (fullscreenMode) {
        stageWidth = viewportWidth;
        stageHeight = viewportHeight;

        if (stageWidth / stageHeight > baseAspectRatio) {
            renderHeight = stageHeight;
            renderWidth = Math.round(stageHeight * baseAspectRatio);
        } else {
            renderWidth = stageWidth;
            renderHeight = Math.round(stageWidth / baseAspectRatio);
        }

        canvasTopOffset = Math.max(0, Math.round((stageHeight - renderHeight) / 2));
    } else if (touchLandscapeMode) {
        stageWidth = viewportWidth;
        stageHeight = viewportHeight;

        const availableWidth = Math.max(stageWidth - stagePaddingX * 2, 280);
        const availableHeight = Math.max(stageHeight - stagePaddingTop - stagePaddingBottom - controlsReservedHeight, 180);
        const scale = Math.min(availableWidth / BASE_CANVAS_WIDTH, availableHeight / BASE_CANVAS_HEIGHT);

        renderWidth = Math.round(BASE_CANVAS_WIDTH * scale);
        renderHeight = Math.round(BASE_CANVAS_HEIGHT * scale);

        const verticalFreeSpace = Math.max(0, availableHeight - renderHeight);
        const desiredTopBias = Math.min(20, Math.round(verticalFreeSpace * 0.42));
        canvasTopOffset = stagePaddingTop + desiredTopBias;
    } else {
        const maxAvailableWidth = Math.max(viewportWidth - 24, 280);
        const maxAvailableHeight = Math.max(viewportHeight - titleHeight - 24, 180);
        const fittedScale = Math.min(maxAvailableWidth / BASE_CANVAS_WIDTH, maxAvailableHeight / BASE_CANVAS_HEIGHT, MAX_DESKTOP_STAGE_RATIO);

        stageWidth = Math.round(BASE_CANVAS_WIDTH * fittedScale);
        stageHeight = Math.round(BASE_CANVAS_HEIGHT * fittedScale);
        renderWidth = stageWidth;
        renderHeight = stageHeight;
        canvasTopOffset = Math.max(0, Math.round((stageHeight - renderHeight) / 2));
    }

    const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);

    gameWrapper.classList.toggle('game-wrapper--fullscreen', fullscreenMode);
    gameWrapper.classList.toggle('game-wrapper--pseudo-fullscreen', pseudoFullscreenActive && !nativeFullscreenActive);
    gameWrapper.classList.toggle('game-wrapper--touch-landscape', touchLandscapeMode);
    document.body.classList.toggle('fullscreen-active', fullscreenMode);
    document.body.classList.toggle('pseudo-fullscreen-active', pseudoFullscreenActive && !nativeFullscreenActive);
    document.body.classList.toggle('touch-landscape', touchLandscapeMode);

    gameWrapper.style.setProperty('--stage-width', `${stageWidth}px`);
    gameWrapper.style.setProperty('--stage-height', `${stageHeight}px`);
    gameWrapper.style.width = `${stageWidth}px`;
    gameWrapper.style.height = `${stageHeight}px`;

    targetCanvas.width = Math.round(BASE_CANVAS_WIDTH * devicePixelRatio);
    targetCanvas.height = Math.round(BASE_CANVAS_HEIGHT * devicePixelRatio);
    targetCanvas.style.width = `${Math.round(renderWidth)}px`;
    targetCanvas.style.height = `${Math.round(renderHeight)}px`;
    targetCanvas.style.left = '50%';
    targetCanvas.style.top = `${canvasTopOffset}px`;
    targetCanvas.style.transform = 'translateX(-50%)';

    if (world) {
        world.setRenderScale(devicePixelRatio);
    }
}

const FULLSCREEN_ICONS = {
    enter: 'sharki/img/6.Botones/Full Screen/Mesa de trabajo 6.png',
    exit: 'sharki/img/6.Botones/Full Screen/Mesa de trabajo 9.png'
};

let pseudoFullscreenActive = false;

function shouldAutoEnterResponsiveFullscreen() {
    return isTouchViewport() && !isPortraitTouchDevice();
}

async function ensureResponsiveFullscreen() {
    const gameWrapper = getGameWrapper();

    if (!gameWrapper) {
        return;
    }

    if (!shouldAutoEnterResponsiveFullscreen() || isFullscreenActive()) {
        return;
    }

    // Nur CSS-/Pseudo-Fullscreen automatisch aktivieren
    pseudoFullscreenActive = true;
    gameWrapper.classList.add('game-wrapper--pseudo-fullscreen');

    updateFullscreenButtonIcon();
    syncGameViewport();
}

/**
 * - Liest Daten aus und gibt einen passenden Wert zurück.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Greift dabei auf DOM zu.
 */

function getGameWrapper() {
    return document.querySelector('.game-wrapper');
}

/**
 * - Prüft einen Zustand oder liefert eine boolesche Aussage.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Greift dabei auf DOM zu.
 */

function isFullscreenActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || pseudoFullscreenActive);
}

/**
 * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isFullscreenActive zusammen.
 * - Greift dabei auf DOM zu.
 */

function updateFullscreenButtonIcon() {
    const fullscreenIcon = document.getElementById('fullscreenIcon');

    if (!fullscreenIcon) {
        return;
    }

    fullscreenIcon.src = isFullscreenActive() ? FULLSCREEN_ICONS.exit : FULLSCREEN_ICONS.enter;
}

/**
 * - Schaltet einen Modus oder UI-Zustand gezielt um.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport, getViewportMetrics zusammen.
 * - Greift dabei auf world, DOM zu.
 */

async function toggleFullscreenMode() {
    const gameWrapper = getGameWrapper();

    if (!gameWrapper) {
        return;
    }

    const exitNativeFullscreen = async () => {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
            return true;
        }

        if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            return true;
        }

        return false;
    };

    const requestNativeFullscreen = async () => {
        const preferDocumentElement = isTouchViewport();
        const candidates = preferDocumentElement
            ? [document.documentElement, gameWrapper]
            : [gameWrapper, document.documentElement];

        for (const candidate of candidates) {
            if (!candidate) {
                continue;
            }

            if (candidate.requestFullscreen) {
                await candidate.requestFullscreen();
                return true;
            }

            if (candidate.webkitRequestFullscreen) {
                candidate.webkitRequestFullscreen();
                return true;
            }
        }

        return false;
    };

    try {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            await exitNativeFullscreen();
            pseudoFullscreenActive = false;
        } else if (pseudoFullscreenActive) {
            pseudoFullscreenActive = false;
            gameWrapper.classList.remove('game-wrapper--pseudo-fullscreen');
        } else {
            const enteredNativeFullscreen = await requestNativeFullscreen();

            if (!enteredNativeFullscreen) {
                pseudoFullscreenActive = true;
                gameWrapper.classList.add('game-wrapper--pseudo-fullscreen');
            }
        }
    } catch (error) {
        pseudoFullscreenActive = !pseudoFullscreenActive;
        gameWrapper.classList.toggle('game-wrapper--pseudo-fullscreen', pseudoFullscreenActive);
        console.error('Fullscreen could not be toggled.', error);
    } finally {
        if (isTouchViewport()) {
            try {
                document.documentElement.style.height = `${getViewportMetrics().height}px`;
                document.body.style.height = `${getViewportMetrics().height}px`;
            } catch (error) {
                console.warn('Viewport height could not be set.', error);
            }
            window.scrollTo(0, 1);
        }

        updateFullscreenButtonIcon();
        syncGameViewport();
        window.setTimeout(() => {
            syncViewportCssVars();
            syncGameViewport();
            toggleInGameUi(Boolean(world));
            window.scrollTo(0, 0);
        }, 120);
    }
}

let canvas;
let world;
let currentLevelNumber = 1;

const LEVEL_FACTORIES = {
    1: createLevel1,
    2: createLevel2,
    3: createLevel3
};

let keyboard = new Keyboard();

/**
 * - Beendet, leert oder setzt einen Ablauf wieder zurück.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Greift dabei auf keyboard zu.
 */

function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
    keyboard.S = false;
}

/**
 * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit syncGameViewport, resetKeyboardState zusammen.
 * - Greift dabei auf world, keyboard, level, canvas zu.
 */

function createWorld(levelNumber = 1) {
    canvas = document.getElementById('canvas');

    if (!canvas) {
        return;
    }

    if (world) {
        world.destroy();
    }

    const levelFactory = LEVEL_FACTORIES[levelNumber] ?? createLevel1;
    currentLevelNumber = levelNumber;

    resetKeyboardState();
    world = new World(canvas, keyboard, {
        onCharacterDeath: showGameOverDialog,
        onEndbossDeath: () => showLevelCompleteDialog(currentLevelNumber)
    }, levelFactory);
    syncGameViewport();
    console.log('my Character is', world.character);
}

/**
 * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit createWorld, toggleInGameUi zusammen.
 * - Greift dabei auf level, Audio zu.
 */

async function init(levelNumber = 1) {
    closeResultDialog();
    createWorld(levelNumber);
    toggleInGameUi(true);
    closePauseDialog();
    updateOrientationPrompt();
    await ensureResponsiveFullscreen();

    if (window.gameAudio) {
        window.gameAudio.startGameplayLoop();
    }
}


/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit resetKeyboardState, toggleInGameUi zusammen.
 * - Greift dabei auf world, DOM, Audio zu.
 */

async function showStartScreen() {
    const startScreen = document.getElementById('startscreen');

    if (world) {
        world.destroy();
        world = null;
    }

    if (window.gameAudio) {
        window.gameAudio.stopGameplayLoop();
        window.gameAudio.stopAllEffects();
    }

    currentLevelNumber = 1;
    resetKeyboardState();
    closeResultDialog();
    closePauseDialog();

    if (startScreen) {
        startScreen.classList.remove('startscreen--hide');
    }

    toggleInGameUi(false);
    updateOrientationPrompt();

    if (window.gameAudio) {
        window.gameAudio.startIntroLoop();
    }

    await ensureResponsiveFullscreen();
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit init zusammen.
 */

function restartLevel() {
    init(currentLevelNumber);
}

/**
 * - Schaltet einen Modus oder UI-Zustand gezielt um.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport, isPortraitTouchDevice zusammen.
 * - Greift dabei auf DOM zu.
 */

function toggleInGameUi(show) {
    const settingsBtn = document.getElementById('settingsBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const mobileFullscreenBtn = document.getElementById('mobileFullscreenBtn');
    const touchControls = document.getElementById('touchControls');

    const startScreen = document.getElementById('startscreen');
    const isStartScreenVisible = Boolean(startScreen && !startScreen.classList.contains('startscreen--hide'));

    if (settingsBtn) {
        settingsBtn.classList.toggle('hidden', !(show || isStartScreenVisible));
    }

    if (fullscreenBtn) {
        const showDesktopFullscreen = !isTouchViewport();
        fullscreenBtn.classList.toggle('hidden', !showDesktopFullscreen);
    }

    if (mobileFullscreenBtn) {
        mobileFullscreenBtn.classList.toggle('hidden', !(show && isTouchViewport() && !isPortraitTouchDevice()));
    }

    if (touchControls) {
        const shouldShowTouchControls = show && isTouchViewport() && !isPortraitTouchDevice();
        touchControls.classList.toggle('hidden', !shouldShowTouchControls);
        touchControls.setAttribute('aria-hidden', shouldShowTouchControls ? 'false' : 'true');
    }
}

/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit resetKeyboardState zusammen.
 * - Greift dabei auf world, DOM zu.
 */

function openPauseDialog() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resultOverlay = document.getElementById('resultOverlay');

    if (!pauseOverlay || (resultOverlay && !resultOverlay.classList.contains('hidden'))) {
        return;
    }

    if (world) {
        world.pause();
        resetKeyboardState();
    }

    pauseOverlay.classList.remove('hidden');
}


/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isPortraitTouchDevice zusammen.
 * - Greift dabei auf world, DOM zu.
 */

function closePauseDialog() {
    const pauseOverlay = document.getElementById('pauseOverlay');

    if (pauseOverlay) {
        pauseOverlay.classList.add('hidden');
    }

    if (world && !isPortraitTouchDevice()) {
        world.resume();
    }
}

/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit resetKeyboardState, closePauseDialog zusammen.
 * - Greift dabei auf DOM zu.
 */

function openResultDialog({ title, text = '', showTryAgain = false, showLeave = false, showNextLevel = false }) {
    const resultOverlay = document.getElementById('resultOverlay');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (!resultOverlay || !resultTitle || !resultText || !tryAgainBtn || !leaveGameBtn || !nextLevelBtn) {
        return;
    }

    closePauseDialog();
    resetKeyboardState();

    resultTitle.textContent = title;
    resultText.textContent = text;

    tryAgainBtn.classList.toggle('hidden', !showTryAgain);
    leaveGameBtn.classList.toggle('hidden', !showLeave);
    nextLevelBtn.classList.toggle('hidden', !showNextLevel);

    resultOverlay.classList.remove('hidden');
    updateOrientationPrompt();
}

/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit updateOrientationPrompt zusammen.
 * - Greift dabei auf DOM zu.
 */

function closeResultDialog() {
    const resultOverlay = document.getElementById('resultOverlay');

    if (resultOverlay) {
        resultOverlay.classList.add('hidden');
    }

    updateOrientationPrompt();
}

/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit openResultDialog zusammen.
 */

function showGameOverDialog() {
    openResultDialog({
        title: 'Game Over',
        text: 'Sharki was defeated. Do you want to restart the level or leave the game?',
        showTryAgain: true,
        showLeave: true
    });
}

/**
 * - Steuert Sichtbarkeit oder Interaktion in der Oberfläche.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit openResultDialog zusammen.
 * - Greift dabei auf level zu.
 */

function showLevelCompleteDialog(levelNumber) {
    const hasNextLevel = levelNumber < 3;
    const nextLevelNumber = levelNumber + 1;

    openResultDialog({
        title: 'Level complete',
        text: hasNextLevel
            ? `The endboss has been defeated. You can start Level ${nextLevelNumber} now.`
            : 'The endboss has been defeated. You completed all 3 levels.',
        showLeave: !hasNextLevel,
        showNextLevel: hasNextLevel
    });
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit init, closeResultDialog zusammen.
 */

function goToNextLevel() {
    const nextLevelNumber = currentLevelNumber + 1;

    if (!LEVEL_FACTORIES[nextLevelNumber]) {
        return;
    }

    closeResultDialog();
    init(nextLevelNumber);
}

/**
 * - Prüft einen Zustand oder liefert eine boolesche Aussage.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Greift dabei auf DOM zu.
 */

function isBlockingOverlayOpen() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resultOverlay = document.getElementById('resultOverlay');

    return Boolean(
        (pauseOverlay && !pauseOverlay.classList.contains('hidden')) ||
        (resultOverlay && !resultOverlay.classList.contains('hidden'))
    );
}

/**
 * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport, isPortraitTouchDevice zusammen.
 * - Greift dabei auf world, DOM zu.
 */

function updateOrientationPrompt() {
    const orientationOverlay = document.getElementById('orientationOverlay');

    if (!orientationOverlay) {
        return;
    }

    const shouldBlockGame = isPortraitTouchDevice() || window.matchMedia('(orientation: portrait)').matches && isTouchViewport();
    orientationOverlay.classList.toggle('hidden', !shouldBlockGame);

    if (!world) {
        return;
    }

    if (shouldBlockGame) {
        world.pause();
        resetKeyboardState();
    } else if (!isBlockingOverlayOpen()) {
        world.resume();
    }

    toggleInGameUi(Boolean(world));
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit isTouchViewport zusammen.
 * - Greift dabei auf canvas zu.
 */

function preventMobileViewportGestures(event) {
    if (!isTouchViewport()) {
        return;
    }

    if (event.touches && event.touches.length > 1) {
        event.preventDefault();
        return;
    }

    const target = event.target;
    const controlTarget = target && target.closest && target.closest('.touch-button, .fullscreen-button, .settings-button, .menu-button');
    if (controlTarget) {
        return;
    }

    const gameSurfaceTarget = target && target.closest && target.closest('canvas, .game-wrapper');
    if (gameSurfaceTarget) {
        event.preventDefault();
    }
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 */

function lockTouchButtonInteraction(button) {
    if (!button) {
        return;
    }

    button.setAttribute('draggable', 'false');
    button.style.webkitTouchCallout = 'none';
    button.style.webkitUserSelect = 'none';
    button.style.userSelect = 'none';
    button.addEventListener('contextmenu', (event) => event.preventDefault());
    button.addEventListener('selectstart', (event) => event.preventDefault());
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit lockTouchButtonInteraction zusammen.
 * - Greift dabei auf keyboard zu.
 */

function bindTouchButton(button) {
    if (!button) {
        return;
    }

    const keyName = button.dataset.key;
    lockTouchButtonInteraction(button);

    const press = (event) => {
        event.preventDefault();
        keyboard[keyName] = true;
        button.classList.add('is-active');
    };

    const release = (event) => {
        if (event) {
            event.preventDefault();
        }

        keyboard[keyName] = false;
        button.classList.remove('is-active');
    };

    button.addEventListener('pointerdown', (event) => {
        if (event.pointerId != null && button.setPointerCapture) {
            try {
                button.setPointerCapture(event.pointerId);
            } catch (error) {}
        }
        press(event);
    });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
}

/**
 * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit toggleFullscreenMode, lockTouchButtonInteraction zusammen.
 * - Greift dabei auf DOM zu.
 */

function setupTouchControls() {
    document.querySelectorAll('.touch-button[data-key]').forEach(bindTouchButton);

    const mobileFullscreenBtn = document.getElementById('mobileFullscreenBtn');
    if (mobileFullscreenBtn) {
        lockTouchButtonInteraction(mobileFullscreenBtn);
        mobileFullscreenBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleFullscreenMode();
        });
    }
}

/**
 * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit lockTouchButtonInteraction zusammen.
 */

function bindTap(button, handler) {
    if (!button) {
        return;
    }

    lockTouchButtonInteraction(button);

    let touchHandled = false;
    const runHandler = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        handler();
    };

    button.addEventListener('click', (event) => {
        if (touchHandled) {
            touchHandled = false;
            return;
        }
        runHandler(event);
    });

    button.addEventListener('touchend', (event) => {
        touchHandled = true;
        runHandler(event);
    }, { passive: false });
}


/**
 * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
 * - Gehört zur Steuerlogik von game und verbindet UI, Audio oder Spielstart.
 * - Hängt direkt mit syncViewportCssVars, syncGameViewport zusammen.
 * - Greift dabei auf DOM, Audio zu.
 */

function openLegalNotice() {
    const legalNoticeOverlay = document.getElementById('legalNoticeOverlay');

    if (!legalNoticeOverlay) {
        return;
    }

    legalNoticeOverlay.classList.remove('hidden');
}

function closeLegalNotice() {
    const legalNoticeOverlay = document.getElementById('legalNoticeOverlay');

    if (!legalNoticeOverlay) {
        return;
    }

    legalNoticeOverlay.classList.add('hidden');
}

function setupStartScreen() {
    syncViewportCssVars();
    updateFullscreenButtonIcon();
    syncGameViewport();
    setupTouchControls();
    updateOrientationPrompt();
    const startScreen = document.getElementById('startscreen');
    const startBtn = document.getElementById('startBtn');
    const keyBtn = document.getElementById('keyBtn');
    const keyOverlay = document.getElementById('keyOverlay');
    const backdrop = document.querySelector('.key-overlay__backdrop');
    const legalNoticeBtn = document.getElementById('legalNoticeBtn');
    const legalNoticeOverlay = document.getElementById('legalNoticeOverlay');
    const legalNoticeBackdrop = document.querySelector('.legal-overlay__backdrop');
    const closeLegalNoticeBtn = document.getElementById('closeLegalNoticeBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const closePauseBtn = document.getElementById('closePauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const leaveBtn = document.getElementById('leaveBtn');
    const muteBtn = document.getElementById('muteBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (!startScreen || !startBtn || !keyBtn || !keyOverlay || !backdrop || !legalNoticeBtn || !legalNoticeOverlay || !legalNoticeBackdrop || !closeLegalNoticeBtn || !settingsBtn || !fullscreenBtn || !closePauseBtn || !restartBtn || !leaveBtn || !muteBtn || !tryAgainBtn || !leaveGameBtn || !nextLevelBtn) return;

    document.querySelectorAll('img').forEach((image) => image.setAttribute('draggable', 'false'));

    if (window.gameAudio) {
        window.gameAudio.startIntroLoop();
        muteBtn.textContent = window.gameAudio.muted ? 'Unmute' : 'Mute';
    }

    bindTap(startBtn, async () => {
        startScreen.classList.add('startscreen--hide');

        if (window.gameAudio) {
            window.gameAudio.stopIntroLoopWithFade();
        }

        await ensureResponsiveFullscreen();

        window.setTimeout(() => {
            init(1);
        }, 250);
    });

    bindTap(keyBtn, () => {
        keyOverlay.classList.remove('hidden');
    });

    bindTap(legalNoticeBtn, openLegalNotice);
    bindTap(closeLegalNoticeBtn, closeLegalNotice);
    bindTap(settingsBtn, openPauseDialog);
    bindTap(fullscreenBtn, toggleFullscreenMode);
    bindTap(closePauseBtn, closePauseDialog);
    bindTap(muteBtn, () => {
        if (!window.gameAudio) {
            return;
        }

        const isMuted = window.gameAudio.toggleMute();
        muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    });
    bindTap(restartBtn, restartLevel);
    bindTap(leaveBtn, showStartScreen);
    bindTap(tryAgainBtn, restartLevel);
    bindTap(leaveGameBtn, showStartScreen);
    bindTap(nextLevelBtn, goToNextLevel);

    backdrop.addEventListener('click', () => {
        keyOverlay.classList.add('hidden');
    });
    backdrop.addEventListener('touchend', (event) => {
        event.preventDefault();
        event.stopPropagation();
        keyOverlay.classList.add('hidden');
    }, { passive: false });

    legalNoticeBackdrop.addEventListener('click', closeLegalNotice);
    legalNoticeBackdrop.addEventListener('touchend', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeLegalNotice();
    }, { passive: false });
}

window.addEventListener('load', async () => {
    setupStartScreen();
    await ensureResponsiveFullscreen();
    window.scrollTo(0, 0);
});
window.addEventListener('fullscreenchange', () => {
    updateFullscreenButtonIcon();
    syncGameViewport();
    updateOrientationPrompt();
});
window.addEventListener('webkitfullscreenchange', () => {
    updateFullscreenButtonIcon();
    syncGameViewport();
    updateOrientationPrompt();
});
window.addEventListener('resize', async () => {
    syncGameViewport();
    updateOrientationPrompt();
    toggleInGameUi(Boolean(world));
    await ensureResponsiveFullscreen();
});
window.addEventListener('orientationchange', async () => {
    syncGameViewport();
    updateOrientationPrompt();
    toggleInGameUi(Boolean(world));
    await ensureResponsiveFullscreen();
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', async () => {
        syncGameViewport();
        updateOrientationPrompt();
        toggleInGameUi(Boolean(world));
        await ensureResponsiveFullscreen();
    });
}


window.addEventListener('pageshow', async () => {
    syncViewportCssVars();
    syncGameViewport();
    updateOrientationPrompt();
    toggleInGameUi(Boolean(world));
    await ensureResponsiveFullscreen();
    window.scrollTo(0, 0);
});

window.addEventListener('scroll', () => {
    if (isTouchViewport() && (document.body.classList.contains('touch-landscape') || document.body.classList.contains('pseudo-fullscreen-active'))) {
        window.scrollTo(0, 0);
    }
}, { passive: true });

document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false });
document.addEventListener('dblclick', (event) => {
    if (isTouchViewport()) {
        event.preventDefault();
    }
}, { passive: false });
document.addEventListener('touchstart', preventMobileViewportGestures, { passive: false });
document.addEventListener('touchmove', preventMobileViewportGestures, { passive: false });

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
    if (e.keyCode == 83) keyboard.S = true;
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
    if (e.keyCode == 83) keyboard.S = false;
});
