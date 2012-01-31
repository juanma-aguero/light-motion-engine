/**
 * CAR
 * States:
 * 0 - default
 * 1 - crash
 * n - default
 * n - default
 *
 */
function carBot(id, initParams, addPointer, motionEngine, behaviour) {

	// Object
	this.id = id;
	this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

	this.behaviour = behaviour;

	// Physics
	this.initParams = initParams;
	this.vel = initParams.vel;
	this.posX = initParams.posX;
	this.posY = initParams.posY;
	this.width = 30;
	this.height = 30;
	this.mass = 1000;

	// Motion engine
	this.motionEngine = motionEngine;

	// Movement
	this.activeMovement = "forward";
	this.activeAngle = Math.floor(Math.random() * 360);
	this.lastAngle = 90;
	this.counter = 0;
	this.intersectable = true;

	// Renderization
	this.spriteX = (5 * this.width);
	this.spriteY = 0;
	this.img = "car";
	this.isSprited = true;

	this.state = 0;
	this.circuit = undefined;

	this.showAngle = addPointer;

}

/*
 * Update carBot state
 */
carBot.prototype.update = function() {

	this.processEvents();

	this.counter++;

	// thinking
	this.think();

	switch( this.state ) {
		case 0:
			this.defaultMovement();
			break;
		case 1:
			this.crashMovement();
			break;
	}

}
/*****/
carBot.prototype.defaultMovement = function() {

	var angleForCalc = undefined;
	var slippingTime = 2;

	// movement
	angleForCalc = this.activeAngle;

	var deltaPosY = (Math.sin(angleForCalc * (Math.PI / -180)) * this.vel);
	var deltaPosX = (Math.cos(angleForCalc * (Math.PI / -180)) * this.vel);

	// carBot update
	this.posY = this.posY + deltaPosY;
	this.posX = this.posX + deltaPosX;

}
/******/
carBot.prototype.crashMovement = function() {
	if(this.posY > 0) {
		this.posY = this.posY + (Math.sin(this.activeAngle * (Math.PI / -180)) * this.vel);
		this.posX = this.posX + (Math.cos(this.activeAngle * (Math.PI / -180)) * this.vel);
	}
}

carBot.prototype.processEvents = function() {

	var len = this.motionEngine.eventQueue.length;

	for( i = 0; i < len; i++) {
		var eventm = this.motionEngine.eventQueue[i];
		switch(eventm.type) {
			case "crash":
				this.manageCrash(eventm);
				break;
		}
	}
}

carBot.prototype.manageCrash = function(eventm) {

	var crashSide = 0;

	if(eventm.params.id == this.id) {
		crashSide = eventm.params.type;
		eventm.isAlive = false;
	}

	if(crashSide > 0) {
		switch(crashSide) {
			case 1:
				if(this.activeAngle > 90 && this.activeAngle < 180) {
					this.activeAngle = this.activeAngle - 90;
				} else {
					if(this.activeAngle > 180 && this.activeAngle < 270)
						this.activeAngle = (270 + (270 - this.activeAngle));
					if(this.activeAngle == 180)
						this.activeAngle = 0;
				}
				break;
			case 2:
				if(this.activeAngle > 270 && this.activeAngle < 360) {
					this.activeAngle = 0 + (360 - this.activeAngle);
				} else {
					if(this.activeAngle > 180 && this.activeAngle < 270)
						this.activeAngle = (90 + (this.activeAngle - 180));
					if(this.activeAngle == 270)
						this.activeAngle = 90;
				}
				break;
			case 3:
				if(this.activeAngle > 270 && this.activeAngle < 360) {
					this.activeAngle = 180 + (360 - this.activeAngle);
				} else {
					if(this.activeAngle > 0 && this.activeAngle < 90)
						this.activeAngle = (90 + (90 - this.activeAngle));
					if(this.activeAngle == 0)
						this.activeAngle = 180;
				}
				break;
			case 4:
				if(this.activeAngle > 0 && this.activeAngle < 90) {
					this.activeAngle = (270 + (90 - this.activeAngle));
				} else {
					if(this.activeAngle > 90 && this.activeAngle < 180)
						this.activeAngle = (180 + (180 - this.activeAngle));
					if(this.activeAngle == 90)
						this.activeAngle = 270;
				}
				break;
		}
		this.lastAngle = this.activeAngle;

	}
}

carBot.prototype.think = function() {

	var haveChild = this.counter % 95;

	if(haveChild == 0) {
		//this.activeAngle = Math.floor(Math.random() * 360);
		//this.motionEngine.addObject(new carBot(this.motionEngine.objects.length + 1, this.initParams, addPointer, this.motionEngine, this.behaviour));
	}
	
	// aim to	
	if( (this.counter % 50) == 0 ){
		
		var objectsInSight = this.motionEngine.giveMeWhatISee();
		for(var i=0; i<objectsInSight.length; i++){
			if(objectsInSight[i].followable){
				this.activeAngle = this.motionEngine.getAngleToFollow(this, objectsInSight[i]);	
			}
			
		}
	}

}