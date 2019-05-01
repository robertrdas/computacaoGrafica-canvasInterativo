function Line (startPt, endPt){
	this.startPt = startPt;
	this.endPt = endPt;
	this.color = getColor();
	this.ID = "LINE";
}

Line.prototype.draw = function(context, dashed = false){
	context.beginPath();
	context.moveTo(this.startPt.x,this.startPt.y);
	context.lineTo(this.endPt.x,this.endPt.y);
	context.strokeStyle = this.color;
	if(dashed) context.setLineDash([3,5]);
	context.stroke();
}

Line.prototype.pick = function(pos){
	var startCode = this.startPt.pickCode(pos);
	var endCode = this.endPt.pickCode(pos);

	if(startCode[0] == false && startCode[1] == false && startCode[2] == false && startCode[3] == false){3
		return true;
	}else if(endCode[0] == false && endCode[1] == false && endCode[2] == false && endCode[3] == false){
		return true;
	}else{
		var tmpPt = new Point(this.startPt.x,this.startPt.y);
		if(startCode[0]){
			tmpPt.y += ((pos.x-tol) - this.startPt.x)*(this.endPt.y - this.startPt.y)/(this.endPt.x - this.startPt.x)
			tmpPt.x = (pos.x-tol);
		}else if(startCode[1]){
			tmpPt.y += ((pos.x+tol) - this.startPt.x)*(this.endPt.y - this.startPt.y)/(this.endPt.x - this.startPt.x)
			tmpPt.x = (pos.x+tol);
		}else if(startCode[2]){
			tmpPt.x += ((pos.y-tol) - this.startPt.y)*(this.endPt.x - this.startPt.x)/(this.endPt.y - this.startPt.y)
			tmpPt.y = (pos.y-tol);
		}else if(startCode[3]){
			tmpPt.x += ((pos.y+tol) - this.startPt.y)*(this.endPt.x - this.startPt.x)/(this.endPt.y - this.startPt.y)
			tmpPt.y = (pos.y+tol);
		}
		startCode = tmpPt.pickCode(pos);
		if(startCode[0] == false && startCode[1] == false && startCode[2] == false && startCode[3] == false){
			return true;
		}
	}
	return false;
}

Line.prototype.highlight = function(context){

	var box = this.boundingBox();
	context.rect(box.x, box.y, box.width, box.height);
	context.strokeStyle = "rgb(0, 0, 0)";
	context.setLineDash([1,1]); 
	context.stroke();
	context.setLineDash([0,0]); 
}

Line.prototype.boundingBox = function(){
	var startX = this.startPt.x;
	var endX = this.endPt.x;
	var startY = this.startPt.y;
	var endY = this.endPt.y;
	if(this.endPt.x < startX){
		startX = this.endPt.x;
		endX = this.startPt.x;
	}
	if(this.endPt.y < startY){
		startY = this.endPt.y;
		endY = this.startPt.y;
	}
	return {x: startX, y: startY, width: endX - startX, height: endY - startY};
}

Line.prototype.translate = function(pos){
	var distX = this.startPt.x 
	var distY = this.startPt.y
	this.startPt.translate(pos);
	this.endPt.x += this.startPt.x - distX
	this.endPt.y += this.startPt.y - distY
}



Line.prototype.scale = function(posX,posY){

	var centerReta = {
		x: (this.startPt.x + this.endPt.x)/2,
		y: (this.startPt.y + this.endPt.y)/2
	}

	this.startPt = this.startPt.scaleP(posX,posY,this.startPt,centerReta) 
	this.endPt = this.endPt.scaleP(posX,posY,this.endPt,centerReta) 
}

Line.prototype.drawScale = function(posX,posY){

	var centerReta = {
		x: (this.startPt.x + this.endPt.x)/2,
		y: (this.startPt.y + this.endPt.y)/2
	}

	var starT = this.startPt.scaleP(posX,posY,this.startPt,centerReta) 
	var endT = this.endPt.scaleP(posX,posY,this.endPt,centerReta) 

	context.beginPath();
	context.moveTo(starT.x, starT.y);
	context.lineTo(endT.x, endT.y);
	context.strokeStyle = this.color;
	context.stroke();
}

