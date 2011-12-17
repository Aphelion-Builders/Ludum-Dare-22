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
						.addGroup("player", {posx: 0, posy: PLAYGROUND_HEIGHT-128, width: 128, height: 128})
							.addSprite("playerBody",{animation: playerAnimation["right"], posx: 0, posy: 0, width: 128, height: 128})
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
					if(nextpos < PLAYGROUND_WIDTH - 100){
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
					if(nextpos < PLAYGROUND_HEIGHT - 30){
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
			
			//Update the movement of the enemies
			$(".enemy").each(function(){
					this.enemy.update($("#player"));
					var posx = parseInt($(this).css("left"));
					if((posx + 100) < 0){
						$(this).remove();
						return;
					}
					//Test for collisions
					var collided = $(this).collision("#playerBody,.group");
					if(collided.length > 0){
						if(this.enemy instanceof Bossy){
								$(this).setAnimation(enemies[2]["explode"], function(node){$(node).remove();});
								$(this).css("width", 150);
						} else if(this.enemy instanceof Brainy) {
							$(this).setAnimation(enemies[1]["explode"], function(node){$(node).remove();});
							$(this).css("width", 150);
						} else {
							$(this).setAnimation(enemies[0]["explode"], function(node){$(node).remove();});
							$(this).css("width", 200);
						}
						$(this).removeClass("enemy");
						//The player has been hit!
						if($("#player")[0].player.damage()){
							explodePlayer($("#player"));
						}
					}
					//Make the enemy fire
					if(this.enemy instanceof Brainy){
						if(Math.random() < 0.05){
							var enemyposx = parseInt($(this).css("left"));
							var enemyposy = parseInt($(this).css("top"));
							var name = "enemiesMissile_"+Math.ceil(Math.random()*1000);
							$("#enemiesMissileLayer").addSprite(name,{animation: missile["enemies"], posx: enemyposx, posy: enemyposy + 20, width: 30,height: 15});
							$("#"+name).addClass("enemiesMissiles");
						}
					}
				});
			
			//Update the movement of the missiles
			$(".playerMissiles").each(function(){
					var posx = parseInt($(this).css("left"));
					if(posx > PLAYGROUND_WIDTH){
						$(this).remove();
						return;
					}
					$(this).css("left", ""+(posx+MISSILE_SPEED)+"px");
					//Test for collisions
					var collided = $(this).collision(".group,.enemy");
					if(collided.length > 0){
						//An enemy has been hit!
						collided.each(function(){
								if($(this)[0].enemy.damage()){
									if(this.enemy instanceof Bossy){
											$(this).setAnimation(enemies[2]["explode"], function(node){$(node).remove();});
											$(this).css("width", 150);
									} else if(this.enemy instanceof Brainy) {
										$(this).setAnimation(enemies[1]["explode"], function(node){$(node).remove();});
										$(this).css("width", 150);
									} else {
										$(this).setAnimation(enemies[0]["explode"], function(node){$(node).remove();});
										$(this).css("width", 200);
									}
									$(this).removeClass("enemy");
								}
							})
						$(this).setAnimation(missile["playerexplode"], function(node){$(node).remove();});
						$(this).css("width", 38);
						$(this).css("height", 23);
						$(this).css("top", parseInt($(this).css("top"))-7);
						$(this).removeClass("playerMissiles");
					}
				});
			$(".enemiesMissiles").each(function(){
					var posx = parseInt($(this).css("left"));
					if(posx < 0){
						$(this).remove();
						return;
					}
					$(this).css("left", ""+(posx-MISSILE_SPEED)+"px");
					//Test for collisions
					var collided = $(this).collision(".group,#playerBody");
					if(collided.length > 0){
						//The player has been hit!
						collided.each(function(){
								if($("#player")[0].player.damage()){
									explodePlayer($("#player"));
								}
							})
						//$(this).remove();
						$(this).setAnimation(missile["enemiesexplode"], function(node){$(node).remove();});
						$(this).removeClass("enemiesMissiles");
					}
				});
		}
	}, REFRESH_RATE);
	
	//this is where the keybinding occurs
	$(document).keydown(function(e){
		if(!gameOver && !playerHit){
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
		if(!gameOver && !playerHit){
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

