class Shark extends MovableObject{
    static VARIANTS = {
        default: {
            swimImage: 'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
            walkingImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition1.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition4.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition5.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
            ],
            energy: 10,
            damage: 5
        },
        transition2: {
            swimImage: 'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png',
            walkingImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition1.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition4.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition5.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.3.png'
            ],
            energy: 15,
            damage: 7
        }
    };

    height = 150;
    width = 100;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = 80;
    hitboxHeight = 80;
    y = 310;
    isRemoved = false;
    deathAnimationStarted = false;

    constructor(config = {}){
        const variantName = config.variant ?? 'default';
        const variant = Shark.VARIANTS[variantName] ?? Shark.VARIANTS.default;

        super().loadImage(variant.swimImage);

        this.variant = variantName;
        this.IMAGES_WALKING = variant.walkingImages;
        this.IMAGES_DEAD = variant.deadImages;
        this.damage = config.damage ?? variant.damage;
        this.energy = config.energy ?? variant.energy;
        this.x = config.x ?? 450 + Math.random() * 500;
        this.speed = config.speed ?? 0.15 + Math.random() * 0.5;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
    }

    animate(){
        this.moveLeft();

        setInterval(() => {
            if (this.isRemoved) {
                return;
            }

            if (this.isDead()) {
                if (!this.deathAnimationStarted) {
                    this.startDeathAnimation();
                }
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 50);
    }

    onDeath() {
        this.disableHitbox();
    }

    startDeathAnimation() {
        this.deathAnimationStarted = true;
        this.currentImage = 0;

        let frameIndex = 0;
        const deathInterval = setInterval(() => {
            if (frameIndex >= this.IMAGES_DEAD.length) {
                clearInterval(deathInterval);
                return;
            }

            const path = this.IMAGES_DEAD[frameIndex];
            this.img = this.imageCache[path];

            if (frameIndex === 0) {
                this.y -= 20;
            } else {
                this.y += 10;
            }

            frameIndex++;
        }, 200);

        setTimeout(() => {
            this.isRemoved = true;
        }, 4000);
    }
}
