class Entity {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.components = {};
        this.transform = this.addComponent(new Transform());
        this.game.entityList.push(this);
    }
    update() {
        for (let key in this.components) this.components[key].update();
    }
    draw() {
        for (let key in this.components) this.components[key].draw();
    }
    findComponentByName(name) {
        return this.components[name];
    }
    addComponent(component) {
        console.log(this.components);
        if (this.components[component.name]) {
            throw `Component ${component.name} already exists in entity ${this.name}.`;
        }
        this.components[component.name] = component;
        component.addToEntity(this);
        return component;
    }
    removeComponentByName(name) {
        this.components[name] = null;
    }
    x() {return this.transform.x();}
    y() {return this.transform.y();}
}
