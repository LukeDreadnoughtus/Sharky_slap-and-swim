/**
 * Syncs wrapper classes and canvas dimensions with the current viewport.
 * It combines calculated layout data with world render scaling.
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
    applyWorldRenderScale(layout);
}

/**
 * Builds all stage and canvas measurements for the current viewport.
 * It delegates the detailed calculations to the dedicated layout helper file.
 */
function buildViewportLayout(title) {
    const fullscreenMode = isFullscreenViewportActive();
    const touchLandscapeMode = isTouchLandscapeViewport();
    const viewport = getViewportMetrics();
    const insets = getViewportInsets(viewport.height);
    const stage = calculateStageDimensions(viewport, insets, title, fullscreenMode, touchLandscapeMode);

    return createViewportLayout(stage, fullscreenMode, touchLandscapeMode);
}

/**
 * Applies wrapper classes, CSS variables, and stage size styles.
 * It keeps syncGameViewport focused on orchestration instead of DOM detail.
 */
function applyWrapperLayout(gameWrapper, layout) {
    syncViewportCssVars();
    toggleViewportStateClasses(gameWrapper, layout);
    applyWrapperDimensions(gameWrapper, layout);
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

/**
 * Applies the current pixel ratio to the world renderer when a world exists.
 * It is called by syncGameViewport after layout data has been resolved.
 */
function applyWorldRenderScale(layout) {
    if (world) {
        world.setRenderScale(layout.devicePixelRatio);
    }
}
