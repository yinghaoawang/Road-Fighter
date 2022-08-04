class SpriteRenderer extends Component {
    constructor({path='./images/Zebra.png'}) {
        super("SpriteRenderer");
        this.path = path;
        this.image = new Image();
        this.image.src = path;
        this.image.onload = () => {
            this.size = {x: this.image.width, y: this.image.height}
        }
    }

    update() {
        super.update();
    }

    getTargetSize() {
        if (this.targetSize != null) return this.targetSize;
        return {
            x: this.size.x * this.entity.transform.scale.x,
            y: this.size.y * this.entity.transform.scale.y
        };
    }

    drawSprite() {
        if (this.size == null) return;
        let targetSize = this.getTargetSize();
        ctx.save();
        ctx.translate(this.entity.x(), this.entity.y());
        ctx.drawImage(this.image,
            0, 0, this.size.x, this.size.y,
            -targetSize.x / 2, -this.targetSize.y / 2, targetSize.x, targetSize.y
        );
        ctx.restore();
        console.log(targetSize, this.entity.x(), this.entity.y());
    }

    draw() {
        super.draw();
        this.drawSprite();
    }
}
