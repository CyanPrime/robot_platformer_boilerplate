Vec2 = function(x, y){
	var nx = x;
	var ny = y;
	
	this.x = nx;
	this.y = ny;
}

fromVec2 = function(obj){
	var temp = new Vec2();
	temp.x = obj.x;
	temp.y = obj.y;
	return temp;
}

Vec2.prototype.rotate = function(a){
	return new Vec2(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a));
}

Vec2.prototype.rotateAround = function(a, center){
	this.x -= center.x;
	this.y -= center.y;
	var temp = new Vec2(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a));
	temp.x += center.x;
	temp.y += center.y;
	
	return temp;
}


Vec2.prototype.minus = function(other){
	return new Vec2(this.x - other.x, this.y - other.y);
};

Vec2.prototype.mul = function(num){
	return new Vec2(this.x * num, this.y * num);
};

Vec2.prototype.dot = function(other){
	return (this.x * other.x) + (this.y * other.y);
};

Vec2.prototype.groundCast = function(maxLength, stage){
	var temp = new PolygonCollider([new Vec2(this.x, this.y), new Vec2(this.x, this.y + maxLength)]);
	for(var i = 0; i < stage.length; i++){
		if(temp.intersect(stage[i])){
			for(var step = 0; step < maxLength; step++){
				var temp2 = new PolygonCollider([new Vec2(this.x, this.y + step), new Vec2(this.x, this.y + step)]);
				if(temp2.intersect(stage[i])) return { y: this.y + step, passthrough: stage[i].passthrough };
			}
		}
	}
	
	return { y: Number.POSITIVE_INFINITY, passthrough: true }
};

Vec2.prototype.skyCast = function(maxLength, stage){
	var temp = new PolygonCollider([new Vec2(this.x, this.y), new Vec2(this.x, this.y - maxLength)]);
	for(var i = 0; i < stage.length; i++){
		if(!stage[i].passthrough){
			if(temp.intersect(stage[i])){
				for(var step = 0; step < maxLength; step++){
					var temp2 = new PolygonCollider([new Vec2(this.x, this.y - step), new Vec2(this.x, this.y - step)]);
					if(temp2.intersect(stage[i])) return this.y - step;
				}
			}
		}
	}
	
	return -Number.POSITIVE_INFINITY;
};

Vec2.prototype.leftCast = function(maxLength, stage){
	var temp = new PolygonCollider([new Vec2(this.x, this.y), new Vec2(this.x - maxLength, this.y)]);
	for(var i = 0; i < stage.length; i++){
		if(temp.intersect(stage[i])){
			for(var step = 0; step < maxLength; step++){
				var temp2 = new PolygonCollider([new Vec2(this.x - step, this.y), new Vec2(this.x - step, this.y)]);
				if(temp2.intersect(stage[i])) return this.x - step;
			}
		}
	}
	
	return -Number.POSITIVE_INFINITY;
};

Vec2.prototype.rightCast = function(maxLength, stage){
	var temp = new PolygonCollider([new Vec2(this.x, this.y), new Vec2(this.x + maxLength, this.y)]);
	for(var i = 0; i < stage.length; i++){
		if(temp.intersect(stage[i])){
			for(var step = 0; step < maxLength; step++){
				var temp2 = new PolygonCollider([new Vec2(this.x + step, this.y), new Vec2(this.x + step, this.y)]);
				if(temp2.intersect(stage[i])) return this.x + step;
			}
		}
	}
	
	return Number.POSITIVE_INFINITY;
};

PolygonCollider = function(pointArray, angle){
	//console.log(pointArray);
	this.points = pointArray;
	
	this.numberOfPoints = this.points.length;
	
	this.edgeDirections = [];
	
	var j = this.numberOfPoints - 1;
	for(var i = 0; i < this.numberOfPoints; i++){
		this.edgeDirections.push(this.points[i].minus(this.points[j]));
		
		if(j >= this.numberOfPoints - 1) j = 0;
		else j++;
	}
	
	this.numberOfEdges = this.edgeDirections.length;
	
	this.normals = [];
	
	for(var i = 0; i < this.numberOfEdges; i++){
		this.normals.push(fromVec2(new Vec2(-this.edgeDirections[i].y, this.edgeDirections[i].x)));
	}
	
	this.passthrough = false;
	this.debugColor = "#00ff00";
};

