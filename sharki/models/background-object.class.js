class BackgroundObject extends MovableObject {

    width = 820;
    height = 480;

    /**
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um background object und arbeitet nah an den Spielobjekten.
     */

    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 0;
    }
}