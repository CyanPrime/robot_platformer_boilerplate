var Xeek = function(player){
	this.player = player;
	this.hp = 50;
	
	this.width = 24;
	this.height = 50;
	
	//physics vars
	this.speed = 3;
	this.gravity = 0;
	this.gravConst = 0.65;
	this.airTime = 0;
	
	//jumping vars
	this.jumpForce = 13;
	
	//linecasting vars
	this.groundCastDist = 10;
	this.widthShrink = 4;
	this.heightShrink = 7;
	
	//object vars
	
	this.poly = new PolygonCollider([
		new Vec2(this.x - (this.width/2), this.y - this.height), //top left
		new Vec2(this.x + (this.width/2), this.y - this.height), //top right
		new Vec2(this.x + (this.width/2), this.y), //bottom right
		new Vec2(this.x - (this.width/2), this.y), //bottom left
	]);
	
	this.state = 0;
	this.frame = 0;
	this.drawDirection = 1;
	this.framesPerState = [6,5,6,4];
	
	this.frameDelay = 5;
	
	//bullet stuff
	this.shotLV1Time = 0;
	this.laserTime = 0;
	
	//dash stuff
	this.dashPressTimeLeft = 0;
	this.dashPressTimeRight = 0;
	
	this.afTime = 0; // time between after images.
};

Xeek.prototype.shootLV1 = function(){
	if(this.shotLV1Time <= 0){
		var bulletY = this.player.y - (this.height/2) - 8;
		var bulletX = (this.drawDirection == 0) ? (this.player.x - ((this.width/2) + 12)) : (this.player.x + ((this.width/2) + 12));
		var angle = (this.airTime >= 1) ? ((this.drawDirection == 0) ? 145 : 30) : ((this.drawDirection == 0) ? 180 : 0)
		var posMod = (this.airTime >= 1) ? ((this.drawDirection == 0) ? { x: 0, y: 4 } : { x: -13, y: 0 }) : ((this.drawDirection == 0) ? { x: -1, y: 0 } : { x: -5, y: 0 })
		this.player.bullets.push(new Lasera(this.player.id, 2, 0.5, 0.5, 1000, bulletX, bulletY, 640, 4, angle, 50 - 4, posMod));
		this.laserTime = 50;
		
		this.shotLV1Time = 32;
	}
};

Xeek.prototype.dropDown = function(){
	if(this.player.onPassthrough){
		this.player.onPassthrough = false;
		this.player.y += this.height/2;
		this.airTime = 1;
	}
}

Xeek.prototype.incrementFrame = function(){
	if(this.frameDelay <= 0){
		if(this.frame + 1 <= this.framesPerState[this.state]){
			this.frame++;
		}
		
		else this.frame = 0;
		
		this.frameDelay = 5;
	}
	
	else this.frameDelay--;
}

Xeek.prototype.setMovementVariablesToDefault = function(){
	this.player.futurePos = new Vec2(this.player.x, this.player.y);
	this.player.move = new Vec2(0,0);
}

Xeek.prototype.nonCombatInput = function(){
	if(!this.player.spawning && this.laserTime <= 0){
		if(this.player.left) this.player.moveLeft();
		if(this.player.right) this.player.moveRight();
	}
}

Xeek.prototype.manageState = function(){
	
			if(this.airTime < 1){
				if(this.player.move.x != 0){
					if(this.state != 1){
						this.state = 1;
						this.frame = 0;
					}
				}
				
				else{
					if(this.state != 0){
						this.state = 0;
						this.frame = 0;
					}
				}
			}
			else{
				if(this.state != 2){
					if(this.state == 0 && this.laserTime > 0){}
					else {
						this.state = 2;
						this.frame = 0;
					}
				}
			}
}

Xeek.prototype.manageHorizontalMovement = function(){
	if(this.sliding){
		var slideDir = (this.drawDirection == 0) ? -1 : 1;
		this.player.move.x = (this.speed * 3) * slideDir;
		this.slideTime--;
		
		if(this.slideTime <= 0) {
			this.sliding = false;
			this.slideCooldown = 32; //keep at a 16 increment for HUD
		}
	}
	
	else if(this.slideCooldown > 0) this.slideCooldown--;
	
	this.player.futurePos.x += this.player.move.x
	
	//no going out of bounds
	if(this.player.futurePos.x < 10 && this.player.move.x < 0) this.player.move.x = 0;
	if(this.player.futurePos.x + this.width > 650 && this.player.move.x > 0) this.player.move.x = 0;
}

Xeek.prototype.jumpCheck = function(){
	if(!this.player.spawning && !this.sliding && this.laserTime <= 0){
		if(this.player.jump) this.player.moveUp();
		if(this.player.down && this.airTime < 1) this.dropDown();
	}
}

Xeek.prototype.colliderManagement = function(){
	if(!this.player.spawning){
		//don't update collider while spawning
		this.poly = new PolygonCollider([
			new Vec2(this.player.x - (this.width/2), this.player.y - this.height), //top left
			new Vec2(this.player.x + (this.width/2), this.player.y - this.height), //top right
			new Vec2(this.player.x + (this.width/2), this.player.y), //bottom right
			new Vec2(this.player.x - (this.width/2), this.player.y), //bottom left
		]);
	}
}

