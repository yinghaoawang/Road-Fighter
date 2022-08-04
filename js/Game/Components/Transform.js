class Transform extends Component {
    constructor(opts={x: 0, y: 0, scaleX: 1, scaleY: 1}) {
        super("Transform");
        this.position = {x: opts.x, x: opts.y};
        this.scale = {x: opts.scaleX, y: opts.scaleY};
    }
    update() {super.update();}
    draw() {super.draw();}

    x() {return this.position.x;}
    y() {return this.position.y;}
    scaleX() {return this.scale.x;}
    scaleY() {return this.scale.y;}
}