let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let p1HealthBarElement = document.getElementById("playerOneHealthBar");
let p2HealthBarElement = document.getElementById("playerTwoHealthBar");
console.log(p2HealthBarElement);
canvas.width = 1024;
canvas.height = 576;

const gravity = 2.2;

let player = new Player({
    maxHealth: 100,
    position: {x: 60, y: 0},
    hurtbox: {size: { x: 30, y: 110 }},
    targetSize: {x: 200 * 2, y: 200 * 2},
    sprites: {
        idle: {imageUrl: './images/hero/Idle.png', maxFrames: 4, frameDuration: 100, size: {x: 200, y: 200}},
        run: {imageUrl: './images/hero/Run.png', maxFrames: 8, frameDuration: 60, size: {x: 200, y: 200}},
        fall: {imageUrl: './images/hero/Fall.png', maxFrames: 2, frameDuration: 100, size: {x: 200, y: 200}},
        jump: {imageUrl: './images/hero/Jump.png', maxFrames: 2, frameDuration: 100, size: {x: 200, y: 200}},
        death: {imageUrl: './images/hero/Death.png', maxFrames: 7, frameDuration: 100, size: {x: 200, y: 200}},
        takeHit: {imageUrl: './images/hero/Take hit.png', maxFrames: 3, frameDuration: 100, size: {x: 200, y: 200}},
        attack1: {imageUrl: './images/hero/Attack1.png', maxFrames: 4, frameDuration: 100, size: {x: 200, y: 200}},
    },
    attackData: [
        {
            damage: 15,
            hitboxes: [
                {offset: {x: 0, y: -60}, size: {x: 0, y: 0},},
                {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
                {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
                {offset: {x: 0, y: -60}, size: {x: 160, y: 120},},
            ],
            spriteName: 'attack1',
            cooldown: 50
        }
    ]
});

let player2 = new Player({
    maxHealth: 50,
    position: {x: canvas.width - 60, y: 0},
    facingRight: false,
    hurtbox: {offset: {x: 0, y: -30}, size: { x: 40, y: 100 }},
    targetSize: {x: 250 * 2, y: 250 * 2},
    sprites: {
        idle: {imageUrl: './images/wizard/Idle.png', maxFrames: 8, frameDuration: 100, size: {x: 250, y: 250}},
        run: {imageUrl: './images/wizard/Run.png', maxFrames: 8, frameDuration: 60, size: {x: 250, y: 250}},
        fall: {imageUrl: './images/wizard/Fall.png', maxFrames: 2, frameDuration: 100, size: {x: 250, y: 250}},
        jump: {imageUrl: './images/wizard/Jump.png', maxFrames: 2, frameDuration: 100, size: {x: 250, y: 250}},
        death: {imageUrl: './images/wizard/Death.png', maxFrames: 7, frameDuration: 100, size: {x: 250, y: 250}},
        takeHit: {imageUrl: './images/wizard/Take hit.png', maxFrames: 3, frameDuration: 100, size: {x: 250, y: 250}},
        attack1: {imageUrl: './images/wizard/Attack1.png', maxFrames: 8, frameDuration: 100, size: {x: 250, y: 250}},
        attack2: {imageUrl: './images/wizard/Attack2.png', maxFrames: 8, frameDuration: 100, size: {x: 250, y: 250}},
    },
    attackData: [
        {
            damage: 18,
            hitboxes: [
                {offset: {x:-80, y: -120}, size: {x: 80, y: 90},},
                {offset: {x:-80, y: -120}, size: {x: 80, y: 90},},
                {offset: {x:-80, y: -120}, size: {x: 80, y: 90},},
                {offset: {x: 40, y: -120}, size: {x: 160, y: 140},},
                {offset: {x: 40, y: -120}, size: {x: 180, y: 200},},
                {offset: {x: 40, y: -120}, size: {x: 170, y: 220},},
                {offset: {x: 40, y: -100}, size: {x: 160, y: 210},},
                {offset: {x: 0, y: 0}, size: {x: 0, y: 0}},
            ],
            spriteName: 'attack2',
            cooldown: 50
        }
    ]
})

let keysDown = [];

let background = new Sprite({sprites: './images/Background.png', position: {x: canvas.width / 2, y: canvas.height / 2}, targetSize: {x: canvas.width, y: canvas.height}});

addEventListener('keydown', function(e) {
    let keyPressed = e.key.toLowerCase();
    if (!keysDown.includes(keyPressed)) {
        keysDown.push(keyPressed);
    }
});

addEventListener('keyup', function(e) {
    let keyReleased = e.key.toLowerCase();
    let indexFound = keysDown.indexOf(keyReleased);
    if (indexFound >= 0) keysDown.splice(indexFound, 1);
});

function handleInputs() {
    // player 1
    let leftPressed, rightPressed, jumpPressed, attackPressed = false; 
    for (let key of keysDown) {
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
    
    if (leftPressed) {
        if (!player.getIsAttacking()) {
            player.velocity.x = -player.speed;
            player.facingRight = false;
        }
    } else if (rightPressed) {
        if (!player.getIsAttacking()) {
            player.velocity.x = player.speed;
            player.facingRight = true;
        }
    } else {
        if (player.grounded) {
            player.velocity.x = 0;
        }
    }
    if (jumpPressed) {
        if (player.grounded && !player.getIsAttacking()) {
            player.velocity.y = -player.jumpSpeed;
            player.grounded = false;
        }
    }
    if (attackPressed) {
        if (player.getCanAttack()) {
            player.performAttack();
            player2.health -= player.attackData[0].damage;
            p2HealthBarElement.style.width = Math.max(0, (player2.health / player2.maxHealth)) * 100 + "%";
        }
    }

    // player 2
    let leftPressed2, rightPressed2, jumpPressed2, attackPressed2 = false; 
    for (let key of keysDown) {
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
    if (leftPressed2) {
        if (!player2.getIsAttacking()) {
            player2.velocity.x = -player2.speed;
            player2.facingRight = false;
        }
    } else if (rightPressed2) {
        if (!player2.getIsAttacking()) {
            player2.velocity.x = player2.speed;
            player2.facingRight = true;
        }
    } else {
        if (player2.grounded) {
            player2.velocity.x = 0;
        }
    }
    if (jumpPressed2) {
        if (player2.grounded && !player2.getIsAttacking()) {
            player2.velocity.y = -player2.jumpSpeed;
            player2.grounded = false;
        }
    }
    if (attackPressed2) {
        if (player2.getCanAttack()) {
            player2.performAttack();
            player.health -= player2.attackData[0].damage;
            p1HealthBarElement.style.width = Math.max(0, (player.health / player.maxHealth)) * 100 + "%";
        }
    }
}

function gameLoop() {
    handleInputs();
    player.update();
    player2.update();

    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    player.draw();
    player2.draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);