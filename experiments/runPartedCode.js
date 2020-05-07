
TOTALPARTS = 0;
fullSrc = [];
justShowFullSrc = function(){
  var srcc = fullSrc.join('\n\n')
	windowManager.get('window_11').content().send('justSource', srcc)
  windowManager.get('window_11').execute('handleRunButton()');
}

controllSumm = 0;

justReturn = function(e, v, i){
  controllSumm +=i;
  fullSrc[i] = v
  
  //(Math.sqrt(L*2)|0)
  if( controllSumm == TOTALPARTS){
  	justShowFullSrc()
  }
}  


once('init', function(){
  
	//wb = windowManager.get('window_11')
	cname = windowManager.getCurrent().name
	require('electron').ipcRenderer.on('justReturn', justReturn);
  
})  






var n = 0
o = ''
for (var i = 0; cwindow = windowManager.get('bozon_' + i); i++) {
  o += i + ' '

  

remoteScript = `
//alert(123)
var re_src =  document.getElementById('source').innerText;
windowManager.get('${cname}').content().send('justReturn', re_src, ${i});`

  
  cwindow.execute(remoteScript) 
  
  
}
TOTALPARTS = i*(i+1)/2;	

o+TOTALPARTS
//windowManager.getCurrent().name