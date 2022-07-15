class Player extends Sprite {
    constructor({position={x: 0, y: 0}, frameData, targetSize, spriteSize, size={x:80, y:150}, facingRight=true, imageUrl, speed=8, jumpSpeed=40, velocity={x:0, y:0}, sprites}) {
        super({position, spriteSize, imageUrl, targetSize, frameData, facingRight, sprites});
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.jumpSpeed = jumpSpeed;
        this.velocity = velocity;

        this.grounded = false;
        this.attack = {
            isAttacking: false,
            lastAttackTime: -999999,

            offset: {
                x: 35,
                y: -40
            },
            size: {
                x: 50,
                y: 25
            },
            duration: .15,
            cooldown: .35,
        }
    }

    performAttack() {
        console.log('attacking');
        this.attack.isAttacking = true;
        this.attack.lastAttackTime = Date.now();
    }

    getCanAttack() {
        return !this.getIsAttacking() && Date.now() >= this.getNextAttackTime();
    }

    getNextAttackTime() {
        return this.attack.lastAttackTime + this.attack.duration * 1000 + this.attack.cooldown * 1000;
    }

    getIsAttacking() {
        if (this.attack.isAttacking) return true;
        return false;
    }

    update() {
        if (this.getIsAttacking()) {
            if (Date.now() >= this.attack.lastAttackTime + this.attack.duration * 1000) {
                this.attack.isAttacking = false;
            }
        }

        this.velocity.y += gravity;

        this.position.x += this.velocity.x;

        if (this.size.y / 2 + this.position.y + this.velocity.y > canvas.height - 70) {
            this.position.y = canvas.height - 70 - this.size.y / 2;
            this.grounded = true;
        } else {
            this.position.y += this.velocity.y;
        }

        if (!this.grounded) {
            if (this.velocity.y > 0) {
                this.switchSprite('fall');
            } else {
                this.switchSprite('jump');
            }
        } else {
            if (this.velocity.x != 0) {
                this.switchSprite('run');
            } else {
                this.switchSprite('idle')
            }
        }

    }

    draw() {
        super.draw();

        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);

        if (this.attack.isAttacking) {
            ctx.save();
            ctx.strokeStyle = 'limegreen';
            ctx.translate(this.position.x, this.position.y);
            ctx.scale(this.facingRight ? 1 : -1, 1);

            ctx.strokeRect(this.attack.offset.x, this.attack.offset.y,
                this.attack.size.x, this.attack.size.y);
            ctx.fillStyle = 'lime';
            ctx.fillRect(this.attack.offset.x, this.attack.offset.y,
                this.attack.size.x, this.attack.size.y);
            ctx.restore();
        }
    }
}