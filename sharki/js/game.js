let canvas;
let world;
let currentLevelNumber = 1;

const LEVEL_FACTORIES = {
    1: createLevel1,
    2: createLevel2,
    3: createLevel3
};

let keyboard = new Keyboard();

/**
 * Resets every gameplay key flag before a new world state starts.
 * It supports createWorld, pause handling, and screen transitions.
 */
function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
    keyboard.S = false;
}

/**
 * Creates the world for one level and wires result callbacks.
 * It coordinates resetKeyboardState, World creation, and viewport sync.
 */
function createWorld(levelNumber = 1) {
    canvas = document.getElementById('canvas');

    if (!canvas) {
        return;
    }

    destroyPreviousWorld();
    currentLevelNumber = levelNumber;
    resetKeyboardState();
    world = buildWorld(levelNumber);
    syncGameViewport();
}

/**
 * Destroys an existing world before a fresh instance is created.
 * It keeps createWorld short and prevents duplicated intervals.
 */
function destroyPreviousWorld() {
    if (world) {
        world.destroy();
    }
}

/**
 * Builds one world instance for the requested level number.
 * It isolates callback wiring for createWorld and level transitions.
 */
function buildWorld(levelNumber) {
    const levelFactory = LEVEL_FACTORIES[levelNumber] ?? createLevel1;
    return new World(canvas, keyboard, {
        onCharacterDeath: showGameOverDialog,
        onEndbossDeath: () => showLevelCompleteDialog(currentLevelNumber)
    }, levelFactory);
}

/**
 * Initializes gameplay for one level and updates overlay state.
 * It cooperates with createWorld, dialog helpers, and game audio.
 */
async function init(levelNumber = 1) {
    closeResultDialog();
    createWorld(levelNumber);
    toggleInGameUi(true);
    closePauseDialog();
    updateOrientationPrompt();
    await ensureResponsiveFullscreen();
    window.gameAudio?.startGameplayLoop();
}

/**
 * Returns to the title screen and resets the active gameplay state.
 * It coordinates world cleanup, UI visibility, and intro audio.
 */
async function showStartScreen() {
    destroyActiveGameState();
    currentLevelNumber = 1;
    resetKeyboardState();
    closeResultDialog();
    closePauseDialog();
    revealStartScreen();
    toggleInGameUi(false);
    updateOrientationPrompt();
    window.gameAudio?.startIntroLoop();
    await ensureResponsiveFullscreen();
}

/**
 * Destroys the active world and stops gameplay-only audio state.
 * It supports showStartScreen before the menu becomes visible again.
 */
function destroyActiveGameState() {
    if (world) {
        world.destroy();
        world = null;
    }

    window.gameAudio?.stopGameplayLoop();
    window.gameAudio?.stopAllEffects();
}

/**
 * Reveals the title screen if it is currently hidden.
 * It is used by showStartScreen after gameplay cleanup.
 */
function revealStartScreen() {
    const startScreen = document.getElementById('startscreen');

    if (startScreen) {
        startScreen.classList.remove('startscreen--hide');
    }
}

/**
 * Restarts the current level using the existing level counter.
 * It keeps restart buttons independent from level selection details.
 */
function restartLevel() {
    init(currentLevelNumber);
}

/**
 * Moves to the next available level and closes the result dialog first.
 * It complements showLevelCompleteDialog and init.
 */
function goToNextLevel() {
    const nextLevelNumber = currentLevelNumber + 1;

    if (!LEVEL_FACTORIES[nextLevelNumber]) {
        return;
    }

    closeResultDialog();
    init(nextLevelNumber);
}
