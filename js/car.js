/** 
 * CAR
 * States: 
 * 0 - default
 * 1 - crash
 * n - default
 * n - default
 *
 */
function car(id, iniX, iniY, addPointer, keyConf, motionEngine) {

    // Object
    this.id = id;
    this.isVisible = true;
    this.color = "green";
    this.followable = true;
    this.canRotate = true;

    // Physics
    this.vel = 0;
    this.posX = iniX;
    this.posY = iniY;
    this.width = 30;
    this.height = 30;
    this.mass = 1000;
    this.maxSpeed = 6;

    // Motion engine
    this.motionEngine = motionEngine;

    // key configuration
    this.keyConf = keyConf;

    // Movement
    this.activeMovement = "forward";

    this.activeAngle = 90;


    this.lastAngle = 90;
    this.counter = 0;
    this.intersectable = true;

    // Renderization
    this.spriteX = (5 * this.width);
    this.spriteY = 0;
    this.img = new Image();
    this.img.src = "images/wheel.png";
    this.isSprited = true;


    this.state = 0;
    this.circuit = undefined;

    // Weapon
    this.shot = 'fireball';
    this.isShooting = false;
    this.shoots = [];

    this.showAngle = addPointer;

}

/*
 * Update car state
 */
car.prototype.update = function() {

    // proceso los eventos de la cola
    this.processEvents();

    switch (this.state) {
        case 0:
            this.defaultMovement();
            break;
        case 1:
            this.crashMovement();
            break;
    }

    this.showAngle(this.activeAngle, this.vel);
}


/*****/
car.prototype.defaultMovement = function() {


    var angleForCalc = undefined;
    var slippingTime = 2;

    // movement
    if (this.activeAngle != this.lastAngle) {
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

    // car update
    this.posY = this.posY + deltaPosY;
    this.posX = this.posX + deltaPosX;

}


/******/
car.prototype.crashMovement = function() {
    if (this.posY > 0) {
        this.posY = this.posY + (Math.sin(this.activeAngle * (Math.PI / -180)) * this.vel);
        this.posX = this.posX + (Math.cos(this.activeAngle * (Math.PI / -180)) * this.vel);
    }
}



/*
 * Filter event
 */
car.prototype.processEvents = function() {

    var len = this.motionEngine.eventQueue.length;

    for (i = 0; i < len; i++) {
        var event = this.motionEngine.eventQueue[i];
        switch (event.type) {
            case "keyboard":
                switch (event.params.keycode) {
                    case this.keyConf.left:
                        this.activeAngle += 15;
                        if (this.activeAngle === 360)
                            this.activeAngle = 0;
                        event.isAlive = false;
                        break;
                    case this.keyConf.up:
                        this.activeMovement = "forward";
                        if (this.vel < this.maxSpeed)
                            this.vel += 0.5;
                        event.isAlive = false;
                        break;
                    case this.keyConf.right:
                        this.activeAngle -= 15;
                        if (this.activeAngle < 0)
                            this.activeAngle = 342;
                        event.isAlive = false;
                        break;
                    case this.keyConf.down:
                        this.activeMovement = "backward";
                        if (this.vel > -this.maxSpeed)
                            this.vel -= 0.5;
                        event.isAlive = false;
                        break;
                    case this.keyConf.fire:
                        this.motionEngine.addObject(new shot("shot1", this.id, this.posX, this.posY, this.activeAngle, (this.vel + 5), this.motionEngine));
                        event.isAlive = false;
                        break;
                }
                break;
            case "crash":
                this.manageCrash(event);
                break;
        }
    }
}

car.prototype.manageCrash = function(eventm) {

    var crashSide = 0;

    if (eventm.params.id === this.id && (eventm.params.object.__proto__ === car.prototype ||  eventm.params.object.__proto__ === border.prototype) ) {
        crashSide = eventm.params.type;
        eventm.isAlive = false;

        if (crashSide > 0) {
            switch (crashSide) {
                case 1:
                    if (this.activeAngle > 90 && this.activeAngle < 180) {
                        this.activeAngle = this.activeAngle - 90;
                    } else {
                        if (this.activeAngle > 180 && this.activeAngle < 270)
                            this.activeAngle = (270 + (270 - this.activeAngle));
                        if (this.activeAngle == 180)
                            this.activeAngle = 0;
                    }
                    break;
                case 2:
                    if (this.activeAngle > 270 && this.activeAngle < 360) {
                        this.activeAngle = 0 + (360 - this.activeAngle);
                    } else {
                        if (this.activeAngle > 180 && this.activeAngle < 270)
                            this.activeAngle = (90 + (this.activeAngle - 180));
                        if (this.activeAngle == 270)
                            this.activeAngle = 90;
                    }
                    break;
                case 3:
                    if (this.activeAngle > 270 && this.activeAngle < 360) {
                        this.activeAngle = 180 + (360 - this.activeAngle);
                    } else {
                        if (this.activeAngle > 0 && this.activeAngle < 90)
                            this.activeAngle = (90 + (90 - this.activeAngle));
                        if (this.activeAngle == 0)
                            this.activeAngle = 180;
                    }
                    break;
                case 4:
                    if (this.activeAngle > 0 && this.activeAngle < 90) {
                        this.activeAngle = (270 + (90 - this.activeAngle));
                    } else {
                        if (this.activeAngle > 90 && this.activeAngle < 180)
                            this.activeAngle = (180 + (180 - this.activeAngle));
                        if (this.activeAngle == 90)
                            this.activeAngle = 270;
                    }
                    break;
            }
            this.lastAngle = this.activeAngle;
        }
    }
    if(eventm.params.id === this.id && eventm.params.object.__proto__ === shot.prototype &&  eventm.params.object.ownerId !== this.id ){
        alert("explosion");
    }
}
