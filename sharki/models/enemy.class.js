class Shark extends MovableObject{

       height = 150;
    width = 100;

    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = 80;
    hitboxHeight = 80;
    y = 310;
    IMAGES_WALKING = [
        'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
        'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
        'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
        'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
        'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'

    ];


    constructor(){
        super().loadImage('sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png');
       this.loadImages(this.IMAGES_WALKING);

        this.x = 450 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    
    }

       animate(){

        this.moveLeft();

        setInterval(() => {
            
 this.playAnimation(this.IMAGES_WALKING);
 
             }, 50);
    }


}