var crwin = remote.getCurrentWindow();

var upwin = remote.BrowserWindow.fromId(crwin.id+1)


var dowin = remote.BrowserWindow.fromId(crwin.id-1)

//thisw._events.move = [];
//thisw.on('move',function(){
var y = 0;


document.body.onmousewheel = function(me){
    var cb = crwin.getBounds();
    y = cb.y + me.wheelDeltaY/3|0;

  	crwin.setPosition(cb.x, y) 

    var ub = upwin.getBounds();
    //var db = dowin.getBounds();

  	upwin.setPosition(cb.x, y - ub.height)
    dowin.setPosition(cb.x, y + cb.height)
}




