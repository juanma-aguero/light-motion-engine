/*********************
 * GAME class
 *
 */
function game(addPointer) {
	// Context
	this.ctx = undefined;

	// Objects
	this.objects = [];

	// keyconfs
	var keyConf1 = {
		up : 'arrow-up',
		down : 'arrow-down',
		left : 'arrow-left',
		right : 'arrow-right'
	};

	var youConf = {
		posX : 100,
		posY : 610,
		vel : 0
	};
	var botConf = {
		posX : 500,
		posY : 200,
		vel : 4
	};

	// Controlled Objects
	this.objects.push(new car(100, 200, addPointer, keyConf1));
	this.objects.push(new carBot(botConf, addPointer));

	this.circuit = new circuit();

	for(var i = 0; i < this.circuit.borders.length; i++) {
		this.objects.push(this.circuit.borders[i]);
	}

	this.activeKeys = [];

	this.intLoop = null;
}

/*
 * Draw objects on canvas
 */
game.prototype.drawObject = function(object) {
	this.ctx.fillRect(object.posX, object.posY, object.width, object.height)
}
/*
 * Delete objects on canvas
 */
game.prototype.deleteObject = function(object) {
	this.ctx.clearRect(object.posX, object.posY, object.width, object.height);
}
/*
 * Init game functionalitys
 */
game.prototype.init = function() {
	var canvas = document.getElementById("canvas-layer");
	this.ctx = canvas.getContext("2d");

	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].circuit = this.circuit;
	}

	this.startLoop();

}

game.prototype.startLoop = function() {
	var gameInstance = this;

	function loop() {

		// delete old objects
		for(var i = 0; i < gameInstance.objects.length; i++) {
			gameInstance.deleteObject(gameInstance.objects[i]);
		}

		// update states
		gameInstance.update();

		// draw new objects
		for(var i = 0; i < gameInstance.objects.length; i++) {
			gameInstance.drawObject(gameInstance.objects[i]);
		}

	}


	this.stop();

	this.intLoop = setInterval(loop, 30);
}
/*
 * Stop game
 */
game.prototype.stop = function() {
	clearInterval(this.intLoop);
}
/*
 * Update all components
 */
game.prototype.update = function() {

	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].update(this.ctx);
	}

}
/*
 * Notify event to all components
 */
game.prototype.notify = function(e, event) {

	var mapped = getValue(e);

	if(event == 'keydown') {
		this.activeKeys.push(mapped);
	}
	if(event == 'keyup') {
		this.activeKeys.splice(this.activeKeys.indexOf(mapped), 1);
	}

	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].notify(this.activeKeys);
	}
}
function getValue(e) {
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
		default:
			return 'unknown';
			break;
	}
}