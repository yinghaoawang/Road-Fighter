let menuDiv = document.getElementById("menuDiv");
let menuBackgroundElement = document.getElementById("menuBackground");
hideElementRecursive(menuDiv);
menuBackgroundElement.width = canvas.width;
menuBackgroundElement.height = canvas.height;

class MenuState extends State {
    constructor(game) {
        super();
        this.game = game;
    }
    enter() {
        showElementRecursive(menuDiv);
    }
    handleInputs() {

    }
    exit() {
        hideElementRecursive(menuDiv);
    }
    update() {

    }
}