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
        door_water: "assets/door/door_water.png",
        door_fire: "assets/door/door_fire.png",

        //PushButton
        push_button: "assets/push_button/push_button.png",

        //Diamons
        diamond_for_water: "assets/diamonds/diamond_for_water.png",
        diamond_for_fire: "assets/diamonds/diamond_for_fire.png",

        //Particles
        particle: "assets/particle/particle.png",

        //Characters
        water_character: "assets/characters/water_character.png",
        fire_character: "assets/characters/fire_character.png"

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
        door_water: "",
        door_fire: "",

        //PushButton
        push_button: "",

        //Diamons
        diamond_for_water: "",
        diamond_for_fire: "",

        //Particle
        particle: "",

        //Characters
        water_character: "assets/characters/water_character_normal.png",
        fire_character: "assets/characters/fire_character_normal.png"
    };

    this.kSounds = {
        background: "assets/sounds/background.mp3",
        death: "assets/sounds/death.mp3",
        diamond: "assets/sounds/diamond.mp3",
        ending: "assets/sounds/ending.mp3",
        finish: "assets/sounds/finish.mp3",
        fire_character_jump: "assets/sounds/fire_character_jump.mp3",
        water_character_jump: "assets/sounds/water_character_jump.mp3",
        fire_character_wave_walking: "assets/sounds/fire_character_wave_walking.mp3",
        water_character_wave_walking: "assets/sounds/water_character_wave_walking.mp3"
    };

    this.mAllCameras = null;
    this.mGlobalLightSet = null;
    this.mAllWalls = null;
    this.mAllPlatforms = null;
    this.mAllWaves = null;
    this.mAllDoors = null;
    this.mAllPushButtons = null;
    this.mAllCharacters = null;
    this.mWin = [false, true];
    this.mMsg = null;
    this.mIsVisibleMap = false;
    this.parser = null;
    this.mAllParticles = new ParticleGameObjectSet();
    this.cont = 0;
    this.activateSoundWalking = 0;

}
gEngine.Core.inheritPrototype(Game, Scene);

Game.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(this.kFileLevel, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    for (const key in this.kTextures) {
        if (this.kTextures[key] !== "") {
            gEngine.Textures.loadTexture(this.kTextures[key]);
        } else {
            this.kTextures[key] = null;
        }
    }

    for (const key in this.kNormals) {
        if (this.kNormals[key] !== "") {
            gEngine.Textures.loadTexture(this.kNormals[key]);
        } else {
            this.kNormals[key] = null;
        }
    }

    for (const key in this.kSounds) {
        if (this.kSounds[key] !== "") {
            gEngine.AudioClips.loadAudio(this.kSounds[key]);
        } else {
            this.kSounds[key] = null;
        }
    }

};

Game.prototype.unloadScene = function () {
    gEngine.LayerManager.cleanUp();
    gEngine.TextFileLoader.unloadTextFile(this.kFileLevel);

    gEngine.AudioClips.stopBackgroundAudio();
    for (const key in this.kTextures) {
        if (this.kTextures[key] !== null) {
            gEngine.Textures.unloadTexture(this.kTextures[key]);
        }
    }

    for (const key in this.kNormals) {
        if (this.kNormals[key] !== null) {
            gEngine.Textures.unloadTexture(this.kNormals[key]);
        }
    }

    for (const key in this.kSounds) {
        if (this.kSounds[key] !== "") {
            gEngine.AudioClips.unloadAudio(this.kSounds[key]);
        } else {
            this.kSounds[key] = null;
        }
    }

    let menu = null;

    if (this.mWin[0] && this.mWin[1]) {
        menu = new WinMenu();
    } else {
        menu = new GameOverMenu();
    }

    if (menu !== null) gEngine.Core.startScene(menu);
};

