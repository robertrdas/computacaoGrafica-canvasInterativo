function Polygon (points){
	this.vertices = points;
	this.color = getColor();
	this.ID = "POLYGON";
}

Polygon.prototype.draw = function(context){
	for (var i = 0; i < this.vertices.length - 1; i++){
		var edge = new Line(this.vertices[i], this.vertices[i + 1]);
		edge.draw(context);
	}

	var finalEdge = new Line(this.vertices[this.vertices.length-1], this.vertices[0]);
	finalEdge.draw(context);
}

Polygon.prototype.pick = function(pos){
	var cout = 0;
	for (var i = 0; i < this.vertices.length; i++){
		if(this.vertices[i].pick(pos) == true)
			return true;
	}
	for(var i = 0; i < this.vertices.length - 1; i++){
		var x0, x1, y0, y1;
		if(this.vertices[i].y < this.vertices[i+1].y){
			x0 = this.vertices[i].x;
			x1 = this.vertices[i+1].x;
			y0 = this.vertices[i].y;
			y1 = this.vertices[i+1].y;
		}else{
			x0 = this.vertices[i+1].x;
			x1 = this.vertices[i].x;
			y0 = this.vertices[i+1].y;
			y1 = this.vertices[i].y;
		}

		if(pos.y > y0 && pos.y < y1 && (pos.x > x0 || pos.x > x1)){
			if((pos.x < x0 && pos.x < x1)){
				cout += 1;
			}else{
				var dx = x0 - x1;
				var xc = x0;
				if(dx != 0){
					xc += ( pos.y - y0 ) * dx / ( y0 - y1 );
				}
				if(pos.x > xc){
					cout += 1;
				}
			}
		}
	}

	if(this.vertices[this.vertices.length-1].y < this.vertices[0].y){
		x0 = this.vertices[this.vertices.length-1].x;
		x1 = this.vertices[0].x;
		y0 = this.vertices[this.vertices.length-1].y;
		y1 = this.vertices[0].y;
	}else{
		x0 = this.vertices[0].x;
		x1 = this.vertices[this.vertices.length-1].x;
		y0 = this.vertices[0].y;
		y1 = this.vertices[this.vertices.length-1].y;
	}

	if(pos.y > y0 && pos.y < y1 && (pos.x > x0 || pos.x > x1)){
		if((pos.x < x0 && pos.x < x1)){
			cout += 1;
		}else{
			var dx = x0 - x1;
			var xc = x0;
			if(dx != 0){
				xc += ( pos.y - y0 ) * dx / ( y0 - y1 );
			}
			if(pos.x > xc){
				cout += 1;
			}
		}
	}
	if(cout%2 == 1){
		return true;
	}

	return false;
}

Polygon.prototype.highlight = function(context){
	var box = this.boundingBox();
	context.rect(box.x, box.y, box.width, box.height);
	context.strokeStyle = "rgb(0,0,0)"
	context.setLineDash([1,3]); 
	context.stroke();
	context.setLineDash([0,0]); 
}

Polygon.prototype.boundingBox = function(){
	var minX = canvas.width;
	var maxX = 0;
	var minY = canvas.height;
	var maxY = 0;
	for (var i = 0; i < this.vertices.length; i++){
		if(this.vertices[i].x < minX){
			minX = this.vertices[i].x;
		}
		if(this.vertices[i].x > maxX){
			maxX = this.vertices[i].x;
		}
		if(this.vertices[i].y < minY){
			minY = this.vertices[i].y;
		}
		if(this.vertices[i].y > maxY){
			maxY = this.vertices[i].y;
		}
	}
	return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
}

Polygon.prototype.translate = function(pos){
	var distX = this.vertices[0].x
	var distY = this.vertices[0].y
	this.vertices[0].translate(pos);
	for(var i = 1; i < this.vertices.length; i++){
		this.vertices[i].x += this.vertices[0].x - distX
		this.vertices[i].y += this.vertices[0].y - distY
	}
}

Polygon.prototype.scale = function(posX,posY){
	var x = 0
	var y = 0 
	for(var i = 0; i < this.vertices.length;i++){
		x += this.vertices[i].x
		y += this.vertices[i].y
	}
	centerPoly = {
		x: x/this.vertices.length,
		y: y/this.vertices.length
	}

	for(var i = 0; i < this.vertices.length;i++){
		this.vertices[i] = this.vertices[i].scaleP(posX,posY,this.vertices[i],centerPoly) 
	}

}

Polygon.prototype.drawScale = function(rate, xPos, yPos){
	context.strokeStyle = this.color;
	var x = 0
	var y = 0 
	for(var i = 0; i < this.vertices.length;i++){
		x += this.vertices[i].x
		y += this.vertices[i].y
	}
	centerPoly = {
		x: x/this.vertices.length,
		y: y/this.vertices.length
	}

	for(var i = 0;i<this.vertices.length-1;i++){
		context.beginPath();
		var t = this.vertices[i].scaleP(xPos,yPos,this.vertices[i],centerPoly)

		context.moveTo(t.x, t.y)

		var t1 = this.vertices[i+1].scaleP(xPos,yPos,this.vertices[i+1],centerPoly)
		context.lineTo(t1.x, t1.y)
		context.stroke()
	}
	context.beginPath();
	var t2 = this.vertices[this.vertices.length-1].scaleP(xPos,yPos,this.vertices[this.vertices.length-1],centerPoly)
	context.moveTo(t2.x, t2.y);
	var t3 = this.vertices[0].scaleP(xPos,yPos,this.vertices[0],centerPoly)
	context.lineTo(t3.x, t3.y)
	context.stroke();
}


