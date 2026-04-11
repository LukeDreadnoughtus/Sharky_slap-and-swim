/**
 * Toggles native fullscreen where available and falls back to pseudo mode.
 * It coordinates browser helpers with viewport sync and icon updates.
 */
async function toggleFullscreenMode() {
    const gameWrapper = getGameWrapper();

    if (!gameWrapper) {
        return;
    }

    if (await handleFullscreenExit(gameWrapper)) {
        return;
    }

    await handleFullscreenEntry(gameWrapper);
    finishFullscreenToggle();
}

/**
 * Handles leaving native or pseudo fullscreen and reports whether it did so.
 * It keeps toggleFullscreenMode focused on the overall control flow.
 */
async function handleFullscreenExit(gameWrapper) {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        await exitNativeFullscreen();
        finishFullscreenToggle();
        return true;
    }

    if (!pseudoFullscreenActive) {
        return false;
    }

    disablePseudoFullscreen(gameWrapper);
    finishFullscreenToggle();
    return true;
}

/**
 * Handles entering native fullscreen first and falls back to pseudo fullscreen.
 * It is called by toggleFullscreenMode after all exit paths were checked.
 */
async function handleFullscreenEntry(gameWrapper) {
    const enteredNativeFullscreen = await tryEnterNativeFullscreen(gameWrapper);

    if (!enteredNativeFullscreen && isTouchViewport()) {
        enablePseudoFullscreen(gameWrapper);
    }
}

/**
 * Runs the shared UI updates after any fullscreen state change.
 * It keeps the toggle flow short and consistent across all branches.
 */
function finishFullscreenToggle() {
    updateFullscreenButtonIcon();
    syncGameViewport();
    updateOrientationPrompt();
}
