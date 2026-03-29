class StatusBar extends DrawableObject {

    IMAGES = [
        'sharki/img/4. Marcadores/Purple/0_ .png',
        'sharki/img/4. Marcadores/Purple/20__1.png',
        
        'sharki/img/4. Marcadores/Purple/40_ .png',
        'sharki/img/4. Marcadores/Purple/60_ .png',
        'sharki/img/4. Marcadores/Purple/80_ .png',
        'sharki/img/4. Marcadores/Purple/100_ .png'
    ];

     IMAGES_coints = [
        'sharki/img/4. Marcadores/Purple/0_ _1.png',
        'sharki/img/4. Marcadores/Purple/20_ .png',
        
        'sharki/img/4. Marcadores/Purple/40_ _1.png',
        'sharki/img/4. Marcadores/Purple/60_ _1.png',
        'sharki/img/4. Marcadores/Purple/80_ _1.png',
        'sharki/img/4. Marcadores/Purple/100_ _1.png'
    ];

     IMAGES_poison_blubble = [
        'sharki/img/4. Marcadores/Purple/0_.png',
        'sharki/img/4. Marcadores/Purple/20_.png',
        
        'sharki/img/4. Marcadores/Purple/40_.png',
        'sharki/img/4. Marcadores/Purple/60_.png',
        'sharki/img/4. Marcadores/Purple/80_.png',
        'sharki/img/4. Marcadores/Purple/100_.png'
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}