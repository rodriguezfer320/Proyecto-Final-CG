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
        background: "assets/backgrounds/background.png",
        shadowBackground: "assets/backgrounds/shadow_background.png",

        //Tileset
        bottom_left_edge: "assets/walls/bottom_left_edge.png",
        bottom_right_edge: "assets/walls/bottom_right_edge.png",
        bottom_tile: "assets/walls/bottom_tile.png",
        color: "assets/walls/color.png", 
        color_medium: "assets/walls/color_medium.png", 
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
        platform: "assets/platform/platform.png",

        //Waves
        wave_fire: "assets/wave/wave_fire.png",
        wave_water: "assets/wave/wave_water.png",

        //Door
        door: "assets/door/door.png",

        //PushButton
        push_button: "assets/push_button/push_button.png",

        //Diamons
        diamond_for_water: "assets/diamonds/diamond_for_water.png",
        diamond_for_fire: "assets/diamonds/diamond_for_fire.png",

        //Characters
        water_character: "assets/characters/water_character.png"
    };

    this.kNormals = {
        //background and shadowBackground
        background: "",
        shadowBackground: "",

        //Tileset
        bottom_left_edge: "assets/walls/bottom_left_edge_normal.png",
        bottom_right_edge: "assets/walls/bottom_right_edge_normal.png",
        bottom_tile: "assets/walls/bottom_tile_normal.png",
        color: "assets/walls/color_normal.png", 
        color_medium: "assets/walls/color_medium_normal.png", 
        inner_corner_bottom_left: "assets/walls/inner_corner_bottom_left_normal.png",
        inner_corner_bottom_right: "assets/walls/inner_corner_bottom_right_normal.png",
        inner_corner_top_left: "assets/walls/inner_corner_top_left_normal.png",   
        inner_corner_top_right: "assets/walls/inner_corner_top_right_normal.png",     
        left_edge_repeating: "assets/walls/left_edge_repeating_normal.png",
        platform_inner_repeating: "assets/walls/platform_inner_repeating_normal.png",  
        platform_left_edge: "assets/walls/platform_left_edge_normal.png",
        platform_right_edge: "assets/walls/platform_right_edge_normal.png",
        platform_single: "assets/walls/platform_single_normal.png",
        left_tile: "assets/walls/left_tile_normal.png",        
        right_edge_repeating: "assets/walls/right_edge_repeating_normal.png",
        right_tile: "assets/walls/right_tile_normal.png",
        top_left_edge: "assets/walls/top_left_edge_normal.png",
        top_right_edge: "assets/walls/top_right_edge_normal.png",
        top_tile: "assets/walls/top_tile_normal.png",

        //Platform
        platform: "assets/platform/platform_normal.png",

        //Waves
        wave_fire: "",
        wave_water: "",

        //Door
        door: "",

        //PushButton
        push_button: "",

        //Diamons
        diamond_for_water: "",
        diamond_for_fire: "",

        //Characters
        water_character: "assets/characters/water_character_normal.png"
    };

    this.mAllCameras = null;
    this.mGlobalLightSet = null;
    this.mAllWalls = null;
    this.mAllPlatforms = null;
    this.mAllWaves = null;
    this.mAllDoors = null;
    this.mAllPushButtons = null;
    this.mAllCharacters = null;
    this.numPushButtonCollide = -1;
    this.mWin = [false, true];
    this.scoreWaterCharacter = 0;
    this.scoreFireCharacter = 0;
    this.mMsg = null;
    this.mIsVisibleMap = false;
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
            gEngine.Textures.unloadTexture(this.kTextures[key]);
        }
    }
    
    for (const key in this.kNormals) {
        if(this.kNormals[key] !== null){
            gEngine.Textures.unloadTexture(this.kNormals[key]);
        }
    }

    let menu = null;

    if(this.mWin[0] && this.mWin[1]){
        menu = new WinMenu();
    }else{
        menu = new GameOverMenu();
    }

    if(menu !== null) gEngine.Core.startScene(menu);
};