Game.prototype.initialize = function () {
    //set ambient lighting
    gEngine.DefaultResources.setGlobalAmbientColor([0.5, 0.5, 0.5, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(1);

    //initialize parser
    this.parser = new SceneFileParser(this.kFileLevel);

    //Camera
    this.mAllCameras = this.parser.parseCameras();

    //Lights
    this.mGlobalLightSet = this.parser.parseLights();

    //Background and shadowBackground
    this.parser.parseBackgrounds(this.kTextures, this.kNormals, this.mGlobalLightSet, this.mAllCameras[0]);

    //Walls
    this.mAllWalls = this.parser.parseWalls(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Platforms
    this.mAllPlatforms = this.parser.parsePlatforms(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Doors 
    this.mAllDoors = this.parser.parseDoors(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //PushButtons
    this.mAllPushButtons = this.parser.parsePushButton(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //PushButtons
    this.mAllDiamons = this.parser.parseDiamond(this.kTextures, this.kNormals, this.mGlobalLightSet);

    //Characters
    this.mAllCharacters = this.parser.parseCharacters(this.kTextures, this.kNormals, this.mGlobalLightSet, this.kSounds);

    //Weves
    this.mAllWaves = this.parser.parseWaves(this.kTextures, this.kNormals, this.mGlobalLightSet);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-14, -17);
    this.mMsg.setTextHeight(2);

    gEngine.LayerManager.addToLayer(gEngine.eLayer.eHUD, this.mMsg);

    gEngine.AudioClips.playBackgroundAudio(this.kSounds["background"]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Game.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mAllCameras[0].setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mAllCameras[0]);

    if (this.mIsVisibleMap) {
        this.mAllCameras[1].setupViewProjection();

        for (let i = 0; i < 4; i++) {
            gEngine.LayerManager.drawLayer(i, this.mAllCameras[1]);
        }
    }
    this.mAllParticles.draw(this.mAllCameras[0]);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Game.prototype.update = function () {
    this.mAllCameras[0].update();
    gEngine.LayerManager.updateAllLayers();

    this.mAllParticles.update();

    //Variables de objetos
    let mWaterCharacter = this.mAllCharacters.getObjectAt(0);
    let mFireCharacter = this.mAllCharacters.getObjectAt(1);

    this.camera(mWaterCharacter, mFireCharacter);
    this.auroraCharacter(mWaterCharacter, 1);
    this.timeParticles();
    this.auroraCharacter(mFireCharacter, 2);
    this.colCharacterWave(mWaterCharacter, mFireCharacter);

    this.colCharacterWaveWalking(mWaterCharacter, mFireCharacter);
    
    this.colCharacterDiamond(mWaterCharacter, mFireCharacter);
    this.colCharacterPushButton(mWaterCharacter, mFireCharacter);
    this.colCharacterDoor(mWaterCharacter, mFireCharacter);
    this.colCharacterParticle(mWaterCharacter, mFireCharacter);
    this.physicsSimulation();
    this.miniMapa();
    this.msjScore(mWaterCharacter, mFireCharacter);
};

//Mover la camara
Game.prototype.camera = function (mWaterCharacter, mFireCharacter) {
    let xf = mWaterCharacter.getXform();
    let posText = this.mMsg.getXform().getPosition();
    let status = this.mAllCameras[0].collideWCBound(xf, 1);

    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        let p1 = this.mAllCameras[0].getWCCenter();

        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            if (p1[1] === -32.900001525878906) {
                p1[1] += 16;
                posText[1] += 16;
            }
            else if (p1[1] === -16.900001525878906) {
                p1[1] += 24;
                posText[1] += 24;
            }
            else if (p1[1] === 7.099998474121094) {
                p1[1] += 12;
                posText[1] += 12;
            }
            else if (p1[1] === 19.099998474121094) {
                p1[1] += 13.8000030518;
                posText[1] += 13.8000030518;
            }
        } else if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            if (p1[1] === -16.900001525878906) {
                p1[1] -= 16;
                posText[1] -= 16
            }
            else if (p1[1] === 7.099998474121094) {
                p1[1] -= 24;
                posText[1] -= 24;
            }
            else if (p1[1] === 19.099998474121094) {
                p1[1] -= 12;
                posText[1] -= 12;
            }
            else if (p1[1] === 32.900001525878906) {
                p1[1] -= 13.8000030518;
                posText[1] -= 13.8000030518;
            }
        } else if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            if (p1[0] === -18) {
                p1[0] += 36;
                posText[0] += 1.6;
            }
        } else if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            if (p1[0] === 18) {
                p1[0] -= 36;
                posText[0] -= 1.6;
            }
        }

        this.mAllCameras[0].panTo(p1[0], p1[1]);
        this.mMsg.getXform().setPosition(posText[0], posText[1]);
    }
};

//Función que activa las fisicas del juego
Game.prototype.physicsSimulation = function () {
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllWalls);
    gEngine.Physics.processSetSet(this.mAllCharacters, this.mAllPlatforms);
};