Line.prototype.rotate = function(angle){
	var centerReta = {
		x: (this.startPt.x + this.endPt.x)/2,
		y: (this.startPt.y + this.endPt.y)/2
	}

	this.startPt = this.startPt.rotateP(angle, this.startPt, centerReta); //(angle,x,y,p,centro) 
	this.endPt = this.endPt.rotateP(angle, this.endPt, centerReta);
}

Line.prototype.drawRotate = function(angle){
	var centerReta = {
		x: (this.startPt.x + this.endPt.x)/2,
		y: (this.startPt.y + this.endPt.y)/2
	}

	this.startPt = this.startPt.rotateP(angle, this.startPt, centerReta); //(angle,x,y,p,centro) 
	this.endPt = this.endPt.rotateP(angle, this.endPt, centerReta);
	
	context.beginPath();
	context.moveTo(this.startPt.x, this.startPt.y);
	context.lineTo(this.endPt.x, this.endPt.y);
	context.strokeStyle = this.color;
	context.stroke();
}

Line.prototype.getCoM = function(){
	return new Point((this.endPt.x + this.startPt.x)/2,  (this.endPt.y + this.startPt.y)/2)
}

Line.prototype.getQuadrant = function(pos){
	var minXPoint, maxXPoint, minYPoint, maxYPoint;
	if(this.startPt.x < this.endPt.x){
		maxXPoint = this.endPt;
		minXPoint = this.startPt;
	}else if(this.startPt.x > this.endPt.x){
		maxXPoint = this.startPt;
		minXPoint = this.endPt;
	}
	if(this.startPt.y < this.endPt.y){
		maxYPoint = this.startPt;
		minYPoint = this.endPt;
	}else if(this.startPt.y > this.endPt.y){
		maxYPoint = this.endPt;
		minYPoint = this.startPt;
	}
	
	if(pos.x > maxXPoint.x && pos.y > maxYPoint.y && pos.y < minYPoint.y) return "right";
	if(pos.x < minXPoint.x && pos.y > maxYPoint.y && pos.y < minYPoint.y) return "left";
	if(pos.y < maxYPoint.y && pos.x < maxXPoint.x && pos.x > minXPoint.x) return "top";
	if(pos.y > minYPoint.y && pos.x < maxXPoint.x && pos.x > minXPoint.x) return "botton";
}

Line.prototype.mirror = function(orientation){ 
	var minXPoint, maxXPoint, minYPoint, maxYPoint;
	if(this.startPt.x < this.endPt.x){
		maxXPoint = this.endPt;
		minXPoint = this.startPt;
	}else if(this.startPt.x > this.endPt.x){
		maxXPoint = this.startPt;
		minXPoint = this.endPt;
	}
	if(this.startPt.y < this.endPt.y){
		maxYPoint = this.startPt;
		minYPoint = this.endPt;
	}else if(this.startPt.y > this.endPt.y){
		maxYPoint = this.endPt;
		minYPoint = this.startPt;
	}
	if (orientation == "left") {
		var distX = maxXPoint.x - minXPoint.x;
		if(this.startPt != minYPoint) this.startPt.x -= distX * 2;
		if(this.endPt != minXPoint) this.endPt.x -= distX * 2;
	}else if(orientation == "right"){
		var distX = maxXPoint.x - minXPoint.x;
		if(this.startPt != maxXPoint) this.startPt.x += distX * 2;
		if(this.endPt != maxXPoint) this.endPt.x += distX * 2;
	}else if(orientation == "top"){
		var distY = minYPoint.y - maxYPoint.y;
		if(this.startPt != maxYPoint) this.startPt.y -= distY * 2;
		if(this.endPt != maxYPoint) this.endPt.y -= distY * 2;
	}else if(orientation == "botton"){
		var distY = minYPoint.y - maxYPoint.y;
		if(this.startPt != minYPoint) this.startPt.y += distY * 2;
		if(this.endPt != minYPoint)this.endPt.y += distY * 2;
	}
}

Line.prototype.toString = function(){
	return this.ID + ";" + this.startPt.x + ";" + this.startPt.y + ";" + this.endPt.x + ";" + + this.endPt.y + ";" + this.color;
}