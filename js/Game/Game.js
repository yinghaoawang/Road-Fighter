
class Game {
    constructor() {
        let that = this;
        this.gravity = 2.2;
        this.keysDown = [];
        this.stateMachine = new StateMachine();
        this.menuState = new MenuState(this);
        this.playingState = new PlayingState(this);

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

    setPlayers(player, player2) {
        this.player = player;
        this.player2 = player2;
    }

    gameLoop() {
        this.stateMachine.handleInputs();
        this.stateMachine.update();
        this.stateMachine.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start() {
        this.stateMachine.changeState(this.playingState);
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
