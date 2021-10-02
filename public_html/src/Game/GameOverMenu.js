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

function GameOverMenu() {
    this.kTextures = {
        background: "assets/backgrounds/background.png",
        menu: "assets/menu/game_over/gameover.png",
        menu_play: "assets/menu/game_over/gameover_play_selected.png",
        menu_exit: "assets/menu/game_over/gameover_exit_selected.png"
    };

    this.mCamera = null;
    this.mBackground = null;
    this.mMenu = null;
    this.mMenuState = GameOverMenu.eMenuState.eMenu;
    this.mPreviousMenuState = GameOverMenu.eMenuState.eMenu;
    this.mLoadSelection = null;
}
gEngine.Core.inheritPrototype(GameOverMenu, Scene);

GameOverMenu.eMenuState = Object.freeze({
    eMenu: 0,
    eMenuPlay: 1,
    eMenuExit: 2
});

GameOverMenu.prototype.loadScene = function () {
    for (const key in this.kTextures) {
       gEngine.Textures.loadTexture(this.kTextures[key]);
    }
};

GameOverMenu.prototype.unloadScene = function () {
    for (const key in this.kTextures) {
        gEngine.Textures.unloadTexture(this.kTextures[key]);
    }

    if(this.mLoadSelection !== null) gEngine.Core.startScene(this.mLoadSelection);
};

GameOverMenu.prototype.initialize = function () {
    //set ambient lighting
    gEngine.DefaultResources.setGlobalAmbientColor([1, 1, 1, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);

    //Camera
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                  //  width of camera
        [0, 0, 900, 483],    //   viewport (orgX, orgY, width, height)
        0
    );
    this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

    this.mBackground = new SpriteRenderable(this.kTextures["background"]);
    this.mBackground.setElementPixelPositions(0, 900, 124, 900);
    this.mBackground.getXform().setSize(100, 100);
    this.mBackground.getXform().setPosition(0, 0);

    this.mMenu = new TextureRenderable(this.kTextures["menu"]);
    this.mMenu.getXform().setSize(45, 50);
    this.mMenu.getXform().setPosition(0, 2.5);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GameOverMenu.prototype.draw = function () {
    gEngine.Core.clearCanvas([1, 1, 1, 1]); 
    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.mMenu.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GameOverMenu.prototype.update = function () {
    this.mCamera.update();
    this.mMenu.update();

    let x = gEngine.Input.getMousePosX();
    let y = gEngine.Input.getMousePosY();

    if(y >= 130 && y <= 228){
        if(x >= 338 && x <= 444){
            if(this.mMenuState === MainMenu.eMenuState.eMenu
                || this.mMenuState === MainMenu.eMenuState.eMenuExit){
                    this.mMenuState = MainMenu.eMenuState.eMenuPlay;
            }
    
            if(gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)){
                this.mLoadSelection = new Game();
                gEngine.GameLoop.stop();
            }
        }else if(x >= 467 && x <= 573){
            if(this.mMenuState === MainMenu.eMenuState.eMenu
                || this.mMenuState === MainMenu.eMenuState.eMenuPlay){
                    this.mMenuState = MainMenu.eMenuState.eMenuExit;
            }

            if(gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)){
                this.mLoadSelection = new MainMenu();
                gEngine.GameLoop.stop();
            }
        }else if(this.mMenuState === MainMenu.eMenuState.eMenuPlay
            || this.mMenuState === MainMenu.eMenuState.eMenuExit){
                this.mMenuState = MainMenu.eMenuState.eMenu;
        }
    }

    if(this.mMenuState !== this.mPreviousMenuState){
        this.mPreviousMenuState = this.mMenuState;

        switch(this.mMenuState){
            case GameOverMenu.eMenuState.eMenu:
                this.mMenu.setTexture(this.kTextures["menu"]);
            break;
            case GameOverMenu.eMenuState.eMenuPlay:
                this.mMenu.setTexture(this.kTextures["menu_play"]);
            break;
            case GameOverMenu.eMenuState.eMenuExit:
                this.mMenu.setTexture(this.kTextures["menu_exit"]);
            break;
        }
    }
};