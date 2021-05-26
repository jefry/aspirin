npm = require('npm')

commandFailed = (er)=>console.error(er)
myConfigObject = {aaa:'bbb'}

arr = []

1&&npm.load(myConfigObject, function (er) {
  justShowResult('LOAD')
  if (er) return handlError(er)
  1&&npm.commands.info(['live-plugin-manager'], function (er, data) {
    if (er) return commandFailed(er)
    console.log('succ', data)
    justShowResult(van_dump(data))
    // command succeeded, and data might have some info
  })
  
  npm.on('log', function (message) { 
    console.warn(message);
    arr.push(message); 
  });
  
  //console.log('aaa', npm.verison())  
              
              
              
})
  

'--'
//o = Object.keys(npm.commands).join('\n')
