var cw = remote.getCurrentWindow()
var n = 100
var m = 10
function move(){
    //m = m%629
    m++;
    pp = remote.require("robotjs").getMousePos()


         x = Math.floor(pp.x + Math.sin(m/100) * (m/n))
         y = Math.floor(pp.y + Math.cos(m/200) * (m/n))

    console.log(cw.setTitle("FF"))
    pp = cw.getPosition()

    cw.setPosition(x, y)

}


var II = II || 0;

//cw.setPosition(-50,90)
//
// clearInterval(II)
// II = setInterval(move, 3)
