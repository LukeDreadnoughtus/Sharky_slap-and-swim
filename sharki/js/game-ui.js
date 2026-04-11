/**
 * Shows or hides in-game controls based on device mode and game state.
 * It keeps the start screen, desktop controls, and touch controls aligned.
 */
function toggleInGameUi(show) {
    const startScreen = document.getElementById('startscreen');
    const startVisible = Boolean(startScreen && !startScreen.classList.contains('startscreen--hide'));
    toggleElementVisibility('settingsBtn', !(show || startVisible));
    toggleDesktopFullscreenButton(show);
    toggleMobileFullscreenButton(show);
    toggleTouchControls(show);
}

/**
 * Toggles the hidden class on one element by id.
 * It supports toggleInGameUi and keeps repeated DOM code in one place.
 */
function toggleElementVisibility(id, hidden) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.classList.toggle('hidden', hidden);
}

/**
 * Updates the desktop fullscreen button for non-touch layouts only.
 * It supports toggleInGameUi during start screen and gameplay changes.
 */
function toggleDesktopFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!fullscreenBtn) {
        return;
    }

    fullscreenBtn.classList.toggle('hidden', isTouchViewport());
}

/**
 * Updates the mobile fullscreen button for touch landscape gameplay.
 * It is coordinated by toggleInGameUi and orientation checks.
 */
function toggleMobileFullscreenButton(show) {
    const mobileFullscreenBtn = document.getElementById('mobileFullscreenBtn');

    if (!mobileFullscreenBtn) {
        return;
    }

    const visible = show && isTouchViewport() && !isPortraitTouchDevice();
    mobileFullscreenBtn.classList.toggle('hidden', !visible);
}

/**
 * Shows or hides the touch controls and keeps aria state synchronized.
 * It is the touch-control branch used by toggleInGameUi.
 */
function toggleTouchControls(show) {
    const touchControls = document.getElementById('touchControls');

    if (!touchControls) {
        return;
    }

    const visible = show && isTouchViewport() && !isPortraitTouchDevice();
    touchControls.classList.toggle('hidden', !visible);
    touchControls.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

/**
 * Opens the pause overlay and pauses the world when gameplay is active.
 * It coordinates resetKeyboardState with world.pause.
 */
function openPauseDialog() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resultOverlay = document.getElementById('resultOverlay');

    if (!pauseOverlay || isOverlayVisible(resultOverlay)) {
        return;
    }

    if (world) {
        world.pause();
        resetKeyboardState();
    }

    pauseOverlay.classList.remove('hidden');
}

/**
 * Closes the pause overlay and resumes the world outside portrait blocking.
 * It works with updateOrientationPrompt and openPauseDialog.
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
 * Opens the result dialog and updates its actions for the current outcome.
 * It cooperates with closePauseDialog and resetKeyboardState.
 */
function openResultDialog(config) {
    const dialog = getResultDialogElements();

    if (!dialog) {
        return;
    }

    closePauseDialog();
    resetKeyboardState();
    applyResultDialogContent(dialog, config);
    dialog.resultOverlay.classList.remove('hidden');
    updateOrientationPrompt();
}

/**
 * Reads all required result dialog elements from the DOM.
 * It supports openResultDialog while keeping null checks centralized.
 */
function getResultDialogElements() {
    const resultOverlay = document.getElementById('resultOverlay');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (!resultOverlay || !resultTitle || !resultText || !tryAgainBtn || !leaveGameBtn || !nextLevelBtn) {
        return null;
    }

    return { resultOverlay, resultTitle, resultText, tryAgainBtn, leaveGameBtn, nextLevelBtn };
}

/**
 * Applies title, message, and button visibility to the result dialog.
 * It is the DOM-writing part used by openResultDialog.
 */
function applyResultDialogContent(dialog, config) {
    const { title, text = '', showTryAgain = false, showLeave = false, showNextLevel = false } = config;
    dialog.resultTitle.textContent = title;
    dialog.resultText.textContent = text;
    dialog.tryAgainBtn.classList.toggle('hidden', !showTryAgain);
    dialog.leaveGameBtn.classList.toggle('hidden', !showLeave);
    dialog.nextLevelBtn.classList.toggle('hidden', !showNextLevel);
}

/**
 * Closes the result dialog and refreshes orientation blocking afterwards.
 * It complements openResultDialog and level transition actions.
 */
function closeResultDialog() {
    const resultOverlay = document.getElementById('resultOverlay');

    if (resultOverlay) {
        resultOverlay.classList.add('hidden');
    }

    updateOrientationPrompt();
}

/**
 * Opens the shared dialog with the game-over message and actions.
 * It is triggered by world callbacks after character death.
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
 * Opens the shared dialog with the current level completion state.
 * It supports world callbacks and the next-level action flow.
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
 * Returns whether a pause or result overlay is currently visible.
 * It is reused by pause handling and orientation blocking.
 */
function isBlockingOverlayOpen() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resultOverlay = document.getElementById('resultOverlay');
    return isOverlayVisible(pauseOverlay) || isOverlayVisible(resultOverlay);
}

/**
 * Checks whether one overlay element is currently visible.
 * It supports isBlockingOverlayOpen and pause/result dialog flow.
 */
function isOverlayVisible(element) {
    return Boolean(element && !element.classList.contains('hidden'));
}

/**
 * Updates the portrait warning overlay and pauses or resumes the world.
 * It coordinates responsive blocking with pause and result dialogs.
 */
function updateOrientationPrompt() {
    const orientationOverlay = document.getElementById('orientationOverlay');

    if (!orientationOverlay) {
        return;
    }

    const shouldBlockGame = isPortraitTouchDevice() && Boolean(world) && !isBlockingOverlayOpen();
    orientationOverlay.classList.toggle('hidden', !shouldBlockGame);
    updateWorldPauseStateForOrientation(shouldBlockGame);
}

/**
 * Pauses or resumes the world based on the current orientation state.
 * It is called only by updateOrientationPrompt to centralize that side effect.
 */
function updateWorldPauseStateForOrientation(shouldBlockGame) {
    if (!world) {
        return;
    }

    if (shouldBlockGame) {
        world.pause();
        resetKeyboardState();
        return;
    }

    if (!isBlockingOverlayOpen()) {
        world.resume();
    }
}
