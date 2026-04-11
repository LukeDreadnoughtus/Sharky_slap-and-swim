/**
 * Reports whether the viewport is currently in native or pseudo fullscreen mode.
 * It is used by buildViewportLayout before stage dimensions are calculated.
 */
function isFullscreenViewportActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || pseudoFullscreenActive);
}

/**
 * Reports whether touch controls are active in a landscape-only play layout.
 * It supports buildViewportLayout when choosing the correct stage calculation.
 */
function isTouchLandscapeViewport() {
    return isTouchViewport() && !isPortraitTouchDevice();
}

/**
 * Creates the final layout object with shared stage and pixel-ratio properties.
 * It keeps buildViewportLayout within the function-length rule.
 */
function createViewportLayout(stage, fullscreenMode, touchLandscapeMode) {
    return {
        ...stage,
        fullscreenMode,
        touchLandscapeMode,
        devicePixelRatio: Math.max(window.devicePixelRatio || 1, 1)
    };
}

/**
 * Collects safe-area and browser inset values used by stage calculations.
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
 * It acts as the central layout selector used by buildViewportLayout.
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
    const renderSize = getFullscreenRenderSize(viewport, aspectRatio);

    return {
        stageWidth: viewport.width,
        stageHeight: viewport.height,
        renderWidth: renderSize.renderWidth,
        renderHeight: renderSize.renderHeight,
        canvasTopOffset: Math.max(0, Math.round((viewport.height - renderSize.renderHeight) / 2))
    };
}

/**
 * Calculates the render size that fits fullscreen space without breaking aspect ratio.
 * It supports getFullscreenLayout before the final layout object is assembled.
 */
function getFullscreenRenderSize(viewport, aspectRatio) {
    let renderWidth = viewport.width;
    let renderHeight = Math.round(renderWidth / aspectRatio);

    if (renderHeight > viewport.height) {
        renderHeight = viewport.height;
        renderWidth = Math.round(renderHeight * aspectRatio);
    }

    return { renderWidth, renderHeight };
}

/**
 * Computes the responsive touch landscape layout above the touch controls.
 * It uses safe-area padding so the stage stays centered and reachable.
 */
function getTouchLandscapeLayout(viewport, insets) {
    const stagePadding = getTouchStagePadding(insets);
    const renderSize = getTouchRenderSize(viewport, stagePadding);
    const topBias = getTouchTopBias(renderSize.height, renderSize.renderHeight);

    return {
        stageWidth: viewport.width,
        stageHeight: viewport.height,
        renderWidth: renderSize.renderWidth,
        renderHeight: renderSize.renderHeight,
        canvasTopOffset: stagePadding.top + topBias
    };
}

/**
 * Calculates the stage paddings used by the touch landscape layout.
 * It supports getTouchLandscapeLayout and keeps safe-area math in one place.
 */
function getTouchStagePadding(insets) {
    return {
        x: Math.max(8, insets.safeHorizontalInset + 6),
        top: Math.max(8, insets.safeTop + 4),
        bottom: Math.max(8, insets.safeBottomInset + 4)
    };
}

/**
 * Calculates the touch render size available above the mobile controls row.
 * It supports getTouchLandscapeLayout after stage paddings are known.
 */
function getTouchRenderSize(viewport, stagePadding) {
    const controlsHeight = MOBILE_CONTROLS_HEIGHT + stagePadding.bottom - 4;
    const width = Math.max(viewport.width - stagePadding.x * 2, 280);
    const height = Math.max(viewport.height - stagePadding.top - stagePadding.bottom - controlsHeight, 180);
    const scale = Math.min(width / BASE_CANVAS_WIDTH, height / BASE_CANVAS_HEIGHT);

    return {
        height,
        renderWidth: Math.round(BASE_CANVAS_WIDTH * scale),
        renderHeight: Math.round(BASE_CANVAS_HEIGHT * scale)
    };
}

/**
 * Calculates the vertical bias that keeps the touch canvas visually centered.
 * It supports getTouchLandscapeLayout after render height was determined.
 */
function getTouchTopBias(height, renderHeight) {
    const freeSpace = Math.max(0, height - renderHeight);
    return Math.min(20, Math.round(freeSpace * 0.42));
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

    return {
        stageWidth,
        stageHeight,
        renderWidth: stageWidth,
        renderHeight: stageHeight,
        canvasTopOffset: 0
    };
}

/**
 * Applies the fullscreen and touch state classes on wrapper and body elements.
 * It keeps applyWrapperLayout short and groups all viewport class toggles together.
 */
function toggleViewportStateClasses(gameWrapper, layout) {
    const pseudoActive = pseudoFullscreenActive && !document.fullscreenElement;

    gameWrapper.classList.toggle('game-wrapper--fullscreen', layout.fullscreenMode);
    gameWrapper.classList.toggle('game-wrapper--pseudo-fullscreen', pseudoActive);
    gameWrapper.classList.toggle('game-wrapper--touch-landscape', layout.touchLandscapeMode);
    document.body.classList.toggle('fullscreen-active', layout.fullscreenMode);
    document.body.classList.toggle('pseudo-fullscreen-active', pseudoActive);
    document.body.classList.toggle('touch-landscape', layout.touchLandscapeMode);
}

/**
 * Applies the calculated width and height values to the game wrapper element.
 * It supports applyWrapperLayout after toggleViewportStateClasses ran.
 */
function applyWrapperDimensions(gameWrapper, layout) {
    gameWrapper.style.setProperty('--stage-width', `${layout.stageWidth}px`);
    gameWrapper.style.setProperty('--stage-height', `${layout.stageHeight}px`);
    gameWrapper.style.width = `${layout.stageWidth}px`;
    gameWrapper.style.height = `${layout.stageHeight}px`;
}
