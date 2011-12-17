$(function()
{
	$("#playground").playground({width: 1024, height: 768, keyTracker: true});
	game.playground = $.playground();
	game.background = $("#sceengraph");
	game.state = "not-started";

	keyTracker = $.gameQuery.keyTracker;
	$().setLoadBar("loading-bar", 400);
});

function registerCallbacks(){
  game.playground
    .registerCallback(gameLoop, JarmView.frameRate)
    .registerCallback(function() {view.update();}, view.updateRate);

  $("#start-button").click(function(){
    game.state = "playing";
    game.playground
      .startGame(function(){
        $("#welcome-screen").remove();
      });
  });

  $(document).keypress(onKeyPress);
  $(document).click(onClick);
}