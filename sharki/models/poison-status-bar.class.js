class PoisonStatusBar extends DrawableObject {
    IMAGES = [
        'sharki/img/4. Marcadores/Purple/0_.png',
        'sharki/img/4. Marcadores/Purple/20_.png',
        'sharki/img/4. Marcadores/Purple/40_.png',
        'sharki/img/4. Marcadores/Purple/60_.png',
        'sharki/img/4. Marcadores/Purple/80_.png',
        'sharki/img/4. Marcadores/Purple/100_.png'
    ];

    collectedPoisonBubbles = 0;

    /**
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um poison status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit setCollectedPoisonBubbles zusammen.
     */

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 90;
        this.width = 200;
        this.height = 60;
        this.setCollectedPoisonBubbles(0);
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Liegt im Modellbereich rund um poison status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit resolveImageIndex zusammen.
     */

    setCollectedPoisonBubbles(collectedPoisonBubbles) {
        this.collectedPoisonBubbles = Math.max(0, Math.min(5, collectedPoisonBubbles));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um poison status bar und arbeitet nah an den Spielobjekten.
     */

    resolveImageIndex() {
        return Math.max(0, Math.min(5, this.collectedPoisonBubbles));
    }
}
