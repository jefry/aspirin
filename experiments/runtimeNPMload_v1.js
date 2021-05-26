mkConsole= ()=>{
  function C(...args){};
  Object.assign(C.prototype, console);
  return C;
};
console.Console = mkConsole();

Debug = require('debug')
Debug.log = (...args)=>console.log(...args);
Debug.enable("live-plugin-manager.PluginVm");

obj = {toWhat: "World"};

function start(){
  const PluginManager = require('live-plugin-manager').PluginManager;
  const manager = new PluginManager({staticDependencies:{
    path: {...path},
    depd: require('depd'),
  }});
  let out={ off:v=>v, man:()=>manager};
  
  let txt = '<button class="btn btn-mini btn-default" onClick="out.off()">StopServer</button> '
  +'<button class="btn btn-mini btn-default" onClick="out.clean()">UninstallAll</button>';

  async function run() {
    //*
    justShowResult("Installing express...");
    await manager.install("express", "4.16.2");
    //await manager.install("codemirror", "5.21.0");
    
    justShowResult("Installing react...");
    await manager.install("react", "16.0.0");
    
    justShowResult("Installing react-dom...");
    await manager.install("react-dom", "16.0.0");
    /**/
    
    justShowResult('Bootstrap Express')
    const express = manager.require("express");
    const React = manager.require("react");
    const ReactDOMServer = manager.require("react-dom/server");
    

    const app = express();
    
    console.log("Express", app);
    app.get("/", function(req, res) {

      class Hello extends React.Component {
        render() {
          return React.createElement("div", null, `Hello ${this.props.toWhat} from React!`);
        }
      }

      const elementToRender = React.createElement(Hello, obj, null);
      const reactResult = ReactDOMServer.renderToString(elementToRender);
      res.send(reactResult);
    });

    const server = app.listen(3000, function() {
     
      justShowResult('Example app listening on port 3000; '+txt, 1);
      console.info("Example app listening on port 3000 ;");
    });

    
    out.off = async () => {
      justShowResult("Stopping...");
      server.close();
      justShowResult("Server off"+txt,1);
    }
    
    out.clean = async () => {
      justShowResult("Uninstalling plugins...");
      await manager.uninstallAll();
      justShowResult('Uninstaled... ok'+txt,1)
    }
    
  }

  run().catch(console.error.bind(console));

  return out;
}
window.out?.off();
out = start();

;'aaa'//+d.enabled