class Player extends Sprite {
    constructor({position={x: 0, y: 0}, targetSize, maxHealth = 100, hurtbox={offset: {x: 0, y: 0}, size: {x:80, y:150}}, facingRight=true, speed=8, jumpSpeed=40, velocity={x:0, y:0}, sprites, attackData}) {
        super({position, targetSize, facingRight, sprites});
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.position = position;
        this.hurtbox = hurtbox;
        this.speed = speed;
        this.jumpSpeed = jumpSpeed;
        this.velocity = velocity;

        if (this.hurtbox && !this.hurtbox.offset) {
            this.hurtbox.offset = {x: 0, y: 0};
        }

        this.grounded = false;

        this.currentAttack = 0;
        this.attackData = attackData;
        this.attacking = false;
        this.lastAttackTime = -999999;
        for (let i = 0; i < this.attackData.length; ++i) {
            let spriteName = this.attackData[i].spriteName;
            this.attackData[i].lastAttackTime = -999999; // use lastAttackTime in player
            this.attackData[i].duration = this.sprites[spriteName].frameDuration * this.sprites[spriteName].maxFrames;
        }
        console.log(this.getCurrentAttack().hitboxes);
    }

    performAttack(i) {
        if (i == null) i = this.currentAttack;

        console.log('attacking');
        this.attacking = true;
        this.attackData[i].lastAttackTime = Date.now();
        this.lastAttackTime = Date.now();
    }

    getCanAttack(i) {
        if (i == null) i = this.currentAttack;

        return !this.getIsAttacking() && Date.now() >= this.getNextAttackTime(i);
    }

    getLastAttackTime() {
        return this.lastAttackTime;
    }

    getNextAttackTime(i) {
        if (i == null) i = this.currentAttack;

        return this.getLastAttackTime() + this.attackData[i].duration + this.attackData[i].cooldown;
    }

    getAttackFinished(i) {
        if (i == null) i = this.currentAttack;

        return this.getLastAttackTime() + this.attackData[i].duration;
    }

    getIsAttacking() {
        return this.attacking;
    }

    getCurrentAttack() {
        return this.attackData[this.currentAttack];
    }

    update() {
        if (this.getIsAttacking()) {
            if (this.grounded) this.velocity.x = 0;
            if (Date.now() >= this.getAttackFinished()) {
                this.attacking = false;
            }
        }

        this.velocity.y += gravity;

        this.position.x += this.velocity.x;

        if (-this.hurtbox.offset.y + this.hurtbox.size.y / 2 + this.position.y + this.velocity.y > canvas.height - 70) {
            this.position.y = canvas.height - 70 - (-this.hurtbox.offset.y + this.hurtbox.size.y / 2);
            this.grounded = true;
        } else {
            this.position.y += this.velocity.y;
        }

        if (this.getIsAttacking()) {
            this.switchSprite(this.getCurrentAttack().spriteName);
        } else if (!this.grounded) {
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

    getCurrentAttackHitbox() {
        const spriteName = this.getCurrentAttack().spriteName;
        const timePerFrame = this.getCurrentAttack().duration / this.sprites[spriteName].maxFrames;
        // hitbox index determined by which frame attack animation is currently on
        let i = (Math.floor((Date.now() - this.getLastAttackTime()) / timePerFrame) || 0) % this.sprites[spriteName].maxFrames;
        return this.getCurrentAttack().hitboxes[i];
    }

    draw() {
        super.draw();

        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.position.x - (this.hurtbox.offset.x + this.hurtbox.size.x / 2), this.position.y - (this.hurtbox.offset.y + this.hurtbox.size.y / 2),
            this.hurtbox.size.x, this.hurtbox.size.y);

        if (this.getIsAttacking()) {
            ctx.save();
            ctx.strokeStyle = 'limegreen';
            ctx.translate(this.position.x, this.position.y);
            ctx.scale(this.facingRight ? 1 : -1, 1);

            let currentHitbox = this.getCurrentAttackHitbox();
            ctx.strokeRect(currentHitbox.offset.x, currentHitbox.offset.y,
                currentHitbox.size.x, currentHitbox.size.y);
            ctx.restore();
        }
    }
}