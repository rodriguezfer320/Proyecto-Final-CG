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

    //Tileset
    this.kWalls = {
        bottom_left_edge: "assets/walls/bottom_left_edge.png",
        bottom_right_edge: "assets/walls/bottom_right_edge.png",
        bottom_tile: "assets/walls/bottom_tile.png",
        color: "assets/walls/color.png",
        inner_corner_top_right: "assets/walls/inner_corner_top_right.png",
        inner_corner_top_left: "assets/walls/inner_corner_top_left.png",
        inner_corner_bottom_right: "assets/walls/inner_corner_bottom_right.png",
        inner_corner_bottom_left: "assets/walls/inner_corner_bottom_left.png",
        left_edge_repeating: "assets/walls/left_edge_repeating.png",
        left_tile: "assets/walls/left_tile.png",
        right_edge_repeating: "assets/walls/right_edge_repeating.png",
        right_tile: "assets/walls/right_tile.png",
        top_left_edge: "assets/walls/top_left_edge.png",
        top_right_edge: "assets/walls/top_right_edge.png",
        top_tile: "assets/walls/top_tile.png"
    };

    //Objects
    this.kFlame = "assets/flame.png";

    //Characters
    this.kWaterCharacter = "assets/water_character.png";
    //this.kFireCharacter = "assets/fire_character.png";

    //background
    this.kBackground = "assets/background.png";
    
    //Variable multiples muros 
    this.mAllWalls = new GameObjectSet();
    
    //Variable objetos personajes
    this.mWaterCharacter = null;
    //this.mFireCharacter = null;
    
    // The camera to view the scene
    this.mCamera = null;

    this.fileLevel = "assets/Level1.xml";
}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {
    for (const key in this.kWalls) {
        gEngine.Textures.loadTexture(this.kWalls[key]);
    }
    
    gEngine.Textures.loadTexture(this.kWaterCharacter);
    //gEngine.Textures.loadTexture(this.kFireCharacter);
    gEngine.Textures.loadTexture(this.kBackground);

    gEngine.Textures.loadTexture(this.kFlame);

    gEngine.TextFileLoader.loadTextFile(this.fileLevel, gEngine.TextFileLoader.eTextFileType.eXMLFile);


};

Game.prototype.unloadScene = function () {
 
    gEngine.LayerManager.cleanUp();

    for (const key in this.kWalls) {
        gEngine.Textures.unloadTexture(this.kWalls[key]);
    }

    gEngine.Textures.unloadTexture(this.kWaterCharacter);
    //gEngine.Textures.unloadTexture(this.kFireCharacter);
    gEngine.Textures.unloadTexture(this.kBackground);

    gEngine.Textures.unloadTexture(this.kFlame);

    gEngine.TextFileLoader.unloadTextFile(this.fileLevel);

};

Game.prototype.initialize = function () {

     //initialize parser
     var parser = new SceneFileParser(this.fileLevel);
   
    // set ambient lighting
    gEngine.DefaultResources.setGlobalAmbientColor([1, 1, 1, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);

    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        100,                  // width of camera
        [0, 0, 900, 900],     // viewport (orgX, orgY, width, height)
        0
    );
    this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

    var background = new TextureRenderable(this.kBackground);
    background.getXform().setSize(96, 96);
    background.getXform().setPosition(0,0);

    //Añadir walls
    var walls = parser.parseWall(this.kWalls);
    for (let index = 0; index < walls.length; index++) {
        this.mAllWalls.addToSet(walls[index]);
    }
    
    //Añadir flame
    parser.parseFlame(this.kFlame);

    this.mWaterCharacter = new Character(-40, -40, 5, 8, this.kWaterCharacter, 1);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, background);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mWaterCharacter);
   
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Game.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); 
    
    this.mCamera.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Game.prototype.update = function () {
    this.mCamera.update();
    gEngine.LayerManager.updateAllLayers();
    gEngine.Physics.processObjSet(this.mWaterCharacter, this.mAllWalls);
}