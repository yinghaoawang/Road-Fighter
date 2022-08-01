let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

/*
let gridCheckbox = document.getElementById("gridCheckbox");
let hurtboxCheckbox = document.getElementById("hurtboxCheckbox");
let hitboxCheckbox = document.getElementById("hitboxCheckbox");

var showGrid = false;
var showHurtboxes = false;
var showHitboxes = false;

gridCheckbox.onchange = () => {
    showGrid = gridCheckbox.checked;
};

hurtboxCheckbox.onchange = () => {
    showHurtboxes = hurtboxCheckbox.checked;
};

hitboxCheckbox.onchange = () => {
    showHitboxes = hitboxCheckbox.checked;
};
*/

let game = new Game();

game.start();