



var n = 0 ;
setInterval(function(){
  n = n%400;
  n++
	s = remote.getCurrentWindow().getPosition(); 
  remote.BrowserWindow.fromId(3).setPosition(300, n+s[1])
},50) 
