class MovableObject {
    x = 120;
    y = 300;
    img;
    height = 150;
    width = 100;
    imageCache = {};
     currentImage= 0;
     speed = 0.15;

     otherDirection = false;
     speedY = 0;
     acceleration = 2.5;

     applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0 ) {
                
            
           this.y -= this.speedY; 
           this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
     }

     isAboveGround(){
        return this.y < 150;
     }


    loadImage(path){
        this.img = new Image(); // this.img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.height,this.width);

    }


drawFrame(ctx){
    if(this instanceof Character || this instanceof Shark || this instanceof Endboss){
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
             ctx.rect(this.x, this.y, this.height, this.width);
        ctx.stroke();
    }
}
isColliding(mo) {
    return this.x + this.width > mo.x &&
           this.y + this.height > mo.y &&
           this.x < mo.x + mo.width &&
           this.y < mo.y + mo.height;
}

    /** 
    * @param {Array} arr - ['img/Image1.png', 'img/Image2.png', ....]
    *
    */

    loadImages(arr){
        arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    }

playAnimation(images){
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
}

     moveRight(){
        console.log('Moving right');
    }

        moveLeft(){
            setInterval(() => {
                this.x -= this.speed;
            }, 1000/ 60);

    }

}