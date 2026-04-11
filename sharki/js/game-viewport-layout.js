/**
 * Syncs wrapper classes and canvas dimensions with the current viewport.
 * It combines stage metrics, fullscreen state, and world render scaling.
 */
function syncGameViewport() {
    const gameWrapper = getGameWrapper();
    const targetCanvas = document.getElementById('canvas');
    const title = document.querySelector('h1');

    if (!gameWrapper || !targetCanvas) {
        return;
    }

    const layout = buildViewportLayout(title);
    applyWrapperLayout(gameWrapper, layout);
    applyCanvasLayout(targetCanvas, layout);

    if (world) {
        world.setRenderScale(layout.devicePixelRatio);
    }
}

/**
 * Builds all stage and canvas measurements for the current viewport.
 * It delegates padding and size calculations to focused helper functions.
 */
function buildViewportLayout(title) {
    const fullscreenMode = Boolean(document.fullscreenElement || document.webkitFullscreenElement || pseudoFullscreenActive);
    const touchLandscapeMode = isTouchViewport() && !isPortraitTouchDevice();
    const viewport = getViewportMetrics();
    const insets = getViewportInsets(viewport.height);
    const stage = calculateStageDimensions(viewport, insets, title, fullscreenMode, touchLandscapeMode);
    return { ...stage, fullscreenMode, touchLandscapeMode, devicePixelRatio: Math.max(window.devicePixelRatio || 1, 1) };
}

/**
 * Collects safe area and browser inset values used by stage calculations.
 * It keeps buildViewportLayout small and reusable.
 */
function getViewportInsets(viewportHeight) {
    const safeTop = Math.max(0, Math.round(window.visualViewport?.offsetTop || 0));
    const safeBottomInset = Math.max(0, Math.round((window.innerHeight || viewportHeight) - viewportHeight - safeTop));
    const safeHorizontalInset = Math.max(0, Math.round(((window.innerWidth || 0) - (window.visualViewport?.width || window.innerWidth || 0)) / 2));
    return { safeTop, safeBottomInset, safeHorizontalInset };
}

/**
 * Calculates stage and render sizes for desktop, touch, and fullscreen modes.
 * It is the central layout helper used by buildViewportLayout.
 */
function calculateStageDimensions(viewport, insets, title, fullscreenMode, touchLandscapeMode) {
    const aspectRatio = BASE_CANVAS_WIDTH / BASE_CANVAS_HEIGHT;
    const titleHeight = getVisibleTitleHeight(title);

    if (fullscreenMode) {
        return getFullscreenLayout(viewport, aspectRatio);
    }

    if (touchLandscapeMode) {
        return getTouchLandscapeLayout(viewport, insets);
    }

    return getDesktopLayout(viewport, titleHeight);
}

/**
 * Returns the visible title height when the desktop layout reserves space.
 * It supports calculateStageDimensions without duplicating DOM checks.
 */
function getVisibleTitleHeight(title) {
    if (!title) {
        return 0;
    }

    const style = window.getComputedStyle(title);
    const visible = style.display !== 'none' && style.visibility !== 'hidden';
    return visible ? title.offsetHeight + 20 : 0;
}

/**
 * Computes stage values for native or pseudo fullscreen mode.
 * It keeps the canvas aspect ratio while filling the available viewport.
 */
function getFullscreenLayout(viewport, aspectRatio) {
    let renderWidth = viewport.width;
    let renderHeight = Math.round(renderWidth / aspectRatio);

    if (renderHeight > viewport.height) {
        renderHeight = viewport.height;
        renderWidth = Math.round(renderHeight * aspectRatio);
    }

    return {
        stageWidth: viewport.width,
        stageHeight: viewport.height,
        renderWidth,
        renderHeight,
        canvasTopOffset: Math.max(0, Math.round((viewport.height - renderHeight) / 2))
    };
}

/**
 * Computes the responsive touch landscape layout above the touch controls.
 * It uses safe-area padding so the stage stays centered and reachable.
 */
