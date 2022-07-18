let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 2.2;

let player = new Player({size: { x: 30, y: 110 },
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
});
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
    let leftPressed, rightPressed, jumpPressed, attackPressed = false; 
    for (let key of keysDown) {
        switch(key) {
            case 'a':
                leftPressed = true;
                break;
            case 'd':
                rightPressed = true;
                break;
            case ' ':
            case 'w':
                jumpPressed = true;
                break;
            case 'q':
                attackPressed = true;
            default:
                console.log('default');
                break;
        }
    }
    
    if (leftPressed) {
        if (!player.attack.isAttacking) {
            player.velocity.x = -player.speed;
            player.facingRight = false;
        }
    } else if (rightPressed) {
        if (!player.attack.isAttacking) {
            player.velocity.x = player.speed;
            player.facingRight = true;
        }
    } else {
        if (player.grounded) {
            player.velocity.x = 0;
        }
    }

    if (jumpPressed) {
        if (player.grounded && !player.attack.isAttacking) {
            player.velocity.y = -player.jumpSpeed;
            player.grounded = false;
        }
    }

    if (attackPressed) {
        if (player.getCanAttack()) {
            player.performAttack();
        }
    }
}

function gameLoop() {
    handleInputs();
    player.update();

    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.draw();
    player.draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);