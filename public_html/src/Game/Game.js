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
    //File
    this.kFileLevel = "assets/Level1.xml";

    this.kTextures = {
        //background and shadowBackground
        background: "assets/background.png",
        shadowBackground: "assets/shadow_background.png",

        //Tileset
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
        platform_single: "assets/walls/platform_single.png",
        left_tile: "assets/walls/left_tile.png",        
        right_edge_repeating: "assets/walls/right_edge_repeating.png",
        right_tile: "assets/walls/right_tile.png",
        top_left_edge: "assets/walls/top_left_edge.png",
        top_right_edge: "assets/walls/top_right_edge.png",
        top_tile: "assets/walls/top_tile.png",

        //Platform
        platform: "assets/platform.png",

        //Door
        door: "assets/door.png",

        //Characters
        water_character: "assets/water_character.png"
    };

    this.kNormals = {
        //background and shadowBackground
        background: "",
        shadowBackground: "",

        //Tileset
        bottom_left_edge: "",
        bottom_right_edge: "",
        bottom_tile: "",
        color: "", 
        inner_corner_bottom_left: "",
        inner_corner_bottom_right: "",
        inner_corner_top_left: "",   
        inner_corner_top_right: "",     
        left_edge_repeating: "",
        platform_inner_repeating: "",  
        platform_left_edge: "",
        platform_right_edge: "",
        platform_single: "",
        left_tile: "",        
        right_edge_repeating: "",
        right_tile: "",
        top_left_edge: "",
        top_right_edge: "",
        top_tile: "",

        //Platform
        platform: "assets/platform_normal.png",

        //Door
        door: "",

        //Characters
        water_character: "assets/water_character_normal.png"
    };

    this.mCamera = null;
    this.mGlobalLightSet = null;
    this.mAllWalls = null;
    this.mAllPlatforms = null;
    this.mAllDoors = null;
    this.mAllCharacters = null;
}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(this.kFileLevel, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    for (const key in this.kTextures) {
        if(this.kTextures[key] !== ""){
            gEngine.Textures.loadTexture(this.kTextures[key]);
        }else{
            this.kTextures[key] = null;
        }
    }
    
    for (const key in this.kNormals) {
        if(this.kNormals[key] !== ""){
            gEngine.Textures.loadTexture(this.kNormals[key]);
        }else{
            this.kNormals[key] = null;
        }
    }
};

Game.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();
    gEngine.TextFileLoader.unloadTextFile(this.kFileLevel);

    for (const key in this.kTextures) {
        if(this.kTextures[key] !== null){
            gEngine.Textures.unloadTextFile(this.kTextures[key]);
        }
    }
    
    for (const key in this.kNormals) {
        if(this.kNormals[key] !== null){
            gEngine.Textures.unloadTextFile(this.kNormals[key]);
        }
    }
};

Game.prototype.initialize = function () {
    //set ambient lighting
    gEngine.DefaultResources.setGlobalAmbientColor([0.5, 0.5, 0.5, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);

    //initialize parser
    let parser = new SceneFileParser(this.kFileLevel);

    //Camera
    this.mCamera = parser.parseCamera();

    //Lights
    this.mGlobalLightSet = parser.parseLights();

    //Background and shadowBackground
    parser.parseBackgrounds(this.kTextures, this.kNormals, this.mGlobalLightSet, this.mCamera);

    //Walls
    this.mAllWalls = parser.parseWalls(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Platforms
    this.mAllPlatforms = parser.parsePlatforms(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Doors
    this.mAllDoors = parser.parseDoors(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Characters
    this.mAllCharacters = parser.parseCharacters(this.kTextures, this.kNormals, this.mGlobalLightSet);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Game.prototype.draw = function () {
    gEngine.Core.clearCanvas([1, 1, 1, 1]); 
    this.mCamera.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Game.prototype.update = function () {
    this.mCamera.update();
    gEngine.LayerManager.updateAllLayers();

    let mWaterCharacter = this.mAllCharacters.getObjectAt(0);
    let door = this.mAllDoors.getObjectAt(0);

    //Mover la camara
    let xf = mWaterCharacter.getXform();
    this.mCamera.setWCCenter(xf.getXPos(), xf.getYPos());

    //Mover la luz del personaje
    let p = vec2.clone(mWaterCharacter.getPhysicsComponent().getXform().getPosition());
    this.mGlobalLightSet.getLightAt(2).set2DPosition(p);

    let collidedDoor = false;
    collidedDoor = mWaterCharacter.getPhysicsComponent().collided(door.getPhysicsComponent(), new CollisionInfo());
    
    if (collidedDoor && !(door.getStatus())) {
        door.activateAnimation();
        door.setStatus(true);
    }

    if (door.getStatus() && (door.getCont() < 50)) {
        door.increment();
    }

    if(door.getCont() == 50){
        door.desactivateAnimation();
        mWaterCharacter.setVisibility(false);
    }

    //physics simulation
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllWalls);
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllPlatforms);
};
