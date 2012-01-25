/** Border*/
function border(x0, y0, type){
	
	this.type = type;

	this.width=13;
	this.height=13;
	
	this.posX=(x0*this.width);
	this.posY=(y0*this.height);

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



