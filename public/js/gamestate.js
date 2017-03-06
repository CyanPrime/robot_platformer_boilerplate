var GameState = function(){
	this.type = "GameState";
};

GameState.prototype.drawState = function(ctx, stage){
	//console.log("drawing state...");
	
	ctx.fillStyle = "#222222";
	ctx.fillRect(0,0,640,480);

	for(var i = 0; i < stage.length; i++){
		ctx.fillStyle = "rgba(100,100,100,1)";
		
		ctx.beginPath();
		ctx.moveTo(stage[i].points[0].x, stage[i].points[0].y);
		
		for(var j = 0; j < stage[i].points.length; j++){
			ctx.lineTo(stage[i].points[j].x, stage[i].points[j].y);
		}
		
		ctx.closePath();
		ctx.fill();
	}
	
	
	if(drawCol){
		for(var i = 0; i < stage.length; i++){
			if(!stage[i].passthrough) ctx.fillStyle = "rgba(0,255,0,0.5)"; //ctx.createPattern(groundImg[patternFromHex(stage[i].debugColor)], "repeat");
			else  ctx.fillStyle = "rgba(0,0,255,0.5)";
			
			ctx.beginPath();
			ctx.moveTo(stage[i].points[0].x, stage[i].points[0].y);
			
			for(var j = 0; j < stage[i].points.length; j++){
				ctx.lineTo(stage[i].points[j].x, stage[i].points[j].y);
			}
			
			ctx.closePath();
			ctx.fill();
		}
	}
	ctx.fillStyle = "#00ffff";
	//console.log('c' + me.character + 'dd' + me.drawDirection + 's' + me.state + 'f' + me.frame);
	//if(me.drawDirection == 1) console.log(playerImgBank);
	
	if(me != undefined){
		if(drawCol && !me.pChar.sliding){
			//no poly while sliding, so don't draw it.
			
		//	console.log(me.poly);
			ctx.fillStyle = "#ffff00";
			ctx.beginPath();
			ctx.moveTo(me.pChar.poly.points[0].x, me.pChar.poly.points[0].y)
			
			for(var i = 0; i < me.pChar.poly.points.length; i++){ 
				ctx.lineTo(me.pChar.poly.points[i].x, me.pChar.poly.points[i].y);
			}
			
			ctx.closePath();
			ctx.fill();
		}
		
		for(var i = 0; i < me.afterimages.length; i++){
			if(!me.afterimages[i].dead){
				ctx.globalAlpha = me.afterimages[i].time;
				var pImg = playerImgBank[me.afterimages[i].character][me.afterimages[i].drawDirection][me.afterimages[i].state][me.afterimages[i].frame];
				ctx.drawImage(pImg, me.afterimages[i].x - (pImg.w/2), me.afterimages[i].y -  pImg.h);
			}
		}
		
		ctx.globalAlpha = 1;
		
		//console.log(me);
		var pImg = playerImgBank[me.character][me.pChar.drawDirection][me.pChar.state][me.pChar.frame];
		if(me.spawning) pImg = playerSpawnImg;
		if(!me.dead) ctx.drawImage(pImg, me.x - (pImg.w/2), me.y -  pImg.h);
		
		for(var i = 0; i < me.bullets.length; i++){
			if(!me.bullets[i].dead){
				
				if(me.bullets[i].drawNum == 0) ctx.drawImage(bulletImg, me.bullets[i].x - (me.bullets[i].width/2), me.bullets[i].y - (me.bullets[i].height/2));
				if(me.bullets[i].drawNum == 1) ctx.drawImage((me.bullets[i].direction == -1) ? chargeBulletImgL : chargeBulletImgR, me.bullets[i].x - (me.bullets[i].width/2), me.bullets[i].y - (me.bullets[i].height/2));
				
				if(me.bullets[i].drawNum == 3) ctx.drawImage(chargeSmallImg, me.bullets[i].x - (me.bullets[i].width/2), me.bullets[i].y - (me.bullets[i].height/2));
				if(me.bullets[i].drawNum == 4) ctx.drawImage(chargeLargeImg, me.bullets[i].x - (me.bullets[i].width/2), me.bullets[i].y - (me.bullets[i].height/2));
				
				
				if(me.bullets[i].drawNum == 2){
					//console.log(me.bullets[i].poly);
					
					ctx.fillStyle = "#00ff00";
					ctx.beginPath();
					ctx.moveTo(me.bullets[i].poly.points[0].x, me.bullets[i].poly.points[0].y)
					
					for(var j = 0; j < me.bullets[i].poly.points.length; j++){ 
						ctx.lineTo(me.bullets[i].poly.points[j].x, me.bullets[i].poly.points[j].y);
					}
					
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}
	
	if(drawCol){
		ctx.fillStyle = "#ffff00";
		for(var step = -2; step < 1; step++){ 
			ctx.beginPath();
			var vec = me.prepareLeftCastVec(step);
			ctx.moveTo(vec.x, vec.y);

			ctx.lineTo(vec.x - me.groundCastDist, vec.y);
			ctx.lineTo(vec.x - me.groundCastDist, vec.y + 1);
			ctx.lineTo(vec.x, vec.y + 1);
			
			ctx.closePath();
			ctx.fill();
		}
		
		ctx.fillStyle = "#ff00ff";
		for(var step = -2; step < 1; step++){ 
			ctx.beginPath();
			var vec = me.prepareRightCastVec(step);
			ctx.moveTo(vec.x, vec.y);

			ctx.lineTo(vec.x + me.groundCastDist, vec.y);
			ctx.lineTo(vec.x + me.groundCastDist, vec.y + 1);
			ctx.lineTo(vec.x, vec.y + 1);

			ctx.closePath();
			ctx.fill();
		}
		
		ctx.fillStyle = "#0000ff";
		for(var step = -1; step < 2; step++){ 
			ctx.beginPath();
			var vec = me.prepareGroundCastVec(step);
			ctx.moveTo(vec.x, vec.y);

			ctx.lineTo(vec.x, vec.y + me.groundCastDist);
			ctx.lineTo(vec.x + 1, vec.y + me.groundCastDist);
			ctx.lineTo(vec.x + 1, vec.y);

			ctx.closePath();
			ctx.fill();
		}
		
		ctx.fillStyle = "#ff0000";
		for(var step = -1; step < 2; step++){ 
			ctx.beginPath();
			var vec = me.prepareSkyCastVec(step);
			ctx.moveTo(vec.x - 1, vec.y);

			ctx.lineTo(vec.x - 1, vec.y - me.groundCastDist);
			ctx.lineTo(vec.x + 1, vec.y - me.groundCastDist);
			ctx.lineTo(vec.x + 1, vec.y);

			ctx.closePath();
			ctx.fill();
		}
	}
		
	if(me != undefined){
			var buttonY = 42;
			
			
			//shot lv1 icon
			ctx.fillStyle = (me.pChar.superMeter >= 50) ? "rgba(0,255,255, 0.7)" : "rgba(255,255,255, 0.7)";
			ctx.fillRect(10, buttonY, 16, 16);
			ctx.fillStyle = "rgba(255,255,255, 1)";
			ctx.fillText("X", 13 ,buttonY + 14);

			ctx.fillStyle = "rgba(0,0,0, 0.6)";
			ctx.fillRect(10, buttonY, 16, me.pChar.shotLV1Time * 0.5);
	}
	
	if(primepad.noController()) {
		ctx.font="10px Verdana";
		ctx.fillStyle = "rgba(255,0,0, 1)";
		ctx.fillText("Press Button 0 to activate controller!", 10, 7);
	}
	if(lastE != undefined){
		ctx.font="20px Verdana";
		ctx.fillStyle = "rgba(255,255,0, 1)";
		ctx.fillText(lastE.toString(), 10, 14);
	}
};