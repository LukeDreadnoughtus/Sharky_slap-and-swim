class Endboss extends MovableObject {
    width = 500;
    height = 400;
    y = 70;
    speed = 0.35;
    movementSpeed = 1.5;
    verticalMovementSpeed = 2.3;
    verticalTrackingTolerance = 8;
    verticalTargetOffset = 10;
    minY = -380;
    maxY = 110;
    damage = 8;
    attackCooldown = 1200;

    hitboxOffsetX = 25;
    hitboxOffsetY = 220;
    hitboxWidth = 420;
    hitboxHeight = 90;

    IMAGES_INTRODUCE = [
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
        'sharki/img/2.Enemy/3 Final Enemy/1.Introduce/10.png'
    ];

    IMAGES_WALKING = [
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/1.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/2.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/3.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/4.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/5.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/6.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/7.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/8.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/9.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/10.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/11.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/12.png',
        'sharki/img/2.Enemy/3 Final Enemy/2.floating/13.png'
    ];

    IMAGES_ATTACK = [
        'sharki/img/2.Enemy/3 Final Enemy/Attack/1.png',
        'sharki/img/2.Enemy/3 Final Enemy/Attack/2.png',
        'sharki/img/2.Enemy/3 Final Enemy/Attack/3.png',
        'sharki/img/2.Enemy/3 Final Enemy/Attack/4.png',
        'sharki/img/2.Enemy/3 Final Enemy/Attack/5.png',
        'sharki/img/2.Enemy/3 Final Enemy/Attack/6.png'
    ];

    IMAGES_HURT = [
        'sharki/img/2.Enemy/3 Final Enemy/Hurt/1.png',
        'sharki/img/2.Enemy/3 Final Enemy/Hurt/3.png'
    ];

    IMAGES_DEAD = [
        'sharki/img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
        'sharki/img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
        'sharki/img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
        'sharki/img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
        'sharki/img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
    ];

    isVisible = false;
    isRemoved = false;
    introStarted = false;
    introFinished = false;
    introImageIndex = 0;
    introInterval = null;
    isWaitingAfterIntro = false;
    canMove = false;
    isAttacking = false;
    attackAnimationStarted = false;
    attackFrameIndex = 0;
    lastAttackTime = 0;
    isHurtAnimating = false;
    hurtAnimationStarted = false;
    hurtFrameIndex = 0;
    deathAnimationStarted = false;
    moveWhileHurt = false;

    /**
     * Creates the boss with its images, timings, and movement defaults.
     * It prepares the shared state that the intro and combat method files consume.
     */
    constructor(config = {}) {
        super().loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadEndbossImages();
        this.applyEndbossConfig(config);
        this.x = this.targetX;
        this.introStartX = this.targetX + this.introOffset;
        this.collidable = false;
        this.animate();
    }

    /**
     * Loads all image sequences that the split intro and combat flows reuse.
     * It keeps the constructor small before the prototype methods take over.
     */
    loadEndbossImages() {
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Applies the optional boss config values used by later behavior methods.
     * It centralizes setup so the prototype files can trust consistent state.
     */
    applyEndbossConfig(config) {
        this.energy = config.energy ?? 100;
        this.speed = config.speed ?? this.speed;
        this.movementSpeed = config.movementSpeed ?? config.speed ?? this.movementSpeed;
        this.verticalMovementSpeed = config.verticalMovementSpeed ?? this.verticalMovementSpeed;
        this.verticalTrackingTolerance = config.verticalTrackingTolerance ?? this.verticalTrackingTolerance;
        this.verticalTargetOffset = config.verticalTargetOffset ?? this.verticalTargetOffset;
        this.minY = config.minY ?? this.minY;
        this.maxY = config.maxY ?? this.maxY;
        this.targetX = config.x ?? 2500;
        this.introOffset = config.introOffset ?? 160;
        this.introFrameDuration = config.introFrameDuration ?? 150;
        this.introWaitTime = config.introWaitTime ?? 3000;
        this.moveWhileHurt = config.moveWhileHurt ?? this.moveWhileHurt;
    }

    /**
     * Draws the boss only while it is active and not removed from play.
     * It stays minimal because the render flow already delegates to DrawableObject.
     */
    draw(ctx) {
        if (!this.isVisible || this.isRemoved) {
            return;
        }

        super.draw(ctx);
    }
}
