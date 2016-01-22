//-c7
wb = windowManager.get('bozon')
//s = String(fs.readFileSync('experiments/warptest.js'))
cpath =  'file://' + remote.app.getAppPath() + '/bozon/index.html';
//as = s.split('\n\n').forEach(load)

s = editor.getValue();
s.split('\n\n').forEach(load)

function load(v,i){
	var w = windowManager.get('bozon_'+i)
  if(!w){
      w = windowManager.createNew('bozon_'+i, 'Bozon', cpath); 
      w.open()
     }
	//w.open()	//w.open()
 	w.execute('bozid = '+i+';')
  //if(i!=3)
  w.content().send('justSource', v)
  w.execute('syncSizeLines();')  
	if(i==0)
	  w.content().send('justScrollAll', v) 
}
//windowManager.get('bozon_0').object.setPosition(2100, 300)

var bounds = 
{
  "x": 1702,
  "y": 379,
  "width": 680,
  "height": 136
};

//bounds = cw.getBounds()
//var dw = windowManager.get('bozon_0')
//    if (dw)
//      dw.content().send('justMoveDowin',  bounds);

//var cb = cw.getBounds();
//el_src.innerText = 'Y = '+ cb.y +';';
//windowManager.get('window_16').execute('handleRunButton()');
//y = bounds.y;
//y = y%500;
windowManager.get('bozon').content().send('justSource', JSON.stringify(bounds,null,2));
windowManager.get('bozon').object.setPosition(bounds.x+100, bounds.y-200)
//'good'
//windowManager.get('window_16').execute('handleRunButton()');

//END