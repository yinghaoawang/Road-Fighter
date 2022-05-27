class Sprite {
    constructor({imageUrl='./images/Zebra.png', position, size}) {
        this.image = new Image();
        this.image.src = imageUrl;
        this.position = position;
        this.size = size;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
