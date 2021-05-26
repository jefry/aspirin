let PM = require('live-plugin-manager').PluginManager;


let manager = new PM();


function run(moduleName) {
    return new Promise(
        res => manager.install(moduleName)
            .then(() => {
                const module = manager.require(moduleName);
                //manager.uninstall(moduleName);
                res(module);
            }))
}

async function asy_run(moduleName) {
    console.log(moduleName);
    await manager.install('react');
    await manager.install('react-dom');
    //debugger
    await manager.install(moduleName);

    //console.log(manager.installedPlugins.map(v=>[v.name, v.version, v.location]))
    const myModule= manager.require(moduleName);


    //await manager.uninstall(moduleName);
    return myModule;
}

/*
false && run('moment').then(moment => {
    let p = moment().format('dddd, DD MMMM');
    let a = [
        p,
        moment.version
    ];

    mmm = moment;

    console.log(a)
});*/

1&&asy_run('@material-ui/core').then(module=>{
    console.log(module)
    mat = module
    //console.log(a)
});

console.log(123);