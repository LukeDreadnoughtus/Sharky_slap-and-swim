class CoinStatusBar extends DrawableObject {
    IMAGES = [
        'sharki/img/4. Marcadores/Purple/0_ _1.png',
        'sharki/img/4. Marcadores/Purple/20_ .png',
        'sharki/img/4. Marcadores/Purple/40_ _1.png',
        'sharki/img/4. Marcadores/Purple/60_ _1.png',
        'sharki/img/4. Marcadores/Purple/80_ _1.png',
        'sharki/img/4. Marcadores/Purple/100__1.png'
    ];

    collectedCoins = 0;

    /**
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um coin status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit setCollectedCoins zusammen.
     */

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 45;
        this.width = 200;
        this.height = 60;
        this.setCollectedCoins(0);
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Liegt im Modellbereich rund um coin status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit resolveImageIndex zusammen.
     */

    setCollectedCoins(collectedCoins) {
        this.collectedCoins = collectedCoins;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um coin status bar und arbeitet nah an den Spielobjekten.
     */

    resolveImageIndex() {
        return Math.min(5, Math.floor(this.collectedCoins / 5));
    }
}
