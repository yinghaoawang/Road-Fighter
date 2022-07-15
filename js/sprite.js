class Sprite {
    constructor({imageUrl='./images/Zebra.png', spriteSize, facingRight=true, spriteOffset={x: 0, y: 0}, targetSize=spriteSize, position={x: 0, y: 0}, frameData={maxFrames: 1, frameDuration: 500}, sprites}) {
        this.image = new Image();
        this.image.src = imageUrl;
        this.position = position;
        if (spriteSize == null) {
            this.image.onload = () => {
                this.spriteSize = {
                    x: this.image.width,
                    y: this.image.height
                }
            };
        }
        this.facingRight = facingRight;
        this.spriteSize = spriteSize;
        this.spriteOffset = spriteOffset;
        this.targetSize = targetSize;
        this.currentFrame = 0;
        this.frameData = frameData;
        this.lastFrameDrawn = Date.now();
        this.sprites = sprites;
        for (const spriteKey in sprites) {  
            let sprite = sprites[spriteKey];
            sprite.image = new Image();
            sprite.image.src = sprite.imageUrl;
        }
    }

    switchSprite(spriteKey) {
        if (this.sprites == null || this.sprites[spriteKey] == null) {
            console.error("Sprite does not have key: " + spriteKey);
            return;
        }

        if (this.sprites[spriteKey].image == this.image) {
            return;
        }

        this.image = this.sprites[spriteKey].image;
        this.frameData.maxFrames = this.sprites[spriteKey].maxFrames;
        this.currentFrame = 0;
    }

    drawSprite({flipped={x: false}}) {
        ctx.save();
        ctx.translate(this.position.x + (flipped.x ? this.targetSize.x : 0), this.position.y);
        ctx.scale(flipped.x ? -1 : 1, 1);
        ctx.drawImage(this.image,
            this.currentFrame * this.spriteSize.x, 0, this.spriteSize.x, this.spriteSize.y,
            (flipped.x ? 1 : -1) * this.targetSize.x / 2, -this.targetSize.y / 2, this.targetSize.x, this.targetSize.y);
        ctx.restore();
    }

    animateFrames() {
        if (Date.now() - this.lastFrameDrawn >= this.frameData.frameDuration) {
            this.currentFrame++;
            if (this.currentFrame >= this.frameData.maxFrames - 1) this.currentFrame = 0;
            this.lastFrameDrawn = Date.now();
        }
    }

    draw() {
        if (this.spriteSize == null) return;

        this.animateFrames();
        this.drawSprite({flipped: {x: !this.facingRight}});
        
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.position.x - this.targetSize.x / 2, this.position.y - this.targetSize.y / 2, this.targetSize.x, this.targetSize.y);
    }
}
