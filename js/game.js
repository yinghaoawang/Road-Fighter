let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 2.2;

let playerSpriteSize = {x: 200, y: 200};
let player = new Player({imageUrl: './images/hero/Idle.png', spriteSize: playerSpriteSize, size: { x: 30, y: 110 },
    targetSize: {x: playerSpriteSize.x * 2, y: playerSpriteSize.y * 2},
    frameData: {maxFrames: 4, frameDuration: 50},
    sprites: {
        idle: {imageUrl: './images/hero/Idle.png', maxFrames: 4},
        run: {imageUrl: './images/hero/Run.png', maxFrames: 8},
        fall: {imageUrl: './images/hero/Fall.png', maxFrames: 2},
        jump: {imageUrl: './images/hero/Jump.png', maxFrames: 2},
        death: {imageUrl: './images/hero/Death.png', maxFrames: 7},
        takeHit: {imageUrl: './images/hero/Take hit.png', maxFrames: 3},
        attack1: {imageUrl: './images/hero/Attack1.png', maxFrames: 4},
    },
});
let keysDown = [];

let background = new Sprite({imageUrl: './images/Background.png', position: {x: canvas.width / 2, y: canvas.height / 2}, targetSize: {x: canvas.width, y: canvas.height}});

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
    player.velocity.x = 0;
    for (let key of keysDown) {
        switch(key) {
            case 'a':
                player.velocity.x = -player.speed;
                player.facingRight = false;
                break;
            case 'd':
                player.velocity.x = player.speed;
                player.facingRight = true;
                break;
            case ' ':
            case 'w':
                if (player.grounded) {
                    player.velocity.y = -player.jumpSpeed;
                    player.grounded = false;
                }
                break;
            case 'q':
                if (player.getCanAttack()) {
                    player.performAttack();
                }
                
                break;
            default:
                console.log('default');
                break;
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