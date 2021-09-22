"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WaveFire(cx, cy, w, h, texture) {
    this.kWaveFire = new SpriteAnimateRenderable(texture);
    this.kWaveFire.getXform().setPosition(cx, cy);
    this.kWaveFire.getXform().setSize(w, h);
    this.kWaveFire.setSpriteSequence(64, 0, 256, 64, 4, 0);
    this.kWaveFire.setAnimationSpeed(50);

    GameObject.call(this, this.kWaveFire);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(WaveFire, GameObject);

WaveFire.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kWaveFire.updateAnimation();
}