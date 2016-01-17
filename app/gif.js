var cw = require('remote').getCurrentWindow()

var m = 600
function move(){
    m = m%629
    m++;
    pp = require('remote').require("robotjs").getMousePos()


    y = Math.floor(pp.y + Math.cos(m/100) * 300-100)

    x = Math.floor(pp.x + Math.sin(m/25) * 300-100)

    //console.log(m,pp.x,x, Math.sin(m/100))
    //pp = cw.getPosition()
    cw.setPosition(x, y)

}


var II = II || 0;

//cw.setPosition(-50,900)

clearInterval(II)
II = setInterval(move, 0)
