class Character extends MovableObject{
    height = 250;
    width = 300;
    
    y = 190;
    speed = 10;

    hitboxOffsetX = 120;
    hitboxOffsetY = 140;
    hitboxWidth = 60;
    hitboxHeight = 50;

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
    
    world;
isSlapping = false;
slapImageIndex = 0;

    constructor(){
    super().loadImage('sharki/img/1.Sharkie/1.IDLE/1.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_SLAP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
}

    animate(){

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){
                this.x += this.speed;
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT && this.x > 0){
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (this.world.keyboard.UP && !this.isSlapping) {
                this.slap();
            }

            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);

        setInterval(() => {
    if(this.isDead()){
        this.playAnimation(this.IMAGES_DEAD);
    } else if(this.isHurt()){
        this.playAnimation(this.IMAGES_HURT);
    } else if (this.isSlapping) {
        let path = this.IMAGES_SLAP[this.slapImageIndex];
        this.img = this.imageCache[path];
        this.slapImageIndex++;

        if (this.slapImageIndex >= this.IMAGES_SLAP.length) {
            this.isSlapping = false;
            this.slapImageIndex = 0;
            this.currentImage = 0;
        }
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_SWIM);
    } else {
        this.playAnimation(this.IMAGES_WALKING);
    }
}, 80);
    }

    slap() {
        if (!this.isSlapping) {
            this.isSlapping = true;
            this.slapImageIndex = 0;
        }
    }
}