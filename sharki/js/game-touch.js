/**
 * Prevents gestures that would zoom or scroll the viewport during gameplay.
 * It supports touch controls and pseudo fullscreen on mobile devices.
 */
function preventMobileViewportGestures(event) {
    if (!isTouchViewport()) {
        return;
    }

    if (event.touches && event.touches.length > 1) {
        event.preventDefault();
        return;
    }

    if (isScrollableOverlayTouch(event.target)) {
        return;
    }

    if (isGameSurfaceTouch(event.target) || isTouchControl(event.target)) {
        event.preventDefault();
    }
}

/**
 * Checks whether one touch started inside a scrollable overlay content area.
 * It lets preventMobileViewportGestures keep legal notice scrolling intact.
 */
function isScrollableOverlayTouch(target) {
    return Boolean(target?.closest?.('.legal-overlay__content'));
}

/**
 * Checks whether one target belongs to the touch control cluster.
 * It supports preventMobileViewportGestures and touch button binding.
 */
function isTouchControl(target) {
    return Boolean(target?.closest?.('.touch-controls, .touch-button'));
}

/**
 * Checks whether one target touches the game surface or wrapper.
 * It helps preventMobileViewportGestures keep focus on the game area.
 */
function isGameSurfaceTouch(target) {
    return Boolean(target?.closest?.('#canvas, .game-wrapper'));
}

/**
 * Applies interaction locks so touch buttons do not trigger selection or menus.
 * It supports touch gameplay buttons and tap-only menu buttons.
 */
function lockTouchButtonInteraction(button) {
    if (!button) {
        return;
    }

    ['contextmenu', 'selectstart'].forEach((eventName) => {
        button.addEventListener(eventName, (event) => event.preventDefault());
    });
}

/**
 * Binds one gameplay touch button to a keyboard flag.
 * It coordinates pointer events with keyboard state and active styling.
 */
function bindTouchButton(button) {
    if (!button) {
        return;
    }

    const keyName = button.dataset.key;
    lockTouchButtonInteraction(button);
    bindTouchPointerEvents(button, keyName);
}

/**
 * Attaches pointer handlers that press and release one virtual key.
 * It keeps bindTouchButton short and focused.
 */
function bindTouchPointerEvents(button, keyName) {
    const press = (event) => setTouchButtonState(button, keyName, true, event);
    const release = (event) => setTouchButtonState(button, keyName, false, event);
    button.addEventListener('pointerdown', (event) => captureTouchPointer(button, event, press));
    ['pointerup', 'pointerleave', 'pointercancel', 'lostpointercapture'].forEach((name) => {
        button.addEventListener(name, release);
    });
}

/**
 * Captures a pointer before the press handler updates button state.
 * It is the pointerdown helper used by bindTouchPointerEvents.
 */
function captureTouchPointer(button, event, press) {
    if (event.pointerId != null && button.setPointerCapture) {
        try {
            button.setPointerCapture(event.pointerId);
        } catch (error) {
            // Ignore capture support issues on older browsers.
        }
    }

    press(event);
}

/**
 * Updates one virtual key flag and the button's active class.
 * It is shared by the press and release branches of touch buttons.
 */
function setTouchButtonState(button, keyName, pressed, event) {
    if (event) {
        event.preventDefault();
    }

    keyboard[keyName] = pressed;
    button.classList.toggle('is-active', pressed);
}

/**
 * Binds all gameplay touch controls and the mobile fullscreen action.
 * It cooperates with lockTouchButtonInteraction and toggleFullscreenMode.
 */
function setupTouchControls() {
    document.querySelectorAll('.touch-button[data-key]').forEach(bindTouchButton);
    const mobileFullscreenBtn = document.getElementById('mobileFullscreenBtn');

    if (!mobileFullscreenBtn) {
        return;
    }

    lockTouchButtonInteraction(mobileFullscreenBtn);
    mobileFullscreenBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleFullscreenMode();
    });
}

/**
 * Binds one menu button to a tap-safe handler across click and touchend.
 * It is used by setupStartScreen for all overlay and menu actions.
 */
function bindTap(button, handler) {
    if (!button) {
        return;
    }

    lockTouchButtonInteraction(button);
    let touchHandled = false;
    button.addEventListener('click', (event) => handleTapClick(event, handler, () => touchHandled, (value) => { touchHandled = value; }));
    button.addEventListener('touchend', (event) => handleTapTouchEnd(event, handler, (value) => { touchHandled = value; }), { passive: false });
}

/**
 * Handles the click half of bindTap while avoiding duplicate touch clicks.
 * It supports bindTap on hybrid devices and mobile browsers.
 */
function handleTapClick(event, handler, getTouchHandled, setTouchHandled) {
    if (getTouchHandled()) {
        setTouchHandled(false);
        return;
    }

    runTapHandler(event, handler);
}

/**
 * Handles the touchend half of bindTap and marks the touch as handled.
 * It complements handleTapClick in the tap abstraction.
 */
function handleTapTouchEnd(event, handler, setTouchHandled) {
    setTouchHandled(true);
    runTapHandler(event, handler);
}

/**
 * Runs one tap handler with shared preventDefault and stopPropagation logic.
 * It is used by both bindTap click and touchend branches.
 */
function runTapHandler(event, handler) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    handler();
}
