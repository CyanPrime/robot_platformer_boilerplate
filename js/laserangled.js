var LaserAngled = function(parentID, drawNum, dmg, stun, priority, x, y, width, height, angle, time, posMod){
	this.parentID = parentID;
	this.direction = 0;
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.oWidth = width;
	this.height = 0;
	this.maxHeight = height;
	this.angle = angle;
	this.speed = 0.75;
	
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

	this.dead = false;
};

LaserAngled.prototype.update = function(plr, stage){
	if(!this.dead){
		//expand the laser's height (makes it slowly lengthen)
		if(this.time > 0) {
			if(this.height < this.maxHeight) this.height++;
		}
		
		else{
			if(this.height > 0) this.height--;
		}
		
		//move laser along angle, and reset width.
		this.angle -= this.speed;
		if(this.angle >= 360)  this.angle -= 360;
		this.width = this.oWidth;
		
		//set's the rotation point of the laser.
		this.rotPoint = new Vec2(this.x + this.posMod.x , this.y + this.posMod.y);
		
		//if the laser hits a piece of the stage shrink it so it doesn't.
		for(var i = 0;  i < stage.length; i++){
			if(this.poly.intersect(stage[i])){
				var laserHit = this.rotPoint.laserCast(this.width, this.angle * (3.14/180), [stage[i]]);
				if(laserHit != undefined){
					console.log(laserHit);
					this.width = new Vec2(this.x, this.y).dist(laserHit);
				}
			}
		}
		
		//reset the collider with the new size info.
		this.poly = new PolygonCollider([
			new Vec2(this.x, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top left
			new Vec2(this.x + this.width, this.y - (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //top right
			new Vec2(this.x  + this.width + 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
			new Vec2(this.x + this.width, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom right
			new Vec2(this.x, this.y + (this.height/2)).rotateAround(this.angle * (3.14/180), this.rotPoint), //bottom left
			new Vec2(this.x - 5, this.y).rotateAround(this.angle * (3.14/180), this.rotPoint), //center left
		]);

		//if the time's up and the height s back at 0 or if the player firing the laser is dead kill the laser.
		this.time--;
		if(this.time <= 0 && this.height <= 0 || plr.dead) this.dead = true;
	}
};