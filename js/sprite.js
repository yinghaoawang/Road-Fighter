class Sprite {
    constructor({facingRight=true, targetSize, position={x: 0, y: 0}, sprites}) {
        this.sprites = sprites;
        if (this.sprites == null || this.sprites.length == 0) {
            this.sprites = {};
            this.sprites.idle = {
                imageUrl: './images/Zebra.png',
            };
        }
        if (typeof this.sprites === 'string') {
            this.sprites = {idle: {imageUrl: this.sprites}};
        }

        for (const spriteKey in this.sprites) {  
            let sprite = this.sprites[spriteKey];
            sprite.image = new Image();
            sprite.image.src = sprite.imageUrl;
            if (sprite.maxFrames == null) sprite.maxFrames = 1;
            if (sprite.size == null) {
                sprite.image.onload = () => {
                    sprite.size = {
                        x: sprite.image.width,
                        y: sprite.image.height
                    }
                };
            }
            if (sprite.frameDuration == null) sprite.frameDuration = 100;
        }

        this.position = position;
        this.facingRight = facingRight;
        this.targetSize = targetSize;

        this.currentFrame = 0;
        this.lastFrameDrawn = Date.now();
        this.currentSprite = this.sprites.idle;
    }

    switchSprite(spriteKey) {
        if (this.sprites == null || this.sprites[spriteKey] == null) {
            console.error("Sprite does not have key: " + spriteKey);
            return;
        }

        if (this.sprites[spriteKey]== this.currentSprite) {
            return;
        }

        this.currentSprite = this.sprites[spriteKey];
        this.currentFrame = 0;
    }

    drawSprite({flipped={x: false}}) {
        if (this.currentSprite.size == null) return;
        
        console.log('drawing sprite');
        ctx.save();
        ctx.translate(this.position.x + (flipped.x ? this.targetSize.x : 0), this.position.y);
        ctx.scale(flipped.x ? -1 : 1, 1);
        ctx.drawImage(this.currentSprite.image,
            this.currentFrame * this.currentSprite.size.x, 0, this.currentSprite.size.x, this.currentSprite.size.y,
            (flipped.x ? 1 : -1) * this.targetSize.x / 2, -this.targetSize.y / 2, this.targetSize.x, this.targetSize.y);
        ctx.restore();
    }

    animateFrames() {
        if (Date.now() - this.lastFrameDrawn >= this.currentSprite.frameDuration) {
            this.currentFrame++;
            if (this.currentFrame >= this.currentSprite.maxFrames) this.currentFrame = 0;
            this.lastFrameDrawn = Date.now();
        }
    }

    draw() {
        if (this.currentSprite == null) return;

        this.animateFrames();
        this.drawSprite({flipped: {x: !this.facingRight}});
        
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.position.x - this.targetSize.x / 2, this.position.y - this.targetSize.y / 2, this.targetSize.x, this.targetSize.y);
    }
}
