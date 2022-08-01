class StateMachine {
    constructor() {
        this.currentState = null;
    }
    changeState(newState) {
        if (this.currentState) this.currentState.exit();
        newState.enter();
    }
    update() {
        if (this.currentState) this.currentState.update();
    }
}