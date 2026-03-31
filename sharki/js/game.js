let canvas;
let world;

let keyboard = new Keyboard();

function init() {
    if (world) return;

    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('my Character is', world.character);
}

function setupStartScreen() {
    const startScreen = document.getElementById('startscreen');
    const startBtn = document.getElementById('startBtn');
    const keyBtn = document.getElementById('keyBtn');
    const keyOverlay = document.getElementById('keyOverlay');
    const backdrop = document.querySelector('.key-overlay__backdrop');

    if (!startScreen || !startBtn || !keyBtn || !keyOverlay || !backdrop) return;

    startBtn.addEventListener('click', () => {
        startScreen.classList.add('startscreen--hide');

        window.setTimeout(() => {
            init();
        }, 250);
    });

    keyBtn.addEventListener('click', () => {
        keyOverlay.classList.remove('hidden');
    });

    backdrop.addEventListener('click', () => {
        keyOverlay.classList.add('hidden');
    });
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
