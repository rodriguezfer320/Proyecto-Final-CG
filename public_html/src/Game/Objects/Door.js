"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Door(cx, cy, w, h, texture) {
    this.kDoor = new SpriteAnimateRenderable(texture);
    this.kDoor.getXform().setPosition(cx, cy);
    this.kDoor.getXform().setSize(w, h);
    this.kDoor.setSpriteSequence(256, 0, 256, 256, 5, 0);
    this.kDoor.setAnimationSpeed(15);

    GameObject.call(this, this.kDoor);
}

gEngine.Core.inheritPrototype(Door, GameObject);

Door.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kDoor.updateAnimation();
}