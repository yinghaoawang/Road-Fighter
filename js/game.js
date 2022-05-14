let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 1;

class Player {
    constructor({position={x:50, y:0}, size={x:10, y:30}}, velocity={x:0, y:0}) {
        this.position = position;
        this.size = size;
        this.velocity = velocity;
    }

    update() {
        this.velocity.y += gravity;

        this.position.x += this.velocity.x;

        if (this.size.y + this.position.y + this.velocity.y > canvas.height) {
            this.position.y = canvas.height - this.size.y;
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

function gameLoop() {
    player.update();

    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);