mkConsole= ()=>{
  function C(...args){};
  Object.assign(C.prototype, console);
  return C;
};
console.Console = mkConsole();

Debug = require('debug');
Debug.log = (...args)=>console.log(...args);
Debug.enable("live-plugin-manager.PluginVm");


PluginManager = require('live-plugin-manager').PluginManager;
manager = new PluginManager({staticDependencies:{
  path: {...path},
  depd: require('depd'),
}});

async function run() {
  await manager.uninstall('lime13');
  await manager.installFromCode('lime13','const fe = (v)=>console.log("ABC "+v); module.exports ={fe};', '1.0.2')
    
  return manager.require('lime13');
}

0&&run().then(lime13=>{
  
  lime13.fe('123')




  li = manager.require('lime13');         
              
})
li.fe(123)