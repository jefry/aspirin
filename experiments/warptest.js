text = `var results = document.getElementById('source');
  var containerWidth = 680;// container.offsetWidth;
  var resultsHeight = results.offsetHeight;`;

wb = windowManager.get('bozon')
wbEditor = windowManager.get('Editor2')

Y = 168;

ss = 'CurentBounds = '+JSON.stringify(cw.getBounds(),null,2)
wb.content().send('justSource',ss)


//wb.execute('syncSizeLines()')
//wb.content().send('justScrollAll')

wb.move(Y+ 1920, 100)
window.ii++
ee = 11
wb.execute(`document.body.style.fontSize = '${ii}px'`)
ii

