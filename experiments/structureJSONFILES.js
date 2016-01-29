
jsonFs = require('json-fs');
fsBuilder = new jsonFs.FSBuilder();
jsonBuilder = new jsonFs.JSONBuilder();

dir = appPath+'/temp2/';

rett = function (err, result) {
    if (err) {
      alert( err);
    }
    //justShowResult(van_dump(result)); 
		 
    plain = _.chain(result)
      .mapObject(function(v){
      	return _.pluck(v, 'sourceText').join('\n//---- \n')
    })
      .pairs().map(function(v){return `//${v[0]}\n //-[]-- \n`+v[1]})
      .value().join('\n');
  	jetpack.write('allsrc.js', plain);
  	justShowResult(plain)
    
    syncSizeLines();
  }
  jsonBuilder.setSource(dir)
	jsonBuilder.build(rett);