Xeek.prototype.manageHorizontalCollision = function(){
	if(!this.player.spawning){
			//<side>Cast example start
			var leftest = -Number.POSITIVE_INFINITY;
			for(var step = -2; step < 1; step++){ 
				var castResult = this.player.prepareLeftCastVec(step).leftCast(this.groundCastDist, stage);
				if(castResult > leftest) leftest = castResult;
			}

			var rightest = Number.POSITIVE_INFINITY;
			for(var step = -2; step < 1; step++){ 
				var castResult = this.player.prepareRightCastVec(step).rightCast(this.groundCastDist, stage);
				if(castResult < rightest) rightest = castResult;
			}
			
			if(leftest != -Number.POSITIVE_INFINITY){
				if(this.player.move.x < 0) this.player.move.x = 0;
			}
			
			if(rightest != Number.POSITIVE_INFINITY){
				if(this.player.move.x > 0) this.player.move.x = 0;
			}
			//<side>Cast example end

			this.player.x += this.player.move.x;
	}
}

Xeek.prototype.manageVerticalCollision = function(){
	if(!this.player.spawning){
		if(this.laserTime <= 0){
			if(this.airTime > 0.1 || this.player.fireJump){ //if we're off the ground
				this.player.fireJump = false;
				//console.log("airTime > 0.1 -- " + this.airTime);
				this.gravity += this.gravConst;
				if(this.gravity > this.gravConst * 35) this.gravity = this.gravConst * 35;
				this.player.move.y += this.gravity;
				this.player.futurePos.y = this.player.y + this.player.move.y;
			}
		}
		
		else this.gravity = 0;
		
		//skyCast example start
		var lowestCeiling = -Number.POSITIVE_INFINITY;
		for(var step = -1; step < 2; step++){
			var castResult = this.player.prepareSkyCastVec(step).skyCast(this.groundCastDist, stage);
			if(castResult > lowestCeiling) lowestCeiling = castResult;
		}
		
		//console.log("lowestCeiling: " + lowestCeiling);
		if(lowestCeiling != -Number.POSITIVE_INFINITY){
			if(this.player.move.y < 0) this.player.move.y = 0;
			if(this.gravity < 0) this.gravity = 0;
		}
		//skyCast example end
		
		//ground cast example start
		var highestGround = Number.POSITIVE_INFINITY;
		var passthrough = true;
		for(var step = -1; step < 2; step++){
			var castResult = this.player.prepareGroundCastVec(step).groundCast(this.groundCastDist, stage);
			if(castResult.y < highestGround){
				highestGround = castResult.y;
				passthrough = castResult.passthrough;
				this.player.onPassthrough = passthrough;
			}
		}
		
		//console.log("highestGround: " + highestGround);
		if(highestGround != Number.POSITIVE_INFINITY){
			if(this.player.move.y <= 0) this.player.move.y = (highestGround + 1) - this.player.y;
			if(this.player.move.y > 0) this.player.move.y = 0;
			if(this.player.move.y >= 0) this.airTime = 0;
			if(this.gravity > 0) this.gravity = 0;
		}
		//ground cast example end
		
		else this.airTime += 0.1;
	}
	
	else this.player.move.y = this.speed * 5;
	
	this.player.y += this.player.move.y;
};

Xeek.prototype.combatInput = function(){
	//bullet stuff
	if(!this.spawning){
		if(this.player.fireLV1) this.shootLV1();
	}
}

Xeek.prototype.combatTimerManagement = function(){
	if(this.shotLV1Time > 0) this.shotLV1Time -= 0.3;
	if(this.laserTime > 0) this.laserTime--;
};

Xeek.prototype.dashManagement = function(){
	//dashing stuff
	if(this.dashPressTimeLeft > 0) this.dashPressTimeLeft -= 0.1;
	if(this.dashPressTimeRight > 0) this.dashPressTimeRight -= 0.1;
	
		
	if((this.player.dashing || this.sliding) && this.afTime <= 0){
		this.player.afterimages.push(new AfterImage(this.player.x, this.player.y, this.player.character, this.state, this.frame, this.drawDirection));
		this.afTime = 3;
	}
	
	if(this.afTime > 0) this.afTime -= 1;
};

Xeek.prototype.spawnPointCheck = function(){
	if(this.player.spawning){
		if(this.player.y >= this.player.spawnpoint.y) this.player.spawning = false;
	}
};

Xeek.prototype.update = function(plr, stage){
	if(!this.player.dead){
		this.incrementFrame();
		this.setMovementVariablesToDefault();
		this.nonCombatInput();
		this.manageState();
		this.manageHorizontalMovement();
		this.jumpCheck();
		this.colliderManagement();
		this.manageHorizontalCollision();
		this.manageVerticalCollision();
		this.combatInput();
		this.combatTimerManagement();
		this.dashManagement();
		this.spawnPointCheck();
	}
	
	//keep out of death loop to prevent bullets from stopping on death.
	for(var i = 0; i < this.player.bullets.length; i++){
		this.player.bullets[i].update(plr, stage);
		
		if(this.player.bullets[i].dead){
			this.player.bullets.splice(i,1);
		}
	}
	
	//keep out of death loop so images fade(?)
	for(var i = 0; i < this.player.afterimages.length; i++){
		this.player.afterimages[i].update();
		
		if(this.player.afterimages[i].dead){
			this.player.afterimages.splice(i,1);
		}
	}
};