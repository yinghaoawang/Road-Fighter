
class Game {
    constructor() {
        let that = this;
        this.gravity = 2.2;
        
        this.inputManager = new InputManager(this);

        this.stateMachine = new StateMachine(this);
        this.menuState = new MenuState(this);
        this.playingState = new PlayingState(this);
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
