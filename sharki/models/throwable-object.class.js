class ThrowableObject extends MovableObject {
    constructor(){
        super().loadImage('sharki/img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.x = 100;
        this.y = 100;
        this.height = 60;
        this.width = 50;
        this.trow(100, 150);
        
    }


    trow(x,y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();
    }
}