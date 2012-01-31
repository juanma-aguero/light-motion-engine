/** Border*/
function border(id, x0, y0, type){
	
	this.color = "black";
	
	this.id = id;
	
	this.type = type;

	this.width=12;
	this.height=12;
	
	this.posX=(x0*13);
	this.posY=(y0*13);
	
	this.intersectable = true;

	this.state = 0;

}


/*
 * Update border state
 */
border.prototype.update=function(car){

}


/*
 * Filter event
 */
border.prototype.notify=function(e){

	
}



