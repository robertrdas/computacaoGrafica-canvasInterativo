function Hull() {
    this.poly = undefined;
    this.points = [];
}

Hull.prototype.getPoints = function(buffer){

    for (var i = 0 ; i < buffer.length; i++) {
        if (buffer[i].ID == "POINT") {
            this.points.push(buffer[i]);
        }else if (buffer[i].ID == "LINE") {
            this.points.push(buffer[i].startPt);
            this.points.push(buffer[i].endPt);        
        }else if(buffer[i].ID == "BEZIER"){
            // for (let j = 0; j<buffer[i].Points.length; j++) {
            //     this.points.push(buffer[i].Points[j]);
            // }
            this.points.push(buffer[i].startPt);
            this.points.push(buffer[i].endPt);
            this.points.push(buffer[i].ctrlPt1);
            this.points.push(buffer[i].ctrlPt2);

        }else if(buffer[i].ID == "ARC"){
            // x(t) = r cos(t) + j
            // y(t) = r sin(t) + k
            var point;
            var x;
            var y;
            for (let j = 0; j < 360; j++) {
                x = buffer[i].radius * Math.cos(j)+ buffer[i].center.x;
                y = buffer[i].radius * Math.sin(j)+ buffer[i].center.y;
                point = new Point(x, y);
                this.points.push(point);
            }
        }else if(buffer[i].ID == "POLYGON"){
            for (let j = 0; j<buffer[i].vertices.length; j++) {
                this.points.push(buffer[i].vertices[j]);
            }
        }
    }
}

Hull.prototype.bruteHull = function(){
    var convex = [];
    var convexPoints = [];
    for (let i = 0; i < this.points.length; i++) {
        for (let j = 0; j < this.points.length; j++) {
            if(i == j){
                continue;
            }
            var flag = true;
            for (let k = 0; k < this.points.length; k++) {
                if (k == i || k==j) {
                    continue;
                }
                var d = (this.points[k].x-this.points[i].x)*(this.points[j].y-this.points[i].y)-(this.points[k].y-this.points[i].y)*(this.points[j].x-this.points[i].x);
                if(d > 0){
                    flag = false;
                    break;
                }

            }
            if(flag == true){
                var startPt = new Point(this.points[i].x, this.points[i].y);
                var endPt = new Point(this.points[j].x, this.points[j].y);
                convex.push(new Line(startPt,endPt));
            }
            
        }
    }

    this.poly = convex;
}