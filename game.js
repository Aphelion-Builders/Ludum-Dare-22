// Global constants:
var PLAYGROUND_WIDTH	= 1024;
var PLAYGROUND_HEIGHT	= 576;
var REFRESH_RATE		= 15;

var playerAnimation = new Array();

// Function to restart the game:
function restartgame()
{
	window.location.reload();
};

function Player(node){

	return true;
}

$(function()
{
	var background1 = new $.gameQuery.Animation({imageURL: "backgrounds/background1.png"});

	playerAnimation["right"]	= new $.gameQuery.Animation({imageURL: "player/golem_right.png"});
	playerAnimation["left"]		= new $.gameQuery.Animation({imageURL: "player/golem_left.png"});
	playerAnimation["up"]		= new $.gameQuery.Animation({imageURL: "player/golem_up.png"});
	playerAnimation["down"]		= new $.gameQuery.Animation({imageURL: "player/golem_down.png"});

	// Initialize the game:
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});
	$.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background1", {animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
				.addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addGroup("player", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: 100, height: 26})
						.end()
					.end()


	$("#player")[0].player = new Player($("#player"));
	
	//this is the HUD for the player life and shield
	$("#overlay").append("<div id='shieldHUD'style='color: white; width: 100px; position: absolute; font-family: verdana, sans-serif;'></div><div id='lifeHUD'style='color: white; width: 100px; position: absolute; right: 0px; font-family: verdana, sans-serif;'></div>")
	
	// this sets the id of the loading bar:
	$().setLoadBar("loadingBar", 400);
	
	//initialize the start button
	$("#startbutton").click(function()
	{
		$.playground().startGame(function()
		{
			$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
		})
	});

	$(document).keydown(function(e)
	{
		switch(e.keyCode)
		{
			case 65: //this is left! (a)
				$("#playerBooster").setAnimation(playerAnimation["left"]);
				break;
			case 87: //this is up! (w)
				$("#playerBoostUp").setAnimation(playerAnimation["up"]);
				break;
			case 68: //this is right (d)
				$("#playerBooster").setAnimation(playerAnimation["right"]);
				break;
			case 83: //this is down! (s)
				$("#playerBoostDown").setAnimation(playerAnimation["down"]);
				break;
		}
	});

	//this is where the keybinding occurs
	$(document).keyup(function(e)
	{
			switch(e.keyCode)
			{
				case 65: //this is left! (a)
					$("#playerBooster").setAnimation(playerAnimation["boost"]);
					break;
				case 87: //this is up! (w)
					$("#playerBoostUp").setAnimation();
					break;
				case 68: //this is right (d)
					$("#playerBooster").setAnimation(playerAnimation["boost"]);
					break;
				case 83: //this is down! (s)
					$("#playerBoostDown").setAnimation();
					break;
			}
	});
});