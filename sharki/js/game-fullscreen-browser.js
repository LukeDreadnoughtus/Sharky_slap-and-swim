/**
 * Leaves browser fullscreen using the available standard or WebKit API.
 * It supports toggleFullscreenMode when the game is already fullscreen.
 */
async function exitNativeFullscreen() {
    if (document.exitFullscreen) {
        await document.exitFullscreen();
        return;
    }

    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Attempts native fullscreen on the wrapper first and then on the canvas.
 * It reports success so the main toggle flow can decide on pseudo fullscreen.
 */
async function tryEnterNativeFullscreen(gameWrapper) {
    const candidates = [gameWrapper, document.getElementById('canvas')];

    for (const candidate of candidates) {
        const entered = await requestElementFullscreen(candidate);
        if (entered) {
            return true;
        }
    }

    return false;
}

/**
 * Requests fullscreen for one element with standard and WebKit fallbacks.
 * It is reused by tryEnterNativeFullscreen for every possible target element.
 */
async function requestElementFullscreen(candidate) {
    if (!candidate) {
        return false;
    }

    if (candidate.requestFullscreen) {
        return requestStandardFullscreen(candidate);
    }

    if (candidate.webkitRequestFullscreen) {
        return requestWebkitFullscreen(candidate);
    }

    return false;
}

/**
 * Requests fullscreen through the standard browser API for one element.
 * It supports requestElementFullscreen when the standard method exists.
 */
async function requestStandardFullscreen(candidate) {
    await candidate.requestFullscreen();
    return true;
}

/**
 * Requests fullscreen through the WebKit fallback API for one element.
 * It supports requestElementFullscreen on older Safari-based browsers.
 */
function requestWebkitFullscreen(candidate) {
    candidate.webkitRequestFullscreen();
    return true;
}

/**
 * Enables pseudo fullscreen on touch devices when native fullscreen is unavailable.
 * It works with handleFullscreenEntry and shares the same wrapper class contract.
 */
function enablePseudoFullscreen(gameWrapper) {
    pseudoFullscreenActive = true;
    gameWrapper.classList.add('game-wrapper--pseudo-fullscreen');
}

/**
 * Disables pseudo fullscreen and removes the wrapper state class again.
 * It supports handleFullscreenExit when no native fullscreen session is active.
 */
function disablePseudoFullscreen(gameWrapper) {
    pseudoFullscreenActive = false;
    gameWrapper.classList.remove('game-wrapper--pseudo-fullscreen');
}
