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

class CombatModule extends PlayerModule {
    constructor(player, maxHealth, hurtbox, attackData) {
        super(player);
        this.lastAttackTime = -999999;
        this.lastDamagedTime = -999999;
        this.attacking = false;
        this.currentAttack = 0;
        this.attackData = attackData;

        for (let i = 0; i < this.attackData.length; ++i) {
            let spriteName = this.attackData[i].spriteName;
            this.attackData[i].lastAttackTime = -999999; // use lastAttackTime in player
            this.attackData[i].duration = this.player.sprites[spriteName].frameDuration * this.player.sprites[spriteName].maxFrames;
        }

        this.hurtbox = hurtbox;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        if (this.hurtbox && !this.hurtbox.offset) {
            this.hurtbox.offset = {x: 0, y: 0};
        }
    }

    getIsDead() {
        return this.health <= 0;
    }

    getRecoverDuration() {
        return this.player.sprites['takeHit'].frameDuration * this.player.sprites['takeHit'].maxFrames;
    }

    getIsReceivingDamage() {
        return this.receivingDamage;
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
        if (!this.getIsReceivingDamage()) return true;
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

    damagePlayer(targetPlayer) {
        if (!this.canDamagePlayer(targetPlayer)) {
            return;
        }

        targetPlayer.combatModule.health -= this.getCurrentAttack().damage;
        this.getCurrentAttack().unitsHitList.push(targetPlayer);
        targetPlayer.combatModule.receivingDamage = true;
        targetPlayer.combatModule.lastDamagedTime = Date.now();
        targetPlayer.combatModule.attacking = false;
        
        if (!targetPlayer.combatModule.getIsDead()) {
            if (this.player.position.x > targetPlayer.position.x) {
                targetPlayer.facingRight = true;
                targetPlayer.velocity.x = -10;
            } else {
                targetPlayer.facingRight = false;
                targetPlayer.velocity.x = 10;
            }
        }
    }

    getCurrentAttackHitbox() {
        const spriteName = this.getCurrentAttack().spriteName;
        const timePerFrame = this.getCurrentAttack().duration / this.player.sprites[spriteName].maxFrames;
        // hitbox index determined by which frame attack animation is currently on
        let i = (Math.floor((Date.now() - this.getLastAttackTime()) / timePerFrame) || 0) % this.player.sprites[spriteName].maxFrames;
        return this.getCurrentAttack().hitboxes[i];
    }

    canDamagePlayer(targetPlayer) {
        for (let unitHit of this.getCurrentAttack().unitsHitList) {
            if (unitHit == targetPlayer) return false;
        }
        return true;
    }
    
    update() {
        if (this.getIsReceivingDamage()) {
            if (this.player.facingRight) {
                this.player.velocity.x += .5;
                if (this.player.velocity.x > 0) this.player.velocity.x = 0;
            } else {
                this.player.velocity.x -= .5;
                if (this.player.velocity.x < 0) this.player.velocity.x = 0;
            }
            
        } else if (this.getIsAttacking()) {
            if (this.player.grounded) this.player.velocity.x = 0;
            if (Date.now() >= this.getAttackFinished()) {
                this.attacking = false;
            }
        }

        if (this.getIsReceivingDamage() && this.getCanRecover()) {
            this.receivingDamage = false;
        } 
    }

    draw() {
        if (showHurtboxes) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.player.position.x - (this.hurtbox.offset.x + this.hurtbox.size.x / 2), this.player.position.y - (this.hurtbox.offset.y + this.hurtbox.size.y / 2),
            this.hurtbox.size.x, this.hurtbox.size.y);
        }

        if (showHitboxes && this.getIsAttacking()) {
            ctx.save();
            ctx.strokeStyle = 'limegreen';
            ctx.translate(this.player.position.x, this.player.position.y);
            ctx.scale(this.player.facingRight ? 1 : -1, 1);

            let currentHitbox = this.getCurrentAttackHitbox();
            ctx.strokeRect(currentHitbox.offset.x, currentHitbox.offset.y,
                currentHitbox.size.x, currentHitbox.size.y);
            ctx.restore();
        }
    }
}
