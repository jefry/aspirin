var robot = remote.require("./rjs");
debugger

function Render(){

//Get mouse position.
  var mouse = robot.getMousePos();
  var hex = robot.getPixelColor(mouse.x, mouse.y);
  //console.log(mouse, "#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
  document.querySelector('.drag').innerHTML = "#" + hex + " at x:" + mouse.x + " y:" + mouse.y
}
