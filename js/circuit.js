/** Rect*/
function circuit(id){
	this.id = id;
	this.width=800;
	this.height=800;
	this.state = 0;
	this.clock = 0;
	this.frictionCoeficient = 0.05;
	this.borders = [];
	
	this.intersectable = false;
	
	this.build();
	
}

circuit.prototype.build=function(){
/*
	////// BORDER - INTERNAL
	//left
	for(var i=12; i<=32; i++){
		this.borders.push(new border( i, 12, 'internal'));
	}
	//right
	for(var i=12; i<=32; i++){
		this.borders.push(new border( i, 32, 'internal'));
	}
	//bottom
	for(var i=13; i<=31; i++){
		this.borders.push(new border( 32, i, 'internal'));
	}
	//top
	for(var i=13; i<=31; i++){
		this.borders.push(new border( 12, i, 'internal'));
	}
	*/
	
	////// BORDER - EXTERNAL
	//left
	for(var i=2; i<=42; i++){
		this.borders.push(new border( "border"+i+2, i, 2, 'external'));
	}
	//right
	for(var i=2; i<=42; i++){
		this.borders.push(new border( "border"+i+42, i, 42, 'external'));
	}
	//bottom
	for(var i=3; i<=41; i++){
		this.borders.push(new border( "border"+43+i, 43, i, 'external'));
	}
	//top
	for(var i=3; i<=41; i++){
		this.borders.push(new border( "border"+2+i, 2, i, 'external'));
	}
	
}


/*
 * Update circuit state
 */
circuit.prototype.update=function(car){

}


/*
 * Filter event
 */
circuit.prototype.notify=function(e){

}
