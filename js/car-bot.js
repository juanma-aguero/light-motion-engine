/** 
* CAR
* States: 
* 0 - default
* 1 - crash
* n - default
* n - default
*
*/
function carBot(initParams, addPointer){

	// Physics
	this.initParams = initParams;
	this.vel = initParams.vel;
	this.posX=initParams.posX;
	this.posY=initParams.posY;
	this.width=30;
	this.height=30;
	this.mass=1000;

	// Movement
	this.activeMovement="forward";
	this.activeAngle = 90;
	this.lastAngle = 90;
	this.counter = 0;
	
	// Renderization
	this.spriteX = (5*this.width);
	this.spriteY = 0;
	this.img = "car";
	this.isSprited = true;
	
	
	this.state = 0;
	this.circuit = undefined;
	
	this.context = undefined;
	
	this.showAngle = addPointer;
	
}



/*
 * Update carBot state
 */
carBot.prototype.update=function(ctx){
	
	this.context = ctx;
	var crashSide = this.thereIsACrash();
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
		
	}else{
		
		// Circuit control
		if( this.posX > 1000 &&
			this.posY < (this.initParams.posY-350) &&
			this.activeAngle < 180
			){
			this.activeAngle += 18;
		}
		if( this.posX < 300 &&
			this.posY < 500 &&
			this.activeAngle < 270
			){
			this.activeAngle += 18;
		}
		if( this.posX < 400 &&
			this.posY > 1000 &&
			this.activeAngle >= 270
			){
			this.activeAngle+=18;
			if(this.activeAngle == 360) this.activeAngle=0;
		}
		if( this.posX > 1000 &&
			this.posY > 1000 &&
			this.activeAngle < 90
			){
			this.activeAngle += 18;
		}

		// speed control
		if( this.vel < 2){
			this.vel += 5;
		}
		
	}
	
	switch( this.state ){
		case 0: this.defaultMovement(); break;
		case 1: this.crashMovement(); break;
	}
	
	this.updateTilesetPosition();
}


/*****/
carBot.prototype.defaultMovement = function(){
	
	var fc = this.circuit.frictionCoeficient;
	
	if(this.vel > fc){
		this.vel = this.vel-fc;
	}else{
		if(this.vel < -fc){
			this.vel = this.vel+fc;
		}else{
			this.vel = 0;
		}
	}
	
	var angleForCalc = undefined;
	var slippingTime = (0.5/fc);
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
	
	// carBot update
	this.posY=this.posY+deltaPosY;
	this.posX=this.posX+deltaPosX;
	

	// check boundaries
	if( this.posY >= this.circuit.height){
		alert("Max height reached: " + this.posY);
		this.vel = 0;
	}
	if( this.posX >= this.circuit.width){
		alert("Max width reached : " + this.posX);
		this.vel = 0;
	}
}


/******/
carBot.prototype.crashMovement = function(){
	if( this.posY > 0){
			this.posY=this.posY+(Math.sin(this.activeAngle*(Math.PI/-180))*this.vel);
			this.posX=this.posX+(Math.cos(this.activeAngle*(Math.PI/-180))*this.vel);
	}
}


/******/
carBot.prototype.thereIsACrash = function(){
	var intersectionsCount = 0;
	for (var i=0; i<this.circuit.borders.length; i++){
		intersectionsCount = this.intersection(this, this.circuit.borders[i]);
		if( intersectionsCount > 0){
			break;
		}
	}
	return intersectionsCount;
}


/** interseccion */
carBot.prototype.intersection = function(object1, object2){
	var response = 0;
	
	// Upper left corner
	if( 
		( object1.posX < (object2.posX+object2.width) ) && 
		(object1.posY < (object2.posY+object2.height)) &&
		(object1.posX >= object2.posX) && 
		(object1.posY >= object2.posY) 
			){
		var sideSum4 = ((object2.posX+object2.width)-object1.posX);
		var sideSum1 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum1 > sideSum4){
			response = 1;
		}else{
			response = 4;
		}
	}
	
	// Down left corner
	if( 
		( object1.posX < (object2.posX+object2.width) ) && 
		(object1.posX >= object2.posX) && 
		((object1.posY+object1.height) < (object2.posY+object2.height)) &&
		((object1.posY+object1.height) >= object2.posY)
			){
		var sideSum2 = ((object2.posX+object2.width)-object1.posX);
		var sideSum1 = ((object1.posY+object1.height)-object2.posY);
		if( sideSum1 > sideSum2){
			response = 1;
		}else{
			response = 2;
		}
	}
	
	// Down right corner
	if( 
		((object1.posX+object1.width) < (object2.posX+object2.width) ) && 
		((object1.posX+object1.width) > object2.posX) && 
		((object1.posY+object1.height) < (object2.posY+object2.height)) &&
		((object1.posY+object1.height) >= object2.posY)
			){
		var sideSum3 = ((object2.posX+object2.width)-object1.posX);
		var sideSum2 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum2 > sideSum3){
			response = 2;
		}else{
			response = 3;
		}
	}
	
	// Upper right corner
	if( 
		((object1.posX+object1.width) <= (object2.posX+object2.width) ) && 
		((object1.posX+object1.width) >= object2.posX) && 
		((object1.posY) <= (object2.posY+object2.height)) &&
		((object1.posY) >= object2.posY)
			){
		var sideSum4 = ((object1.posX+object1.width)-object2.posX);
		var sideSum3 = ((object2.posY+object2.height)-object1.posY);
		if( sideSum3 > sideSum4){
			response = 3;
		}else{
			response = 4;
		}
	}
	
	return response;
}


carBot.prototype.updateTilesetPosition = function(){
    var pos = (this.activeAngle/18);
    this.spriteX = (pos * this.width);
    this.spriteY = 0;
}




/*
 * Filter event
 */
carBot.prototype.notify=function(e){
	
	
}
