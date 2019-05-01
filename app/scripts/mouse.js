var mousePos;
var mousePosAnt;

var pick = null;
var move = false;
var scale = 0;
var rotate = 0;
var hullBuffer = [];
var reta1 = null;
var radiusScale;

//Mouse Up listener
canvas.addEventListener('mouseup', mouseEventDrawPoint, false);
canvas.addEventListener('mouseup', mouseEventDrawLine, false);
canvas.addEventListener('mouseup', mouseEventDrawPolygonStart, false);
canvas.addEventListener('mouseup', mouseEventDrawCircle, false);
canvas.addEventListener('mouseup', mouseEventDrawBezier, false);
canvas.addEventListener('mouseup', mouseEventPick, false);
canvas.addEventListener('mouseup', mouseEventOnScaleStart, false);
canvas.addEventListener('mouseup', mouseEventOnRotateStart, false);

// Double Click listener
canvas.addEventListener('dblclick', mouseEventOnScaleEnd, false);
canvas.addEventListener('dblclick', mouseEventDrawPolygonEnd, false);
canvas.addEventListener('dblclick', mouseEventEndTranslate, false);
canvas.addEventListener('dblclick', mouseEventOnRotateEnd, false);
canvas.addEventListener('dblclick', mouseEventOnMirrorStart, false);

//Mouse Move listener
canvas.addEventListener('mousemove', mouseEventGetMousePosition, false);
canvas.addEventListener('mousemove', mouseEventRubberBandLine, false);
canvas.addEventListener('mousemove', mouseEventRubberBandPolygon, false);
canvas.addEventListener('mousemove', mouseEventRubberBandCircle, false);
canvas.addEventListener('mousemove', mouseEventRubberBandBezier, false);
canvas.addEventListener('mousemove', mouseEventIsMoveMode, false);
canvas.addEventListener('mousemove', mouseEventTranslate, false);
canvas.addEventListener('mousemove', mouseEventOnScaling, false);
canvas.addEventListener('mousemove', mouseEventOnRotation, false);

