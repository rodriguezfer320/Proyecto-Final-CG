"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Character(cx, cy, w, h, texture, player) {
    this.mCharacterState = Character.eCharacterState.eFace;
    this.mPreviousCharacterState = Character.eCharacterState.eFace;
    this.mIsMoving = false;
    this.mIsJumping = false;
    this.mDelta = 0.4;
    this.mInitialVelocityY = 0;

    this.mCharacter = new SpriteAnimateRenderable(texture);
    this.mCharacter.getXform().setPosition(cx, cy);
    this.mCharacter.getXform().setSize(4, 6);
    this.mCharacter.setSpriteSequence(1980, 88, 124, 220, 1, 44);

    GameObject.call(this, this.mCharacter);

    var rigidShape = new RigidRectangle(this.getXform(), 4, 4);
    rigidShape.setMass(2.5);
    rigidShape.setRestitution(0);
    rigidShape.setFriction(0);
    rigidShape.setColor([0, 1, 0, 1]);
    rigidShape.setDrawBounds(true);
    this.setPhysicsComponent(rigidShape);

    var mc = {
        eLeft: (player === 0) ? gEngine.Input.keys.A : gEngine.Input.keys.Left,
        eRight: (player === 0) ? gEngine.Input.keys.D : gEngine.Input.keys.Right,
        eUp: (player === 0) ? gEngine.Input.keys.W : gEngine.Input.keys.Up
    };
    this.eMotionControls = Object.freeze(mc);
}
gEngine.Core.inheritPrototype(Character, GameObject);

Character.eCharacterState = Object.freeze({
    eFace: 0,
    eRunRight: 1,
    eRunLeft: 2,
    eJumpUp: 3,
    eJumpRight: 4,
    eJumpLeft: 5,
    eFallDown: 6,
    eFallRight: 7,
    eFallLeft: 8
});

Character.prototype.update = function () {
    GameObject.prototype.update.call(this);

    var xform = this.getXform();
    var velocity = this.getPhysicsComponent().getVelocity();

    this.mIsMoving = false;

    if(velocity[1] === this.mInitialVelocityY){
        velocity[0] = 0;
        this.mIsJumping = false;
    }

    if(gEngine.Input.isKeyPressed(this.eMotionControls.eLeft)){
        if(this.mCharacterState === Character.eCharacterState.eFace
            || this.mCharacterState === Character.eCharacterState.eRunRight
            || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpLeft)
            || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eFallLeft)){
                this.mCharacterState = Character.eCharacterState.eRunLeft;
                velocity[0] = 0;
        }else if(this.mIsJumping === true &&  this.mCharacterState === Character.eCharacterState.eJumpUp
            || this.mCharacterState === Character.eCharacterState.eFallDown){
                this.mCharacterState = Character.eCharacterState.eFallLeft;
                velocity[0] = 20;
        }

        xform.incXPosBy(-this.mDelta);
        this.mIsMoving = true;
    }else if(gEngine.Input.isKeyPressed(this.eMotionControls.eRight)){        
        if(this.mCharacterState === Character.eCharacterState.eFace
            || this.mCharacterState === Character.eCharacterState.eRunLeft
            || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpRight)
            || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eFallRight)){
                this.mCharacterState = Character.eCharacterState.eRunRight;
                velocity[0] = 0;
        }else if(this.mIsJumping === true &&  this.mCharacterState === Character.eCharacterState.eJumpUp
            || this.mCharacterState === Character.eCharacterState.eFallDown){
                this.mCharacterState = Character.eCharacterState.eFallRight;
                velocity[0] = -20;
        }
    
        xform.incXPosBy(this.mDelta);
        this.mIsMoving = true;
    }else if(this.mCharacterState === Character.eCharacterState.eJumpRight
        || this.mCharacterState === Character.eCharacterState.eJumpLeft
        || this.mCharacterState === Character.eCharacterState.eFallRight
        || this.mCharacterState === Character.eCharacterState.eFallLeft){
            this.mCharacterState = Character.eCharacterState.eFallDown;
            velocity[0] = 0;
            velocity[1] = -1;
    }

    if(this.mIsJumping === false){
        if (this.mIsMoving === false) {    
            if (this.mCharacterState === Character.eCharacterState.eRunRight
                || this.mCharacterState === Character.eCharacterState.eRunLeft
                || this.mCharacterState === Character.eCharacterState.eJumpUp
                || this.mCharacterState === Character.eCharacterState.eJumpRight
                || this.mCharacterState === Character.eCharacterState.eJumpLeft
                || this.mCharacterState === Character.eCharacterState.eFallDown
                || this.mCharacterState === Character.eCharacterState.eFallRight
                || this.mCharacterState === Character.eCharacterState.eFallLeft){
                    this.mCharacterState = Character.eCharacterState.eFace;
                    velocity[0] = 0;
            }
        }

        if(gEngine.Input.isKeyClicked(this.eMotionControls.eUp)){
            this.mInitialVelocityY = velocity[1];
            this.mIsJumping = true;
            velocity[1] = 23; //Jump velocity
    
            if (this.mCharacterState === Character.eCharacterState.eFace){
                this.mCharacterState = Character.eCharacterState.eJumpUp;
            }else if(this.mCharacterState === Character.eCharacterState.eRunRight){
                this.mCharacterState = Character.eCharacterState.eJumpRight;
                velocity[0] = -20;
            }else if(this.mCharacterState === Character.eCharacterState.eRunLeft){
                this.mCharacterState = Character.eCharacterState.eJumpLeft;
                velocity[0] = 20;
            }  
        }
    }
    
    this.changeAnimation();
    this.mCharacter.updateAnimation();
};

