var primepad = new PrimePad();
primepad.setEventListeners();

var fullscreen = false;
function turnOnFullScreen() {
	console.log("attempting fullscreen...");
	if (
	document.fullscreenEnabled || 
	document.webkitFullscreenEnabled || 
	document.mozFullScreenEnabled ||
	document.msFullscreenEnabled
	) {
		console.log("can fullscreen...");
		var i = document.getElementById("screen");
		// go full-screen
		if (i.requestFullscreen) {
			i.requestFullscreen();
		} else if (i.webkitRequestFullscreen) {
			i.webkitRequestFullscreen();
		} else if (i.mozRequestFullScreen) {
			i.mozRequestFullScreen();
		} else if (i.msRequestFullscreen) {
			i.msRequestFullscreen();
		}
		
		fullscreen = true;
	}
}

function turnOffFullScreen() {
	if (
	document.fullscreenEnabled || 
	document.webkitFullscreenEnabled || 
	document.mozFullScreenEnabled ||
	document.msFullscreenEnabled
	) {
		var i = document.getElementById("screen");
		// go full-screen
		// exit full-screen
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		
		fullscreen = false;
	}
}

var buttonDownCheck = function(){
	var leftBtnDown = primepad.getButtonDown(14);
	var leftAxisDown = (primepad.getAxis(0) <= -1);
	if(leftBtnDown || leftAxisDown){
		me.left = true;
		if(leftBtnDown) me.btnMove = true;
		if(leftAxisDown){ 
			me.axisMove = true;
			me.pChar.axisDelayTimerLeft = 0;
		}
	}
	
	else me.pChar.axisDelayTimerLeft++;
	
	var rightBtnDown = primepad.getButtonDown(15);
	var rightAxisDown = (primepad.getAxis(0) >= 1);
	if(rightBtnDown || rightAxisDown){
		me.right = true;
		if(rightBtnDown) me.btnMove = true;
		if(rightAxisDown){
			me.axisMove = true;
			me.pChar.axisDelayTimerRight = 0;
		}
	}
	
	else me.pChar.axisDelayTimerRight++;
	
	if(primepad.getButtonDown(0)) me.jump = true;
	if(primepad.getButtonDown(13) || primepad.getAxis(1) >= 1){
		if(primepad.getButtonDown(13)) me.btnMove = true;
		me.down = true;
	}
		
	if(primepad.getButtonDown(2)) me.fireLV1 = true;
	if(primepad.getButtonDown(3)) me.fireLV2 = true;
	if(primepad.getButtonDown(1)) me.slide = true;
}

var buttonUpCheck = function(){
	var leftBtnUp = primepad.getButtonUp(14);
	var leftAxisUp = (primepad.getAxis(0) > -1);
	if(leftBtnUp || leftAxisUp){
		if(me.axisMove && leftAxisUp){
			me.left = false;
			me.pChar.dashPressTimeLeft = 1;
		}
		
		else if(me.btnMove && leftBtnUp){
			me.left = false;
			me.pChar.dashPressTimeLeft = 1;
			me.btnMove = false;
		}
	}
	
	var rightBtnUp = primepad.getButtonUp(15);
	var rightAxisUp = (primepad.getAxis(0) < 1);
	if(rightBtnUp || rightAxisUp){
		if(me.axisMove && rightAxisUp){
			me.right = false;
			me.pChar.dashPressTimeRight = 1;
		}
		
		else if(me.btnMove && rightBtnUp){
			me.right = false;
			me.pChar.dashPressTimeRight = 1;
			me.btnMove = false;
		}
	}
	
	if(!me.btnMove && !me.kbMove){
		if(me.pChar.axisDelayTimerLeft  > 2 && me.pChar.axisDelayTimerRight > 2){
			me.axisMove = false;
			me.dashing = false;
		}
	}
	
	if(primepad.getButtonUp(0)) me.jump = false;
	
	var downBtnUp = primepad.getButtonUp(13);
	if(downBtnUp || primepad.getAxis(1) < 1){
		if(me.btnMove && downBtnUp){
			me.down = false;
			me.btnMove = false;
		}
		else if (!me.btnMove) me.down = false;
	}
	
	if(primepad.getButtonUp(2)) me.fireLV1 = false;
	if(primepad.getButtonUp(3)) me.fireLV2 = false;
	if(primepad.getButtonUp(1)) me.slide = false;
}

var makeImg = function(str){
	var temp = new Image();
	temp.src = str;
	temp.onload = function() {
		temp.w = this.width
		temp.h = this.height;
		console.log(str + ' loaded');
	}
	console.log(str + ' -- ' + temp.w + 'x' + temp.h);
	return temp;
}

