
//Get pixel color under the mouse. 
var robot = require("robotjs");


function Render(){

//Get mouse position. 
var mouse = robot.getMousePos();
var hex = robot.getPixelColor(mouse.x, mouse.y);
console.log(mouse, "#" + hex + " at x:" + mouse.x + " y:" + mouse.y);

}

setInterval(Render,100)

//Move the mouse across the screen as a sine wave.
//Speed up the mouse.

return

robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = 2*screenSize.width;

for (var x = 0; x < width; x++)
{
    y = height * Math.sin((twoPI * x) / width) + height;
    //console.log(mouse, "#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
    robot.moveMouse(x-screenSize.width, y);
}