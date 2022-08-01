let menuDiv = document.getElementById("menuDiv");
let menuBackgroundElement = document.getElementById("menuBackground");
hideElementRecursive(menuDiv);

class MenuState extends State {
    constructor(game) {
        super();
        menuBackgroundElement.width = canvas.width;
        menuBackgroundElement.height = canvas.height;
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