function mouseEventGetMousePosition(evt){
	var rect = canvas.getBoundingClientRect();
	mousePosAnt = mousePos
	mousePos = {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function mouseEventDrawPoint(){
	if(drawPoint == true){
		drawBuffer.push(new Point(mousePos.x, mousePos.y));
		drawCanvas();
	}
}

function mouseEventDrawLine(){
	if(drawLine == 1){
		tmpPt1 = new Point(mousePos.x, mousePos.y);
		drawLine = 2;
	}else if(drawLine == 2){
		drawBuffer.push(new Line (tmpPt1, new Point(mousePos.x, mousePos.y)));
		drawCanvas();
		setAllFalse();
		pick = null;
	}
}

function mouseEventDrawPolygonStart(){
	if(drawPoly == 1){
		tmpPt = new Point(mousePos.x, mousePos.y);
		tmpArray = [];
		tmpArray.push(tmpPt);
		drawPoly = 2;
	}else if(drawPoly == 2) {
		tmpPt = new Point(mousePos.x, mousePos.y);
		tmpArray.push(tmpPt);
		drawPoly = 3;
	}else if(drawPoly == 3){
		tmpPt = new Point(mousePos.x, mousePos.y);
		tmpArray.push(tmpPt);
	}
}

function mouseEventPick(){
	if(typeof(pick) === "undefined") pick = null;

	for(var i = 0; i < drawBuffer.length; i++){
		if(drawBuffer[i].pick(mousePos) == true){
			pick = drawBuffer[i];
			break;
		}
	}

	if(pick != null && angle == 1 && reta1 != null ){

		var vectorU  = new Point(reta1.startPt.x - reta1.endPt.x, reta1.startPt.y - reta1.endPt.y);
		var vectorV =  new Point(pick.startPt.x - pick.endPt.x, pick.startPt.y - pick.endPt.y);

		var normaU = Math.sqrt(Math.pow(vectorU.x, 2) + Math.pow(vectorU.y, 2));
		var normaV = Math.sqrt(Math.pow(vectorV.x, 2) + Math.pow(vectorV.y, 2));


		var produtoUV = vectorU.x*vectorV.x + vectorU.y*vectorV.y;

		var angleToRad = (produtoUV/(normaU*normaV));

		var anglo = Math.acos(angleToRad);

		alert((anglo*(180/Math.PI)).toFixed(4) + "º Graus")

		reta1 = null
		pick = null;
		angle = 0 
	}
	else if(pick != null && angle == 1){
		reta1 = pick
	}

	if(pick != null){
		if(pick.ID == "POLYGON"){
			//pick.area();
			if(calculateArea == 1){
				pick.area();
				calculateArea = 0;
				console.log(calculateArea);
			}
		}
		if(scale == 0 || rotate == 0){
			drawCanvas();
			pick.highlight(context);
		}
	}
}

function mouseEventDrawPolygonEnd(){
	if(drawPoly == 3){
		setAllFalse();
		tmpArray.push(new Point(mousePos.x,mousePos.y));
		tmpArray.pop();
		tmpArray.pop();
		drawBuffer.push(new Polygon(tmpArray));
		
		drawCanvas();
		pick = null;
	}
	setAllFalse();
	drawCanvas();
}

function mouseEventDrawBezier(){
	if(drawBezier == 1){
		tmpPt1 = new Point(mousePos.x,mousePos.y)
		drawBezier = 2;
	}else if(drawBezier == 2){
		tmpPt2 = new Point(mousePos.x,mousePos.y)
		drawBezier = 3;
	}else if(drawBezier == 3){
		tmpPt3 = new Point(mousePos.x,mousePos.y)
		drawBezier = 4;
	}else if(drawBezier == 4){
		tmpPt4 = new Point(mousePos.x,mousePos.y)
		drawBuffer.push (new Bezier(tmpPt1, tmpPt2, tmpPt3, tmpPt4));
		drawBezier = 0;
		drawCanvas();
	}
}

function mouseEventEndTranslate(){
	if (move == true){
		move = false;
		pick = null;
	}
}

function mouseEventRubberBandLine(){
	if(drawLine == 2){
		drawCanvas();
		new Line(tmpPt1, mousePos).draw(context);
	}
}

function mouseEventRubberBandPolygon(){
	if(drawPoly == 2){
		drawCanvas();
		// Draw the second polygon's edge.
		new Line(tmpPt, mousePos).draw(context);

	}else if(drawPoly == 3){
		drawCanvas();

		for (var i = 0; i < tmpArray.length - 1; i++){
			new Line(tmpArray[i], tmpArray[i + 1]).draw(context);
		}

		new Line(tmpPt, mousePos).draw(context);

		// Draw what a closed polygon would be at that point.
		new Line(tmpArray[0], mousePos).draw(context);

	}
}

function mouseEventDrawCircle(){
	if(drawCircle == 1){
		tmpPt1 = new Point(mousePos.x,mousePos.y);
		drawCircle = 2;
	}else if(drawCircle == 2){	
		tmpPt2 = new Point(mousePos.x,mousePos.y);
		radius = Math.sqrt(Math.pow(tmpPt1.x - tmpPt2.x,2) + Math.pow(tmpPt1.y - tmpPt2.y, 2));
		drawCircle = 3;
	}else if(drawCircle == 3){
		drawBuffer.push(new Arc (tmpPt1, radius, tmpPt1,tmpPt2))
		drawCircle = 0;
		drawCanvas();
	}
}

function mouseEventRubberBandCircle(){

	if(drawCircle == 2){
		drawCanvas();
		context.setLineDash([0,0]); 
		context.strokeStyle = getColor();
		context.beginPath();

		var distance = Math.sqrt(Math.pow(tmpPt1.x - mousePos.x,2) + Math.pow(tmpPt1.y - mousePos.y,2));
		context.arc(tmpPt1.x,tmpPt1.y,distance,0,Math.PI*2,true);
		context.stroke();
	}
}

function mouseEventRubberBandBezier(){
	if (drawBezier == 2){
		drawCanvas();
		new Line(tmpPt1, mousePos).draw(context);

	}else if (drawBezier == 3){
		drawCanvas();
		// Draw what is Bezier's curve so far.
		new Bezier(tmpPt1, tmpPt2, mousePos, tmpPt2).draw(context);

		// Draw the first control point.
		new Line(tmpPt1, mousePos).draw(context, true);

	}else if (drawBezier == 4){
		drawCanvas();
		// Draw what would be Bezier's curve a that point.
		new Bezier(tmpPt1, tmpPt2, tmpPt3, mousePos).draw(context);

		// Draw the second control point.
		new Line(tmpPt2, mousePos).draw(context, true);
	}
}

function mouseEventTranslate(){
	if(move == true && pick != null && translate == 1){
		pick.translate(mousePos);
		drawCanvas();
		pick.highlight(context);
	}
}

function mouseEventOnScaling(){
	if(scale == 2 && pick != null){
		if(pick.ID == "Point") return;

		drawCanvas(pick);

		new Line(scalePt, mousePos).draw(context);
		radiusScale = Math.sqrt(Math.pow(scalePt.x - mousePos.x,2) + Math.pow(scalePt.y - mousePos.y, 2));

		rate = (mousePos.x/(canvas.width/2));

		if(pick.ID == "ARC"){
			if(scalePt.x > mousePos.x){
				pick.drawScale(-radiusScale);	
			}else{
				pick.drawScale(radiusScale);
			}
		}else{
			pick.drawScale(rate, rate, rate);
		}

	}
}

function mouseEventOnScaleStart(){
	if(scale == 1 && pick != null){
		if(pick.ID == "Point") return;
		move = false;
		scalePt = new Point(mousePos.x, mousePos.y);
		scale = 2;
		drawCanvas();
	}
}

function mouseEventOnScaleEnd(){
	if(scale == 2 && pick != null){
		if(pick.ID == "Point") return;


		if(pick.ID == "BEZIER"){
			pick.scale(rate*0.001, rate*0.001);	
		}else if(pick.ID == "ARC"){
			if(scalePt.x > mousePos.x){
				pick.scale(-radiusScale);
				pick.translate(pick.center);	
			}else{
				pick.scale(radiusScale);
				pick.translate(pick.center);
			}
		}else{
			pick.scale(rate, rate);
		}
		
		
		scale = 0;
		pick = null;
		drawCanvas();
	}
}

function mouseEventOnRotateStart(){
	if(rotate == 1 && pick != null){
		if(pick.ID == "Point" || pick.ID == "ARC") return;
		tmpPt1 = new Point(mousePos.x,mousePos.y);
		rotate = 2;
	}
}

function mouseEventOnRotation(){
	if(rotate == 2 && pick != null){
		if(pick.ID == "Point") return;	
		drawCanvas();
		
		var dist = Math.sqrt(Math.pow(tmpPt1.x - mousePos.x, 2) + Math.pow(tmpPt1.y - mousePos.y, 2));
		
		// essa era pra ser a reta que define o angulo com o eixo x, ela move de acordo com a posição do mouse
		var lineForAngle = new Line(tmpPt1, mousePos);
		//lineForAngle.draw(context, true);

		var lineX = new Line(new Point(0,0),new Point(200,0)); //aqui é pra emular uma reta no eixo x

		var vectorU  = new Point(lineForAngle.startPt.x - lineForAngle.endPt.x, lineForAngle.startPt.y - lineForAngle.endPt.y);
		var vectorV =  new Point(lineX.startPt.x - lineX.endPt.x, lineX.startPt.y - lineX.endPt.y);

		var normaU = Math.sqrt(Math.pow(vectorU.x, 2) + Math.pow(vectorU.y, 2));
		var normaV = Math.sqrt(Math.pow(vectorV.x, 2) + Math.pow(vectorV.y, 2));


		var produtoUV = vectorU.x*vectorV.x + vectorU.y*vectorV.y;

		var angleToRad = (produtoUV/(normaU*normaV));

		var anglo = Math.acos(angleToRad);

		if(pick.ID == "LINE" || pick.ID == "BEZIER"){
			pick.drawRotate(anglo*0.01);	
		}else{
			pick.drawRotate(anglo); 
		}
		
		rotatedObj = pick;
	}
}

function mouseEventOnRotateEnd(){
	if(rotate == 2 && rotatedObj != null){
		if(rotatedObj.ID == "Point") return;
		var dist = Math.sqrt(Math.pow(tmpPt1.x - mousePos.x, 2) + Math.pow(tmpPt1.y - mousePos.y, 2));

		// essa era pra ser a reta que define o angulo com o eixo x, ela move de acordo com a posição do mouse
		var lineForAngle = new Line(tmpPt1, mousePos);
		//lineForAngle.draw(context, true);

		var lineX = new Line(new Point(0,0),new Point(200,0)); //aqui é pra emular uma reta no eixo x

		var vectorU  = new Point(lineForAngle.startPt.x - lineForAngle.endPt.x, lineForAngle.startPt.y - lineForAngle.endPt.y);
		var vectorV =  new Point(lineX.startPt.x - lineX.endPt.x, lineX.startPt.y - lineX.endPt.y);

		var normaU = Math.sqrt(Math.pow(vectorU.x, 2) + Math.pow(vectorU.y, 2));
		var normaV = Math.sqrt(Math.pow(vectorV.x, 2) + Math.pow(vectorV.y, 2));


		var produtoUV = vectorU.x*vectorV.x + vectorU.y*vectorV.y;

		var angleToRad = (produtoUV/(normaU*normaV));

		var anglo = Math.acos(angleToRad); 

		console.log((anglo*180/Math.PI).toFixed(4))

		move = false;
		
		if(rotatedObj.ID == "LINE" || rotatedObj.ID == "BEZIER"){
			rotatedObj.rotate(anglo*0.01);// (angle, posX, posY)-classe 	
		}else{
			rotatedObj.rotate(anglo);// (angle, posX, posY)-classe 
		}
		
		rotate = 0;
		rotatedObj = null;
		pick = null;
		drawCanvas();
	}
}

function mouseEventOnMirrorStart(){
	if(mirror == 1 && pick != null){
		var quad = pick.getQuadrant(mousePos);
		pick.mirror(quad);	
		mirror = 0;
		drawCanvas();
	}
}

function mouseEventIsMoveMode(){
	if(pick != null && scale == 0 && rotate == 0 && translate == 1){
		move = true;
	}
}