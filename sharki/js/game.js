let canvas;
let world;
let currentLevelNumber = 1;

const LEVEL_FACTORIES = {
    1: createLevel1,
    2: createLevel2
};

let keyboard = new Keyboard();

function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
    keyboard.S = false;
}

function createWorld(levelNumber = 1) {
    canvas = document.getElementById('canvas');

    if (!canvas) {
        return;
    }

    if (world) {
        world.destroy();
    }

    const levelFactory = LEVEL_FACTORIES[levelNumber] ?? createLevel1;
    currentLevelNumber = levelNumber;

    resetKeyboardState();
    world = new World(canvas, keyboard, {
        onCharacterDeath: showGameOverDialog,
        onEndbossDeath: () => showLevelCompleteDialog(currentLevelNumber)
    }, levelFactory);
    console.log('my Character is', world.character);
}

function init(levelNumber = 1) {
    closeResultDialog();
    createWorld(levelNumber);
    toggleInGameUi(true);
    closePauseDialog();
}

function showStartScreen() {
    const startScreen = document.getElementById('startscreen');

    if (world) {
        world.destroy();
        world = null;
    }

    currentLevelNumber = 1;
    resetKeyboardState();
    closeResultDialog();
    closePauseDialog();
    toggleInGameUi(false);

    if (startScreen) {
        startScreen.classList.remove('startscreen--hide');
    }
}

function restartLevel() {
    init(currentLevelNumber);
}

function toggleInGameUi(show) {
    const settingsBtn = document.getElementById('settingsBtn');

    if (!settingsBtn) {
        return;
    }

    settingsBtn.classList.toggle('hidden', !show);
}

function openPauseDialog() {
    const pauseOverlay = document.getElementById('pauseOverlay');
    const resultOverlay = document.getElementById('resultOverlay');

    if (!world || !pauseOverlay || (resultOverlay && !resultOverlay.classList.contains('hidden'))) {
        return;
    }

    world.pause();
    resetKeyboardState();
    pauseOverlay.classList.remove('hidden');
}

function closePauseDialog() {
    const pauseOverlay = document.getElementById('pauseOverlay');

    if (pauseOverlay) {
        pauseOverlay.classList.add('hidden');
    }

    if (world) {
        world.resume();
    }
}

function openResultDialog({ title, text = '', showTryAgain = false, showLeave = false, showNextLevel = false }) {
    const resultOverlay = document.getElementById('resultOverlay');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (!resultOverlay || !resultTitle || !resultText || !tryAgainBtn || !leaveGameBtn || !nextLevelBtn) {
        return;
    }

    closePauseDialog();
    resetKeyboardState();

    resultTitle.textContent = title;
    resultText.textContent = text;

    tryAgainBtn.classList.toggle('hidden', !showTryAgain);
    leaveGameBtn.classList.toggle('hidden', !showLeave);
    nextLevelBtn.classList.toggle('hidden', !showNextLevel);

    resultOverlay.classList.remove('hidden');
}

function closeResultDialog() {
    const resultOverlay = document.getElementById('resultOverlay');

    if (resultOverlay) {
        resultOverlay.classList.add('hidden');
    }
}

function showGameOverDialog() {
    openResultDialog({
        title: 'Game Over',
        text: 'Sharki wurde besiegt. Möchtest du das Level neu starten oder verlassen?',
        showTryAgain: true,
        showLeave: true
    });
}

function showLevelCompleteDialog(levelNumber) {
    const isLevelOne = levelNumber === 1;

    openResultDialog({
        title: 'Level geschafft',
        text: isLevelOne
            ? 'Der Endboss ist besiegt. Du kannst jetzt direkt Level 2 starten.'
            : 'Der Endboss ist besiegt. Level 2 wurde abgeschlossen.',
        showLeave: !isLevelOne,
        showNextLevel: isLevelOne
    });
}

function goToNextLevel() {
    if (currentLevelNumber !== 1) {
        return;
    }

    closeResultDialog();
    init(2);
}

function setupStartScreen() {
    const startScreen = document.getElementById('startscreen');
    const startBtn = document.getElementById('startBtn');
    const keyBtn = document.getElementById('keyBtn');
    const keyOverlay = document.getElementById('keyOverlay');
    const backdrop = document.querySelector('.key-overlay__backdrop');
    const settingsBtn = document.getElementById('settingsBtn');
    const closePauseBtn = document.getElementById('closePauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const leaveBtn = document.getElementById('leaveBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (!startScreen || !startBtn || !keyBtn || !keyOverlay || !backdrop || !settingsBtn || !closePauseBtn || !restartBtn || !leaveBtn || !tryAgainBtn || !leaveGameBtn || !nextLevelBtn) return;

    startBtn.addEventListener('click', () => {
        startScreen.classList.add('startscreen--hide');

        window.setTimeout(() => {
            init(1);
        }, 250);
    });

    keyBtn.addEventListener('click', () => {
        keyOverlay.classList.remove('hidden');
    });

    backdrop.addEventListener('click', () => {
        keyOverlay.classList.add('hidden');
    });

    settingsBtn.addEventListener('click', openPauseDialog);
    closePauseBtn.addEventListener('click', closePauseDialog);
    restartBtn.addEventListener('click', restartLevel);
    leaveBtn.addEventListener('click', showStartScreen);
    tryAgainBtn.addEventListener('click', restartLevel);
    leaveGameBtn.addEventListener('click', showStartScreen);
    nextLevelBtn.addEventListener('click', goToNextLevel);
}

window.addEventListener('load', setupStartScreen);

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
    if (e.keyCode == 83) keyboard.S = true;
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
    if (e.keyCode == 83) keyboard.S = false;
});
