"use strict";  // Operate in Strict mode such that variables must be declared before used!

function PushButton(x, y, w, h, texture, normal, lgtSet) {
    if(normal !== null){
        this.mPushButton = new IllumRenderable(texture, normal);
    }else{
        this.mPushButton = new LightRenderable(texture);
    }

    this.mPushButton.getXform().setPosition(x, y);
    this.mPushButton.getXform().setSize(w, h);
    this.mPushButton.setElementPixelPositions(0, 128, 0, 64);
    this.mPushButton.addLight(lgtSet.getLightAt(0));

    GameObject.call(this, this.mPushButton);

    var rigidShape = new RigidRectangle(this.getXform(), 3, 0.5);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(false);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}

gEngine.Core.inheritPrototype(PushButton, GameObject);

PushButton.prototype.pushButtonPressed =function () {
    this.mPushButton.setElementPixelPositions(128, 256, 0, 64);
}

PushButton.prototype.pushButtonNotPressed =function () {
    this.mPushButton.setElementPixelPositions(0, 128, 0, 64);
}