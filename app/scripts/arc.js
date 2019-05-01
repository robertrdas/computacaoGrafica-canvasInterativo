function Arc (center, radius, start, end){
	this.center = center;
	this.radius = radius;
	this.start = start;
	this.end = end;
	this.color = getColor();
	this.ID = "ARC";
}

Arc.prototype.draw = function (context, dashed = false){
	context.beginPath();
	context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2, true);
	context.strokeStyle = this.color;
	context.stroke();
	if(dashed) context.setLineDash([0,0]);
}

Arc.prototype.pick = function(pt2){
	var dist = Math.sqrt(Math.pow(pt2.x - this.center.x, 2) + Math.pow(pt2.y - this.center.y, 2));

	if(dist > this.radius-tol && dist < this.radius+tol){
		return true;
	}
	return false;
}

Arc.prototype.highlight = function(context){
	context.rect(this.center.x - this.radius, this.center.y - this.radius, this.radius * 2, this.radius * 2);
	context.strokeStyle = "rgb(0,0,0)";
	context.setLineDash([1,3]); 
	context.stroke();
	context.setLineDash([0,0]); 
}

Arc.prototype.boundingBox = function(){
	var left = this.center.x - this.radius;
	var right = this.center.x + this.radius;
	var up = this.center.y - this.radius;
	var down = this.center.y + this.radius;
	
	return [new Point(left, up), new Point(left, down), new Point(right, down), new Point(right, up)]
}

Arc.prototype.translate = function(pt2){
	this.center.translate(pt2)
}

Arc.prototype.scale = function(radiusScale){
	this.radius += radiusScale;
}

Arc.prototype.drawScale = function (radiusScale){
	
	context.beginPath();
	context.arc(this.center.x,this.center.y,this.radius+radiusScale,0,Math.PI*2,true);
	context.strokeStyle = this.color;
	context.stroke();
}

Arc.prototype.getQuadrant = function (pos){
	
	var boundingPoints = this.boundingBox();
	
	if(pos.x > boundingPoints[2].x && pos.y < boundingPoints[2].y && pos.y > boundingPoints[0].y) return 1;
	if(pos.y < boundingPoints[2].y && pos.x < boundingPoints[2].x && pos.x > boundingPoints[0].x) return 2;
	if(pos.x < boundingPoints[0].x && pos.y < boundingPoints[2].y && pos.y > boundingPoints[0].y) return 3;
	if(pos.y > boundingPoints[0].y && pos.x < boundingPoints[2].x && pos.x > boundingPoints[0].x) return 4;

}

Arc.prototype.mirror = function (quad){
	switch (quad){
		case 2:
		case 4:{
			var aux = this.start * -1;
			this.start = this.end * -1;
			this.end = aux;
			break;
		}
		case 1:
		case 3:{
			var aux = this.start
			this.start = Math.PI - this.end;
			this.end = Math.PI - aux;
			break;
		}
	}	
	switch (quad){
		case 1: this.center.x += this.radius * 2; break;
		case 2: this.center.y -= this.radius * 2; break;
		case 3: this.center.x -= this.radius * 2; break;
		case 4: this.center.y += this.radius * 2; break;
	}
}

Arc.prototype.toString = function(){ 
	return this.ID + ";" + this.center.x + ";" + this.center.y + ";" + this.radius + ";" + this.start + ";" + this.end + ";" + this.color; 
}

