/*********************
 * GAME class
 *
 */
function motionEngine(addPointer) {
	// Context
	this.ctx = undefined;

	// Objects
	this.objects = [];

	// Events
	this.eventQueue = [];

	this.intLoop = null;
}

/*
 * Add objects to engine
 */
motionEngine.prototype.addObject = function(object) {
	this.objects.push(object);
}
/*
 * Draw objects on canvas
 */
motionEngine.prototype.drawObject = function(object) {
		this.ctx.save();
		this.ctx.translate(object.posX, object.posY);
		this.ctx.rotate((-object.activeAngle) * Math.PI/180);
//		this.ctx.fillStyle = object.color;
//		this.ctx.fillRect(-(object.width/2), -(object.height/2), object.width, object.height);
                this.ctx.drawImage(object.img, -(object.width/2), -(object.height/2), object.width, object.height);
		this.ctx.restore();
}
/*
 * Delete objects on canvas
 */
motionEngine.prototype.clearScreen = function(object) {
	//this.ctx.clearRect(object.posX, object.posY, object.width, object.height);
	this.ctx.clearRect(0, 0, 700, 700);
}
/*
 * Init motionEngine functionalitys
 */
motionEngine.prototype.init = function() {
	var canvas = document.getElementById("canvas-layer");
	this.ctx = canvas.getContext("2d");

	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].circuit = this.circuit;
	}

	this.startLoop();

}

motionEngine.prototype.startLoop = function() {
	var motionEngineInstance = this;

	function loop() {
		// delete old objects
		motionEngineInstance.clearScreen();

		// update states
		motionEngineInstance.update();

		// draw new objects
		for(var i = 0; i < motionEngineInstance.objects.length; i++) {
			if(motionEngineInstance.objects[i].isVisible){
				motionEngineInstance.drawObject(motionEngineInstance.objects[i]);
			}
		}
	}


	this.stop();
	this.intLoop = setInterval(loop, 30);
}
/*
 * Stop motionEngine
 */
motionEngine.prototype.stop = function() {
	clearInterval(this.intLoop);
}
/*
 * Update all components
 */
motionEngine.prototype.update = function() {
	
	this.clearQueue();

	for(var i = 0; i < this.objects.length; i++) {

		var actual = this.objects[i];

		for(var j = 0; j < this.objects.length; j++) {
			if(i != j && this.objects[j].intersectable) {
				var comparado = this.objects[j];
				var thereIsACrash = this.intersection(actual, comparado);
				if(thereIsACrash > 0) {
					this.pushEvent(new event("crash", {
						"id" : this.objects[i].id,
						"object" : this.objects[j],
						"type" : thereIsACrash
					}));
					this.pushEvent(new event("crash", {
						"id" : this.objects[j].id,
                                                "object" : this.objects[i],
						"type" : thereIsACrash
					}));
				}
			}
		}

		this.objects[i].update();
	}
}
/*
 * Notify event to all components
 */
motionEngine.prototype.pushEvent = function(event) {
	this.eventQueue.push(event);
}

motionEngine.prototype.popEvent = function(event) {
	this.eventQueue.splice(this.eventQueue.indexOf(event), 1);
}
/*
 * interseccion
 */
