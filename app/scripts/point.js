function Point (x, y){
	this.x = x;
	this.y = y;
	this.color = getColor();
	this.ID = 'POINT';
}

Point.prototype.draw = function(context){
	context.beginPath();
	context.arc(this.x, this.y, 1.3, 0, 2 * Math.PI);
	context.strokeStyle = this.color;
	context.stroke();
}

Point.prototype.pick = function(pos){
	if(this.x < pos.x + tol && this.x > pos.x - tol && this.y < pos.y + tol && this.y > pos.y - tol){
		return true;
	}
	return false;
}

Point.prototype.pickCode = function(pos){
	var code = [];
	code[0] = this.x < pos.x - tol;
	code[1] = this.x > pos.x + tol;
	code[2] = this.y < pos.y - tol;
	code[3] = this.y > pos.y + tol;
	return code;
}

Point.prototype.highlight = function (context){
	drawCanvas();
	context.rect(this.x - tol/2, this.y - tol/2, tol, tol);
	context.strokeStyle = "rgb(0,0,0)"
	context.setLineDash([1,1]); 
	context.stroke();
	context.setLineDash([0,0]); 
}

Point.prototype.translate = function(pos){
	this.x += (pos.x - this.x);
	this.y += (pos.y - this.y);
}

Point.prototype.scaleP = function (x,y,p,centro){
	function translate(p1, p2){
		var p0 = [];
		var mat = [[1, 0, p2.x],[0, 1, p2.y],[0, 0, 1]];
		p0.push([p1.x]);
		p0.push([p1.y]);
		p0.push([1]);
		p0 = multMatriz(mat, p0);
		var posTranslate = new Point(p0[0][0],p0[1][0]);
		return posTranslate;
	}    

	function multMatriz(mat1, mat2){
		var i, j, k, s;
		var matRes = [];
		for(i = 0; i < mat1.length; i++){
			var res = [];
			for(j = 0; j < mat2[0].length; j++){
				s = 0;
				for(k = 0; k < mat2.length; k++){
	    			s += mat1[i][k] * mat2[k][j];
				}
	    		res.push(s);
			}
			matRes.push(res);
		}
		return matRes;
	}
	var p0 = [];
		    	
	var mat = [[x,0,0], [0,y,0], [0,0,1]];
		
	p = translate(p, new Point(-centro.x,-centro.y));
		    	
	p0.push([p.x]);
	p0.push([p.y]);
	p0.push([1]);
		    	
	p0 = multMatriz(mat,p0);
			  
	p = translate(new Point(p0[0][0],p0[1][0]),centro);

	return p;
}

Point.prototype.rotateP = function (angle,p,centro){
	function translate(p1, p2){
		var p0 = [];

		var mat = [[1, 0, p2.x],[0, 1, p2.y],[0, 0, 1]];

		p0.push([p1.x]);
		p0.push([p1.y]);
		p0.push([1]);
		p0 = multMatriz(mat, p0);
		var posTranslate = new Point(p0[0][0],p0[1][0]);
		return posTranslate;
	}    

	function multMatriz(mat1, mat2){
		var i, j, k, s;
		var matRes = [];
		for(i = 0; i < mat1.length; i++){
			var res = [];
			for(j = 0; j < mat2[0].length; j++){
				s = 0;
				for(k = 0; k < mat2.length; k++){
	    			s += mat1[i][k] * mat2[k][j];
				}
	    		res.push(s);
			}
			matRes.push(res);
		}
		return matRes;
	}
	var p0 = [];


	p = translate(p, new Point(-centro.x,-centro.y));

	var mat = [[Math.cos(angle), -Math.sin(angle), 0],
	[Math.sin(angle), Math.cos(angle), 0],
	[0,0,1]];
	
		    	
	p0.push([p.x]);
	p0.push([p.y]);
	p0.push([1]);
		    	
	p0 = multMatriz(mat,p0);
			  
	p = translate(new Point(p0[0][0],p0[1][0]),centro);

	return p;
}

Point.prototype.scale = function(pos){ return; }

Point.prototype.rotate = function(pos){ return; }

Point.prototype.getQuadrant = function(pos){ return; }

Point.prototype.mirror = function(pos){ return; }

Point.prototype.toString = function(){ 
	return this.ID + ";" + this.x + ";" + this.y + ";" + this.color; 
}