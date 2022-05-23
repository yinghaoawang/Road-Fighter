let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 2.2;

let player = new Player({});
let keysDown = [];

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
                break;
            case 'd':
                player.velocity.x = player.speed;
                break;
            case ' ':
            case 'w':
                if (player.grounded) {
                    player.velocity.y = -player.jumpSpeed;
                    player.grounded = false;
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
    player.draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);