//Función que activa y desactiva el minimapa
Game.prototype.miniMapa = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        if (!this.mIsVisibleMap) {
            this.mIsVisibleMap = true;
        } else {
            this.mIsVisibleMap = false;
        }
    }
};

//Mensaje de score para los personajes
Game.prototype.msjScore = function (mWaterCharacter, mFireCharacter) {
    let msg = "Watergirl: " + mWaterCharacter.getScore() + " Fireboy: " + mFireCharacter.getScore();
    this.mMsg.setText(msg);
};

//Función que crear las auroras de los personajes
Game.prototype.auroraCharacter = function (character, pos) {
    let auroraCharacter = vec2.clone(character.getPhysicsComponent().getXform().getPosition());
    this.mGlobalLightSet.getLightAt(pos).set2DPosition(auroraCharacter);
};

//Colisión del personaje con el liquido
Game.prototype.colCharacterWave = function (mWaterCharacter, mFireCharacter) {

    for (let i = 0; i < this.mAllWaves.size(); i++) {
        let wave = this.mAllWaves.getObjectAt(i);
        let character = (wave.getPlayerCollision() === 0) ? mWaterCharacter : mFireCharacter;

        let col = (character !== null) ? character.getPhysicsComponent().collided(wave.getPhysicsComponent(), new CollisionInfo()) : false;

        if (col) {
            gEngine.AudioClips.playACue(this.kSounds["death"]);
            gEngine.AudioClips.playACue(this.kSounds["finish"]);
            this.mGlobalLightSet.getLightAt(1).setLightTo(false);
            character.setVisibility(false);
            gEngine.GameLoop.stop();
        }
    }
};

//Función que detecta que personaje camina sobre su wave y reproduce el camino (en producción)
Game.prototype.colCharacterWaveWalking = function (mWaterCharacter, mFireCharacter) {
    for (let i = 0; i < this.mAllWaves.size(); i++) {
        let wave = this.mAllWaves.getObjectAt(i);
        let characterWalking = (wave.getPlayerCollision() === 0) ? mFireCharacter : mWaterCharacter;
        let colWalking = (characterWalking !== null) ? characterWalking.getPhysicsComponent().collided(wave.getPhysicsComponent(), new CollisionInfo()) : false;

        if (colWalking && (this.activateSoundWalking == 0)) {
            characterWalking.playSoundWalking();
            this.activateSoundWalking = 1;
        }
    }
};


//Colisión del personaje con su respectivo diamante
Game.prototype.colCharacterDiamond = function (mWaterCharacter, mFireCharacter) {
    for (let i = 0; i < this.mAllDiamons.size(); i++) {
        let diamond = this.mAllDiamons.getObjectAt(i);
        let character = (diamond.getPlayerCollision() === 0) ? mWaterCharacter : mFireCharacter;
        let col = (character !== null) ? character.getPhysicsComponent().collided(diamond.getPhysicsComponent(), new CollisionInfo()) : false;

        if (col) {
            gEngine.AudioClips.playACue(this.kSounds["diamond"]);
            diamond.setVisibility(false);
            character.incrementScore();
            this.mAllDiamons.removeFromSet(diamond);
        }
    }
};