function getTouchLandscapeLayout(viewport, insets) {
    const stagePaddingX = Math.max(8, insets.safeHorizontalInset + 6);
    const stagePaddingTop = Math.max(8, insets.safeTop + 4);
    const stagePaddingBottom = Math.max(8, insets.safeBottomInset + 4);
    const controlsHeight = MOBILE_CONTROLS_HEIGHT + insets.safeBottomInset;
    const width = Math.max(viewport.width - stagePaddingX * 2, 280);
    const height = Math.max(viewport.height - stagePaddingTop - stagePaddingBottom - controlsHeight, 180);
    const scale = Math.min(width / BASE_CANVAS_WIDTH, height / BASE_CANVAS_HEIGHT);
    const renderWidth = Math.round(BASE_CANVAS_WIDTH * scale);
    const renderHeight = Math.round(BASE_CANVAS_HEIGHT * scale);
    const freeSpace = Math.max(0, height - renderHeight);
    const topBias = Math.min(20, Math.round(freeSpace * 0.42));
    return { stageWidth: viewport.width, stageHeight: viewport.height, renderWidth, renderHeight, canvasTopOffset: stagePaddingTop + topBias };
}

/**
 * Computes the standard desktop layout with title spacing and max scaling.
 * It is used when no touch landscape or fullscreen mode is active.
 */
function getDesktopLayout(viewport, titleHeight) {
    const maxWidth = Math.max(viewport.width - 24, 280);
    const maxHeight = Math.max(viewport.height - titleHeight - 24, 180);
    const scale = Math.min(maxWidth / BASE_CANVAS_WIDTH, maxHeight / BASE_CANVAS_HEIGHT, MAX_DESKTOP_STAGE_RATIO);
    const stageWidth = Math.round(BASE_CANVAS_WIDTH * scale);
    const stageHeight = Math.round(BASE_CANVAS_HEIGHT * scale);
    return { stageWidth, stageHeight, renderWidth: stageWidth, renderHeight: stageHeight, canvasTopOffset: 0 };
}

/**
 * Applies wrapper classes, CSS variables, and stage size styles.
 * It keeps syncGameViewport focused on orchestration rather than DOM detail.
 */
function applyWrapperLayout(gameWrapper, layout) {
    syncViewportCssVars();
    gameWrapper.classList.toggle('game-wrapper--fullscreen', layout.fullscreenMode);
    gameWrapper.classList.toggle('game-wrapper--pseudo-fullscreen', pseudoFullscreenActive && !document.fullscreenElement);
    gameWrapper.classList.toggle('game-wrapper--touch-landscape', layout.touchLandscapeMode);
    document.body.classList.toggle('fullscreen-active', layout.fullscreenMode);
    document.body.classList.toggle('pseudo-fullscreen-active', pseudoFullscreenActive && !document.fullscreenElement);
    document.body.classList.toggle('touch-landscape', layout.touchLandscapeMode);
    gameWrapper.style.setProperty('--stage-width', `${layout.stageWidth}px`);
    gameWrapper.style.setProperty('--stage-height', `${layout.stageHeight}px`);
    gameWrapper.style.width = `${layout.stageWidth}px`;
    gameWrapper.style.height = `${layout.stageHeight}px`;
}

/**
 * Applies render resolution and visual size to the game canvas.
 * It works with applyWrapperLayout and world.setRenderScale.
 */
function applyCanvasLayout(targetCanvas, layout) {
    targetCanvas.width = Math.round(BASE_CANVAS_WIDTH * layout.devicePixelRatio);
    targetCanvas.height = Math.round(BASE_CANVAS_HEIGHT * layout.devicePixelRatio);
    targetCanvas.style.width = `${Math.round(layout.renderWidth)}px`;
    targetCanvas.style.height = `${Math.round(layout.renderHeight)}px`;
    targetCanvas.style.left = '50%';
    targetCanvas.style.top = `${layout.canvasTopOffset}px`;
    targetCanvas.style.transform = 'translateX(-50%)';
}
