function shot(id, ownerId, iniX, iniY, iniAngle, iniVel, motionEngine) {

    // Object
    this.id = id;
    this.ownerId = ownerId;
    this.isVisible = true;
    this.color = "green";
    this.followable = false;
    this.canRotate = false;
    this.intersectable = false;

    // Physics
    this.vel = iniVel;
    this.posX = iniX;
    this.posY = iniY;
    this.width = 10;
    this.height = 10;
    this.mass = 1000;
    this.maxSpeed = 6;

    // Motion engine
    this.motionEngine = motionEngine;

    // Movement
    this.activeMovement = "forward";
    this.activeAngle = iniAngle;
    this.lastAngle = 90;
    this.counter = 0;

    // Renderization
    this.spriteX = (5 * this.width);
    this.spriteY = 0;
    this.img = new Image();
    this.img.src = "images/fireball.png";
    this.isSprited = false;


    this.state = 0;
    this.circuit = undefined;

}

/*
 * Update shot state
 */
shot.prototype.update = function() {
    switch (this.state) {
        case 0:
            this.defaultMovement();
            break;
    }
}


/*****/
shot.prototype.defaultMovement = function() {


    var angleForCalc = undefined;
    var slippingTime = 2;

    // movement
    if (this.activeAngle !== this.lastAngle) {
        if (this.counter < slippingTime) {
            angleForCalc = this.lastAngle;
            this.counter++;
        } else {
            this.counter = 0;
            this.lastAngle = this.activeAngle;
            angleForCalc = this.lastAngle;
        }
    } else {
        angleForCalc = this.activeAngle;
    }

    var deltaPosY = (Math.sin(angleForCalc * (Math.PI / -180)) * this.vel);
    var deltaPosX = (Math.cos(angleForCalc * (Math.PI / -180)) * this.vel);

    // shot update
    this.posY = this.posY + deltaPosY;
    this.posX = this.posX + deltaPosX;

}
