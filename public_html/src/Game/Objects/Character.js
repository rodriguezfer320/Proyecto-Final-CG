"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Character(x, y, texture, normal, lgtSet, player) {
    this.mCharacterState = Character.eCharacterState.eFace;
    this.mPreviousCharacterState = Character.eCharacterState.eFace;
    this.mIsMoving = false;
    this.mIsJumping = false;
    this.mCanMove = true;
    this.mDelta = 0.4;
    this.mOldPosX = 0;
    this.mXAxisCorrection = -0.7;
    this.mYAxisCorrection = 1.5;

    if(normal !== null){
        this.mCharacter = new IllumRenderable(texture, normal);
    }else{
        this.mCharacter = new LightRenderable(texture);
    }
    
    this.mCharacter.getXform().setPosition(x, y);
    this.mCharacter.getXform().setZPos(2);
    this.mCharacter.getXform().setSize(7, 7);
    this.mCharacter.setSpriteSequence(2048, 0, 256, 256, 1, 0);
    this.mCharacter.setAnimationSpeed(0);
    this.mCharacter.addLight(lgtSet.getLightAt(0));

    GameObject.call(this, this.mCharacter);

    let transform = new Transform();
    transform.setPosition(x, y);

    let rigidShape = new RigidRectangle(transform, 1, 4);
    rigidShape.setMass(2.5);
    rigidShape.setRestitution(0);
    rigidShape.setFriction(0);
    rigidShape.setColor([0, 1, 0, 1]);
    rigidShape.setDrawBounds(false);
    this.setPhysicsComponent(rigidShape);

    let motionControls = {
        eLeft: (player === "water_character") ? gEngine.Input.keys.A : gEngine.Input.keys.Left,
        eRight: (player === "water_character") ? gEngine.Input.keys.D : gEngine.Input.keys.Right,
        eUp: (player === "water_character") ? gEngine.Input.keys.W : gEngine.Input.keys.Up
    };
    this.eMotionControls = Object.freeze(motionControls);
}
gEngine.Core.inheritPrototype(Character, GameObject);

Character.eCharacterState = Object.freeze({
    eFace: 0,
    eRunLeft: 1,
    eRunRight: 2,
    eJumpUp: 3,
    eJumpLeft: 4,
    eJumpRight: 5,
    eFallDown: 6
});

