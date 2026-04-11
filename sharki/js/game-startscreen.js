/**
 * Opens the legal notice overlay.
 * It is bound by setupStartScreen together with the close action.
 */
function openLegalNotice() {
    const legalNoticeOverlay = document.getElementById('legalNoticeOverlay');

    if (legalNoticeOverlay) {
        legalNoticeOverlay.classList.remove('hidden');
    }
}

/**
 * Closes the legal notice overlay.
 * It complements openLegalNotice inside the start screen bindings.
 */
function closeLegalNotice() {
    const legalNoticeOverlay = document.getElementById('legalNoticeOverlay');

    if (legalNoticeOverlay) {
        legalNoticeOverlay.classList.add('hidden');
    }
}

/**
 * Boots start screen bindings, overlays, touch controls, and menu actions.
 * It coordinates viewport sync, audio state, and button handlers.
 */
function setupStartScreen() {
    syncViewportCssVars();
    updateFullscreenButtonIcon();
    syncGameViewport();
    setupTouchControls();
    updateOrientationPrompt();
    const ui = getStartScreenElements();

    if (!ui) {
        return;
    }

    prepareStartScreenAssets(ui);
    syncStartScreenAudio(ui);
    bindStartScreenActions(ui);
}

/**
 * Reads all required start screen and overlay elements from the DOM.
 * It keeps setupStartScreen focused on orchestration rather than querying.
 */
function getStartScreenElements() {
    const ids = ['startscreen', 'startBtn', 'keyBtn', 'keyOverlay', 'legalNoticeBtn', 'legalNoticeOverlay', 'closeLegalNoticeBtn',
        'settingsBtn', 'fullscreenBtn', 'closePauseBtn', 'restartBtn', 'leaveBtn', 'muteBtn', 'tryAgainBtn', 'leaveGameBtn', 'nextLevelBtn'];
    const elements = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
    elements.backdrop = document.querySelector('.key-overlay__backdrop');
    elements.legalNoticeBackdrop = document.querySelector('.legal-overlay__backdrop');
    return hasRequiredStartScreenElements(elements) ? elements : null;
}

/**
 * Checks whether all required start screen nodes were found successfully.
 * It supports getStartScreenElements before event binding begins.
 */
function hasRequiredStartScreenElements(elements) {
    return Object.values(elements).every(Boolean);
}

/**
 * Prepares static start screen assets such as non-draggable images.
 * It runs once from setupStartScreen before any bindings are attached.
 */
function prepareStartScreenAssets() {
    document.querySelectorAll('img').forEach((image) => image.setAttribute('draggable', 'false'));
}

/**
 * Syncs initial audio state and the mute button label for the menu.
 * It cooperates with the shared AudioManager during boot.
 */
function syncStartScreenAudio(ui) {
    if (!window.gameAudio) {
        return;
    }

    window.gameAudio.startIntroLoop();
    ui.muteBtn.textContent = window.gameAudio.muted ? 'Unmute' : 'Mute';
}

/**
 * Wires all start screen, pause, and result button interactions.
 * It keeps setupStartScreen compact while grouping related bindings.
 */
function bindStartScreenActions(ui) {
    bindPrimaryStartActions(ui);
    bindOverlayActions(ui);
    bindMenuActions(ui);
}

/**
 * Binds the main start and key buttons on the title screen.
 * It coordinates intro fade-out and game initialization.
 */
function bindPrimaryStartActions(ui) {
    bindTap(ui.startBtn, async () => startGameFromMenu(ui.startscreen));
    bindTap(ui.keyBtn, () => ui.keyOverlay.classList.remove('hidden'));
    bindTap(ui.legalNoticeBtn, openLegalNotice);
    bindTap(ui.closeLegalNoticeBtn, closeLegalNotice);
}

/**
 * Starts gameplay from the title screen with the existing transition timing.
 * It keeps the original menu flow while reusing init and fullscreen helpers.
 */
async function startGameFromMenu(startScreen) {
    startScreen.classList.add('startscreen--hide');

    if (window.gameAudio) {
        window.gameAudio.stopIntroLoopWithFade();
    }

    await ensureResponsiveFullscreen();
    window.setTimeout(() => init(1), 250);
}

/**
 * Binds backdrop interactions for the key and legal notice overlays.
 * It complements the button-based overlay open and close actions.
 */
function bindOverlayActions(ui) {
    bindTap(ui.backdrop, () => ui.keyOverlay.classList.add('hidden'));
    bindTap(ui.legalNoticeBackdrop, closeLegalNotice);
}

/**
 * Binds pause, mute, restart, leave, and next-level actions.
 * It reuses shared dialog and state functions across all menu buttons.
 */
function bindMenuActions(ui) {
    bindTap(ui.settingsBtn, openPauseDialog);
    bindTap(ui.fullscreenBtn, toggleFullscreenMode);
    bindTap(ui.closePauseBtn, closePauseDialog);
    bindTap(ui.muteBtn, () => updateMuteButtonState(ui.muteBtn));
    bindTap(ui.restartBtn, restartLevel);
    bindTap(ui.leaveBtn, showStartScreen);
    bindTap(ui.tryAgainBtn, restartLevel);
    bindTap(ui.leaveGameBtn, showStartScreen);
    bindTap(ui.nextLevelBtn, goToNextLevel);
}

/**
 * Toggles audio mute and updates the visible mute button label.
 * It is used by bindMenuActions to keep UI and audio state in sync.
 */
function updateMuteButtonState(muteBtn) {
    if (!window.gameAudio) {
        return;
    }

    const isMuted = window.gameAudio.toggleMute();
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
}
