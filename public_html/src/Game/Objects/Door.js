"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Door(cx, cy, w, h, texture) {
    this.status = false;
    this.kDoor = new SpriteAnimateRenderable(texture);
    this.kDoor.getXform().setPosition(cx, cy);
    this.kDoor.getXform().setSize(w, h);
    this.kDoor.setSpriteSequence(256, 0, 256, 256, 1, 0);
    this.kDoor.setAnimationSpeed(0);

    GameObject.call(this, this.kDoor);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(Door, GameObject);

Door.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kDoor.updateAnimation();
}

Door.prototype.activateAnimation =function () {
    this.kDoor.setSpriteSequence(256, 0, 256, 256, 4, 0);
    this.kDoor.setAnimationSpeed(15);
}

Door.prototype.desactivateAnimation =function () {
    this.kDoor.setSpriteSequence(256, 1024, 256, 256, 1, 0);
    this.kDoor.setAnimationSpeed(0);
}

Door.prototype.getStatus = function(){
    return this.status;
}

Door.prototype.setStatus = function(status){
    this.status = status;
}