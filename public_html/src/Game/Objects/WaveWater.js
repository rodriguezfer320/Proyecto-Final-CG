"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WaveWater(cx, cy, w, h, texture) {
    this.kWaveWater = new SpriteAnimateRenderable(texture);
    this.kWaveWater.getXform().setPosition(cx, cy);
    this.kWaveWater.getXform().setSize(w, h);
    this.kWaveWater.setSpriteSequence(64, 0, 256, 64, 4, 0);
    this.kWaveWater.setAnimationSpeed(50);

    GameObject.call(this, this.kWaveWater);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(WaveWater, GameObject);

WaveWater.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kWaveWater.updateAnimation();
}