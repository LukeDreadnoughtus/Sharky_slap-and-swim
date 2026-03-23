class World {
   

character = new Character();
level = level1;

canvas;
ctx;
keyboard;
camera_x = 0;


constructor(canvas, keyboard){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.CheckCollisions();

}

setWorld(){
    this.character.world = this;
}

CheckCollisions(){
    setInterval(() => {
        this.level.enemies.forEach((enemy) => {
                if( this.character.isColliding(enemy)) {
                    console.log('collision with charakter', enemy);
                }
        });
    }, 200);
}

    draw(){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);  //must be first loaded
        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        
         this.ctx.translate(-this.camera_x, 0);
        


        // Draw wird immerwieder aufgerufen
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
        this.addtoMap(o);
        });

    }


addtoMap(mo){
    if(mo.otherDirection){
        this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if(mo.otherDirection){
        this.flipImageBack(mo);
    }

    mo.drawFrame(this.ctx);
}

flipImage(mo){
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

flipImageBack(mo){
    mo.x = mo.x * -1;
    this.ctx.restore();
}
}