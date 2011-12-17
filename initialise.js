$(function(){
  $("#playground").playground({width: 800, height: 600, keyTracker: true});
  game.playground = $.playground();
  game.background = $("#sceengraph");

  game.golem = new Golem();
  game.playground
    .addSprite("Golem", {animation: game.farmer.getAnimation(),
      width: game.farmer.width, height: game.farmer.height, posx: 400, posy: 300});
  game.golem.elem = $("#golem");
  game.golem.setPos(100, 100);

  view = new GolemView();
  registerCallbacks();

  game.state = "not-started";

  keyTracker = $.gameQuery.keyTracker;
  $().setLoadBar("loading-bar", 400);
});