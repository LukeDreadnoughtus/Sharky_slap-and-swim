class Endboss extends MovableObject{
    width = 500;
    height = 400;
    y = 70;

    hitboxOffsetX = 45;
    hitboxOffsetY = 90;
    hitboxWidth = 420;
    hitboxHeight = 250;

    damage = 8;
    speed = 0.35;
    attackCooldown = 1200;
    waitAfterIntro = 3000;

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
        'sharki/img/2.Enemy/3 Final Enemy/Hurt/2.png',
        'sharki/img/2.Enemy/3 Final Enemy/Hurt/3.png',
        'sharki/img/2.Enemy/3 Final Enemy/Hurt/4.png'
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
    waitUntil = 0;
    attackAnimationRunning = false;
    hurtAnimationRunning = false;
    deathAnimationStarted = false;
    hasDealtAttackDamage = false;
    lastAttackAt = 0;
    character = null;

    constructor(config = {}){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.energy = config.energy ?? 100;
        this.x = config.x ?? 2500;
        this.collidable = false;
        this.animate();
    }

    draw(ctx) {
        if (!this.isVisible || this.isRemoved) {
            return;
        }

        super.draw(ctx);
    }

    setTarget(character) {
        this.character = character;
    }

    startIntro() {
        if (this.introStarted) {
            return;
        }

        this.isVisible = true;
        this.introStarted = true;
        this.introFinished = false;
        this.collidable = false;
        this.currentImage = 0;

        let introFrame = 0;
        const introInterval = setInterval(() => {
            if (this.isRemoved) {
                clearInterval(introInterval);
                return;
            }

            if (introFrame >= this.IMAGES_INTRODUCE.length) {
                clearInterval(introInterval);
                this.finishIntro();
                return;
            }

            const path = this.IMAGES_INTRODUCE[introFrame];
            this.img = this.imageCache[path];
            introFrame++;
        }, 150);
    }

    finishIntro() {
        this.introFinished = true;
        this.waitUntil = Date.now() + this.waitAfterIntro;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
        this.collidable = true;
    }

    updateDirection() {
        if (!this.character) {
            return;
        }

        // Boss-Grafik hat die entgegengesetzte Grundrichtung zu den normalen Gegnern.
        // Darum wird die Spiegelung hier invertiert gesetzt.
        this.otherDirection = this.character.x > this.x;
    }

    canMove() {
        return this.introFinished &&
               Date.now() >= this.waitUntil &&
               !this.attackAnimationRunning &&
               !this.hurtAnimationRunning &&
               !this.deathAnimationStarted &&
               !this.isDead() &&
               !!this.character;
    }

    moveTowardCharacter() {
        if (!this.canMove()) {
            return;
        }

        const distanceX = this.character.x - this.x;

        if (Math.abs(distanceX) <= 5) {
            return;
        }

        this.x += distanceX > 0 ? this.speed : -this.speed;
        this.updateDirection();
    }

    tryAttack(character) {
        if (this.deathAnimationStarted || this.isDead() || this.attackAnimationRunning || !this.introFinished) {
            return;
        }

        if (Date.now() - this.lastAttackAt < this.attackCooldown) {
            return;
        }

        this.character = character;
        this.updateDirection();
        this.startAttackAnimation();
    }

    startAttackAnimation() {
        this.attackAnimationRunning = true;
        this.hasDealtAttackDamage = false;
        this.currentImage = 0;

        let frameIndex = 0;
        const attackInterval = setInterval(() => {
            if (this.isRemoved || this.deathAnimationStarted) {
                clearInterval(attackInterval);
                return;
            }

            if (frameIndex >= this.IMAGES_ATTACK.length) {
                clearInterval(attackInterval);
                this.attackAnimationRunning = false;
                this.lastAttackAt = Date.now();
                this.currentImage = 0;
                return;
            }

            const path = this.IMAGES_ATTACK[frameIndex];
            this.img = this.imageCache[path];

            if (!this.hasDealtAttackDamage && frameIndex >= 2 && this.character && this.isColliding(this.character)) {
                this.character.hit(this.damage);
                if (this.character.world && this.character.world.statusBar) {
                    this.character.world.statusBar.setPercentage(this.character.energy);
                }
                this.hasDealtAttackDamage = true;
            }

            frameIndex++;
        }, 120);
    }

    hit(damage = 5){
        if (this.isDead() || this.deathAnimationStarted || this.isRemoved) {
            return;
        }

        super.hit(damage);

        if (this.isDead()) {
            this.startDeathAnimation();
            return;
        }

        this.startHurtAnimation();
    }

    onDeath() {
        this.startDeathAnimation();
    }

    startHurtAnimation() {
        if (this.hurtAnimationRunning || this.attackAnimationRunning || this.deathAnimationStarted) {
            return;
        }

        this.hurtAnimationRunning = true;
        this.currentImage = 0;

        let frameIndex = 0;
        const hurtInterval = setInterval(() => {
            if (this.isRemoved || this.deathAnimationStarted) {
                clearInterval(hurtInterval);
                return;
            }

            if (frameIndex >= this.IMAGES_HURT.length) {
                clearInterval(hurtInterval);
                this.hurtAnimationRunning = false;
                this.currentImage = 0;
                return;
            }

            const path = this.IMAGES_HURT[frameIndex];
            this.img = this.imageCache[path];
            frameIndex++;
        }, 100);
    }

    startDeathAnimation() {
        if (this.deathAnimationStarted) {
            return;
        }

        this.deathAnimationStarted = true;
        this.collidable = false;
        this.currentImage = 0;

        let frameIndex = 0;
        const deathInterval = setInterval(() => {
            if (frameIndex >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
                return;
            }

            const path = this.IMAGES_DEAD[frameIndex];
            this.img = this.imageCache[path];
            frameIndex++;
        }, 180);
    }

    animate(){
        setInterval(() => {
            if (!this.isVisible || this.isRemoved || this.deathAnimationStarted) {
                return;
            }

            this.moveTowardCharacter();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isVisible || this.isRemoved || this.deathAnimationStarted) {
                return;
            }

            if (this.attackAnimationRunning || this.hurtAnimationRunning || !this.introFinished) {
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }
}
