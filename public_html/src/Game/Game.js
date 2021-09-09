/*
 * File: Game.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Game() {
    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.x = 0;
    this.y = 0;
}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {

};

Game.prototype.unloadScene = function () {

};

Game.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                  // width of camera
        [0, 0, 900, 900],     // viewport (orgX, orgY, width, height)
        0
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 0.9, 1]);

    this.mMsg = new FontRenderable("");
    this.mMsg.setColor([1, 0, 0, 1]);
    this.mMsg.setTextHeight(5);

    this.mMsg1 = new FontRenderable("");
    this.mMsg1.setColor([0, 0, 0, 1]);
    this.mMsg1.setTextHeight(5);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Game.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mMsg.setText("This is splash Screen");
    this.mMsg.getXform().setPosition(10, 55);
    this.mMsg.draw(this.mCamera);
    this.mMsg.setText("<Space Bar> to Start");
    this.mMsg.getXform().setPosition(10, 45);
    this.mMsg.draw(this.mCamera);
    this.mMsg1.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Game.prototype.update = function () {
    var zoomDelta = 0.05;

    this.mCamera.update();
    
    // Pan camera to object
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        this.x--;
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up) && this.y < 900) {
        this.y++;
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        this.x++;
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down) && this.y > 0) {
        this.y--;
    }

    this.mCamera.panTo(this.x, this.y);
    this.mMsg1.setText("x:" + this.x + ", y:" + this.y);
    this.mMsg1.getXform().setPosition(this.x - 20, this.y);
}