/*Copyright (c) 2013-2016, Rob Schmuecker
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Rob Schmuecker may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/


// Get JSON data
treeJSON = d3.json(appPath+'/ASKA_4D_d3.json', function(error, treeData) {
  //ASKA

  function Aska_d3_render(){
    d3.json(appPath+'/ASKA_4D_d3.json', function(error, json) {
      if (error) throw error;
      svg.selectAll(".link").remove(".link")
      svg.selectAll(".node").remove(".node")
      var nodes = tree.nodes(json),
          links = tree.links(nodes);
      var link = svg.selectAll("path.link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal)
      var node = svg.selectAll("g.node")
      .data(nodes)
      .enter().append("g")
      .attr("id", function(d) { return  "wid"})//d.name
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

      node.append("circle")
        .attr("r", function(d) { return d.size; })
      node.append("text")
        .attr("dx", function(d) { return d.children ? -16 : -16; })
        .attr("dy", -2)
        .attr("id", function(d) { return  d.name})//d.name


        .attr("style", function(d){
        if(d.name == window.run_color){
          d.color = '99dd00'
        }
        let ti = "stroke:#"+d.color+";font: "+d.fontsize+"px Verdana, Arial, sans-serif;";
        return ti
      })
        .attr( "onclick",function(d) {
        return "aska('"+d.name+"','"+d.previous_name+"','"+d.earlier_name+"')" 
      })
        .attr( "oncontextmenu",function(d) { return "aska_speech_config('"+d.name+"','"+d.previous_name+"','"+d.earlier_name+"');" })  //aska_redactor('"+d.name+"'); just.run('${name}', this)
      //.attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.name})

      node.append("text")
        .attr("dx", function(d) { return d.children ? 30 : 30; })
        .attr("dy", 11)
        .attr("style", function(d) { return "stroke:#353535;font: "+(d.fontsize-8)+"px  Arial;"; })
        .text(function(d) { return d.coments});//

      node.append("text")
        .attr("dx", function(d) { return d.children ? 40 : 40; })
        .attr("dy", 21)
        .attr("style", function(d) { return "stroke:#303030;font: "+(d.fontsize-8)+"px  Arial;"; })
        .text(function(d) { return d.coments2});//
      /*
      node.append("text")
        .attr("dy", +4)
        .attr("style", function(d) { return "stroke:#000;font:"+(d.fontsize-5)+"px  Arial;"; })
        .attr("dx", function(d){ return d.children ? -50:-50})
        .text(function(d) { return d.coments3});
*/

      node.append("text")
        .attr("dy", 11)
        .attr("style", function(d) { return "stroke:#222;font:"+(d.fontsize-6)+"px  Arial;"; })
        .attr("dx", function(d) { return d.children ? -15 : -15; })
        .text(function(d) { return d.coments3});

    });
  }
  //////////////////////////////////////

  //////////////////////////////////////
  function save_new_code4D(arr,name,code){
    let count = 0
    arr.map((v,index)=>{if(v[0]==name){count +=1; arr[index][1] = code}})
    if(count == 0)arr.push([name,code])
    return arr
  }
  /////////////////////////////////////////////////////////////////////
  function reload4D(){
    var A4D = jetpack.read(appPath+'/ASKA_4D.json','json');
    let level = 10
    let knows = {}
    knows.name = A4D[3][0];
    knows.previous_name = A4D[3][0];
    knows.earlier_name = A4D[3][0];
    knows.fontsize = 16;
    knows.size = 130;
    knows.color = 'FFD700';
    knows.children = [];
    jetpack.write(appPath+'/ASKA_4D_render_buffer.json',[knows]);

    var buffer_ren

    for(iz=0;iz<A4D.length;iz++){
      buffer_ren = jetpack.read(appPath+'/ASKA_4D_render_buffer.json','json');
      if(buffer_ren[iz] == undefined){
        iz = 2 + A4D.length
      }else{
        let a1 = buffer_ren[iz].previous_name
        let b1 = buffer_ren[iz].name
        //alert(a1+'  '+b1)
        start_render(A4D,a1,b1)
      }
    }
    
    buffer_ren = jetpack.read(appPath+'/ASKA_4D_render_buffer.json','json');
    for(ie=buffer_ren.length-1;ie>0;ie--){
      let a2 = buffer_ren[ie].previous_name
      let b2 = buffer_ren[ie].name
      let ass = 'w'
      buffer_ren.map((v,index)=>{if(v.name == a2){ass = index}})
      let knowz = buffer_ren[ass]
      knowz.children.unshift(buffer_ren[ie])
      buffer_ren[ass] = knowz
      buffer_ren.splice(ie,1)
      jetpack.write(appPath+'/ASKA_4D_render_buffer.json',buffer_ren);
    }
    buffer_ren = jetpack.read(appPath+'/ASKA_4D_render_buffer.json','json');
    buffer_ren = buffer_ren[0]
    jetpack.write(appPath+'/ASKA_4D_render_buffer.json',buffer_ren);
    jetpack.write(appPath+'/ASKA_4D_d3.json',buffer_ren)
  }
  function start_render(arr,a,b){
    var buffer_render = jetpack.read(appPath+'/ASKA_4D_render_buffer.json','json');
    let pep = all_links4D(arr,a,b)
    console.log(pep)
    let know = []
    let kok = 0
    let obj

    pep.map((v)=>{obj = {};
                  obj.name = v;
                  obj.previous_name = b;
                  obj.earlier_name = a;
                  if(v == window.buffer_d3){
                    obj.fontsize = 12;
                    obj.size = 80;
                    obj.color = 'B22222';
                  }else{
                    obj.fontsize = 16;
                    obj.size = 28;
                    obj.color = 'dd9400';
                    if(b=='x_code_run'||a=='x_code_run'){obj.color = 'aa3355';}
                    if(v=='Кнопки'||b=='Кнопки'||a=='Кнопки'){obj.color = '3399aa';}
                    if(v=='aska'||b=='aska'||a=='aska'){obj.color = 'bb4466';}
                    if(v=='calc_time'||b=='calc_time'||a=='calc_time'){obj.color = 'bb4466';}
                    if(v=='run_x_code_win'||b=='run_x_code_win'||a=='run_x_code_win'){obj.color = 'bb4466';}
                  }
                  arr.map((m,index)=>{if(m[0] == v){kok = index}})
                  kok = arr[kok][1]
                  if(kok.length > 50){
                    obj.coments = kok.substring(0,50)
                    if(kok.length > 100){
                      obj.coments2 = kok.substring(50,100)
                    }else{
                      obj.coments2 = kok.substring(50,kok.length);
                    }
                  }else{
                    obj.coments = kok
                  }
                  obj.coments3 = kok.length
                  obj.children = [];
                  buffer_render.push(obj);
                 })
    jetpack.write(appPath+'/ASKA_4D_render_buffer.json',buffer_render);
    return
  }
  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  // size of the diagram
  var viewerWidth = 1920;
  var viewerHeight = 1080;

  var tree = d3.layout.tree()
  .size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(treeData, function(d) {
    totalNodes++;
    maxLabelLength = Math.max(d.name.length, maxLabelLength);

  }, function(d) {
    return d.children && d.children.length > 0 ? d.children : null;
  });


  // sort the tree according to the node names

  function sortTree() {
    tree.sort(function(a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // TODO: Pan function, can be better implemented.

  function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
      clearTimeout(panTimer);
      translateCoords = d3.transform(svgGroup.attr("transform"));
      if (direction == 'left' || direction == 'right') {
        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == 'up' || direction == 'down') {
        translateX = translateCoords.translate[0];
        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
      }
      scaleX = translateCoords.scale[0];
      scaleY = translateCoords.scale[1];
      scale = zoomListener.scale();
      svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
      d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
      
      zoomListener.scale(zoomListener.scale());
      zoomListener.translate([translateX, translateY]);
      panTimer = setTimeout(function() {
        pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  function zoom() {
    console.log(d3.event.translate[0])
    let xc = d3.event.translate[0]
    xc = xc/1000
    xc = xc*10|0
    
   
    xc = xc/10
    console.log(xc)
    windowManager.sharedData.set('xscale_win',xc);
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }


  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function initiateDrag(d, domNode) {
    draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(domNode).attr('class', 'node activeDrag');

    svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
      if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (nodes.length > 1) {
      // remove link paths
      links = tree.links(nodes);
      nodePaths = svgGroup.selectAll("path.link")
        .data(links, function(d) {
        return d.target.id;
      }).remove();
      // remove child nodes
      nodesExit = svgGroup.selectAll("g.node")
        .data(nodes, function(d) {
        return d.id;
      }).filter(function(d, i) {
        if (d.id == draggingNode.id) {
          return false;
        }
        return true;
      }).remove();
    }

    // remove parent link
    parentLink = tree.links(tree.nodes(draggingNode.parent));
    svgGroup.selectAll('path.link').filter(function(d, i) {
      if (d.target.id == draggingNode.id) {
        return true;
      }
      return false;
    }).remove();

    dragStarted = null;
  }

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3.select("#tree-container").append("svg")
  .attr("width", viewerWidth)
  .attr("height", viewerHeight)
  .attr("class", "overlay")
  .call(zoomListener);


  // Define the drag listeners for drag/drop behaviour of nodes.
  dragListener = d3.behavior.drag()
    .on("dragstart", function(d) {
    if (d == root) {
      return;
    }
    dragStarted = true;
    nodes = tree.nodes(d);
    d3.event.sourceEvent.stopPropagation();
    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
  })
    .on("drag", function(d) {
    if (d == root) {
      return;
    }
    if (dragStarted) {
      domNode = this;
      initiateDrag(d, domNode);
    }

    // get coords of mouseEvent relative to svg container to allow for panning
    //var mouse = ;
    relCoords = d3.mouse(robot.getMousePos());
    if (relCoords[0] < panBoundary) {
      panTimer = true;
      pan(this, 'left');
    } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

      panTimer = true;
      pan(this, 'right');
    } else if (relCoords[1] < panBoundary) {
      panTimer = true;
      pan(this, 'up');
    } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
      panTimer = true;
      pan(this, 'down');
    } else {
      try {
        clearTimeout(panTimer);
      } catch (e) {

      }
    }

    d.x0 += d3.event.dy;
    d.y0 += d3.event.dx;
    var node = d3.select(this);
    node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
    updateTempConnector();
  }).on("dragend", function(d) {
    if (d == root) {
      return;
    }
    domNode = this;
    if (selectedNode) {
      // now remove the element from the parent, and insert it into the new elements children
      var index = draggingNode.parent.children.indexOf(draggingNode);
      if (index > -1) {
        draggingNode.parent.children.splice(index, 1);
      }
      if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
        if (typeof selectedNode.children !== 'undefined') {
          selectedNode.children.push(draggingNode);
        } else {
          selectedNode._children.push(draggingNode);
        }
      } else {
        selectedNode.children = [];
        selectedNode.children.push(draggingNode);
      }
      // Make sure that the node being added to is expanded so user can see added node is correctly moved
      expand(selectedNode);
      sortTree();
      endDrag();
    } else {
      endDrag();
    }
  });

  function endDrag() {
    selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    d3.select(domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    updateTempConnector();
    if (draggingNode !== null) {
      update(root);
      centerNode(draggingNode);
      draggingNode = null;
    }
  }

  // Helper functions for collapsing and expanding nodes.

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  }

  var overCircle = function(d) {
    selectedNode = d;
    updateTempConnector();
  };
  var outCircle = function(d) {
    selectedNode = null;
    updateTempConnector();
  };

  // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function() {
    var data = [];
    if (draggingNode !== null && selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: selectedNode.y0,
          y: selectedNode.x0
        },
        target: {
          x: draggingNode.y0,
          y: draggingNode.x0
        }
      }];
    }
    var link = svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 2;
    d3.select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.

  function mouse_left_click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    if (d.name == undefined) return;
    //console.log(d)
    let c = d.name
    let b = d.previous_name
    let a = d.earlier_name
    let new_arr = window.date_to_delete_link
    if(new_arr != 0 && new_arr != undefined){
      let a_del = new_arr[0]
      let b_del = new_arr[1]
      let c_del = new_arr[2]
      window.date_to_delete_link = [a,b,c]
      window.buffer_d3 = c
      if(a_del == a && b_del == b && c_del == c){
        window.date_to_delete_link = 0
        window.buffer_d3 = 0
        windowManager.sharedData.set('x_command',[b,c])
        windowManager.sharedData.set('d3_windows_copy',[a,b,c])
        run_x_code();
      }
    }else{
      window.date_to_delete_link = [a,b,c]
      window.buffer_d3 = c
    }
    reload4D();
   // var A4D = jetpack.read('F:/ajr/ASKA_4D.json','json')
    //start_render(A4D,'A4D','A4D')
    d = toggleChildren(d);
    update(d);
    //centerNode(d);
  }

  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 125; // 25 pixels per line  
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
      d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node")
      .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
    .call(dragListener)
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click',mouse_left_click)//---------------------------------------

    nodeEnter.append("circle")
      .attr('class', 'nodeEnter')
      .attr("r", function(d) { return d.size; })


    nodeEnter.append("text")
      .attr("x", function(d) {
      return d.children || d._children ? -10 : 10;
    })
      .attr("dx", function(d) { return d.children ? -16 : -16; })
      .attr("dy", -2)
      .attr('class', 'nodeText')
      .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
      .text(function(d) {
      return d.name;
    })
      .attr("style", function(d){
      if(d.name == window.run_color){
        d.color = '99dd00'
      }
      let ti = "stroke:#"+d.color+";font: "+d.fontsize+"px Verdana, Arial, sans-serif;";
      return ti
    })
      .attr( "oncontextmenu",function(d) { return "mouse_right_click('"+d.name+"','"+d.previous_name+"','"+d.earlier_name+"');" })

    nodeEnter.append("text")
      .attr("dx", function(d) { return d.children ? 30 : 30; })
      .attr("dy", 11)
      .attr("style", function(d) { return "stroke:#353535;font: "+(d.fontsize-8)+"px  Arial;"; })
      .text(function(d) { return d.coments});//

    nodeEnter.append("text")
      .attr("dx", function(d) { return d.children ? 40 : 40; })
      .attr("dy", 21)
      .attr("style", function(d) { return "stroke:#303030;font: "+(d.fontsize-8)+"px  Arial;"; })
      .text(function(d) { return d.coments2});//
    nodeEnter.append("text")
      .attr("dy", 11)
      .attr("style", function(d) { return "stroke:#222;font:"+(d.fontsize-6)+"px  Arial;"; })
      .attr("dx", function(d) { return d.children ? -15 : -15; })
      .text(function(d) { return d.coments3});
    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
      .attr('class', 'ghostCircle')
      .attr("r", 30)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "red")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", function(node) {
      overCircle(node);
    })
      .on("mouseout", function(node) {
      outCircle(node);
    });

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function(d) {
      return d.children || d._children ? -10 : 10;
    })
      .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
      .text(function(d) {
      return d.name;
    });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 4.5)
      .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  update(root);
  centerNode(root);
});