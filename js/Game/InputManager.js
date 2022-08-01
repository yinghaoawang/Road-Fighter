class InputManager {
    constructor(game) {
        this.game = game;
        this.keysDown = [];
        let that = this;
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
}