motionEngine.prototype.intersection = function(object1, object2) {
	var response = 0;

	// Upper left corner
	if((object1.posX < (object2.posX + object2.width) ) && (object1.posY < (object2.posY + object2.height)) && (object1.posX >= object2.posX) && (object1.posY >= object2.posY)) {
		var sideSum4 = ((object2.posX + object2.width) - object1.posX);
		var sideSum1 = ((object2.posY + object2.height) - object1.posY);
		if(sideSum1 > sideSum4) {
			response = 1;
		} else {
			response = 4;
		}
	}

	// Down left corner
	if((object1.posX < (object2.posX + object2.width) ) && (object1.posX >= object2.posX) && ((object1.posY + object1.height) < (object2.posY + object2.height)) && ((object1.posY + object1.height) >= object2.posY)) {
		var sideSum2 = ((object2.posX + object2.width) - object1.posX);
		var sideSum1 = ((object1.posY + object1.height) - object2.posY);
		if(sideSum1 > sideSum2) {
			response = 1;
		} else {
			response = 2;
		}
	}

	// Down right corner
	if(((object1.posX + object1.width) < (object2.posX + object2.width) ) && ((object1.posX + object1.width) > object2.posX) && ((object1.posY + object1.height) < (object2.posY + object2.height)) && ((object1.posY + object1.height) >= object2.posY)) {
		var sideSum3 = ((object2.posX + object2.width) - object1.posX);
		var sideSum2 = ((object2.posY + object2.height) - object1.posY);
		if(sideSum2 > sideSum3) {
			response = 2;
		} else {
			response = 3;
		}
	}

	// Upper right corner
	if(((object1.posX + object1.width) <= (object2.posX + object2.width) ) && ((object1.posX + object1.width) >= object2.posX) && ((object1.posY) <= (object2.posY + object2.height)) && ((object1.posY) >= object2.posY)) {
		var sideSum4 = ((object1.posX + object1.width) - object2.posX);
		var sideSum3 = ((object2.posY + object2.height) - object1.posY);
		if(sideSum3 > sideSum4) {
			response = 3;
		} else {
			response = 4;
		}
	}

	return response;
}

motionEngine.prototype.clearQueue = function() {
	var len = this.eventQueue.length;
	var eventQueueTemp = [];

	for( var i = 0; i < len; i++) {
		var eventm = this.eventQueue[i];
		if(eventm.isAlive) {
			eventQueueTemp.push(eventm);
		}
	}
	this.eventQueue = eventQueueTemp;
}

motionEngine.prototype.getMapped = function(e) {
	switch(e) {
		case 38:
			return 'arrow-up';
			break;
		case 40:
			return 'arrow-down';
			break;
		case 37:
			return 'arrow-left';
			break;
		case 39:
			return 'arrow-right';
			break;
		case 87:
			return 'key-w';
			break;
		case 83:
			return 'key-s';
			break;
		case 65:
			return 'key-a';
			break;
		case 68:
			return 'key-d';
			break;
		case 70:
			return 'key-fire';
			break;
		default:
			return 'unknown';
			break;
	}
}

motionEngine.prototype.distanceBetween = function(object1, object2){
	var x = object1.posX-object2.posX;
	var y = object1.posY-object2.posY;
	
	var hyp = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
	
	return hyp;
}

motionEngine.prototype.giveMeWhatISee = function(object){
	var toReturn = [];
	for(var i=0; i<this.objects.length; i++){
		var distance = this.distanceBetween(object, this.objects[i]);
		var ang = this.getAngleToFollow(object, this.objects[i]);
		if( ang > (object.activeAngle-30) &&  ang < (object.activeAngle+30) && distance < 100){
			toReturn.push(this.objects[i]);
		}
	}
    //toReturn.push(this.objects[0]);
	return toReturn;
}

motionEngine.prototype.getAngleToFollow = function(object, object2follow){
	var equis = object2follow.posX-object.posX;
	var hi = object2follow.posY-object.posY;

	// les saco el signo
	unsignedEquis = Math.sqrt( Math.pow(equis, 2) );
	unsignedHi = Math.sqrt( Math.pow(hi, 2) );
	
	var hipotenu = Math.sqrt(Math.pow(unsignedHi, 2) + Math.pow(unsignedEquis, 2));
	
	var radians = Math.asin(unsignedHi/hipotenu);
	var ang = ( radians * (180 / Math.PI) );
	
	var d = 0;
	
	if( equis > 0 && hi > 0){
		d = (270 + (90-ang));
	}
	if( equis > 0 && hi < 0){
		d = ang;
	}
	if( equis < 0 && hi > 0){
		d = (180+ang);
	}
	if( equis < 0 && hi < 0){
		d = (90 + (180-ang));
	}
	
	return d;
}
