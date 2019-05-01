var navbarElement; 
var canvas;
var canvasColor;
var context;

var drawBuffer = [];
var drawPoint = false;
var drawLine = 0;
var drawCircle = 0;
var drawBezier = 0;
var drawPoly = 0;
var tol = 10;
var translate = 0;
var mirror = 0;
var angle = 0;
var calculateArea = 0;
var fileTxt = "";
var bruteHullflag = 0;
var quickHullflag = 0;

function onLoad(){
	
	navbarElement = document.getElementsByClassName("navbar")[0];
	canvas = document.getElementById('canvas');
	canvasColor = "#fff";

	
	if(canvas != null){
		context = canvas.getContext('2d');
	}

	drawCanvas();

	// Seta o tamnho do canvas com as medidas da tela do usuário.
	window.addEventListener('resize', resizeCanvas, false);
}

function setAllFalse(){
	drawPoint = false;
	drawLine = 0;
	drawArc = 0;
	drawBezier = 0;
	drawPoly = 0;
	scale = 0;
	rotation = 0;
	translate = 0;
	angle = 0;
	calculateArea = 0;
	bruteHullflag = 0;
	quickHullflag = 0;
}

function setCanvasSize(){
	canvas.width = navbarElement.offsetWidth;
	canvas.height = window.innerHeight - navbarElement.offsetHeight;
}

function resizeCanvas(){
	setCanvasSize();
	drawCanvas();
}

function clearCanvas(){
	setCanvasSize();
	context.fillStyle = canvasColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawBuffer = [];
}

function drawCanvas(pick = null){
	setCanvasSize();
	context.fillStyle = canvasColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	if(drawBuffer.length > 0){
		for (var i = 0; i < drawBuffer.length; i++){
			context.setLineDash([0,0]);
			if(drawBuffer[i] != pick) drawBuffer[i].draw(context);
		}
	}
}

function drawQuadrants(){
	if(pick != null && mirror == 1){
		var box = pick.boundingBox();
		new Line(new Point(0, box.y), new Point (canvas.width, box.y)).draw(context, true);
		new Line(new Point(0, box.y + box.height), new Point (canvas.width, box.y + box.height)).draw(context, true);
		new Line(new Point(box.x, 0), new Point (box.x, canvas.height)).draw(context, true);
		new Line(new Point(box.x + box.width, 0), new Point (box.x + box.width,  canvas.height)).draw(context, true);
		pick.draw(context);
	}
}

function getColor() {
	var colorPicker = document.getElementById("colorwheel");	
	if(colorPicker == null){
		return "#000";
	}
	return colorPicker.value;
}

function setAllFalse(){
	drawPoint = false;
	drawLine = 0;
	drawCircle = 0;
	drawBezier = 0;
	drawPoly = 0;
	scale = 0;
	rotation = 0;
	translate = 0;
	angle = 0;
}

function generateNewPoint(){
	if(drawPoint == false){
		setAllFalse();
		drawPoint = true;
	}else{
		drawPoint = false;
	}
}

function generateNewLine(){
	if(drawLine == 0){
		setAllFalse();
		drawLine = 1;
	}
}

function generateNewCicle(){
	if(drawCircle == 0){
		setAllFalse();
		drawCircle = 1;
	}
}

function generateNewBezier(){
	if(drawBezier == 0){
		setAllFalse();
		drawBezier = 1;
	}
}

function generateNewPolygon(){
	if(drawPoly == 0){
		setAllFalse();
		drawPoly = 1;
	}
}

function translateFlag(){
	
	if(translate == 0){
		setAllFalse();
		translate = 1;
	}else{
		translate = 0;
	}
}

function scaleFlag(){
	if(scale == 0){
		setAllFalse();
		scale = 1;
	}
}

function rotationFlag(){
	if(rotate == 0){
		setAllFalse();
		rotate = 1;
	}
}

function mirrorFlag(){
	if(mirror == 0){
		setAllFalse();
		mirror = 1;
	}
}

function angleFlag(){
	if(angle == 0){
		setAllFalse();
		angle = 1;
	}
}

function areaFlag(){
	if(calculateArea == 0){
		setAllFalse();
		calculateArea = 1;
	}
}

function bruteHull(){
	if(bruteHullflag == 1){

		var convexHull = new Hull();
		convexHull.getPoints(drawBuffer);

		convexHull.bruteHull();
		for(let i = 0; i < convexHull.poly.length ; i++ ){
			drawBuffer.push(convexHull.poly[i]);
		}

		drawCanvas();
		bruteHullflag = 0;
	}
}

function hullflagBrute(){
	if(bruteHullflag == 0){
		setAllFalse();
		bruteHullflag = 1;
		bruteHull();
	}
}

function quickHull(){
	if(quickHullflag == 1){

		var convexHull = new QuickHull();
		let convexHullResult = convexHull.getPoints(drawBuffer);
		let polygonConvex = new Polygon(convexHullResult);
		drawBuffer.push(polygonConvex);
		drawCanvas();
		quickHullflag = 0;
	}
}

function hullflagQuick(){
	if(quickHullflag == 0){
		setAllFalse();
		quickHullflag = 1;
		quickHull();
	}
}

onLoad();	