"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Wall(cx, cy, w, h, texture) {
    this.kWall = new TextureRenderable(texture);
    this.kWall.getXform().setSize(w, h);
    this.kWall.getXform().setPosition(cx, cy);

    GameObject.call(this, this.kWall);

    var rigidShape = new RigidRectangle(this.getXform(), w, h);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([0, 0, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(Wall, GameObject);