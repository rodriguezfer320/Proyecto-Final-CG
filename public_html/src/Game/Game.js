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
    this.kWallColor = "assets/platfotm_tileset/yellow_brown/color.png";
    this.kWallRightTile = "assets/platfotm_tileset/yellow_brown/right_tile.png";
    this.kWallTopTile = "assets/platfotm_tileset/yellow_brown/top_tile.png";
    this.kWallLeftTile = "assets/platfotm_tileset/yellow_brown/left_tile.png";
    this.kWallBottomTile = "assets/platfotm_tileset/yellow_brown/bottom_tile.png";
    
    this.kWallShallowSlopeLeft01 = "assets/platfotm_tileset/yellow_brown/shallow_slope_left_01.png";
    this.kWallShallowSlopeLeft02 = "assets/platfotm_tileset/yellow_brown/shallow_slope_left_02.png";
    this.kWallShallowSlopeLeft03 = "assets/platfotm_tileset/yellow_brown/shallow_slope_left_03.png";
    this.kWallSteepSlopeLeft2 = "assets/platfotm_tileset/yellow_brown/steep_slope_left_2.png";
    this.kWallSteepSlopeLeft3 = "assets/platfotm_tileset/yellow_brown/steep_slope_left_3.png";

    this.kWallShallowSlopeRight01 = "assets/platfotm_tileset/yellow_brown/shallow_slope_right_01.png";
    this.kWallShallowSlopeRight02 = "assets/platfotm_tileset/yellow_brown/shallow_slope_right_02.png";
    this.kWallShallowSlopeRight03 = "assets/platfotm_tileset/yellow_brown/shallow_slope_right_03.png";
    this.kWallSteepSlopeRight1 = "assets/platfotm_tileset/yellow_brown/steep_slope_right_1.png";
    this.kWallSteepSlopeRight2 = "assets/platfotm_tileset/yellow_brown/steep_slope_right_2.png";

    this.kWaterCharacter = "assets/water_character.png";
    this.kFireCharacter = "assets/fire_character.png";
    this.kBackground = "assets/background.png";

    this.mAllWalls = new GameObjectSet();
    this.mWaterCharacter = null;
    this.mFireCharacter = null;

    // The camera to view the scene
    this.mCamera = null;
}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kWallColor);
    gEngine.Textures.loadTexture(this.kWallRightTile);
    gEngine.Textures.loadTexture(this.kWallTopTile);
    gEngine.Textures.loadTexture(this.kWallLeftTile);
    gEngine.Textures.loadTexture(this.kWallBottomTile);

    gEngine.Textures.loadTexture(this.kWallShallowSlopeLeft01);
    gEngine.Textures.loadTexture(this.kWallShallowSlopeLeft02);
    gEngine.Textures.loadTexture(this.kWallShallowSlopeLeft03);
    gEngine.Textures.loadTexture(this.kWallSteepSlopeLeft2);
    gEngine.Textures.loadTexture(this.kWallSteepSlopeLeft3);

    gEngine.Textures.loadTexture(this.kWallShallowSlopeRight01);
    gEngine.Textures.loadTexture(this.kWallShallowSlopeRight02);
    gEngine.Textures.loadTexture(this.kWallShallowSlopeRight03);
    gEngine.Textures.loadTexture(this.kWallSteepSlopeRight1);
    gEngine.Textures.loadTexture(this.kWallSteepSlopeRight2);

    gEngine.Textures.loadTexture(this.kWaterCharacter);
    gEngine.Textures.loadTexture(this.kFireCharacter);
    gEngine.Textures.loadTexture(this.kBackground);
};

Game.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();
    gEngine.Textures.unloadTexture(this.kWallColor);
    gEngine.Textures.unloadTexture(this.kWallRightTile);
    gEngine.Textures.unloadTexture(this.kWallTopTile);
    gEngine.Textures.unloadTexture(this.kWallLeftTile);
    gEngine.Textures.unloadTexture(this.kWallBottomTile);

    gEngine.Textures.unloadTexture(this.kWallShallowSlopeLeft01);
    gEngine.Textures.unloadTexture(this.kWallShallowSlopeLeft02);
    gEngine.Textures.unloadTexture(this.kWallShallowSlopeLeft03);
    gEngine.Textures.unloadTexture(this.kWallSteepSlopeLeft2);
    gEngine.Textures.unloadTexture(this.kWallSteepSlopeLeft3);

    gEngine.Textures.unloadTexture(this.kWallShallowSlopeRight01);
    gEngine.Textures.unloadTexture(this.kWallShallowSlopeRight02);
    gEngine.Textures.unloadTexture(this.kWallShallowSlopeRight03);
    gEngine.Textures.unloadTexture(this.kWallSteepSlopeRight1);
    gEngine.Textures.unloadTexture(this.kWallSteepSlopeRight2);

    gEngine.Textures.unloadTexture(this.kWaterCharacter);
    gEngine.Textures.unloadTexture(this.kFireCharacter);
    gEngine.Textures.unloadTexture(this.kBackground);
};

Game.prototype.initialize = function () {
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

    var wall = null;
    var urlWall = this.kWallColor;
    var posX = -48;
    var posY = 48;
    var w = 4;
    var h = 4;

    for(var i = 0; i < 96; i++){
        wall =  new Wall(posX, posY, w, h, urlWall);
        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
        this.mAllWalls.addToSet(wall);

        if(i < 24){
            posY -= h;
        } else if(i < 48){
            if(i == 47 || (i > 28 && i < 42)){
                urlWall = this.kWallColor;
            }else if(i == 28){
                urlWall = this.kWallShallowSlopeLeft01;
            }else if(i == 42){
                urlWall = this.kWallShallowSlopeRight01;
            }else{
                urlWall = this.kWallTopTile;
            }

            posX += w;
        } else if(i < 72){
            urlWall = this.kWallColor;
            posY += h;
        } else{
            posX -= w;
        }
    }

    wall =  new Wall(-28, -44, w, h, this.kWallShallowSlopeLeft02);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-24, -44, w, h, this.kWallShallowSlopeLeft03);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-20, -44, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-16, -44, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-12, -44, w, h, this.kWallSteepSlopeLeft3);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-12, -40, w, h, this.kWallSteepSlopeLeft2);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-8, -40, w, h, this.kWallSteepSlopeLeft3);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-8, -36, w, h, this.kWallSteepSlopeLeft2);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(-4, -36, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(0, -36, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(4, -36, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(8, -36, w, h, this.kWallSteepSlopeRight2);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(8, -40, w, h, this.kWallSteepSlopeRight1);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(12, -40, w, h, this.kWallSteepSlopeRight2);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(12, -44, w, h, this.kWallSteepSlopeRight1);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(16, -44, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(20, -44, w, h, this.kWallTopTile);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(24, -44, w, h, this.kWallShallowSlopeRight03);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

    wall =  new Wall(28, -44, w, h, this.kWallShallowSlopeRight02);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);
    this.mAllWalls.addToSet(wall);

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