Polygon.prototype.rotate = function(angle){
	var x = 0
	var y = 0 
	for(var i = 0; i < this.vertices.length;i++){
		x += this.vertices[i].x
		y += this.vertices[i].y
	}
	centerPoly = {
		x: x/this.vertices.length,
		y: y/this.vertices.length
	}

	for(var i = 0; i < this.vertices.length;i++){
		this.vertices[i] = this.vertices[i].rotateP(angle, this.vertices[i], centerPoly)  
	}
	
}

Polygon.prototype.drawRotate = function(angle){
	context.strokeStyle = this.color;
	var x = 0
	var y = 0 
	for(var i = 0; i < this.vertices.length;i++){
		x += this.vertices[i].x
		y += this.vertices[i].y
	}
	centerPoly = {
		x: x/this.vertices.length,
		y: y/this.vertices.length
	}

	for(var i = 0;i<this.vertices.length-1;i++){
		context.beginPath();
		var t = this.vertices[i].rotateP(angle,this.vertices[i],centerPoly)

		context.moveTo(t.x, t.y)

		var t1 = this.vertices[i+1].rotateP(angle,this.vertices[i+1],centerPoly)
		context.lineTo(t1.x, t1.y)
		context.stroke()
	}
	context.beginPath();
	var t2 = this.vertices[this.vertices.length-1].rotateP(angle,this.vertices[this.vertices.length-1],centerPoly)
	context.moveTo(t2.x, t2.y);
	var t3 = this.vertices[0].rotateP(angle,this.vertices[0],centerPoly)
	context.lineTo(t3.x, t3.y)
	context.stroke();
}

Polygon.prototype.getQuadrant = function(pos){
	var minXPoint = this.vertices[0];
	var maxXPoint = this.vertices[0];
	var minYPoint = this.vertices[0];
	var maxYPoint = this.vertices[0];
	for(var i = 1; i < this.vertices.length; i++){
		if(this.vertices[i].x < minXPoint.x){
			minXPoint = this.vertices[i];
		}
		if(this.vertices[i].x > maxXPoint.x){
			maxXPoint = this.vertices[i];
		}
		if(this.vertices[i].y < minYPoint.y){
			minYPoint = this.vertices[i];
		}
		if(this.vertices[i].y > maxYPoint.y){
			maxYPoint = this.vertices[i];
		}
	}

	if(pos.x > maxXPoint.x && pos.y < maxYPoint.y && pos.y > minYPoint.y) return "right";
	if(pos.x < minXPoint.x && pos.y < maxYPoint.y && pos.y > minYPoint.y) return "left";
	if(pos.y < maxYPoint.y && pos.x < maxXPoint.x && pos.x > minXPoint.x) return "top";
	if(pos.y > minYPoint.y && pos.x < maxXPoint.x && pos.x > minXPoint.x) return "botton";
}

Polygon.prototype.mirror = function(orientation){ 
	if (orientation == "left") {
		var minPoint = this.vertices[0];
		for(var i = 1; i < this.vertices.length; i++){
			if(this.vertices[i].x < minPoint.x){
				minPoint = this.vertices[i];
			}
		}
		for(var i = 0; i < this.vertices.length; i++){
			var distX = this.vertices[i].x - minPoint.x;
			this.vertices[i].x -= distX * 2;
		}
	}else if(orientation == "right"){
		var maxPoint = this.vertices[0];
		for(var i = 1; i < this.vertices.length; i++){
			if(this.vertices[i].x > maxPoint.x){
				maxPoint = this.vertices[i];
			}
		}
		for(var i = 0; i < this.vertices.length; i++){
			var distX = maxPoint.x - this.vertices[i].x;
			this.vertices[i].x += distX * 2;
		}
	}else if(orientation == "top"){
		var maxPoint = this.vertices[0];
		for(var i = 1; i < this.vertices.length; i++){
			if(this.vertices[i].y < maxPoint.y){
				maxPoint = this.vertices[i];
			}
		}
		for(var i = 0; i < this.vertices.length; i++){
			var distY = this.vertices[i].y - maxPoint.y;
			this.vertices[i].y -= distY * 2;
		}
	}else if(orientation == "botton"){
		var minPoint = this.vertices[0];
		for(var i = 1; i < this.vertices.length; i++){
			if(this.vertices[i].y > minPoint.y){
				minPoint = this.vertices[i];
			}
		}
		for(var i = 0; i < this.vertices.length; i++){
			var distY = minPoint.y - this.vertices[i].y;
			this.vertices[i].y += distY * 2
		}
	}
}


Polygon.prototype.area = function(){
	var area = 0;
	for(var i = 1; i+1 < this.vertices.length; i++){
		var x1 = this.vertices[i].x - this.vertices[0].x;
		var y1 = this.vertices[i].y - this.vertices[0].y;
	    var x2 = this.vertices[i+1].x - this.vertices[0].x;
	    var y2 =  this.vertices[i+1].y - this.vertices[0].y;
	    var cross = x1*y2 - x2*y1;
	    area += cross; 
	}
	alert(Math.abs(area/2.0).toFixed(2) + " und².");
}

Polygon.prototype.toString = function(){
	var str = this.ID;
	for(var i = 0; i < this.vertices.length; i++){
		str += ";" + this.vertices[i].x + ";" + this.vertices[i].y;
	}
	str += ";" + this.color;
	return str;
}