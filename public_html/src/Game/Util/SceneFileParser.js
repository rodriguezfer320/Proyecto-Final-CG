/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true, white: true*/
/*global gEngine, Light, Camera, vec2, Platform, Wall,
 LightSet, IllumRenderable, ParallaxGameObject, ShadowReceiver */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFilePath) {
    this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElm = function (tagElm) {
    var theElm = this.mSceneXml.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    }
    return theElm;
};

SceneFileParser.prototype._convertToNum = function (a) {
    var j;
    for (j = 0; j < a.length; j++) {
        a[j] = Number(a[j]);
    }
};

SceneFileParser.prototype.parseLights = function () {
    var lightSet = new LightSet();
    var elm = this._getElm("Light");
    var i, type, pos, dir, color, n, f, inner, outer, intensity, dropoff, shadow, lgt;
    for (i = 0; i < elm.length; i++) {
        type = Number(elm.item(i).attributes.getNamedItem("Type").value);
        color = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        pos = elm.item(i).attributes.getNamedItem("Pos").value.split(" ");
        dir = elm.item(i).attributes.getNamedItem("Dir").value.split(" ");
        n = Number(elm.item(i).attributes.getNamedItem("Near").value);
        f = Number(elm.item(i).attributes.getNamedItem("Far").value);
        inner = Number(elm.item(i).attributes.getNamedItem("Inner").value);
        outer = Number(elm.item(i).attributes.getNamedItem("Outter").value);
        dropoff = Number(elm.item(i).attributes.getNamedItem("DropOff").value);
        intensity = Number(elm.item(i).attributes.getNamedItem("Intensity").value);
        shadow = elm.item(i).attributes.getNamedItem("CastShadow").value;
        // make sure array contains numbers
        this._convertToNum(color);
        this._convertToNum(pos);
        this._convertToNum(dir);

        // convert type ...

        lgt = new Light();
        lgt.setLightType(type);
        lgt.setColor(color);
        lgt.setXPos(pos[0]);
        lgt.setYPos(pos[1]);
        lgt.setZPos(pos[2]);
        lgt.setDirection(dir);
        lgt.setNear(n);
        lgt.setFar(f);
        lgt.setInner(inner);
        lgt.setOuter(outer);
        lgt.setIntensity(intensity);
        lgt.setDropOff(dropoff);
        lgt.setLightCastShadowTo((shadow === "true"));

        lightSet.addToSet(lgt);
    }

    return lightSet;
};

SceneFileParser.prototype.parseDoor = function(texture){    
    var elm = this._getElm("Door");

    var cx = null;
    var cy = null;
    var w = null;
    var h = null;

    cx = Number(elm[0].getAttribute("posX"));
    cy = Number(elm[0].getAttribute("posY"));
    w = Number(elm[0].getAttribute("weight"));
    h = Number(elm[0].getAttribute("height"));
    var mDoor = new Door(cx, cy, w, h, texture);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, mDoor);

    return mDoor;
    
};

SceneFileParser.prototype.parseWall = function(textures){
    var elm = this._getElm("Wall");

    var allWalls = [];
    for (var index = 0; index < elm.length; index++) {
        var x = Number(elm.item(index).attributes.getNamedItem("posX").value);
        var y = Number(elm.item(index).attributes.getNamedItem("posY").value);

        var typeWall = elm[index].getAttribute("type");

        var wall = new Wall(x, y, 4, 4, textures[typeWall]);
        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, wall);

        allWalls.push(wall);
    }

    return allWalls;
    
};

SceneFileParser.prototype.parsePushButton = function(texture){    
    var elm = this._getElm("PushButton");

    var cx = null;
    var cy = null;
    var w = null;
    var h = null;

    cx = Number(elm[0].getAttribute("posX"));
    cy = Number(elm[0].getAttribute("posY"));
    w = Number(elm[0].getAttribute("weight"));
    h = Number(elm[0].getAttribute("height"));
    var mPushButton = new PushButton(cx, cy, w, h, texture);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, mPushButton);

    return mPushButton;
    
};



SceneFileParser.prototype.parsePlatform = function (texture, normal, lightSet) {
    var elm = this._getElm("Platform");
    var i, j, x, y, v, r, p;
    var allPlatforms = [];
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        v = elm.item(i).attributes.getNamedItem("Velocity").value.split(" ");
        r = Number(elm.item(i).attributes.getNamedItem("MovementRange").value);
        // make sure color array contains numbers
        this._convertToNum(v);

        p = new Platform(x, y, v, r, texture, normal, lightSet);
        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, p);
        gEngine.LayerManager.addAsShadowCaster(p);

        allPlatforms.push(p);
    }

    return allPlatforms;
};
