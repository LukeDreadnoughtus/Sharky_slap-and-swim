/**
 * Boots the menu, responsive fullscreen, and initial scroll reset on load.
 * It is the main entry point after all game helpers are available.
 */
window.addEventListener('load', async () => {
    setupStartScreen();
    await ensureResponsiveFullscreen();
    window.scrollTo(0, 0);
});

/**
 * Syncs UI state after browser fullscreen changes.
 * It keeps the viewport, icon, and orientation prompt aligned.
 */
function handleFullscreenChange() {
    updateFullscreenButtonIcon();
    syncGameViewport();
    updateOrientationPrompt();
}

window.addEventListener('fullscreenchange', handleFullscreenChange);
window.addEventListener('webkitfullscreenchange', handleFullscreenChange);

/**
 * Syncs viewport-dependent UI state after resize-like events.
 * It is reused by resize, orientationchange, and visualViewport resize.
 */
async function handleViewportChange() {
    syncGameViewport();
    updateOrientationPrompt();
    toggleInGameUi(Boolean(world));
    await ensureResponsiveFullscreen();
}

window.addEventListener('resize', handleViewportChange);
window.addEventListener('orientationchange', handleViewportChange);

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange);
}

/**
 * Reapplies viewport state when the page is restored from browser cache.
 * It complements load and resize handling after navigation restores.
 */
window.addEventListener('pageshow', async () => {
    syncViewportCssVars();
    syncGameViewport();
    updateOrientationPrompt();
    toggleInGameUi(Boolean(world));
    await ensureResponsiveFullscreen();
    window.scrollTo(0, 0);
});

window.addEventListener('scroll', () => {
    if (shouldLockScrollPosition()) {
        window.scrollTo(0, 0);
    }
}, { passive: true });

/**
 * Checks whether mobile gameplay should keep the window scroll locked.
 * It supports the passive scroll handler in responsive fullscreen modes.
 */
function shouldLockScrollPosition() {
    const touchMode = isTouchViewport();
    const landscapeMode = document.body.classList.contains('touch-landscape');
    const pseudoFullscreen = document.body.classList.contains('pseudo-fullscreen-active');
    return touchMode && (landscapeMode || pseudoFullscreen);
}

document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false });
document.addEventListener('dblclick', (event) => {
    if (isTouchViewport()) {
        event.preventDefault();
    }
}, { passive: false });
document.addEventListener('touchstart', preventMobileViewportGestures, { passive: false });
document.addEventListener('touchmove', preventMobileViewportGestures, { passive: false });

/**
 * Updates keyboard flags for desktop gameplay input.
 * It cooperates with the touch controls that modify the same Keyboard object.
 */
window.addEventListener('keydown', (event) => updateKeyboardState(event.keyCode, true));
window.addEventListener('keyup', (event) => updateKeyboardState(event.keyCode, false));

/**
 * Maps browser key codes to the shared keyboard state object.
 * It centralizes desktop input updates for keydown and keyup.
 */
function updateKeyboardState(keyCode, pressed) {
    if (keyCode === 39) keyboard.RIGHT = pressed;
    if (keyCode === 37) keyboard.LEFT = pressed;
    if (keyCode === 38) keyboard.UP = pressed;
    if (keyCode === 40) keyboard.DOWN = pressed;
    if (keyCode === 32) keyboard.SPACE = pressed;
    if (keyCode === 68) keyboard.D = pressed;
    if (keyCode === 83) keyboard.S = pressed;
}
