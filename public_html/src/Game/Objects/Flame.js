"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Flame(cx, cy, w, h, texture) {
    this.kFlame = new SpriteAnimateRenderable(texture);
    this.kFlame.getXform().setPosition(cx, cy);
    this.kFlame.getXform().setSize(w, h);
    this.kFlame.setSpriteSequence(256, 79.5, 75, 256, 6, 181);
    this.kFlame.setAnimationSpeed(10);

    GameObject.call(this, this.kFlame);
}

gEngine.Core.inheritPrototype(Flame, GameObject);

Flame.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.kFlame.updateAnimation();
}