Character.prototype.changeAnimation = function () {
    if (this.mCharacterState !== this.mPreviousCharacterState) {
        this.mPreviousCharacterState = this.mCharacterState;

        switch (this.mCharacterState) {
            case Character.eCharacterState.eFace:
                this.mCharacter.getXform().setSize(4, 6);
                this.mCharacter.setSpriteSequence(1980, 88, 124, 220, 1, 44);
                this.mCharacter.setAnimationSpeed(0);
                break;
            case Character.eCharacterState.eRunLeft:
                this.mCharacter.getXform().setSize(7, 6);
                this.mCharacter.setSpriteSequence(1460, 0, 212, 210, 4, 44);
                this.mCharacter.setAnimationSpeed(10);
                break;
            case Character.eCharacterState.eRunRight:
                this.mCharacter.getXform().setSize(7, 6);
                this.mCharacter.setSpriteSequence(1716, 0, 212, 210, 4, 44);
                this.mCharacter.setAnimationSpeed(10);
                break;
            case Character.eCharacterState.eJumpUp:
                this.mCharacter.getXform().setSize(4, 9);
                this.mCharacter.setSpriteSequence(2048, 344, 124, 350, 2, 140);
                this.mCharacter.setAnimationSpeed(100);
                break;
            case Character.eCharacterState.eJumpRight:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1256, 0, 212, 278, 4, 44);
                this.mCharacter.setAnimationSpeed(40);
                break;
            case Character.eCharacterState.eJumpLeft:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1000, 0, 212, 278, 4, 44);
                this.mCharacter.setAnimationSpeed(40);
                break;
            case Character.eCharacterState.eFallDown:
                this.mCharacter.getXform().setSize(4, 9);
                this.mCharacter.setSpriteSequence(2048, 608, 124, 350, 1, 140);
                this.mCharacter.setAnimationSpeed(0);
                break;
            case Character.eCharacterState.eFallRight:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1256, 512, 212, 278, 2, 44);
                this.mCharacter.setAnimationSpeed(10);
                break;
            case Character.eCharacterState.eFallLeft:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1000, 512, 212, 278, 2, 44);
                this.mCharacter.setAnimationSpeed(10);
                break;
        }
    }
};