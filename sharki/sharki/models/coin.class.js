class Coin extends MovableObject {
    IMAGES = [
        'sharki/img/4. Marcadores/1. Coins/3.png',
        'sharki/img/4. Marcadores/1. Coins/4.png',
        'sharki/img/4. Marcadores/1. Coins/1.png',
        'sharki/img/4. Marcadores/1. Coins/2.png'
    ];

    width = 40;
    height = 40;
    collected = false;

    hitboxOffsetX = 4;
    hitboxOffsetY = 4;
    hitboxWidth = 32;
    hitboxHeight = 32;

    /**
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um coin und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit animate zusammen.
     */

    constructor(x, y) {
        super().loadImage('sharki/img/4. Marcadores/1. Coins/3.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * - Steuert Animationsabläufe und wiederkehrende Bewegungen der Spielfigur oder Objekte.
     * - Liegt im Modellbereich rund um coin und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf world zu.
     */

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (!this.collected) {
                this.playAnimation(this.IMAGES);
            }
        }, 140);
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um coin und arbeitet nah an den Spielobjekten.
     */

    collect() {
        this.collected = true;
        this.width = 0;
        this.height = 0;
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
    }
}