Game.prototype.initialize = function () {
    //set ambient lighting
    gEngine.DefaultResources.setGlobalAmbientColor([0.5, 0.5, 0.5, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);

    //initialize parser
    let parser = new SceneFileParser(this.kFileLevel);

    //Camera
    this.mAllCameras = parser.parseCameras();

    //Lights
    this.mGlobalLightSet = parser.parseLights();

    //Background and shadowBackground
    parser.parseBackgrounds(this.kTextures, this.kNormals, this.mGlobalLightSet, this.mAllCameras[0]);

    //Walls
    this.mAllWalls = parser.parseWalls(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Platforms
    this.mAllPlatforms = parser.parsePlatforms(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Doors 
    this.mAllDoors = parser.parseDoors(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //PushButtons
    this.mAllPushButtons = parser.parsePushButton(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //PushButtons
    this.mAllDiamons = parser.parseDiamond(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Characters
    this.mAllCharacters = parser.parseCharacters(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Weves
    this.mAllWaves = parser.parseWaves(this.kTextures, this.kNormals, this.mGlobalLightSet);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-14, -17);
    this.mMsg.setTextHeight(2);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eHUD, this.mMsg);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Game.prototype.draw = function () {
    gEngine.Core.clearCanvas([1, 1, 1, 1]); 
    this.mAllCameras[0].setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mAllCameras[0]);

    if(this.mIsVisibleMap){
        this.mAllCameras[1].setupViewProjection();

        for(let i = 0; i < 4; i++){
            gEngine.LayerManager.drawLayer(i, this.mAllCameras[1]);
        }
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Game.prototype.update = function () {
    this.mAllCameras[0].update();
    gEngine.LayerManager.updateAllLayers();

    //Variables de objetos
    let mWaterCharacter = this.mAllCharacters.getObjectAt(0);
    let door = this.mAllDoors.getObjectAt(0);

    //Mover la camara
    let xf = mWaterCharacter.getXform();
    let posText = this.mMsg.getXform().getPosition();
    let status = this.mAllCameras[0].collideWCBound(xf, 1);

    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        let p1 = this.mAllCameras[0].getWCCenter();

        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            if(p1[1] === -32.900001525878906){
                p1[1] += 16;
                posText[1] += 16;
            }
            else if(p1[1] === -16.900001525878906){
                p1[1] += 24;
                posText[1] += 24;
            }
            else if(p1[1] === 7.099998474121094){
                p1[1] += 12;
                posText[1] += 12;
            }
            else if(p1[1] === 19.099998474121094){
                p1[1] += 13.8000030518;
                posText[1] += 13.8000030518;
            } 
        }else if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            if(p1[1] === -16.900001525878906){
                p1[1] -= 16;
                posText[1] -= 16
            } 
            else if(p1[1] === 7.099998474121094){
                p1[1] -= 24;
                posText[1] -= 24;
            }
            else if(p1[1] === 19.099998474121094){
                p1[1] -= 12;
                posText[1] -= 12;
            }
            else if( p1[1] === 32.900001525878906){
                p1[1] -= 13.8000030518;
                posText[1] -= 13.8000030518;
            } 
        }else if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            if(p1[0] === -18){
                p1[0] += 36;
                posText[0] += 1.6;
            }
        }else if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            if(p1[0] === 18){
                p1[0] -= 36;
                posText[0] -= 1.6;
            }
        }

        this.mAllCameras[0].panTo(p1[0], p1[1]);
        this.mMsg.getXform().setPosition(posText[0], posText[1]);
    }

    //Mover la luz del personaje
    let p = vec2.clone(mWaterCharacter.getPhysicsComponent().getXform().getPosition());
    this.mGlobalLightSet.getLightAt(1).set2DPosition(p);

    //Colisión puerta con el personaje de agua 
    let collidedDoor = mWaterCharacter.getPhysicsComponent().collided(door.getPhysicsComponent(), new CollisionInfo());
    
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
        this.mWin[0] = true;
        gEngine.GameLoop.stop();
    }

    /**
     * Si el personaje oprime el push button 1 o 2 activa el movimiento de la plataforma 1.
     * Si el personaje oprime el push button 3 o 4 activa el movimiento de la plataforma 2.
     */
    for (let i = 0; i < this.mAllPushButtons.size(); i++) {
        let pushButton = this.mAllPushButtons.getObjectAt(i);
        let col = mWaterCharacter.getPhysicsComponent().collided(pushButton.getPhysicsComponent(), new CollisionInfo()); 

        if(col){
            let platform = this.mAllPlatforms.getObjectAt(pushButton.getPlatform());
            this.numPushButtonCollide = i;

            if(!platform.getIsMoving()){
                pushButton.pushButtonPressed();
                platform.changeDirectionMovement(true);
            }
        /**
         * Si el personaje deja de oprimir el push button 1 o 2 desactiva el movimiento de la plataforma 1.
         * Si el personaje deja de oprimir el push button 3 o 4 desactiva el movimiento de la plataforma 2.
         */
        }else if(i === this.numPushButtonCollide){
            pushButton.pushButtonNotPressed();
            this.numPushButtonCollide = -1;
            this.mAllPlatforms.getObjectAt(pushButton.getPlatform()).changeDirectionMovement(false);
        }        
    }

    //Colisión del personaje con el liquido
    for (let i = 0; i < this.mAllWaves.size(); i++) {
        let wave = this.mAllWaves.getObjectAt(i);
        let character = (wave.getPlayerCollision() === 0) ? mWaterCharacter : null;
        let col = (character !== null) ? character.getPhysicsComponent().collided(wave.getPhysicsComponent(), new CollisionInfo()) : false; 

        if(col){
            this.mGlobalLightSet.getLightAt(1).setLightTo(false);
            character.setVisibility(false);
            gEngine.GameLoop.stop();
        } 
    }

    /**
     * Si el personaje toca su respectivo diamante le suma un 1 a su score.
     */
    for (let i = 0; i < this.mAllDiamons.size(); i++) {
        let diamond = this.mAllDiamons.getObjectAt(i);
        let col = mWaterCharacter.getPhysicsComponent().collided(diamond.getPhysicsComponent(), new CollisionInfo()); 
        let type = diamond.getType();

        if(col && (type === "diamond_for_water")){
            diamond.setVisibility(false);
            this.scoreWaterCharacter++;    
            this.mAllDiamons.removeFromSet(diamond);
        } 
    }

    //physics simulation
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllWalls);
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllPlatforms); 

    //se habilita y deshabilita el mapa
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)){
        if(!this.mIsVisibleMap){
            this.mIsVisibleMap = true;
        }else{
            this.mIsVisibleMap = false;
        }
    }
    
    //Mensaje de score para los personajes
    let msg = "Watergirl: " + this.scoreWaterCharacter + " Fireboy: " + this.scoreFireCharacter;
    this.mMsg.setText(msg);
};
