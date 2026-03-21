class BackgroundObject extends MovableObject {


    height = 820;
    width = 480;
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.x = x;
        this.y =  480 - this.width;
    }
}