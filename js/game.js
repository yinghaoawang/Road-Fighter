let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 2.2;

class Player {
    constructor({position={x:50, y:0}, size={x:80, y:150}}, speed=8, jumpSpeed=40, velocity={x:0, y:0}) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.jumpSpeed = jumpSpeed;
        this.velocity = velocity;

        this.grounded = false;
    }

    update() {
        this.velocity.y += gravity;

        this.position.x += this.velocity.x;

        if (this.size.y + this.position.y + this.velocity.y > canvas.height) {
            this.position.y = canvas.height - this.size.y;
            this.grounded = true;
        } else {
            this.position.y += this.velocity.y;
        }

    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

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