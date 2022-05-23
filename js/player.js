class Player {
    constructor({position={x:50, y:0}, size={x:80, y:150}}, speed=8, jumpSpeed=40, velocity={x:0, y:0}) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.jumpSpeed = jumpSpeed;
        this.velocity = velocity;

        this.grounded = false;
        this.attack = {
            offset: {
                x: 35,
                y: -40
            },
            size: {
                x: 50,
                y: 25
            }
        }
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

    getCenter() {
        return {
            x: this.position.x + this.size.x / 2,
            y: this.position.y + this.size.y / 2
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        ctx.fillStyle = 'green';
        ctx.fillRect(this.getCenter().x + this.attack.offset.x, this.getCenter().y + this.attack.offset.y,
            this.attack.size.x, this.attack.size.y);
    }
}