/* example params:
attackData:
[
    {
        damage: 15,
        hitboxes: [
            {offset: {x: 0, y: -60}, size: {x: 0, y: 0},},
            {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
            {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
            {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
        ],
        spriteName: 'attack1',
        cooldown: 50,
    }
]
*/

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
        this.lastDamagedTime = -999999;
        for (let i = 0; i < this.attackData.length; ++i) {
            let spriteName = this.attackData[i].spriteName;
            this.attackData[i].lastAttackTime = -999999; // use lastAttackTime in player
            this.attackData[i].duration = this.sprites[spriteName].frameDuration * this.sprites[spriteName].maxFrames;
        }
        console.log(this.getCurrentAttack().hitboxes);
    }

    getIsDead() {
        return this.health <= 0;
    }

    getRecoverDuration() {
        return this.sprites['takeHit'].frameDuration * this.sprites['takeHit'].maxFrames;
    }

    performAttack(i) {
        if (i == null) i = this.currentAttack;

        console.log('attacking');
        this.getCurrentAttack().unitsHitList = []
        this.attacking = true;
        this.getCurrentAttack().lastAttackTime = Date.now();
        this.lastAttackTime = Date.now();
    }

    getCanRecover() {
        if (!this.receivingDamage) return true;
        return Date.now() >= this.getNextRecoverTime();
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

    getNextRecoverTime() {
        return this.lastDamagedTime + this.getRecoverDuration();
    }

    update() {
        if (this.receivingDamage) {
            if (this.facingRight) {
                this.velocity.x += .5;
                if (this.velocity.x > 0) this.velocity.x = 0;
            } else {
                this.velocity.x -= .5;
                if (this.velocity.x < 0) this.velocity.x = 0;
            }
            
        } else if (this.getIsAttacking()) {
            if (this.grounded) this.velocity.x = 0;
            if (Date.now() >= this.getAttackFinished()) {
                this.attacking = false;
            }
        }


        this.velocity.y += gravity;

        this.position.x += this.velocity.x;
        if (this.position.x - this.hurtbox.size.x / 2 < 0) {
            this.position.x = this.hurtbox.size.x / 2;
        }
        if (this.position.x + this.hurtbox.size.x / 2 > canvas.width) {
            this.position.x = canvas.width - this.hurtbox.size.x / 2;
        }

        if (-this.hurtbox.offset.y + this.hurtbox.size.y / 2 + this.position.y + this.velocity.y > canvas.height - 70) {
            this.position.y = canvas.height - 70 - (-this.hurtbox.offset.y + this.hurtbox.size.y / 2);
            this.grounded = true;
        } else {
            this.position.y += this.velocity.y;
        }

        if (this.receivingDamage && this.getCanRecover()) {
            this.receivingDamage = false;
        } 

        if (this.getIsDead()) {
            this.switchSprite('death');
        } else if (this.receivingDamage) {
            this.switchSprite('takeHit');
        } else if (this.getIsAttacking()) {
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

    canDamagePlayer(targetPlayer) {
        for (let unitHit of this.getCurrentAttack().unitsHitList) {
            if (unitHit == targetPlayer) return false;
        }
        return true;
    }

    damagePlayer(targetPlayer) {
        if (!this.canDamagePlayer(targetPlayer)) {
            return;
        }

        targetPlayer.health -= this.getCurrentAttack().damage;
        this.getCurrentAttack().unitsHitList.push(targetPlayer);
        targetPlayer.receivingDamage = true;
        targetPlayer.lastDamagedTime = Date.now();
        targetPlayer.attacking = false;
        
        if (!targetPlayer.getIsDead()) {
            if (this.position.x > targetPlayer.position.x) {
                targetPlayer.facingRight = true;
                targetPlayer.velocity.x = -10;
            } else {
                targetPlayer.facingRight = false;
                targetPlayer.velocity.x = 10;
            }
        }
        
    }

    draw() {
        if (this.getIsDead()) {
            if (this.currentFrame == this.sprites['death'].maxFrames - 1) {
                this.animatingFrames = false
            }
        }
        
        super.draw();

        if (showHurtboxes) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.position.x - (this.hurtbox.offset.x + this.hurtbox.size.x / 2), this.position.y - (this.hurtbox.offset.y + this.hurtbox.size.y / 2),
            this.hurtbox.size.x, this.hurtbox.size.y);
        }

        if (showHitboxes && this.getIsAttacking()) {
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