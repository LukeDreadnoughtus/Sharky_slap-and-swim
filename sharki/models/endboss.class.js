class Endboss extends MovableObject {
    width = 500;
    height = 400;
    y = 70;
    speed = 0.35;
    movementSpeed = 0.35;
    damage = 8;
    attackCooldown = 1200;

    hitboxOffsetX = 45;
    hitboxOffsetY = 90;
    hitboxWidth = 420;
    hitboxHeight = 250;

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

    constructor(config = {}) {
        super().loadImage(this.IMAGES_INTRODUCE[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.energy = config.energy ?? 100;
        this.speed = config.speed ?? this.speed;
        this.movementSpeed = config.movementSpeed ?? config.speed ?? this.movementSpeed;
        this.targetX = config.x ?? 2500;
        this.introOffset = config.introOffset ?? 160;
        this.introFrameDuration = config.introFrameDuration ?? 150;
        this.introWaitTime = config.introWaitTime ?? 3000;
        this.moveWhileHurt = config.moveWhileHurt ?? this.moveWhileHurt;
        this.x = this.targetX;
        this.introStartX = this.targetX + this.introOffset;
        this.collidable = false;
        this.animate();
    }

    draw(ctx) {
        if (!this.isVisible || this.isRemoved) {
            return;
        }

        super.draw(ctx);
    }

    startIntro() {
        if (this.introStarted) {
            return;
        }

        this.isVisible = true;
        this.introStarted = true;
        this.introFinished = false;
        this.isWaitingAfterIntro = false;
        this.canMove = false;
        this.collidable = false;
        this.currentImage = 0;
        this.introImageIndex = 0;
        this.x = this.introStartX;
        this.img = this.imageCache[this.IMAGES_INTRODUCE[0]];

        const distance = this.introStartX - this.targetX;

        this.introInterval = setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (this.introImageIndex < this.IMAGES_INTRODUCE.length) {
                const path = this.IMAGES_INTRODUCE[this.introImageIndex];
                this.img = this.imageCache[path];
            }

            const progress = Math.min(1, (this.introImageIndex + 1) / this.IMAGES_INTRODUCE.length);
            this.x = this.introStartX - distance * progress;
            this.introImageIndex++;

            if (this.introImageIndex >= this.IMAGES_INTRODUCE.length) {
                clearInterval(this.introInterval);
                this.introInterval = null;
                this.x = this.targetX;
                this.finishIntro();
            }
        }, this.introFrameDuration);
    }

    finishIntro() {
        this.introFinished = true;
        this.isWaitingAfterIntro = true;
        this.collidable = true;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_WALKING[0]];

        setTimeout(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (this.isDead() || this.isRemoved) {
                return;
            }

            this.isWaitingAfterIntro = false;
            this.canMove = true;
        }, this.introWaitTime);
    }

    updateBehavior(character) {
        if (!character || !this.introFinished || this.isDead() || this.isRemoved) {
            return;
        }

        this.updateDirection(character);

        if (!this.canMove || this.isAttacking || (this.isHurtAnimating && !this.moveWhileHurt)) {
            return;
        }

        const bossCenter = this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
        const characterCenter = character.x + character.hitboxOffsetX + character.hitboxWidth / 2;

        if (characterCenter < bossCenter - 5) {
            this.x -= this.movementSpeed;
        } else if (characterCenter > bossCenter + 5) {
            this.x += this.movementSpeed;
        }
    }

    updateDirection(character) {
        const bossCenter = this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
        const characterCenter = character.x + character.hitboxOffsetX + character.hitboxWidth / 2;

        this.otherDirection = characterCenter > bossCenter;
    }

    canStartAttack() {
        return this.introFinished &&
            !this.isWaitingAfterIntro &&
            !this.isDead() &&
            !this.isRemoved &&
            !this.isAttacking &&
            !this.isHurtAnimating &&
            new Date().getTime() - this.lastAttackTime >= this.attackCooldown;
    }

    startAttack() {
        if (!this.canStartAttack()) {
            return false;
        }

        this.isAttacking = true;
        this.attackAnimationStarted = false;
        this.attackFrameIndex = 0;
        this.canMove = false;
        this.lastAttackTime = new Date().getTime();
        return true;
    }

    playAttackAnimation() {
        if (this.attackFrameIndex >= this.IMAGES_ATTACK.length) {
            this.isAttacking = false;
            this.attackAnimationStarted = false;
            this.attackFrameIndex = 0;
            this.currentImage = 0;

            if (!this.isDead() && !this.isRemoved && !this.isWaitingAfterIntro) {
                this.canMove = true;
            }
            return;
        }

        const path = this.IMAGES_ATTACK[this.attackFrameIndex];
        this.img = this.imageCache[path];
        this.attackFrameIndex++;
    }

    hit(damage = 5) {
        if (this.isDead() || this.isRemoved) {
            return;
        }

        super.hit(damage);

        if (this.isDead()) {
            return;
        }

        this.startHurtAnimation();
    }

    startHurtAnimation() {
        if (this.isAttacking || this.isHurtAnimating || !this.introFinished) {
            return;
        }

        this.isHurtAnimating = true;
        this.hurtAnimationStarted = false;
        this.hurtFrameIndex = 0;
        this.canMove = this.moveWhileHurt;
    }

    playHurtAnimation() {
        if (this.hurtFrameIndex >= this.IMAGES_HURT.length) {
            this.isHurtAnimating = false;
            this.hurtAnimationStarted = false;
            this.hurtFrameIndex = 0;
            this.currentImage = 0;

            if (!this.isDead() && !this.isRemoved && !this.isWaitingAfterIntro) {
                this.canMove = true;
            }
            return;
        }

        const path = this.IMAGES_HURT[this.hurtFrameIndex];
        this.img = this.imageCache[path];
        this.hurtFrameIndex++;
    }

    onDeath() {
        this.disableHitbox();
        this.canMove = false;
        this.startDeathAnimation();
    }

    startDeathAnimation() {
        if (this.deathAnimationStarted) {
            return;
        }

        this.deathAnimationStarted = true;
        this.isAttacking = false;
        this.isHurtAnimating = false;
        this.attackAnimationStarted = false;
        this.hurtAnimationStarted = false;
        this.attackFrameIndex = 0;
        this.hurtFrameIndex = 0;
        this.currentImage = 0;

        let frameIndex = 0;
        const deathInterval = setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (frameIndex >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                setTimeout(() => {
                    this.isRemoved = true;
                }, 600);
                return;
            }

            const path = this.IMAGES_DEAD[frameIndex];
            this.img = this.imageCache[path];
            frameIndex++;
        }, 180);
    }

    animate() {
        setInterval(() => {
            if (this.world && !this.world.isRunning()) {
                return;
            }

            if (!this.introFinished || this.isDead() || this.isRemoved) {
                return;
            }

            if (this.isAttacking) {
                if (!this.attackAnimationStarted) {
                    this.attackAnimationStarted = true;
                    this.attackFrameIndex = 0;
                }
                this.playAttackAnimation();
                return;
            }

            if (this.isHurtAnimating) {
                if (!this.hurtAnimationStarted) {
                    this.hurtAnimationStarted = true;
                    this.hurtFrameIndex = 0;
                }
                this.playHurtAnimation();
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 120);
    }
}
