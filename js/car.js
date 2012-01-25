/** 
* CAR
* States: 
* 0 - default
* 1 - crash
* n - default
* n - default
*
*/
function car(id, iniX, iniY, addPointer, keyConf, motionEngine){

	// Object
	this.id = id;
	
	// Physics
	this.vel = 0;
	this.posX=iniX;
	this.posY=iniY;
	this.width=30;
	this.height=30;
	this.mass=1000;
	this.maxSpeed=6;
	
	// Motion engine
	this.motionEngine = motionEngine;

	// key configuration
	this.keyConf = keyConf;
	
	// Movement
	this.activeMovement="forward";
	this.activeAngle = 90;
	this.lastAngle = 90;
	this.counter = 0;
	this.intersectable = true;
	
	// Renderization
	this.spriteX = (5*this.width);
	this.spriteY = 0;
	this.img = "car";
	this.isSprited = true;
	
	
	this.state = 0;
	this.circuit = undefined;
	
	// Weapon
	this.shot = 'fireball';
	this.isShooting = false;
	this.shoots=[];
	
	this.showAngle = addPointer;
	
}

/*
 * Update car state
 */
car.prototype.update=function(){
	
	// proceso los eventos de la cola
	this.processEvents();

	switch( this.state ){
		case 0: this.defaultMovement(); break;
		case 1: this.crashMovement(); break;
	}
	
	this.updateTilesetPosition();
	this.showAngle(this.activeAngle, this.vel);
}


/*****/
car.prototype.defaultMovement = function(){
	
	// var fc = this.circuit.frictionCoeficient;
	
	// if(this.vel > fc){
		// this.vel = this.vel-fc;
	// }else{
		// if(this.vel < -fc){
			// this.vel = this.vel+fc;
		// }else{
			// this.vel = 0;
		// }
	// }
	
	var angleForCalc = undefined;
	//var slippingTime = ((this.vel/60)/fc);
	var slippingTime = 2;
	
	// movement
	if(this.activeAngle != this.lastAngle){
		if(this.counter < slippingTime){
			angleForCalc = this.lastAngle;
			this.counter++;
		}else{
			this.counter = 0;
			this.lastAngle = this.activeAngle;
			angleForCalc = this.lastAngle;
		}
	}else{
		angleForCalc = this.activeAngle;
	}
	
	var deltaPosY = (Math.sin(angleForCalc*(Math.PI/-180))*this.vel);
	var deltaPosX = (Math.cos(angleForCalc*(Math.PI/-180))*this.vel);
	
	// car update
	this.posY=this.posY+deltaPosY;
	this.posX=this.posX+deltaPosX;
	
}


/******/
car.prototype.crashMovement = function(){
	if( this.posY > 0){
			this.posY=this.posY+(Math.sin(this.activeAngle*(Math.PI/-180))*this.vel);
			this.posX=this.posX+(Math.cos(this.activeAngle*(Math.PI/-180))*this.vel);
	}
}


/******/
car.prototype.thereIsACrash = function(){
	var intersectionsCount = 0;
	for (var i=0; i<this.circuit.borders.length; i++){
		intersectionsCount = this.intersection(this, this.circuit.borders[i]);
		if( intersectionsCount > 0){
			break;
		}
	}
	return intersectionsCount;
}



car.prototype.updateTilesetPosition = function(){
    var pos = (this.activeAngle/18);
    this.spriteX = (pos * this.width);
    this.spriteY = 0;
}




/*
 * Filter event
 */
car.prototype.processEvents=function(){
	
	var len = this.motionEngine.eventQueue.length;
	
	for (i=0; i<len; i++){
		var event = this.motionEngine.eventQueue[i];
		switch(event.type){
			case "keyboard":
				switch( event.params.keycode ){
					case this.keyConf.left:
						  this.activeAngle+=18;
						  if(this.activeAngle == 360) this.activeAngle=0;
						  this.motionEngine.popEvent(event);
					  break;
					case this.keyConf.up:
					  this.activeMovement = "forward";
					  if(this.vel < this.maxSpeed) this.vel+=0.5;
					  this.motionEngine.popEvent(event);
					  break;
					case this.keyConf.right:
						  this.activeAngle-=18;
						  if(this.activeAngle < 0) this.activeAngle = 342;
						  this.motionEngine.popEvent(event);
					  break;
					case this.keyConf.down:
					  this.activeMovement = "backward";
					  if(this.vel > -this.maxSpeed) this.vel-=0.5;
					  this.motionEngine.popEvent(event);
					  break;
				}
				break;
			case "crash":
				this.manageCrash(event);
				break;
		}
	}
}

car.prototype.manageCrash=function(event){
	if(crashSide > 0 ){
		switch(crashSide){
			case 1:
				if( this.activeAngle > 90 && this.activeAngle < 180  ){
					this.activeAngle = this.activeAngle - 90;
				}else{
					if( this.activeAngle > 180 && this.activeAngle < 270  )	this.activeAngle=(270+(270-this.activeAngle));
					if(this.activeAngle==180) this.activeAngle = 0;
				}
				break;
			case 2:
				if( this.activeAngle > 270 && this.activeAngle < 360 ){
					this.activeAngle = 0+(360 - this.activeAngle);
				}else{
					if( this.activeAngle > 180 && this.activeAngle < 270  )	this.activeAngle = (90+(this.activeAngle-180));
					if( this.activeAngle == 270)this.activeAngle = 90;
				}
				break;
			case 3:
				if( this.activeAngle > 270 && this.activeAngle < 360 ){
					this.activeAngle = 180+(360-this.activeAngle);
				}else{
					if( this.activeAngle > 0 && this.activeAngle < 90  )this.activeAngle = (90+(90-this.activeAngle));
					if( this.activeAngle == 0)this.activeAngle = 180;
				}
				break;
			case 4:
				if( this.activeAngle > 0 && this.activeAngle < 90  )	{
					this.activeAngle = (270+(90-this.activeAngle));
				}else{
					if( this.activeAngle > 90 && this.activeAngle < 180  )this.activeAngle = (180+(180-this.activeAngle));
					if( this.activeAngle == 90)this.activeAngle = 270;
				}
				break;
		}
		this.lastAngle = this.activeAngle;
		
	}	
}