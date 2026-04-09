class StatusBar extends DrawableObject {

    IMAGES = [
        'sharki/img/4. Marcadores/Purple/0_ .png',
        'sharki/img/4. Marcadores/Purple/20__1.png',
        
        'sharki/img/4. Marcadores/Purple/40_ .png',
        'sharki/img/4. Marcadores/Purple/60_ .png',
        'sharki/img/4. Marcadores/Purple/80_ .png',
        'sharki/img/4. Marcadores/Purple/100_ .png'
    ];

     IMAGES_poison_blubble = [
        'sharki/img/4. Marcadores/Purple/0_.png',
        'sharki/img/4. Marcadores/Purple/20_.png',
        
        'sharki/img/4. Marcadores/Purple/40_.png',
        'sharki/img/4. Marcadores/Purple/60_.png',
        'sharki/img/4. Marcadores/Purple/80_.png',
        'sharki/img/4. Marcadores/Purple/100_.png'
    ];

    percentage = 100;

    /**
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit setPercentage zusammen.
     */

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * - Setzt Werte oder wendet Einstellungen direkt auf Objekte an.
     * - Liegt im Modellbereich rund um status bar und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit resolveImageIndex zusammen.
     */

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um status bar und arbeitet nah an den Spielobjekten.
     */

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}