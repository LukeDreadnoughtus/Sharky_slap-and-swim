class World {
    character = new Character();
    level = createLevel1();

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    poisonStatusBar = new PoisonStatusBar();
    throwableObjects = [];
    collectedCoins = 0;
    collectedPoisonBubbles = 0;
    maxPoisonBubbles = 5;
    isPaused = false;
    isDestroyed = false;
    hasHandledCharacterDeath = false;
    hasHandledEndbossDeath = false;
    resultDialogTimeout = null;
    onCharacterDeath = null;
    onEndbossDeath = null;
    renderScale = 1;

    /**
     * Creates one world instance and starts rendering and collision loops.
     * It cooperates with setWorld, draw, and CheckCollisions.
     */
    constructor(canvas, keyboard, callbacks = {}, levelFactory = createLevel1) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = levelFactory();
        this.onCharacterDeath = callbacks.onCharacterDeath ?? null;
        this.onEndbossDeath = callbacks.onEndbossDeath ?? null;
        this.draw();
        this.setWorld();
        this.CheckCollisions();
    }

    /**
     * Links the world reference to all active world objects.
     * It prepares the object graph used by collision and render helpers.
     */
    setWorld() {
        this.character.world = this;
        this.getAllWorldObjects().forEach((object) => {
            object.world = this;
        });
    }

    /**
     * Returns every level object that needs a back-reference to the world.
     * It supports setWorld without repeating the object list there.
     */
    getAllWorldObjects() {
        return [
            ...this.level.enemies,
            ...this.level.coins,
            ...this.level.poisonBubbles,
            ...this.level.backgroundObjects,
            ...this.level.bossTriggers
        ];
    }

    /**
     * Stores the current canvas render scale for high-DPI rendering.
     * It is called by syncGameViewport before the next draw cycle.
     */
    setRenderScale(scale = 1) {
        this.renderScale = scale > 0 ? scale : 1;
    }

    /**
     * Returns whether the world may currently update and animate.
     * It is reused by movement, collision, and endboss helper logic.
     */
    isRunning() {
        return !this.isPaused && !this.isDestroyed;
    }

    /**
     * Pauses update loops while keeping the world instance alive.
     * It is used by dialogs and portrait blocking in game helpers.
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resumes update loops after a pause state was cleared.
     * It complements pause and is called from UI helpers.
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Permanently stops the world and clears delayed result callbacks.
     * It is called before a new world is created or the game is left.
     */
    destroy() {
        this.isDestroyed = true;
        this.isPaused = true;

        if (this.resultDialogTimeout) {
            clearTimeout(this.resultDialogTimeout);
            this.resultDialogTimeout = null;
        }
    }
}
