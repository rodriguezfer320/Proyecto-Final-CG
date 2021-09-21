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
    this.kDoor = "assets/door.png";
    this.kPushButton = "assets/push_button.png";

    this.kPlatform = "assets/platform.png";
    this.kPlatformNormal = "assets/platform_normal.png";

    //Characters
    this.kWaterCharacter = "assets/water_character.png";
    //this.kFireCharacter = "assets/fire_character.png";

    //background
    this.kBackground = "assets/background.png";
    this.kShadowBackground = "assets/shadow_background.png";
    
    //Variable multiples muros 
    this.mAllWalls = new GameObjectSet();
    
    //Variable objetos personajes
    this.mWaterCharacter = null;
    //this.mFireCharacter = null;
    
    //The camera to view the scene
    this.mCamera = null;

    //Object Door
    this.objectDoor = null;
    this.objectPushButton = null;

    this.mGlobalLightSet = null;

    this.fileLevel = "assets/Level1.xml";

    this.mAllPlatforms = new GameObjectSet();
}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(this.fileLevel, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    gEngine.Textures.loadTexture(this.kBackground);
    gEngine.Textures.loadTexture(this.kShadowBackground);
    
    for (const key in this.kWalls) {
        gEngine.Textures.loadTexture(this.kWalls[key]);
    }
    


    gEngine.Textures.loadTexture(this.kDoor);

    gEngine.Textures.loadTexture(this.kPushButton);

    gEngine.Textures.loadTexture(this.kPlatform);
    gEngine.Textures.loadTexture(this.kPlatformNormal);

    gEngine.Textures.loadTexture(this.kWaterCharacter);
    //gEngine.Textures.loadTexture(this.kFireCharacter);
};

Game.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();

    gEngine.TextFileLoader.unloadTextFile(this.fileLevel);

    gEngine.Textures.unloadTexture(this.kBackground);
    gEngine.Textures.unloadTexture(this.kShadowBackground);

    for (const key in this.kWalls) {
        gEngine.Textures.unloadTexture(this.kWalls[key]);
    }

    gEngine.Textures.unloadTexture(this.kDoor);

    gEngine.Textures.unloadTexture(this.kPushButton);

    gEngine.Textures.unloadTexture(this.kPlatform);
    gEngine.Textures.unloadTexture(this.kPlatformNormal);

    gEngine.Textures.unloadTexture(this.kWaterCharacter);
    //gEngine.Textures.unloadTexture(this.kFireCharacter);
};

Game.prototype.initialize = function () {

    //initialize parser
    let parser = new SceneFileParser(this.fileLevel);
   

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

    let light = new Light();
    light.setLightType(Light.eLightType.ePointLight);
    light.setColor([0/255, 153/255, 255/255, 1]);
    light.setXPos(-42);
    light.setYPos(-43);
    light.setZPos(2);
    light.setDirection([0.02, -0.02, -1]);
    light.setNear(2);
    light.setFar(3);
    light.setInner(1.2);
    light.setOuter(1.3);
    light.setIntensity(1.5);
    light.setDropOff(1.5);
    light.setLightCastShadowTo(true);

    let background = new LightRenderable(this.kBackground);
    background.setElementPixelPositions(0, 900, 124, 1024);
    background.getXform().setSize(100, 100);
    background.getXform().setPosition(0,0);
    background.addLight(light);
    background = new ParallaxGameObject(background, 100, this.mCamera);

    let shadowBackground = new LightRenderable(this.kShadowBackground);
    shadowBackground.setElementPixelPositions(0, 900, 124, 1024);
    shadowBackground.getXform().setSize(100, 100);
    shadowBackground.getXform().setPosition(0,0);
    shadowBackground.addLight(light);
    shadowBackground = new ParallaxGameObject(shadowBackground, 2, this.mCamera);
    shadowBackground = new ShadowReceiver(shadowBackground);

    //Añadir walls
    let walls = parser.parseWall(this.kWalls);
    for (let index = 0; index < walls.length; index++) {
        this.mAllWalls.addToSet(walls[index]);
    }

    //Añadir door y recuperar instancia
    this.objectDoor = parser.parseDoor(this.kDoor);

    //Añadir lever y recuperar instancia
    this.objectPushButton = parser.parsePushButton(this.kPushButton);

    let p = parser.parsePlatform(this.kPlatform, this.kPlatformNormal, this.mGlobalLightSet);
    for (let index = 0; index < p.length; index++) {
        this.mAllPlatforms.addToSet(p[index]);
    }

    //Añadir personaje water
    this.mWaterCharacter = new Character(40, 12, this.kWaterCharacter, light);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, background);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eShadowReceiver, shadowBackground);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mWaterCharacter);
    gEngine.LayerManager.addAsShadowCaster(this.mWaterCharacter);
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

    //Mover la camara
    let p = this.mWaterCharacter.getXform();
    this.mCamera.setWCCenter(p.getXPos(), p.getYPos());
    
    
    // physics simulation
    gEngine.Physics.processObjSet(this.mWaterCharacter, this.mAllWalls);
    gEngine.Physics.processObjSet(this.mWaterCharacter, this.mAllPlatforms);
    var colPushWater =  gEngine.Physics.processObjObj(this.objectPushButton, this.mWaterCharacter);
    
    /**
     * Colisión puerta con el personaje de agua
     */
    let collidedDoor = false;
    collidedDoor = this.mWaterCharacter.getPhysicsComponent().collided(this.objectDoor.getPhysicsComponent(), new CollisionInfo());
    
    if (collidedDoor && !(this.objectDoor.getStatus())) {
        this.objectDoor.activateAnimation();
        this.objectDoor.setStatus(true);
    }

    if (this.objectDoor.getStatus() && (this.objectDoor.getCont() < 50)) {
        this.objectDoor.incrementCont();
    }

    if(this.objectDoor.getCont() == 50){
        this.objectDoor.desactivateAnimation();
        this.mWaterCharacter.setVisibility(false);
    } 

    if (colPushWater) {
        console.log("entro");
        this.objectPushButton.pushButtonPressed();
    }else {
        this.objectPushButton.pushButtonNotPressed();
    }
    
 
};
