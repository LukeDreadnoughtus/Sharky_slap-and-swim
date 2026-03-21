class Endboss extends MovableObject{



    width = 500;
    height =400;
    y = -10;



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

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }

    animate(){
        setInterval(() => {
            
    this.playAnimation(this.IMAGES_WALKING);
 
             }, 150);
    }


    }