var patternFromHex = function(hexStr){
	if(hexStr == "#ff0000") return 0;
	if(hexStr == "#00ff00") return 1;
	if(hexStr == "#0000ff") return 2;
	return - 1;
}

var me;
var gState;
var reasonForNo;
var bgImg;
var drawCol = false;
var lastE;

var bulletImg = makeImg('img/bullet.png');
var playerSpawnImg = makeImg('img/player/spawn.png');
var playerImgBank = [ //characters
	[ //directions (xeek)
		[ //states (left)
			[ // frames (idle)
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_000.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_001.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_002.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_003.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_004.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_005.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/left/idle_006.png'),
			],
			[ //frames (run)
				makeImg('img/player/xeek/xeek_spriter_run/left/run_000.png'),
				makeImg('img/player/xeek/xeek_spriter_run/left/run_001.png'),
				makeImg('img/player/xeek/xeek_spriter_run/left/run_002.png'),
				makeImg('img/player/xeek/xeek_spriter_run/left/run_003.png'),
				makeImg('img/player/xeek/xeek_spriter_run/left/run_004.png'),
				makeImg('img/player/xeek/xeek_spriter_run/left/run_005.png'),
			],
			[ //frames (in-air)
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_000.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_001.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_002.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_003.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_004.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_005.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/left/jump_006.png'),
			],
		],
		
		[ //states (right)
			[ //frames (idle)
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_000.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_001.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_002.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_003.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_004.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_005.png'),
				makeImg('img/player/xeek/xeek_spriter_idle/right/idle_006.png'),
			],
			[ //frames (run)
				makeImg('img/player/xeek/xeek_spriter_run/right/run_000.png'),
				makeImg('img/player/xeek/xeek_spriter_run/right/run_001.png'),
				makeImg('img/player/xeek/xeek_spriter_run/right/run_002.png'),
				makeImg('img/player/xeek/xeek_spriter_run/right/run_003.png'),
				makeImg('img/player/xeek/xeek_spriter_run/right/run_004.png'),
				makeImg('img/player/xeek/xeek_spriter_run/right/run_005.png'),
			],
			[ //frames (in-air)
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_000.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_001.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_002.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_003.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_004.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_005.png'),
				makeImg('img/player/xeek/xeek_spriter_jump/right/jump_006.png'),
			],
		],
	],
];

$( document ).keydown(function( event ) {
	if(event.keyCode == 37){
		me.left = true;
		me.kbMove = true;
	}
	if(event.keyCode == 39){
		me.right = true;
		me.kbMove = true;
	}
	if(event.keyCode == 90) me.jump = true;
	if(event.keyCode == 40) me.down = true;
	
	if(event.keyCode == 88) me.fireLV1 = true;
	if(event.keyCode == 67) me.fireLV2 = true;
	if(event.keyCode == 86) me.slide = true;
});

$( document ).keyup(function( event ) {
	//lastE = event;
	//console.log(event);
	if(event.keyCode == 37){
		me.dashing = false;
		me.left = false;
		me.kbMove = false;
		me.pChar.dashPressTimeLeft = 1;
		
	}
	if(event.keyCode == 39){
		me.dashing = false;
		me.right = false;	
		me.kbMove = false;
		me.pChar.dashPressTimeRight = 1;
	}
	
	if(event.keyCode == 90) me.jump = false;
	if(event.keyCode == 40) me.down = false;
	if(event.keyCode == 88) me.fireLV1 = false;
	if(event.keyCode == 67) me.fireLV2 = false;
	if(event.keyCode == 86) me.slide = false;
	
	if(event.keyCode == 80) drawCol = !drawCol;
	
	if (event.keyCode == 13) (!fullscreen) ? turnOnFullScreen() : turnOffFullScreen();
});

$( document ).ready(function() {
	
	
	var gState = new GameState();
	gState.type = "GameState";
	
	var ctx = $("#screen")[0].getContext('2d');
	
	me = new Player();
		
	var sp = stage.spawnpoints[Math.floor(Math.random() * stage.spawnpoints.length)];
	me.setSpawnPoint(sp);
	
	//the main loop
	var mainLoop = function(){
		if(gState.type == "GameState"){
			
			if(me != undefined){
				buttonDownCheck();
				buttonUpCheck();
	
				me.update(stage);
			}

			gState.drawState(ctx, stage);
		}
		
		primepad.update();
	};

	var updateInterval = setInterval(mainLoop, 1000 / 60);
});