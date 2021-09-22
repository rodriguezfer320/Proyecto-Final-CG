"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Wave(cx, cy, w, h, texture) {
    this.kWave = new SpriteAnimateRenderable(texture);
    this.kWave.getXform().setPosition(cx, cy);
    this.kWave.getXform().setSize(w, h);
    this.kWave.setSpriteSequence(64, 0, 256, 64, 4, 0);
    this.kWave.setAnimationSpeed(35);

    GameObject.call(this, this.kWave);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(Wave, GameObject);

Wave.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kWave.updateAnimation();
}