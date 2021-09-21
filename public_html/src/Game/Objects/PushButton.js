"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PushButton(cx, cy, w, h, texture) {
    this.cont = 0;
    this.status = false;
    this.kPushButton = new SpriteRenderable(texture);
    this.kPushButton.getXform().setPosition(cx, cy);
    this.kPushButton.getXform().setSize(w, h);
    this.kPushButton.setElementPixelPositions(0, 128, 0, 64);

    GameObject.call(this, this.kPushButton);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(PushButton, GameObject);

PushButton.prototype.pushButtonPressed =function () {
    console.log("choco");
}

PushButton.prototype.pushButtonNotPressed =function () {
    console.log("deschocho");
}

PushButton.prototype.getCont = function(){
    return this.cont;
}

PushButton.prototype.setCont = function(cont){
    this.cont = cont;
}

PushButton.prototype.incrementCont = function(){
   this.cont ++; 
}