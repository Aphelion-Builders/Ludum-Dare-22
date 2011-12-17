// Global constants:
var PLAYGROUND_WIDTH	= 1024;
var PLAYGROUND_HEIGHT	= 576;
var REFRESH_RATE		= 15;

// Gloabl animation holder
var playerAnimation = new Array();

var playerHit = false;
var timeOfRespawn = 0;
var gameOver = false;

// Function to restart the game:
function restartgame()
{
	window.location.reload();
};

// Game objects:
function Player(node){

	this.node = node;

	this.update = function(){
		if((this.respawnTime > 0) && (((new Date()).getTime()-this.respawnTime) > 3000)){
			this.grace = false;
			$(this.node).fadeTo(500, 1); 
			this.respawnTime = -1;
		}
	}
	
	return true;
}

// --------------------------------------------------------------------------------------------------------------------
// --                                      the main declaration:                                                     --
// --------------------------------------------------------------------------------------------------------------------
$(function()
{
	
	// The background:
	var background1 = new $.gameQuery.Animation({imageURL: "backgrounds/background1.png"});

	// Player space shipannimations:
	playerAnimation["up"]		= new $.gameQuery.Animation({imageURL: "player/golem_up.png"});
	playerAnimation["down"]		= new $.gameQuery.Animation({imageURL: "player/golem_down.png"});
	playerAnimation["right"]	= new $.gameQuery.Animation({imageURL: "player/golem_right.png"});
	playerAnimation["left"]		= new $.gameQuery.Animation({imageURL: "player/golem_left.png"});
	
	// Initialize the game:
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});
				
	// Initialize the background
	$.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background1", {animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
					.end()
					.addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addGroup("player", {posx: 10, posy: 480, width: 38, height: 90})
							.addSprite("playerBody",{animation: playerAnimation["right"], posx: 0, posy: 0, width: 38, height: 90})
						.end()
					.end()
	
	$("#player")[0].player = new Player($("#player"));
	
	// this sets the id of the loading bar:
	$().setLoadBar("loadingBar", 400);
	
	//initialize the start button
	$("#startbutton").click(function(){
		$.playground().startGame(function(){
			$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
		});
	})
	
	// this is the function that control most of the game logic 
	$.playground().registerCallback(function(){
		if(!gameOver){
			if(!playerHit){
				$("#player")[0].player.update();
				if(jQuery.gameQuery.keyTracker[37]){ //this is left! (a)
					var nextpos = parseInt($("#player").css("left"))-5;
					if(nextpos > 0){
						$("#player").css("left", ""+nextpos+"px");
					}
				}
				if(jQuery.gameQuery.keyTracker[39]){ //this is right! (d)
					var nextpos = parseInt($("#player").css("left"))+5;
					if(nextpos < PLAYGROUND_WIDTH - 40){
						$("#player").css("left", ""+nextpos+"px");
					}
				}
				if(jQuery.gameQuery.keyTracker[38]){ //this is up! (w)
					var nextpos = parseInt($("#player").css("top"))-3;
					if(nextpos > 0){
						$("#player").css("top", ""+nextpos+"px");
					}
				}
				if(jQuery.gameQuery.keyTracker[40]){ //this is down! (s)
					var nextpos = parseInt($("#player").css("top"))+3;
					if(nextpos < PLAYGROUND_HEIGHT/2){
						$("#player").css("top", ""+nextpos+"px");
					}
				}
			} else {
				var posy = parseInt($("#player").css("top"))+5;
				var posx = parseInt($("#player").css("left"))-5;
				if(posy > PLAYGROUND_HEIGHT){
					//Does the player did get out of the screen?
					if($("#player")[0].player.respawn()){
						gameOver = true;
						$("#playground").append('<div style="position: absolute; top: 50px; width: 700px; color: white; font-family: verdana, sans-serif;"><center><h1>Game Over</h1><br><a style="cursor: pointer;" id="restartbutton">Click here to restart the game!</a></center></div>');
						$("#restartbutton").click(restartgame);
						$("#actors,#playerMissileLayer,#enemiesMissileLayer").fadeTo(1000,0);
						$("#background").fadeTo(5000,0);
					} else {
						$("#explosion").remove();
						$("#player").children().show();
						$("#player").css("top", PLAYGROUND_HEIGHT / 2);
						$("#player").css("left", PLAYGROUND_WIDTH / 2);
						playerHit = false;
					}
				} else {
					$("#player").css("top", ""+ posy +"px");
					$("#player").css("left", ""+ posx +"px");
				}
			}
		}
	}, REFRESH_RATE);
	
	//this is where the keybinding occurs
	$(document).keydown(function(e){
		if(!gameOver)
		{
			switch(e.keyCode)
			{
				case 37: //this is left! (a)
					$("#playerBody").setAnimation(playerAnimation["left"]);
					break;
				case 38: //this is up! (w)
					$("#playerBody").setAnimation(playerAnimation["up"]);
					break;
				case 39: //this is right (d)
					$("#playerBody").setAnimation(playerAnimation["right"]);
					break;
				case 40: //this is down! (s)
					$("#playerBody").setAnimation(playerAnimation["down"]);
					break;
			}
		}
	});
	//this is where the keybinding occurs
	$(document).keyup(function(e){
		if(!gameOver)
		{
			switch(e.keyCode){
				case 37: //this is left! (a)
					$("#playerBody").setAnimation(playerAnimation["left"]);
					break;
				case 38: //this is up! (w)
					$("#playerBody").setAnimation(playerAnimation["up"]);
					break;
				case 39: //this is right (d)
					$("#playerBody").setAnimation(playerAnimation["right"]);
					break;
				case 40: //this is down! (s)
					$("#playerBody").setAnimation(playerAnimation["down"]);
					break;
			}
		}
	});
});

