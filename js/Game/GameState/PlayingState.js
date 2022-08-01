let playingDiv = document.getElementById("playingDiv");
let p1HealthBarElement = document.getElementById("playerOneHealthBar");
let p2HealthBarElement = document.getElementById("playerTwoHealthBar");
hideElementRecursive(playingDiv);

let showGrid = true, showHurtboxes = true, showHitboxes = true;
let checkboxesDiv = document.getElementById("checkboxes");
hideElementRecursive(checkboxesDiv);

class PlayingState extends State {
    constructor(game) {
        super();
        this.game = game;
        this.background = new Sprite({sprites: './images/Background.png', position: {x: canvas.width / 2, y: canvas.height / 2}, targetSize: {x: canvas.width, y: canvas.height}});
    }
    enter() {
        super.enter();
        showElementRecursive(playingDiv);
        this.player = new Player(this.game, structuredClone(ninjaData));
        this.player2 = new Player(this.game, structuredClone(wizardData));
    }
    exit() {
        super.exit();
        hideElementRecursive(playingDiv);
    }
    update() {
        super.update();
        this.handleCollisions();
        this.player.update();
        this.player2.update();
    }
    draw() {
        super.draw();
        this.background.draw();
        this.player.draw();
        this.player2.draw();
        drawGuides();
    }
    handleInputs() {
        super.handleInputs();
        let player = this.player;
        let player2 = this.player2;
        let inputManager = this.game.inputManager;

        //player 1
        let leftPressed, rightPressed, jumpPressed, attackPressed = false; 
        for (let key of inputManager.keysDown) {
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
        
        if (!player.combatModule.getIsDead() && !player.combatModule.getIsReceivingDamage()) {
            if (leftPressed) {
                if (!player.combatModule.getIsAttacking()) {
                    player.velocity.x = -player.speed;
                    player.facingRight = false;
                }
            } else if (rightPressed) {
                if (!player.combatModule.getIsAttacking()) {
                    player.velocity.x = player.speed;
                    player.facingRight = true;
                }
            } else {
                if (player.grounded && !player.combatModule.getIsReceivingDamage()) {
                    player.velocity.x = 0;
                }
            }
            if (jumpPressed) {
                if (player.grounded && !player.combatModule.getIsAttacking()) {
                    player.velocity.y = -player.jumpSpeed;
                    player.grounded = false;
                }
            }
            if (attackPressed) {
                if (player.combatModule.getCanAttack()) {
                    player.combatModule.performAttack();
                    
                }
            }
        }
        
        // player 2
        let leftPressed2, rightPressed2, jumpPressed2, attackPressed2 = false; 
        for (let key of inputManager.keysDown) {
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
        if (!player2.combatModule.getIsDead() && !player2.combatModule.getIsReceivingDamage()) {
            if (leftPressed2) {
                if (!player2.combatModule.getIsAttacking()) {
                    player2.velocity.x = -player2.speed;
                    player2.facingRight = false;
                }
            } else if (rightPressed2) {
                if (!player2.combatModule.getIsAttacking()) {
                    player2.velocity.x = player2.speed;
                    player2.facingRight = true;
                }
            } else {
                if (player2.grounded && !player2.combatModule.getIsReceivingDamage()) {
                    player2.velocity.x = 0;
                }
            }
            if (jumpPressed2) {
                if (player2.grounded && !player2.combatModule.getIsAttacking()) {
                    player2.velocity.y = -player2.jumpSpeed;
                    player2.grounded = false;
                }
            }
            if (attackPressed2) {
                if (player2.combatModule.getCanAttack()) {
                    player2.combatModule.performAttack();
                }
            }
        }
    }

    handleCollisions() {
        let player = this.player;
        let player2 = this.player2;

        if (player == null || player2 == null) return;
    
        if (player.combatModule.getIsAttacking() && playerAttackCollision(player, player2)) {
            player.combatModule.damagePlayer(player2);
            console.log("ah");
            p2HealthBarElement.style.width = Math.max(0, (player2.combatModule.health / player2.combatModule.maxHealth)) * 100 + "%";
        }
    
        if (player2.combatModule.getIsAttacking() && playerAttackCollision(player2, player)) {
            player2.combatModule.damagePlayer(player);
            p1HealthBarElement.style.width = Math.max(0, (player.combatModule.health / player.combatModule.maxHealth)) * 100 + "%";
        }
    }
}