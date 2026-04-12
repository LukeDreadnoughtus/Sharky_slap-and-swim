class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 300;
    height = 150;
    width = 100;
    static SHOW_DEBUG_VISUALS = false;

    /**
     * Loads one image and stores it as the active sprite for this object.
     * It is the basic asset helper used before draw renders the object.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current sprite only when the object is visible and image-ready.
     * It is reused by all model classes before optional debug visuals are added.
     */
    draw(ctx) {
        if (!this.canDrawSprite()) {
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Checks whether the current sprite is ready to be drawn on the canvas.
     * It supports draw so the render method stays compact.
     */
    canDrawSprite() {
        return !this.isRemoved && Boolean(this.img) && this.img.complete && this.img.naturalWidth !== 0;
    }

    /**
     * Draws the configured debug hitbox when debug visuals are enabled.
     * It delegates type and hitbox checks so the render method stays small.
     */
    drawFrame(ctx) {
        if (!this.shouldDrawHitbox()) {
            return;
        }

        this.renderHitboxFrame(ctx);
    }

    /**
     * Checks whether a debug hitbox should be rendered for the current object.
     * It is shared by drawFrame before any canvas drawing happens.
     */
    shouldDrawHitbox() {
        return !this.isRemoved && DrawableObject.SHOW_DEBUG_VISUALS
            && this.collidable && this.hitboxWidth > 0 && this.hitboxHeight > 0
            && this.isSupportedDebugTarget();
    }

    /**
     * Checks whether the current object type supports the blue debug frame.
     * It keeps drawFrame free from a long instanceof chain.
     */
    isSupportedDebugTarget() {
        return this instanceof Character || this instanceof Shark || this instanceof Endboss
            || this instanceof Coin || this instanceof PoisonBubble || this instanceof ThrowableObject;
    }

    /**
     * Renders the blue debug rectangle around the configured hitbox area.
     * It is used by drawFrame once all guard checks already passed.
     */
    renderHitboxFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x + this.hitboxOffsetX, this.y + this.hitboxOffsetY, this.hitboxWidth, this.hitboxHeight);
        ctx.stroke();
    }

    /**
     * Draws the red slap debug line for the character attack hitbox.
     * It uses helper methods so the visual setup and line math stay separate.
     */
    drawAttackLine(ctx) {
        const hitbox = this.getDrawableAttackHitbox();

        if (!hitbox) {
            return;
        }

        this.renderAttackDebugLine(ctx, hitbox);
    }

    /**
     * Returns the slap hitbox only when character debug visuals should render.
     * It supports drawAttackLine without mixing guards and canvas drawing.
     */
    getDrawableAttackHitbox() {
        if (!(this instanceof Character) || !DrawableObject.SHOW_DEBUG_VISUALS) {
            return null;
        }

        return this.getSlapHitbox();
    }

    /**
     * Renders the red debug line through the active slap hitbox center.
     * It is called by drawAttackLine after the hitbox was resolved.
     */
    renderAttackDebugLine(ctx, hitbox) {
        const startX = this.otherDirection ? hitbox.x + hitbox.width : hitbox.x;
        const endX = this.otherDirection ? hitbox.x : hitbox.x + hitbox.width;
        const lineY = hitbox.y + hitbox.height / 2;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'red';
        ctx.moveTo(startX, lineY);
        ctx.lineTo(endX, lineY);
        ctx.stroke();
    }

    /**
     * Preloads an image list into the shared cache for later animation playback.
     * It is used by constructors before playAnimation switches between frames.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