PolygonCollider.prototype.rotate = function(deg){
	for(var i = 0; i < this.points.length; i++){
		this.points[i] = this.points[i].rotate(deg * (3.14/180));
	}
};

PolygonCollider.prototype.rotateAround = function(deg, center){
	var temp = [];
	for(var i = 0; i < this.numberOfPoints; i++){
		temp.push(this.points[i].rotateAround(deg * (3.14/180), center));
	}
	
	this.points = temp;
};

PolygonCollider.prototype.recalculate = function(){
	this.numberOfPoints = this.points.length;
	
	this.edgeDirections = [];
	
	var j = this.numberOfPoints - 1;
	for(var i = 0; i < this.numberOfPoints; i++){
		this.edgeDirections.push(this.points[i].minus(this.points[j]));
		
		if(j >= this.numberOfPoints - 1) j = 0;
		else j++;
	}
	
	this.numberOfEdges = this.edgeDirections.length;
	
	this.normals = [];
	
	for(var i = 0; i < this.numberOfEdges; i++){
		this.normals.push(fromVec2(new Vec2(-this.edgeDirections[i].y, this.edgeDirections[i].x)));
	}
};

PolygonCollider.prototype.stringify = function(){
	var str = '{ ';
		str += '"passthrough" : ' + this.passthrough + ',';
		str += '"debugColor" : "' + this.debugColor + '",';
		
		str += '"points" : [';
		for(i = 0; i < this.numberOfPoints; i++) 
		{ 
			str += '{ "x" : ' + this.points[i].x + ', "y" : ' + this.points[i].y + ' }';
			if(i < this.numberOfPoints - 1) str += ',';
		}
		str += ' ]';
	str += ' }';
	
	return str;
}

PolygonCollider.prototype.setPassthrough = function(pt){
	this.passthrough = pt;
}

PolygonCollider.prototype.setDebugColor = function(color){
	this.debugColor = color;
}

PolygonCollider.prototype.calculateInterval = function(axis) 
{ 
	var d = axis.dot(this.points[0]); 
	var min = d;
	var max = d;

	for(i = 0; i < this.numberOfPoints; i++) 
	{ 
		var d = this.points[i].dot(axis); 
		if (d < min) min = d; 
		else if(d > max) max = d; 
	} 
	
	return { min: min, max: max };
}

PolygonCollider.prototype.intersect = function(other){
	
	for(var i = 0; i < this.normals.length; i++){
		if (this.axisSeparatePolygons (this.normals[i], other)) return false;
	}
	
	for(var i = 0; i < other.normals.length; i++){
		if (other.axisSeparatePolygons (other.normals[i], this)) return false;
	}
	
	return true; 
}

PolygonCollider.prototype.axisSeparatePolygons = function(axis, other) 
{ 
	var tempA = this.calculateInterval(axis);
	var tempB = other.calculateInterval(axis);

	if (tempA.min > tempB.max || tempB.min > tempA.max) 
		return true; 
/*
    // find the interval overlap 
    float depthTestA = tempA.max - tempB.min; 
    float depthTestB = tempB.max - tempA.min; 
    float depth = (depthTestA < depthTestB)? depthTestA : depthTestB; 

    // convert the separation axis into a push vector (re-normalise 
    // the axis and multiply by interval overlap) 
    float axis_length_squared = axis.dot(axis); 

    axis.mul(depth / axis_length_squared); */
    return false; 
}



/***
GLOBAL FUNCTIONS
***/


polygonColliderFromJSON = function(jsonObj){
	var poly = new PolygonCollider([]);
	
	poly.passthrough = jsonObj.passthrough;
	poly.debugColor = jsonObj.debugColor;
	for(var i = 0; i < jsonObj.points.length; i++){
		poly.points[i] = new Vec2(jsonObj.points[i].x, jsonObj.points[i].y);
	}
	
	poly.recalculate();
	
	return poly;
}