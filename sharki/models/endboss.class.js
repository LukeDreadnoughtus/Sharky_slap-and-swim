class Endboss extends MovableObject{
    width = 500;
    height = 400;
    y = 70;

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

    isVisible = false;
    introStarted = false;
    introFinished = false;
    introImageIndex = 0;

    constructor(config = {}){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_WALKING);
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

    startIntro() {
        if (this.introStarted) {
            return;
        }

        this.isVisible = true;
        this.introStarted = true;
        this.introFinished = false;
        this.collidable = false;
        this.currentImage = 0;
        this.introImageIndex = 0;

        const introInterval = setInterval(() => {
            if (this.introImageIndex >= this.IMAGES_INTRODUCE.length) {
                clearInterval(introInterval);
                this.finishIntro();
                return;
            }

            const path = this.IMAGES_INTRODUCE[this.introImageIndex];
            this.img = this.imageCache[path];
            this.introImageIndex++;
        }, 150);
    }

    finishIntro() {
        this.introFinished = true;
        this.collidable = true;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
    }

    animate(){
        setInterval(() => {
            if (!this.introFinished || this.isDead() || this.isRemoved) {
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }
}
