class PrimePad{
	constructor(){
		//var gamepad;
		//var chromepad;
		this.chromeIndex = -1;

		//this.lastBtnValues = {};
		this.direction = {val: -1, prev: -1, time: 0};
		this.buttonPressTime = [];
	}
	
	setEventListeners(){
		window.addEventListener("gamepadconnected", function(e) {
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index, e.gamepad.id,
			e.gamepad.buttons.length, e.gamepad.axes.length);
			
			this.gamepad = e.gamepad;
		});
		
		window.addEventListener("gamepaddisconnected", function(e) {
			console.log("Gamepad disconnected from index %d: %s",
			e.gamepad.index, e.gamepad.id);
		});
	}
	
	pollChromePad(){
		this.chromepad = navigator.getGamepads()[0];
		if(this.chromeIndex >= 0) this.chromepad = navigator.getGamepads()[this.chromeIndex];
		else{
			for(var i = 0; i < navigator.getGamepads().length; i++){
				if(navigator.getGamepads()[i] != undefined){
					if(navigator.getGamepads()[i].buttons[0].pressed){
						this.chromeIndex = i;
					}
				}
			}
		}
	}
	
	noController(){
		if(!window.chrome && this.gamepad == undefined) return true;
		if(window.chrome && this.chromepad == undefined) return true;
		if(window.chrome && this.chromeIndex < 0) return true;
		return false;
	}

	getAxis(num){
		if(this.chromepad != undefined){
			if(this.chromepad.axes[num] != undefined) return this.chromepad.axes[num];
			return 0;
		}
		
		if(this.gamepad != undefined){
			if(this.gamepad.axes[num] != undefined) return this.gamepad.axes[num];
			else return 0;
		}
		
		return 0;
	}
	
	isButtonDown(num){
		if(this.chromepad != undefined){
			if(this.chromepad.buttons[num] != undefined){
				if(this.chromepad.buttons[num].pressed) return true;
				else if(this.chromepad.buttons[num].value == 1) return true;
			}
			
			return false;
		}
		
		if(this.gamepad != undefined){
			if(this.gamepad.buttons[num].pressed) return true;
			else if(this.gamepad.buttons[num].value == 1) return true;
		}
		return false;
	}
	
	getButtonDown(num){
		//if(this.isButtonDown(num)){
			var result = false;
			var btnFound = false;
			for(var i = 0; i < this.buttonPressTime.length; i++){
				if(this.buttonPressTime[i].button == num){
					btnFound = true;
					if(this.buttonPressTime[i].prevTime == 0 && this.buttonPressTime[i].time > 0) result = true;
				}
			}
			
			if(!btnFound){
				this.buttonPressTime.push({ button: num, time: 0, prevTime: 0 });
			}
			
			return result;
		//}
		
		//return false;
	}
	
	getButton(num){
		var result = false;
		for(var i = 0; i < this.buttonPressTime.length; i++){
			if(this.buttonPressTime[i].button == num){
				result = true;
			}
		}
		
		return result;
	}
	
	getButtonUp(num){
		//if(!this.isButtonDown(num)){
		var result = false;
		for(var i = 0; i < this.buttonPressTime.length; i++){
			if(this.buttonPressTime[i].button == num){
				if(this.buttonPressTime[i].prevTime > 0 && this.buttonPressTime[i].time == 0) result = true;
			}
		}
		
		return result;
	}
	
	update(){
		this.pollChromePad();
		for(var i = 0; i < this.buttonPressTime.length; i++){
				this.buttonPressTime[i].prevTime = this.buttonPressTime[i].time;
				if(this.isButtonDown(this.buttonPressTime[i].button)) this.buttonPressTime[i].time++;
				else this.buttonPressTime[i].time = 0;
		}
	}
}