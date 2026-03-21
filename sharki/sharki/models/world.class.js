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

}

setWorld(){
    this.character.world = this;
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
        mo.drawFrame(this.ctx);

                 if(mo.otherDirection){
                    this.flipImageBack(mo);


        }
         
    }

        flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * - 1;
        }

        flipImage(mo){
            mo.x = mo.x * - 1;
            this.ctx.restore();

        }
}