//Colisión del personaje con su respectiva puerta
Game.prototype.colCharacterDoor = function (mWaterCharacter, mFireCharacter) {
    for (let i = 0; i < this.mAllDoors.size(); i++) {
        let door = this.mAllDoors.getObjectAt(i);
        let character = (door.getPlayerCollision() === 0) ? mWaterCharacter : mFireCharacter;
        let col = (character !== null) ? character.getPhysicsComponent().collided(door.getPhysicsComponent(), new CollisionInfo()) : false;

        if (col) {
            if (!(door.getStatus())) {
                door.activateAnimation();
                door.setStatus(true);
            }

            if (door.getStatus() && (door.getCont() < 50)) {
                door.increment();
            }

            if (door.getCont() == 50) {
                door.desactivateAnimation();
                character.setVisibility(false);
                character.setInDoor(true);
            }
        }
    }

    if (mWaterCharacter.getInDoor() && mFireCharacter.getInDoor()) {
        gEngine.AudioClips.playACue(this.kSounds["ending"]);
        this.gameover();
    }
};

//Colisión del personaje con los botones para activar las plataformas
Game.prototype.colCharacterPushButton = function (mWaterCharacter, mFireCharacter) {
    for (let i = 0; i < this.mAllPushButtons.size(); i++) {
        let pushButton = this.mAllPushButtons.getObjectAt(i);
        let colWater = mWaterCharacter.getPhysicsComponent().collided(pushButton.getPhysicsComponent(), new CollisionInfo());
        let colFire = mFireCharacter.getPhysicsComponent().collided(pushButton.getPhysicsComponent(), new CollisionInfo());

        if (colWater && (mWaterCharacter.getStatus() != pushButton.getPlatform())) {
            this.activatePlatform(pushButton, mFireCharacter, i);
            mWaterCharacter.setNumPushButtonCollide(i);
        } else if (i === mWaterCharacter.getNumPushButtonCollide()) {
            this.desactivatePlatform(pushButton, mFireCharacter);
            mWaterCharacter.setNumPushButtonCollide(-1);
        }

        if (colFire && (mFireCharacter.getStatus() != pushButton.getPlatform())) {
            this.activatePlatform(pushButton, mWaterCharacter, i);
            mFireCharacter.setNumPushButtonCollide(i);
        } else if (i === mFireCharacter.getNumPushButtonCollide()) {
            this.desactivatePlatform(pushButton, mWaterCharacter);
            mFireCharacter.setNumPushButtonCollide(-1);
        }
    }
};

//Función auxiliar activar plataforma
Game.prototype.activatePlatform = function (pushButton, character, i) {
    character.setStatus(pushButton.getPlatform());

    let platform = this.mAllPlatforms.getObjectAt(pushButton.getPlatform());

    if (!platform.getIsMoving()) {
        pushButton.pushButtonPressed();
        platform.changeDirectionMovement(true);
    }
};

//Función auxiliar desactivar plataforma
Game.prototype.desactivatePlatform = function (pushButton, character) {
    pushButton.pushButtonNotPressed();

    this.mAllPlatforms.getObjectAt(pushButton.getPlatform()).changeDirectionMovement(false);
    character.setStatus(-1);
};

//Función que calcula el tiempo de parada de las particulas
Game.prototype.timeParticles = function () {
    if (this.cont < 100) {
        this.loadParticles();
    }
    if (this.mAllParticles.size() === 0) {
        this.cont = 0;
    }
}

//Función que carga las particulas
Game.prototype.loadParticles = function () {

    if (this.cont < 100) {
        var p = this.parser.parseParticle(this.kTextures);
        this.mAllParticles.addToSet(p);
        this.cont++;
    }

};

//Colisión entre personajes y sustancia tóxica.
Game.prototype.colCharacterParticle = function (mWaterCharacter, mFireCharacter) {
    for (let i = 0; i < this.mAllParticles.size(); i++) {
        let particle = this.mAllParticles.getObjectAt(i);

    }
}

//Functión que para el juego.
Game.prototype.gameover = function () {
    this.mWin[0] = true;
    gEngine.GameLoop.stop();

};





