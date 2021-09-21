"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PushButton(cx, cy, w, h, texture) {
    this.kPushButton = new SpriteRenderable(texture);
    this.kPushButton.getXform().setPosition(cx, cy);
    this.kPushButton.getXform().setSize(w, h);
    this.kPushButton.setElementPixelPositions(0, 128, 0, 64);

    GameObject.call(this, this.kPushButton);

    var rigidShape = new RigidRectangle(this.getXform(), 3, 0.5);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(PushButton, GameObject);

PushButton.prototype.pushButtonPressed =function () {
    this.kPushButton.setElementPixelPositions(128, 256, 0, 64);
}

PushButton.prototype.pushButtonNotPressed =function () {
    this.kPushButton.setElementPixelPositions(0, 128, 0, 64);
}