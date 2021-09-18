"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Lever(cx, cy, w, h, texture) {
    this.cont = 0;
    this.status = false;
    this.kLever = new SpriteAnimateRenderable(texture);
    this.kLever.getXform().setPosition(cx, cy);
    this.kLever.getXform().setSize(w, h);
    this.kLever.setSpriteSequence(256, 123, 512, 256, 1, 0);
    this.kLever.setAnimationSpeed(0);

    GameObject.call(this, this.kLever);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(Lever, GameObject);

Lever.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kLever.updateAnimation();
}

Lever.prototype.activateAnimation =function () {
    this.kLever.setSpriteSequence(256, 123, 512, 256, 3, 0);
    this.kLever.setAnimationSpeed(40);
}

Lever.prototype.desactivateAnimation =function () {
    this.kLever.setSpriteSequence(256, 123, 512, 256, 1, 0);
    this.kLever.setAnimationSpeed(0);
}

Lever.prototype.getStatus = function(){
    return this.status;
}

Lever.prototype.setStatus = function(status){
    this.status = status;
}

Lever.prototype.getCont = function(){
    return this.cont;
}

Lever.prototype.increment = function(){
   this.cont ++; 
}