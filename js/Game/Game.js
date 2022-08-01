
class Game {
    constructor(player, player2) {
        let that = this;
        this.player = player;
        this.player2 = player2;
        this.keysDown = [];
        this.background = new Sprite({sprites: './images/Background.png', position: {x: canvas.width / 2, y: canvas.height / 2}, targetSize: {x: canvas.width, y: canvas.height}});
    
        addEventListener('keydown', function(e) {
            let keyPressed = e.key.toLowerCase();
            if (!that.keysDown.includes(keyPressed)) {
                that.keysDown.push(keyPressed);
            }
        });
        
        addEventListener('keyup', function(e) {
            let keyReleased = e.key.toLowerCase();
            let indexFound = that.keysDown.indexOf(keyReleased);
            if (indexFound >= 0) that.keysDown.splice(indexFound, 1);
        });
    }

    handleInputs() {
        // player 1
        let leftPressed, rightPressed, jumpPressed, attackPressed = false; 
        for (let key of this.keysDown) {
            switch(key) {
                case 'a':
                    leftPressed = true;
                    break;
                case 'd':
                    rightPressed = true;
                    break;
                case 'w':
                    jumpPressed = true;
                    break;
                case 'q':
                    attackPressed = true;
                default:
                    break;
            }
        }
        
        if (!this.player.combatModule.getIsDead() && !this.player.combatModule.getIsReceivingDamage()) {
            if (leftPressed) {
                if (!this.player.combatModule.getIsAttacking()) {
                    this.player.velocity.x = -this.player.speed;
                    this.player.facingRight = false;
                }
            } else if (rightPressed) {
                if (!this.player.combatModule.getIsAttacking()) {
                    this.player.velocity.x = this.player.speed;
                    this.player.facingRight = true;
                }
            } else {
                if (this.player.grounded && !this.player.combatModule.getIsReceivingDamage()) {
                    this.player.velocity.x = 0;
                }
            }
            if (jumpPressed) {
                if (this.player.grounded && !this.player.combatModule.getIsAttacking()) {
                    this.player.velocity.y = -this.player.jumpSpeed;
                    this.player.grounded = false;
                }
            }
            if (attackPressed) {
                if (this.player.combatModule.getCanAttack()) {
                    this.player.combatModule.performAttack();
                    
                }
            }
        }
    
        // player 2
        let leftPressed2, rightPressed2, jumpPressed2, attackPressed2 = false; 
        for (let key of this.keysDown) {
            switch(key) {
                case 'j':
                    leftPressed2 = true;
                    break;
                case 'l':
                    rightPressed2 = true;
                    break;
                case 'i':
                    jumpPressed2 = true;
                    break;
                case 'o':
                    attackPressed2 = true;
                default:
                    break;
            }
        }
        if (!this.player2.combatModule.getIsDead() && !this.player2.combatModule.getIsReceivingDamage()) {
            if (leftPressed2) {
                if (!this.player2.combatModule.getIsAttacking()) {
                    this.player2.velocity.x = -this.player2.speed;
                    this.player2.facingRight = false;
                }
            } else if (rightPressed2) {
                if (!this.player2.combatModule.getIsAttacking()) {
                    this.player2.velocity.x = this.player2.speed;
                    this.player2.facingRight = true;
                }
            } else {
                if (this.player2.grounded && !this.player2.combatModule.getIsReceivingDamage()) {
                    this.player2.velocity.x = 0;
                }
            }
            if (jumpPressed2) {
                if (this.player2.grounded && !this.player2.combatModule.getIsAttacking()) {
                    this.player2.velocity.y = -this.player2.jumpSpeed;
                    this.player2.grounded = false;
                }
            }
            if (attackPressed2) {
                if (this.player2.combatModule.getCanAttack()) {
                    this.player2.combatModule.performAttack();
                }
            }
        }
        
    }

    handleCollisions() {
        if (this.player == null || this.player2 == null) return;
    
        if (this.player.combatModule.getIsAttacking() && playerAttackCollision(this.player, this.player2)) {
            this.player.combatModule.damagePlayer(this.player2);
            console.log("ah");
            p2HealthBarElement.style.width = Math.max(0, (this.player2.combatModule.health / player2.combatModule.maxHealth)) * 100 + "%";
        }
    
        if (this.player2.combatModule.getIsAttacking() && playerAttackCollision(this.player2, player)) {
            player2.combatModule.damagePlayer(this.player);
            p1HealthBarElement.style.width = Math.max(0, (this.player.combatModule.health / this.player.combatModule.maxHealth)) * 100 + "%";
        }
    }

    gameLoop() {
        this.handleInputs();
        this.handleCollisions();
        this.player.update();
        this.player2.update();
    
        this.background.draw();
        this.player.draw();
        this.player2.draw();
        drawGuides();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
