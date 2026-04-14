class EndbossStatusBar extends StatusBar {
    IMAGES = [
        'sharki/img/4. Marcadores/green/Life/0_  copia 3.png',
        'sharki/img/4. Marcadores/green/Life/20_ copia 4.png',
        'sharki/img/4. Marcadores/green/Life/40_  copia 3.png',
        'sharki/img/4. Marcadores/green/Life/60_  copia 3.png',
        'sharki/img/4. Marcadores/green/Life/80_  copia 3.png',
        'sharki/img/4. Marcadores/green/Life/100_  copia 2.png'
    ];

    isVisible = false;

    /**
     * Creates the boss health bar with mirrored art on the right HUD side.
     * It extends StatusBar and is shown by World.startBossFight.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 590;
        this.y = 50;
        this.setPercentage(100);
    }

    /**
     * Draws the boss bar only after the boss trigger activated the fight.
     * It mirrors the HUD art so it visually matches the right screen edge.
     */
    draw(ctx) {
        if (!this.isVisible || !this.canDrawSprite()) {
            return;
        }

        ctx.save();
        ctx.translate(this.x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }

    /**
     * Resolves the boss frame with a dedicated zero-health image rule.
     * It overrides StatusBar.resolveImageIndex for the boss asset set.
     */
    resolveImageIndex() {
        if (this.percentage <= 0) {
            return 0;
        }

        if (this.percentage <= 20) {
            return 1;
        }

        if (this.percentage <= 40) {
            return 2;
        }

        if (this.percentage <= 60) {
            return 3;
        }

        if (this.percentage <= 80) {
            return 4;
        }

        return 5;
    }
}
