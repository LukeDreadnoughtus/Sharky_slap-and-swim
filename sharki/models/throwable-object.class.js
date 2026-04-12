class ThrowableObject extends MovableObject {
    IMAGES_BUBBLE = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/Bubble.png'
    ];

    IMAGES_POISON_BUBBLE = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
    ];

    width = 45;
    height = 45;
    speedX = 5;
    speedY = -3.2;
    floatAcceleration = -0.02;
    maxRiseSpeed = -4.4;
    arcStrength = 1.1;
    direction = 1;
    travelDistance = 0;
    isRemoved = false;
    alreadyHit = false;
    damage = 2;
    bubbleType = 'normal';

    hitboxOffsetX = 8;
    hitboxOffsetY = 8;
    hitboxWidth = 28;
    hitboxHeight = 28;

    /**
     * Creates a normal or poison bubble and initializes its upward flight state.
     * It preloads both sprite options before animate starts the swim arc.
     */
    constructor(x, y, direction = 1, bubbleType = 'normal') {
        super().loadImage(this.getBubbleImagePath(bubbleType));
        this.loadImages(this.IMAGES_BUBBLE);
        this.loadImages(this.IMAGES_POISON_BUBBLE);
        this.x = x;
        this.y = y;
        this.startY = y;
        this.direction = direction;
        this.bubbleType = bubbleType;
        this.damage = bubbleType === 'poison' ? 10 : 2;
        this.animate();
    }

    /**
     * Returns the sprite path that matches the selected bubble type.
     * It keeps the constructor short before shared image loading happens.
     */
    getBubbleImagePath(bubbleType) {
        return bubbleType === 'poison'
            ? 'sharki/img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
            : 'sharki/img/1.Sharkie/4.Attack/Bubble trap/Bubble.png';
    }

    /**
     * Starts the recurring bubble flight loop until the bubble gets removed.
     * It delegates each frame to updateFlightStep so the interval body stays compact.
     */
    animate() {
        this.flightInterval = setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            this.updateFlightStep();
        }, 1000 / 60);
    }

    /**
     * Updates one upward swim step with a small forward arc.
     * It is called by animate until the bubble reaches the screen edge.
     */
    updateFlightStep() {
        if (this.isRemoved) {
            clearInterval(this.flightInterval);
            return;
        }

        this.travelDistance += this.speedX;
        this.x += this.speedX * this.direction;
        this.y += this.getVerticalFlightStep();
        this.speedY = Math.max(
            this.maxRiseSpeed,
            this.speedY + this.floatAcceleration
        );

        if (this.hasReachedUpperEdge()) {
            this.remove();
        }
    }

    /**
     * Returns the combined rise and arc offset for the current frame.
     * It supports updateFlightStep with a gentle bow-shaped path.
     */
    getVerticalFlightStep() {
        const arcOffset = Math.sin(this.travelDistance * 0.08) * this.arcStrength;
        return this.speedY + arcOffset;
    }

    /**
     * Checks whether the bubble already left the visible top area.
     * It keeps updateFlightStep focused on flight movement.
     */
    hasReachedUpperEdge() {
        return this.y + this.height < 0;
    }

    /**
     * Removes the bubble from collision and rendering after the flight ends.
     * It is used by updateFlightStep and collision code for a shared cleanup path.
     */
    remove() {
        this.isRemoved = true;
        this.collidable = false;
        this.hitboxWidth = 0;
        this.hitboxHeight = 0;
        this.width = 0;
        this.height = 0;
    }
}
