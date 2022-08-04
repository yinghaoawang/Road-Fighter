class Entity {
    constructor(name) {
        this.name = name;
        this.components = {};
    }
    findComponentByName(name) {
        return this.components[name];
    }
    addComponent(component) {
        if (this.components[component.name]) {
            throw `Component ${component.name} already exists in entity ${this.name}.`;
        }
        this.components[component.name] = component;
        component.addToEntity(this);
    }
    removeComponentByName(name) {
        this.components[name] = null;
    }
}