Character.prototype.update = function () {
    GameObject.prototype.update.call(this);

    if(this.isVisible()){
        let xform = this.getPhysicsComponent().getXform();
        let velocity = this.getPhysicsComponent().getVelocity();

        this.mCharacter.getXform().setPosition(xform.getXPos() + this.mXAxisCorrection, xform.getYPos() + this.mYAxisCorrection);            
        this.mIsMoving = false;

        if(velocity[1] < -0.3333333432674408){
            if(this.mCharacterState === Character.eCharacterState.eFace
                || this.mCharacterState === Character.eCharacterState.eRunRight
                || this.mCharacterState === Character.eCharacterState.eRunLeft){
                    this.mCharacterState = Character.eCharacterState.eFallDown;
                    this.mIsJumping = true;
                    this.mCanMove = false;
            }
        }else if(velocity[1] === -0.3333333432674408){
            this.mIsJumping = false;
            this.mCanMove = true;
            velocity[0] = 0;
        }

        if(this.mCanMove === true){
            if(gEngine.Input.isKeyPressed(this.eMotionControls.eLeft)){
                if(this.mCharacterState === Character.eCharacterState.eFace
                    || this.mCharacterState === Character.eCharacterState.eRunRight
                    || this.mCharacterState === Character.eCharacterState.eJumpUp
                    || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpLeft)
                    || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpRight)
                    || this.mCharacterState === Character.eCharacterState.eFallDown){
                        this.mCharacterState = Character.eCharacterState.eRunLeft;
                }

                if(this.mIsJumping && xform.getXPos() < (this.mOldPosX - 6.2)){
                    this.mCanMove = false;
                }else{
                    this.mIsMoving = true;
                    xform.incXPosBy(-this.mDelta);
                }
            }

            if(gEngine.Input.isKeyPressed(this.eMotionControls.eRight)){        
                if(this.mCharacterState === Character.eCharacterState.eFace
                    || this.mCharacterState === Character.eCharacterState.eRunLeft
                    || this.mCharacterState === Character.eCharacterState.eJumpUp
                    || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpLeft)
                    || (this.mIsJumping === false && this.mCharacterState === Character.eCharacterState.eJumpRight)
                    || this.mCharacterState === Character.eCharacterState.eFallDown){
                        this.mCharacterState = Character.eCharacterState.eRunRight;
                }

                if(this.mIsJumping && xform.getXPos() > (this.mOldPosX + 6.2)){
                    this.mCanMove = false;
                }else{
                    this.mIsMoving = true;
                    xform.incXPosBy(this.mDelta);
                }
            }
        }

        if(this.mIsJumping === false){
            if (this.mIsMoving === false) {    
                if (this.mCharacterState === Character.eCharacterState.eRunLeft
                    || this.mCharacterState === Character.eCharacterState.eRunRight
                    || this.mCharacterState === Character.eCharacterState.eJumpUp
                    || this.mCharacterState === Character.eCharacterState.eJumpRight
                    || this.mCharacterState === Character.eCharacterState.eJumpLeft
                    || this.mCharacterState === Character.eCharacterState.eFallDown){
                        this.mCharacterState = Character.eCharacterState.eFace;
                }
            }

            if(gEngine.Input.isKeyClicked(this.eMotionControls.eUp)){
                this.mIsJumping = true;
        
                if (this.mCharacterState === Character.eCharacterState.eFace){
                    this.mCharacterState = Character.eCharacterState.eJumpUp;
                    velocity[1] = 23; //Jump velocity
                    this.mOldPosX = xform.getXPos();
                }else if(this.mCharacterState === Character.eCharacterState.eRunRight){
                    this.mCharacterState = Character.eCharacterState.eJumpRight;
                    this.mCanMove = false;
                    velocity[1] = 20; //Jump velocity
                    velocity[0] = 5;
                }else if(this.mCharacterState === Character.eCharacterState.eRunLeft){
                    this.mCharacterState = Character.eCharacterState.eJumpLeft;
                    this.mCanMove = false;
                    velocity[1] = 20; //Jump velocity
                    velocity[0] = -5;
                }  
            }
        }
        
        this.changeAnimation();
        this.mCharacter.updateAnimation();
    }else{
        this.mCharacter.getLightAt(0).isLightOn(false);
    }
};

Character.prototype.changeAnimation = function () {
    if (this.mCharacterState !== this.mPreviousCharacterState) {
        this.mPreviousCharacterState = this.mCharacterState;

        switch (this.mCharacterState) {
            case Character.eCharacterState.eFace:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(2048, 0, 256, 256, 1, 0);
                this.mCharacter.setAnimationSpeed(0);
                this.mXAxisCorrection = -0.7;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eRunLeft:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1536, 0, 256, 256, 4, 0);
                this.mCharacter.setAnimationSpeed(10);
                this.mXAxisCorrection = 1.8;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eRunRight:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1792, 0, 256, 256, 4, 0);
                this.mCharacter.setAnimationSpeed(10);
                this.mXAxisCorrection = -0.7;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eJumpUp:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(2048, 256, 256, 256, 2, 0);
                this.mCharacter.setAnimationSpeed(100);
                this.mXAxisCorrection = -0.5;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eJumpLeft:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1024, 0, 256, 256, 4, 0);
                this.mCharacter.setAnimationSpeed(40);
                this.mXAxisCorrection = 1.2;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eJumpRight:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(1280, 0, 256, 256, 4, 0);
                this.mCharacter.setAnimationSpeed(40);
                this.mXAxisCorrection = -1.2;
                this.mYAxisCorrection = 1.5;
                break;
            case Character.eCharacterState.eFallDown:
                this.mCharacter.getXform().setSize(7, 7);
                this.mCharacter.setSpriteSequence(2048, 512, 256, 256, 1, 0);
                this.mCharacter.setAnimationSpeed(0);
                this.mXAxisCorrection = -0.5;
                this.mYAxisCorrection = 1.5;
                break;
        }
    }
};