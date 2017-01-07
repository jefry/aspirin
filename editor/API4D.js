function createNew(a,b,c,c2){
    let arr = jetpack.read(appPath+'/ASKA_4D.json','json');
    arr = save_new_code4D(arr,c,c2)
    arr = linked4D(arr,a,b,c)
    jetpack.write(appPath+'/ASKA_4D.json',arr)
  }
  /////////////////////////////////////////////
  function search4D(arr,name){
    arr.map((v,index)=>{
      if(v[0] == name){name=index}
    })
    if(isNaN(name)){
      aska('ненашла имя')
      name = 0;
    }
    return name
  }
  //////////////////////////////////////
  function save4D(arr,a,b,c){
    a = search4D(arr,a)
    b = search4D(arr,b)
    c = search4D(arr,c)
    let d = (a+b+c)/3
    return d
  }
  //////////////////////////////////////
  function linked4D(arr,a,b,c){
    let link = save4D(arr,a,b,c)
    b = search4D(arr,b)
    arr[b].push(link)
    return arr
  }
  //////////////////////////////////////
  function delete_link4D(arr,a,b,c){
    a = search4D(arr,a)
    b = search4D(arr,b)
    c = search4D(arr,c)
    let i = 0
    let linker = arr[b]
    linker.map((v,index)=>{
      if(index > 1){
        if(calc4D(v,b,c) == a){ i = index}
      }
    })
    linker.splice(i,1)
    arr[b] = linker
    return arr
  }
  //////////////////////////////////////
  function delete_all_link4D(arr,b){
    b = search4D(arr,b)
    let linker = [arr[b][0],arr[b][1]]
    arr[b] = linker
    return arr
  }
  //////////////////////////////////////
  function calc4D(link,a,b){
    return link = (link*3)-(a+b)
  }
  //////////////////////////////////////
  function clear_null_in_numbers(n){
    n = n.filter((v)=>{if(isNaN(v)){}else{return v}})
    return n
  }
  //////////////////////////////////////
  function clear_null_in_names(n){
    n = n.filter((v)=>{if(isFinite(v)){}else{return v}})
    return n
  }
  //////////////////////////////////////
  function reflect4D(arr,a,b){
    let c = 0
    a = search4D(arr,a)
    b = search4D(arr,b)
    let n = [];
    arr[b].filter((v)=>{n.push(calc4D(v,a,b))})
    n = clear_null_in_numbers(n)
    return n
  }
  //////////////////////////////////////
  function all_links4D(arr,a,b){
    //console.log(a)
    //console.log(b)
    let d = reflect4D(arr,a,b)
    //console.log(d)
    d = d.map((v)=>{if(arr[v]){
      return v = arr[v][0]
    }})
    d = clear_null_in_names(d)
    return d
  }


