class BossTrigger extends DrawableObject {
    width = 8;
    height = 280;
    y = 120;
    collidable = true;
    hitboxOffsetX = 0;
    hitboxOffsetY = 0;
    hitboxWidth = this.width;
    hitboxHeight = this.height;
    isActivated = false;
    isRemoved = false;

    constructor(x, y = 120, height = 280) {
        super();
        this.x = x;
        this.y = y;
        this.height = height;
        this.hitboxHeight = height;
        this.loadImage('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
    }

    /**
     * - Aktualisiert Darstellung, Status oder Rendering im Spiel.
     * - Liegt im Modellbereich rund um boss trigger und arbeitet nah an den Spielobjekten.
     */

    draw(ctx) {
        if (this.isRemoved || !DrawableObject.SHOW_DEBUG_VISUALS) {
            return;
        }

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um boss trigger und arbeitet nah an den Spielobjekten.
     */

    activate() {
        this.isActivated = true;
        this.isRemoved = true;
        this.collidable = false;
    }
}
