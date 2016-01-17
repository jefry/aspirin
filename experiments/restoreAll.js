var dk = JSON.parse(localStorage.Knows);
function startKnows(know, id){
		if (id < 2) return;

		window.open('file://' + __dirname + '/index.html');
  	var win = remote.BrowserWindow.fromId(id);
		
  	if(win)	{
      
				win.webContents.on("did-finish-load", function() {
				  win.webContents.send('justUpdate');
      	  win.webContents.send('justScrollAll');
				})
    }
}
dk.forEach(startKnows)



