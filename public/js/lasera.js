var Lasera = function(parentID, drawNum, dmg, stun, priority, x, y, width, height, angle, time, posMod){
	this.parentID = parentID;
	this.direction = 0;
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = 0;
	this.maxHeight = height;
	this.angle = angle;
	this.speed = 8;
	
	this.time = time;
	
	this.drawNum = drawNum;
	this.damage = dmg;
	this.stun = stun;
	this.priority = priority;
	this.posMod = posMod;
	
	this.rotPoint = new Vec2(this.x + this.posMod.x , this.y + this.posMod.y);
		this.poly = new PolygonCollider([
			new Vec2(this.x, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top left
			new Vec2(this.x + this.width, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top right
			new Vec2(this.x  + this.width + 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
			new Vec2(this.x + this.width, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom right
			new Vec2(this.x, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom left
			new Vec2(this.x - 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
		]);
	
	//this.poly.rotateAround(this.angle, this.poly.points[5]);
	//console.log(this.poly);
	this.dead = false;
	this.deadTrigger = false;
	this.deadTime = 3;
};

Lasera.prototype.update = function(plr, stage){
	if(!this.dead){
		if(this.time > 0) {
			if(this.height < this.maxHeight) this.height++;
		}
		
		else{
			if(this.height > 0) this.height--;
		}
		
		//if(this.angle >= 360)  this.angle -= 360;
		
		//console.log(this);
		//console.log(this.poly);
		this.rotPoint = new Vec2(this.x + this.posMod.x , this.y + this.posMod.y);
	
		this.poly = new PolygonCollider([
			new Vec2(this.x, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top left
			new Vec2(this.x + this.width, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top right
			new Vec2(this.x  + this.width + 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
			new Vec2(this.x + this.width, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom right
			new Vec2(this.x, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom left
			new Vec2(this.x - 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
		]);
		
		/*
		this.poly.rotateAround(this.angle, this.rotPoint);
		this.poly.recalculate();*/
		//console.log(this.poly);
		/*for(var i = 0;  i < stage.length; i++){
			if(this.poly.intersect(stage[i])){
				this.dead = true;
			}
		}*/
	
		//console.log("clients: " + lastKeyFrame.clients.length);
				
		if(this.deadTrigger){
			this.deadTime--;
			if(this.deadTime < 0) this.dead = true;
		}
		
		this.time--;
		if(this.time <= 0 && this.height <= 0 || plr.dead) this.dead = true;
	}
};