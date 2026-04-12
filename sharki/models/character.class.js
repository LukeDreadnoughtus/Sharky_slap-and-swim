class Character extends MovableObject {
    height = 250;
    width = 300;
    y = 190;
    speed = 10;
    minY = -70;
    maxY = 230;
    hitboxOffsetX = 120;
    hitboxOffsetY = 140;
    hitboxWidth = 110;
    hitboxHeight = 50;
    bubbleSpawnOffsetXRight = 210;
    bubbleSpawnOffsetXLeft = 40;
    bubbleSpawnOffsetY = 115;

    IMAGES_WALKING = [
        'sharki/img/1.Sharkie/1.IDLE/1.png',
        'sharki/img/1.Sharkie/1.IDLE/2.png',
        'sharki/img/1.Sharkie/1.IDLE/3.png',
        'sharki/img/1.Sharkie/1.IDLE/4.png',
        'sharki/img/1.Sharkie/1.IDLE/5.png',
        'sharki/img/1.Sharkie/1.IDLE/6.png',
        'sharki/img/1.Sharkie/1.IDLE/7.png',
        'sharki/img/1.Sharkie/1.IDLE/8.png',
        'sharki/img/1.Sharkie/1.IDLE/9.png',
        'sharki/img/1.Sharkie/1.IDLE/10.png',
        'sharki/img/1.Sharkie/1.IDLE/11.png',
        'sharki/img/1.Sharkie/1.IDLE/12.png',
        'sharki/img/1.Sharkie/1.IDLE/13.png',
        'sharki/img/1.Sharkie/1.IDLE/14.png',
        'sharki/img/1.Sharkie/1.IDLE/15.png',
        'sharki/img/1.Sharkie/1.IDLE/16.png',
        'sharki/img/1.Sharkie/1.IDLE/17.png',
        'sharki/img/1.Sharkie/1.IDLE/18.png'
    ];

    IMAGES_SWIM = [
        'sharki/img/1.Sharkie/3.Swim/1.png',
        'sharki/img/1.Sharkie/3.Swim/2.png',
        'sharki/img/1.Sharkie/3.Swim/3.png',
        'sharki/img/1.Sharkie/3.Swim/4.png',
        'sharki/img/1.Sharkie/3.Swim/5.png',
        'sharki/img/1.Sharkie/3.Swim/6.png'
    ];

    IMAGES_LONG_IDLE = [
        'sharki/img/1.Sharkie/2.Long_IDLE/i1.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I2.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I3.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I4.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I5.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I6.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I7.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I8.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I9.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I10.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I11.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I12.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I13.png',
        'sharki/img/1.Sharkie/2.Long_IDLE/I14.png'
    ];

    IMAGES_SLAP = [
        'sharki/img/1.Sharkie/4.Attack/Fin slap/1.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/2.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/3.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/4.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/5.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/6.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/7.png',
        'sharki/img/1.Sharkie/4.Attack/Fin slap/8.png'
    ];

    IMAGES_DEAD = [
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/1.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/2.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/3.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/4.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/5.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/6.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/7.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/8.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/9.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/10.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/11.png',
         'sharki/img/1.Sharkie/6.dead/1.Poisoned/12.png'
    ];

    IMAGES_HURT = [
         'sharki/img/1.Sharkie/5.Hurt/1.Poisoned/1.png',
         'sharki/img/1.Sharkie/5.Hurt/1.Poisoned/2.png',
         'sharki/img/1.Sharkie/5.Hurt/1.Poisoned/3.png',
         'sharki/img/1.Sharkie/5.Hurt/1.Poisoned/4.png',
         'sharki/img/1.Sharkie/5.Hurt/1.Poisoned/5.png'
    ];

    IMAGES_ELECTRIC_HURT = [
        'sharki/img/1.Sharkie/5.Hurt/2.Electric shock/5.png',
        'sharki/img/1.Sharkie/5.Hurt/2.Electric shock/4.png',
        'sharki/img/1.Sharkie/5.Hurt/2.Electric shock/1.png',
        'sharki/img/1.Sharkie/5.Hurt/2.Electric shock/2.png',
        'sharki/img/1.Sharkie/5.Hurt/2.Electric shock/3.png'
    ];

    IMAGES_BUBBLE_ATTACK = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
    ];

    IMAGES_POISON_BUBBLE_ATTACK = [
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png',
        'sharki/img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png'
    ];

    IMAGES_POSION_BUBBLE_ATTACK = this.IMAGES_POISON_BUBBLE_ATTACK;
    world;
    lastActionTime = Date.now();
    longIdleStartedAt = 0;
    isLongIdle = false;
    longIdleFrameDelay = 0;
    longIdleDelayThreshold = 3;
    isSlapping = false;
    slapImageIndex = 0;
    slapTargetsHit = new Set();
    isBubbleAttacking = false;
    bubbleAttackFrameIndex = 0;
    bubbleAttackType = null;
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    deathImageIndex = 0;
    hurtAnimationType = 'poison';

    /**
     * Creates the character and preloads all animation image groups.
     * It cooperates with animate, attack helpers, and hurt/death playback.
     */
    constructor() {
        super().loadImage('sharki/img/1.Sharkie/1.IDLE/1.png');
        this.loadCharacterImages();
        this.animate();
    }

    /**
     * Preloads all image groups used by movement, attacks, and damage states.
     * It keeps the constructor compact before animate starts its intervals.
     */
    loadCharacterImages() {
        [
            this.IMAGES_WALKING,
            this.IMAGES_SWIM,
            this.IMAGES_LONG_IDLE,
            this.IMAGES_SLAP,
            this.IMAGES_DEAD,
            this.IMAGES_HURT,
            this.IMAGES_ELECTRIC_HURT,
            this.IMAGES_BUBBLE_ATTACK,
            this.IMAGES_POISON_BUBBLE_ATTACK
        ].forEach((images) => this.loadImages(images));
    }

    /**
     * Clamps the vertical position to the configured movement bounds.
     * It supports swimUp, swimDown, and the shared movement update.
     */
    clampVerticalPosition() {
        this.y = Math.max(this.minY, Math.min(this.y, this.maxY));
    }

    /**
     * Moves the character upward and reapplies the vertical bounds.
     * It is used by the movement update inside animate.
     */
    swimUp() {
        this.registerAction();
        this.y -= this.speed;
        this.clampVerticalPosition();
    }

    /**
     * Moves the character downward and reapplies the vertical bounds.
     * It is used by the movement update inside animate.
     */
    swimDown() {
        this.registerAction();
        this.y += this.speed;
        this.clampVerticalPosition();
    }

    /**
     * Resets long idle tracking after movement or attacks change the state.
     * It supports movement helpers and attack starters before animations switch.
     */
    registerAction() {
        this.lastActionTime = Date.now();
        this.longIdleStartedAt = 0;
        this.isLongIdle = false;
        this.longIdleFrameDelay = 0;
    }

    /**
     * Enables the long idle state after seven seconds without player actions.
     * It supports updateCharacterAnimation before idle frames get selected.
     */
    checkLongIdle() {
        const inactiveTime = Date.now() - this.lastActionTime;

        if (inactiveTime < 7000) {
            return;
        }

        this.isLongIdle = true;

        if (!this.longIdleStartedAt) {
            this.longIdleStartedAt = Date.now();
        }
    }

    /**
     * Returns the correct hurt image group for the current damage type.
     * It supports the render update inside the animation interval.
     */
    getCurrentHurtImages() {
        return this.hurtAnimationType === 'electric'
            ? this.IMAGES_ELECTRIC_HURT
            : this.IMAGES_HURT;
    }

    /**
     * Starts the slap attack and resets hit tracking for this swing.
     * It cooperates with World.checkSlapHit and slap animation playback.
     */
    slap() {
        if (this.isSlapping) {
            return;
        }

        this.registerAction();
        this.isSlapping = true;
        this.slapImageIndex = 0;
        this.slapTargetsHit.clear();
        window.gameAudio?.play('slap_sound', { cooldown: 120 });
    }

    /**
     * Starts the normal projectile attack flow.
     * It delegates the shared setup to startProjectileAttack.
     */
    startBubbleAttack() {
        this.startProjectileAttack('normal');
    }

    /**
     * Starts the poison projectile flow when inventory is available.
     * It complements startBubbleAttack for the poison pickup mechanic.
     */
    startPoisonBubbleAttack() {
        if (!this.world || this.world.collectedPoisonBubbles <= 0) {
            return;
        }

        this.startProjectileAttack('poison');
    }

    /**
     * Starts one projectile attack state when the character is allowed to act.
     * It prepares the animation that later spawns the projectile in the world.
     */
    startProjectileAttack(type) {
        if (!this.canStartProjectileAttack()) {
            return;
        }

        this.registerAction();
        this.isBubbleAttacking = true;
        this.bubbleAttackType = type;
        this.bubbleAttackFrameIndex = 0;
        this.currentImage = 0;
        window.gameAudio?.play('bubble_sound', { cooldown: 120 });
    }

    /**
     * Checks whether a projectile attack may currently begin.
     * It supports startProjectileAttack by keeping the guard reusable.
     */
    canStartProjectileAttack() {
        return Boolean(this.world)
            && !this.isBubbleAttacking
            && !this.isSlapping
            && !this.isDead();
    }

    /**
     * Returns the correct projectile attack image group.
     * It supports bubble attack animation playback.
     */
    getCurrentBubbleAttackImages() {
        return this.bubbleAttackType === 'poison'
            ? this.IMAGES_POISON_BUBBLE_ATTACK
            : this.IMAGES_BUBBLE_ATTACK;
    }

    /**
     * Returns the projectile spawn position and direction from the current pose.
     * It is used by the world once the attack animation finishes.
     */
    getBubbleSpawnPosition() {
        const x = this.otherDirection
            ? this.x + this.bubbleSpawnOffsetXLeft
            : this.x + this.bubbleSpawnOffsetXRight;

        return {
            x,
            y: this.y + this.bubbleSpawnOffsetY,
            direction: this.otherDirection ? -1 : 1
        };
    }

    /**
     * Checks whether the current slap frame should deal melee damage.
     * It supports getSlapHitbox and world slap collision checks.
     */
    isSlapAttackFrame() {
        return this.isSlapping
            && this.slapImageIndex >= 3
            && this.slapImageIndex <= 5;
    }

    /**
     * Returns the active slap hitbox for the current animation frame.
     * It cooperates with isSlapAttackFrame and World.checkSlapHit.
     */
    getSlapHitbox() {
        if (!this.isSlapAttackFrame()) {
            return null;
        }

        return this.otherDirection
            ? this.getLeftSlapHitbox()
            : this.getRightSlapHitbox();
    }

    /**
     * Returns the slap hitbox for attacks facing left.
     * It is used by getSlapHitbox when otherDirection is active.
     */
    getLeftSlapHitbox() {
        const lineLength = 80;
        const y = this.y + this.height * 0.65 - 10;
        const endX = this.x + 120;
        return { x: endX - lineLength, y, width: lineLength, height: 20 };
    }

    /**
     * Returns the slap hitbox for attacks facing right.
     * It is used by getSlapHitbox in the default facing direction.
     */
    getRightSlapHitbox() {
        const lineLength = 80;
        const y = this.y + this.height * 0.65 - 10;
        return { x: this.x + this.width - 120, y, width: lineLength, height: 20 };
    }
}
