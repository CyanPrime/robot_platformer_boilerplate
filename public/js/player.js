var Player = function(){
	this.pChar = new Xeek(this);
	
	//x,y from middle of feet
	this.x = 640/2;
	this.y = -50;
	
	this.fireJump = false;
	
	//object vars
	this.move = new Vec2(0,0);
	
	this.updateDrawPos = true;
	this.futurePos = new Vec2(0,0);
	
	this.oldPos = new Vec2(0,0);
	
	
	this.left = false;
	this.right = false;
	this.jump = false;
	this.down = false;
	this.fireLV1 = false;
	
	this.character = 0;
	
	//bullet stuff
	this.bullets = [];
	
	//dash stuff
	this.dashing = false;
	
	this.afterimages = [];
	
	this.deathballs = [];
	
	//sliding (mmx dash)
	this.slide = false; //input
	
	this.killCount = 0;
	this.room = -1;
	
	this.spawning = true;
	this.onPassthrough = false;
};

Player.prototype.update = function(stage){
	this.pChar.update(this, stage);
};

Player.prototype.prepareLeftCastVec = function(step){
	return new Vec2(this.futurePos.x - ((this.pChar.width/2) - this.pChar.groundCastDist), this.y + (((this.pChar.height/2) - this.pChar.heightShrink) * step) -8)
};

Player.prototype.prepareRightCastVec = function(step){
	return new Vec2(this.futurePos.x + ((this.pChar.width/2) - this.pChar.groundCastDist), this.y + (((this.pChar.height/2) - this.pChar.heightShrink) * step) -8)
};

Player.prototype.prepareGroundCastVec = function(step){
	return new Vec2((this.x + ((this.pChar.width/2) - this.pChar.widthShrink) * step), this.futurePos.y - this.pChar.groundCastDist);
};

Player.prototype.prepareSkyCastVec = function(step){
	return new Vec2((this.x + ((this.pChar.width/2) - this.pChar.widthShrink ) * step), this.futurePos.y - (this.pChar.height - this.pChar.groundCastDist));
};

Player.prototype.moveLeft = function(){
	this.pChar.drawDirection = 0;
	
	if(this.pChar.dashPressTimeLeft > 0){ 
		this.dashing = true;
	}

	if(this.x > 10) this.move.x = (this.dashing ? (-this.pChar.speed * 2) : -this.pChar.speed);
};

Player.prototype.moveRight = function(){
	this.pChar.drawDirection = 1;
	
	if(this.pChar.dashPressTimeRight > 0){ 
		this.dashing = true;
	}
	
	if(this.x + this.pChar.width < 650) this.move.x = (this.dashing ? (this.pChar.speed * 2) : this.pChar.speed);
};

Player.prototype.moveUp = function(){
	if(!this.fireJump && this.pChar.airTime <= 0){
		this.fireJump = true;
		this.pChar.gravity = -this.pChar.jumpForce;
		this.pChar.airTime = 1; // quickly go to jump sprite on up press.
	}
};

Player.prototype.moveDown = function(){
	this.move.y = this.pChar.speed;
};

Player.prototype.setSpawnPoint = function(spawnpoint){
	this.spawnpoint = spawnpoint;
	console.log(spawnpoint);
	this.x = this.spawnpoint.x - (this.pChar.width/2);
	this.y = -50;
	this.spawning = true;
};

Player.prototype.send = function(socket, rollback){
	rollback.sendClientPacket(this.room, socket, "client_update", 
		{ 
			room: this.room,
			hp: this.pChar.hp,
			su: this.pChar.superMeter,
			x: this.x, 
			y: this.y, 
			id: this.id,
			left: this.left,
			right: this.right,
			jump: this.jump,
			
			character: this.character,
			state: this.pChar.state,
			frame: this.pChar.frame,
			drawDirection: this.pChar.drawDirection,
			
			airTime: this.pChar.airTime,
			gravity: this.pChar.gravity,
			bullets: this.bullets,
			dashing: this.dashing,
			afterimages: this.afterimages,
			deathballs: this.deathballs,
			spawning: this.spawning,
			
			dead: this.dead,
			killCount: this.killCount,
			stun: this.pChar.stun,
		},  
	this.lastUpdated);
};

Player.prototype.getPos = function(){
	console.log(this);
	return { x: this.x, y: this.y };
}

/***
AFTER IMAGE STUFF
***/

var AfterImage = function(x, y, ch, s, f, dd){
	this.x = x;
	this.y = y;
	
	this.character = ch;
	this.state = s;
	this.frame = f;
	this.drawDirection = dd;
	
	this.time = 1; //needs to be 1 so I can use it as alpha. if you want more time make it -= 0.1, or -= 0.001
	this.dead = false;
}

AfterImage.prototype.update = function(){
	this.time -= 0.1;
	
	if(this.time <= 0) this.dead = true;
};