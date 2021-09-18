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
        inner_corner_bottom_left: "assets/walls/inner_corner_bottom_left.png",
        inner_corner_bottom_right: "assets/walls/inner_corner_bottom_right.png",
        inner_corner_top_left: "assets/walls/inner_corner_top_left.png",   
        inner_corner_top_right: "assets/walls/inner_corner_top_right.png",     
        left_edge_repeating: "assets/walls/left_edge_repeating.png",
        platform_inner_repeating: "assets/walls/platform_inner_repeating.png",  
        platform_left_edge: "assets/walls/platform_left_edge.png",
        platform_right_edge: "assets/walls/platform_right_edge.png",
        platform_single:"assets/walls/platform_single.png",
        left_tile: "assets/walls/left_tile.png",        
        right_edge_repeating: "assets/walls/right_edge_repeating.png",
        right_tile: "assets/walls/right_tile.png",
        top_left_edge: "assets/walls/top_left_edge.png",
        top_right_edge: "assets/walls/top_right_edge.png",
        top_tile: "assets/walls/top_tile.png"
    };

    //Objects
    this.kFlame = "assets/flame.png";
    this.kDoor = "assets/door.png";
    this.kLever = "assets/lever.png";

    this.kPlatform = "assets/platform.png";
    this.kPlatformNormal = "assets/platform_normal.png";

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
    
    //The camera to view the scene
    this.mCamera = null;

    //Object Door
    this.objectDoor = null;
    this.objectLever = null;

    this.mGlobalLightSet = null;

    this.fileLevel = "assets/Level1.xml";

    this.mAllPlatforms = new GameObjectSet();
    
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

    gEngine.Textures.loadTexture(this.kDoor);

    gEngine.Textures.loadTexture(this.kLever);

    gEngine.Textures.loadTexture(this.kPlatform);
    gEngine.Textures.loadTexture(this.kPlatformNormal);

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

    gEngine.Textures.unloadTexture(this.kDoor);

    gEngine.Textures.unloadTexture(this.kLever);

    gEngine.Textures.unloadTexture(this.kPlatform);
    gEngine.Textures.unloadTexture(this.kPlatformNormal);

    gEngine.TextFileLoader.unloadTextFile(this.fileLevel);

};

Game.prototype.initialize = function () {

    //initialize parser
    var parser = new SceneFileParser(this.fileLevel);
    var i;
   

    this.mGlobalLightSet = parser.parseLights();
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
    
    //Añadir flames
    parser.parseFlame(this.kFlame);

    //Añadir door y recuperar instancia
    this.objectDoor =  parser.parseDoor(this.kDoor);

    //Añadir lever y recuperar instancia
    this.objectLever = parser.parseLever(this.kLever);

    var p = parser.parsePlatform(this.kPlatform, this.kPlatformNormal, this.mGlobalLightSet);
    for (i = 0; i < p.length; i++) {
        this.mAllPlatforms.addToSet(p[i]);
    }

    //Añadir personaje water
    this.mWaterCharacter = new Character(28, 40, 5, 8, this.kWaterCharacter, 1);

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

    // physics simulation
    gEngine.Physics.processObjSet(this.mWaterCharacter, this.mAllPlatforms);

    var collidedDoor = false;

    collidedDoor = this.mWaterCharacter.getPhysicsComponent().collided(this.objectDoor.getPhysicsComponent(), new CollisionInfo());
    if (collidedDoor && !(this.objectDoor.getStatus())) {
        this.objectDoor.activateAnimation();
        this.objectDoor.setStatus(true);
    }

    if (this.objectDoor.getStatus() && (this.objectDoor.getCont() < 50)) {
        this.objectDoor.increment();
    }

    if(this.objectDoor.getCont() == 50){
        this.objectDoor.desactivateAnimation();
        this.mWaterCharacter.setVisibility(false);
    }

    var collidedLever = false;
    collidedLever = this.mWaterCharacter.getPhysicsComponent().collided(this.objectLever.getPhysicsComponent(), new CollisionInfo());
    if (collidedLever && !(this.objectLever.getStatus())) {
        this.objectLever.activateAnimation();
        this.objectLever.setStatus(true);
    }

    if (this.objectLever.getStatus() && (this.objectLever.getCont() < 100)) {
        this.objectLever.increment();
    }

    if(this.objectLever.getCont() == 100){
        this.objectLever.desactivateAnimation();
    }

    
};
