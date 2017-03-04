var importlevel = function(str){
	var jsonObj = JSON.parse(str);
	
	stage = [];
	
	for(var i = 0; i < jsonObj.polygons.length; i++){
		stage.push(polygonColliderFromJSON(jsonObj.polygons[i]));
	}
	
	stage.spawnpoints = [];
	
	for(var i = 0; i < jsonObj.spawnpoints.length; i++){
		console.log(jsonObj.spawnpoints[i].y);
		stage.spawnpoints.push(new Vec2(jsonObj.spawnpoints[i].x, jsonObj.spawnpoints[i].y));
	}
}

var recreatelevel = function(){
	importlevel(
	
	'{ "imgName" : "map1.png","polygons" : [{ "passthrough" : false,"debugColor" : "#00ff00","points" : [{ "x" : 0, "y" : 385 },{ "x" : 241, "y" : 386 },{ "x" : 311, "y" : 416 },{ "x" : 311, "y" : 486 },{ "x" : -4, "y" : 486 } ] },{ "passthrough" : true,"debugColor" : "#00ff00","points" : [{ "x" : 21, "y" : 271 },{ "x" : 196, "y" : 271 },{ "x" : 196, "y" : 273 },{ "x" : 21, "y" : 273 } ] },{ "passthrough" : true,"debugColor" : "#00ff00","points" : [{ "x" : 20, "y" : 190 },{ "x" : 196, "y" : 190 },{ "x" : 196, "y" : 192 },{ "x" : 26, "y" : 192 } ] },{ "passthrough" : false,"debugColor" : "#00ff00","points" : [{ "x" : 285, "y" : 160 },{ "x" : 451, "y" : 161 },{ "x" : 431, "y" : 191 },{ "x" : 296, "y" : 191 } ] },{ "passthrough" : false,"debugColor" : "#00ff00","points" : [{ "x" : 450, "y" : 290 },{ "x" : 646, "y" : 291 },{ "x" : 646, "y" : 316 },{ "x" : 451, "y" : 321 } ] },{ "passthrough" : false,"debugColor" : "#00ff00","points" : [{ "x" : 270, "y" : 415 },{ "x" : 651, "y" : 421 },{ "x" : 646, "y" : 481 },{ "x" : 271, "y" : 481 } ] }],"spawnpoints" : [{ "x" : 385, "y" : 405 },{ "x" : 570, "y" : 280 },{ "x" : 105, "y" : 175 },{ "x" : 320, "y" : 145 }] } '
	
	);
}

recreatelevel();