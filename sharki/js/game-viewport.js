const BASE_CANVAS_WIDTH = 820;
const BASE_CANVAS_HEIGHT = 480;
const MOBILE_BREAKPOINT = 1024;
const MOBILE_CONTROLS_HEIGHT = 92;
const MAX_DESKTOP_STAGE_RATIO = 1;
const FULLSCREEN_ICONS = {
    enter: 'sharki/img/6.Botones/Full Screen/Mesa de trabajo 6.png',
    exit: 'sharki/img/6.Botones/Full Screen/Mesa de trabajo 9.png'
};

let pseudoFullscreenActive = false;

/**
 * Detects touch-sized viewports and coarse pointer devices.
 * It supports responsive fullscreen and touch control visibility.
 */
function isTouchViewport() {
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    return window.innerWidth <= MOBILE_BREAKPOINT || coarsePointer;
}

/**
 * Checks whether the current touch device is held in portrait mode.
 * It is used by viewport layout and orientation blocking.
 */
function isPortraitTouchDevice() {
    return isTouchViewport() && window.innerHeight > window.innerWidth;
}

/**
 * Reads the visual viewport and returns safe fallback dimensions.
 * It supports viewport CSS sync and canvas scaling calculations.
 */
function getViewportMetrics() {
    const viewport = window.visualViewport;
    const width = Math.max(Math.round(viewport?.width || window.innerWidth || BASE_CANVAS_WIDTH), 280);
    const height = Math.max(Math.round(viewport?.height || window.innerHeight || BASE_CANVAS_HEIGHT), 180);
    return { width, height };
}

/**
 * Syncs CSS custom properties with the current visual viewport.
 * It prepares values that syncGameViewport and CSS both reuse.
 */
function syncViewportCssVars() {
    const { width, height } = getViewportMetrics();
    const safeTop = Math.max(0, Math.round(window.visualViewport?.offsetTop || 0));
    document.documentElement.style.setProperty('--vvh', `${height}px`);
    document.documentElement.style.setProperty('--app-height', `${height}px`);
    document.documentElement.style.setProperty('--vvw', `${width}px`);
    document.documentElement.style.setProperty('--safe-top', `${safeTop}px`);
}

/**
 * Returns the shared game wrapper element for stage sizing.
 * It is used by fullscreen helpers and viewport synchronization.
 */
function getGameWrapper() {
    return document.querySelector('.game-wrapper');
}

/**
 * Checks whether native or pseudo fullscreen is currently active.
 * It supports layout decisions and fullscreen button updates.
 */
function isFullscreenActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || pseudoFullscreenActive);
}

/**
 * Updates the fullscreen button icon to match the current mode.
 * It depends on isFullscreenActive and the shared icon map.
 */
function updateFullscreenButtonIcon() {
    const fullscreenIcon = document.getElementById('fullscreenIcon');

    if (!fullscreenIcon) {
        return;
    }

    fullscreenIcon.src = isFullscreenActive() ? FULLSCREEN_ICONS.exit : FULLSCREEN_ICONS.enter;
}

/**
 * Checks whether touch landscape should auto-enable pseudo fullscreen.
 * It keeps the mobile stage immersive without forcing browser fullscreen.
 */
function shouldAutoEnterResponsiveFullscreen() {
    return isTouchViewport() && !isPortraitTouchDevice();
}

/**
 * Enables pseudo fullscreen on touch landscape when no fullscreen is active.
 * It cooperates with syncGameViewport and updateFullscreenButtonIcon.
 */
async function ensureResponsiveFullscreen() {
    const gameWrapper = getGameWrapper();

    if (!gameWrapper || !shouldAutoEnterResponsiveFullscreen() || isFullscreenActive()) {
        return;
    }

    pseudoFullscreenActive = true;
    gameWrapper.classList.add('game-wrapper--pseudo-fullscreen');
    updateFullscreenButtonIcon();
    syncGameViewport();
}
