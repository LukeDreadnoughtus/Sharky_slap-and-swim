class Character extends MovableObject{
    height = 250;
    width = 300;

    y = 190;
    speed = 10;
    minY = -70;
    maxY = 230;

    hitboxOffsetX = 120;
    hitboxOffsetY = 140;
    hitboxWidth = 60;
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

    IMAGES_DEAD =[
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
     * - Erzeugt die Instanz und startet die Grundinitialisierung der Klasse.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit animate zusammen.
     */

    constructor(){
        super().loadImage('sharki/img/1.Sharkie/1.IDLE/1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_SLAP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ELECTRIC_HURT);
        this.loadImages(this.IMAGES_BUBBLE_ATTACK);
        this.loadImages(this.IMAGES_POISON_BUBBLE_ATTACK);
        this.animate();
    }


    clampVerticalPosition() {
        this.y = Math.max(this.minY, Math.min(this.y, this.maxY));
    }

    swimUp() {
        this.y -= this.speed;
        this.clampVerticalPosition();
    }

    swimDown() {
        this.y += this.speed;
        this.clampVerticalPosition();
    }

    /**
     * - Steuert Animationsabläufe und wiederkehrende Bewegungen der Spielfigur oder Objekte.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit getCurrentHurtImages, slap zusammen.
     * - Greift dabei auf world, keyboard, level zu.
     */

    animate(){
        setInterval(() => {
            if (!this.world || !this.world.keyboard || !this.world.level) {
                return;
            }

            if (this.isDead()) {
                return;
            }

            if (!this.isBubbleAttacking) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.character_max_x) {
                    this.x = Math.min(this.x + this.speed, this.world.level.character_max_x);
                    this.otherDirection = false;
                }

                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.x -= this.speed;
                    this.otherDirection = true;
                }

                if (this.world.keyboard.UP) {
                    this.swimUp();
                }

                if (this.world.keyboard.DOWN) {
                    this.swimDown();
                }
            }

            this.clampVerticalPosition();

            if (this.world.keyboard.SPACE && !this.isSlapping && !this.isBubbleAttacking) {
                this.slap();
            }

            if (this.world.keyboard.S) {
                this.startBubbleAttack();
            }

            if (this.world.keyboard.D) {
                this.startPoisonBubbleAttack();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (!this.world || !this.world.keyboard) {
                return;
            }

            if (this.isDead()) {
                this.playDeathAnimationOnce();
            } else if (this.isHurt()) {
                this.playAnimation(this.getCurrentHurtImages());
            } else if (this.isBubbleAttacking) {
                this.playBubbleAttackAnimation();
            } else if (this.isSlapping) {
                let path = this.IMAGES_SLAP[this.slapImageIndex];
                this.img = this.imageCache[path];
                this.slapImageIndex++;

                if (this.slapImageIndex >= this.IMAGES_SLAP.length) {
                    this.isSlapping = false;
                    this.slapImageIndex = 0;
                    this.currentImage = 0;
                    this.slapTargetsHit.clear();
                }
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
                this.playAnimation(this.IMAGES_SWIM);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 80);
    }


    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    getCurrentHurtImages() {
        return this.hurtAnimationType === 'electric'
            ? this.IMAGES_ELECTRIC_HURT
            : this.IMAGES_HURT;
    }


    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf Audio zu.
     */

    slap() {
        if (!this.isSlapping) {
            this.isSlapping = true;
            this.slapImageIndex = 0;
            this.slapTargetsHit.clear();

            if (window.gameAudio) {
                window.gameAudio.play('slap_sound', { cooldown: 120 });
            }
        }
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit startProjectileAttack zusammen.
     */

    startBubbleAttack() {
        this.startProjectileAttack('normal');
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit startProjectileAttack zusammen.
     * - Greift dabei auf world zu.
     */

    startPoisonBubbleAttack() {
        if (!this.world || this.world.collectedPoisonBubbles <= 0) {
            return;
        }

        this.startProjectileAttack('poison');
    }

    /**
     * - Initialisiert Abläufe oder bereitet benötigte Daten vor.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf world, Audio zu.
     */

    startProjectileAttack(type) {
        if (!this.world || this.isBubbleAttacking || this.isSlapping || this.isDead()) {
            return;
        }

        this.isBubbleAttacking = true;
        this.bubbleAttackType = type;
        this.bubbleAttackFrameIndex = 0;
        this.currentImage = 0;

        if (window.gameAudio) {
            window.gameAudio.play('bubble_sound', { cooldown: 120 });
        }
    }

    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    getCurrentBubbleAttackImages() {
        return this.bubbleAttackType === 'poison'
            ? this.IMAGES_POISON_BUBBLE_ATTACK
            : this.IMAGES_BUBBLE_ATTACK;
    }

    /**
     * - Spielt Medien ab oder lädt benötigte Ressourcen.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit getCurrentBubbleAttackImages, finishBubbleAttack zusammen.
     */

    playBubbleAttackAnimation() {
        const images = this.getCurrentBubbleAttackImages();

        if (this.bubbleAttackFrameIndex >= images.length) {
            this.finishBubbleAttack();
            return;
        }

        let path = images[this.bubbleAttackFrameIndex];
        this.img = this.imageCache[path];
        this.bubbleAttackFrameIndex++;
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Greift dabei auf world zu.
     */

    finishBubbleAttack() {
        const attackType = this.bubbleAttackType;

        this.isBubbleAttacking = false;
        this.bubbleAttackFrameIndex = 0;
        this.bubbleAttackType = null;
        this.currentImage = 0;

        if (!this.world) {
            return;
        }

        if (attackType === 'poison') {
            if (this.world.collectedPoisonBubbles > 0) {
                this.world.removePoisonBubbleFromInventory(1);
                this.world.spawnPoisonBubbleShot();
            }
            return;
        }

        this.world.spawnBubbleShot();
    }

    /**
     * - Spielt Medien ab oder lädt benötigte Ressourcen.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    playDeathAnimationOnce() {
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.deathAnimationFinished = false;
            this.deathImageIndex = 0;
            this.currentImage = 0;
        }

        if (this.deathImageIndex >= this.IMAGES_DEAD.length) {
            const lastImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
            this.img = this.imageCache[lastImage];
            this.deathAnimationFinished = true;
            return;
        }

        const path = this.IMAGES_DEAD[this.deathImageIndex];
        this.img = this.imageCache[path];
        this.deathImageIndex++;

        if (this.deathImageIndex >= this.IMAGES_DEAD.length) {
            this.deathAnimationFinished = true;
        }
    }

    hit(damage = 5, type = 'poison') {
        if (this.isDead()) {
            return;
        }

        this.hurtAnimationType = type === 'electric' ? 'electric' : 'poison';
        super.hit(damage);

        if (this.isDead()) {
            this.triggerDeathState();
            return;
        }

        if (this.energy <= 20) {
            this.energy = 0;
            this.triggerDeathState();
        }
    }

    /**
     * - Übernimmt einen abgegrenzten Teil der Spiellogik in dieser Datei.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    triggerDeathState() {
        this.lastHit = 0;
        this.isSlapping = false;
        this.isBubbleAttacking = false;
        this.slapImageIndex = 0;
        this.bubbleAttackFrameIndex = 0;
        this.bubbleAttackType = null;
        this.currentImage = 0;
        this.deathAnimationStarted = false;
        this.deathAnimationFinished = false;
        this.deathImageIndex = 0;

        if (typeof this.onDeath === 'function') {
            this.onDeath();
        }
    }

    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    getBubbleSpawnPosition() {
        const spawnX = this.otherDirection
            ? this.x + this.bubbleSpawnOffsetXLeft
            : this.x + this.bubbleSpawnOffsetXRight;

        return {
            x: spawnX,
            y: this.y + this.bubbleSpawnOffsetY,
            direction: this.otherDirection ? -1 : 1
        };
    }

    /**
     * - Prüft einen Zustand oder liefert eine boolesche Aussage.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     */

    isSlapAttackFrame() {
        return this.isSlapping && this.slapImageIndex >= 3 && this.slapImageIndex <= 5;
    }

    /**
     * - Liest Daten aus und gibt einen passenden Wert zurück.
     * - Liegt im Modellbereich rund um character und arbeitet nah an den Spielobjekten.
     * - Hängt direkt mit isSlapAttackFrame zusammen.
     */

    getSlapHitbox() {
        if (!this.isSlapAttackFrame()) {
            return null;
        }

        const lineLength = 80;
        const lineY = this.y + this.height * 0.65;
        const lineHeight = 20;

        if (this.otherDirection) {
            const endX = this.x + 120;
            return {
                x: endX - lineLength,
                y: lineY - lineHeight / 2,
                width: lineLength,
                height: lineHeight
            };
        }

        return {
            x: this.x + this.width - 120,
            y: lineY - lineHeight / 2,
            width: lineLength,
            height: lineHeight
        };
    }
}
