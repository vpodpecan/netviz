
var netviz = {
    nodes: undefined,
    edges: undefined,
    network: undefined,
    isFrozen: false
};

netviz.options = {
    clickToUse: false,

    interaction: {
        navigationButtons: true,
        hover: true,
        multiselect: true,
        tooltipDelay: 1000
    },


    manipulation: {
        enabled: true,
        addNode: function(nodeData, callback) {
            vex.dialog.open({
                message: 'Enter node data:',
                input: [
                    '<div class="vex-custom-field-wrapper">',
                        '<label for="label">Node label</label>',
                        '<div class="vex-custom-input-wrapper">',
                            '<input name="label" type="text"/>',
                        '</div>',
                    '</div>',
                    '<div class="vex-custom-field-wrapper">',
                        '<label for="text">Node text data</label>',
                        '<div class="vex-custom-input-wrapper">',
                            '<input name="text" type="text"/>',
                        '</div>',
                    '</div>'
                ].join(''),
                callback: function (data) {
                    // if (!data) {
                    //     return;
                    // }
                    nodeData.label = data.label!=undefined ? data.label.trim() : undefined;
                    nodeData.title = data.text!=undefined ? make_tooltip('', data.text.trim()): undefined;
                    //
                    // if (data.text == undefined)
                    //     data.text = '';
                    // nodeData.label = data.label;
                    // nodeData.title = make_tooltip(data.label, data.text);
                    callback(nodeData);
                }
            })
        },

        addEdge: function(edgeData, callback) {

            vex.dialog.open({
                message: 'Configure edge',
                input: [
                    '<div class="vex-custom-field-wrapper">',
                        '<label for="label">Edge label</label>',
                        '<div class="vex-custom-input-wrapper">',
                            '<input name="label" type="text"/>',
                        '</div>',
                    '</div>',
                    '<div class="vex-custom-field-wrapper">',
                        '<label for="text">Edge text data</label>',
                        '<div class="vex-custom-input-wrapper">',
                            '<input name="text" type="text"/>',
                        '</div>',
                    '</div>',
                    '<div class="vex-custom-field-wrapper">',
                        '<div class="vex-custom-input-wrapper">',
                        '<label for="arrows">Arrows</label>',
                            '<select name="arrows" class="custom-select">',
                             '<option value="to">to</option>',
                             '<option value="from">from</option>',
                             '<option value="from,to">from,to</option>',
                             '<option value="">none</option>',
                           '</select> ',
                        '</div>',
                    '</div>',
                ].join(''),
                callback: function (data) {
                    // if (!data) {
                    //     return;
                    // }
                    edgeData.label = data.label!=undefined ? data.label.trim() : undefined;
                    edgeData.title = data.text!=undefined ? make_tooltip('', data.text.trim()) : undefined;
                    edgeData.arrows = data.arrows;
                    callback(edgeData);
                }
            })
        }

    },

    nodes: {
        font: {
            size: 14,
            face: 'sans'
        },
        shape: 'box',
        // color: '#C8D7FF'
        color: {
            background: '#C8D7FF',
            highlight: {
                border: 'red',
                background: 'orange'
            },
            hover: {
                // border: 'orange',
                background: 'orange'
            }
        }
    },

    edges: {
        smooth: {
            enabled: true,
            type: 'continuous',
            // type: 'dynamic',
            forceDirection: 'none'
            },
        font: {
            size: 13,
            face: 'sans',
            align: 'horizontal',
            color: '#808080'
        },
        color: '#2B7CE9',
        hoverWidth: function (width) {return width+1;},
        selectionWidth: function (width) {return width+3;}
    },

   layout: {
       // improvedLayout: true
       improvedLayout: false

   },

    physics: {
        enabled: true,
        solver: 'barnesHut',

        barnesHut: {
            gravitationalConstant: -18000,
            centralGravity: 0.1,
            springLength: 150,
            springConstant: 0.16,
        },
        repulsion: {
            centralGravity: 0,
            springLength: 150,
            springConstant: 0.05,
            nodeDistance: 170,
            damping: 0.1
        },
        stabilization: {
             enabled: true,
             iterations: 10,
             // updateInterval: 5,
             fit: true
         },
    }
};


function scale() {
    $('#networkView').height(verge.viewportH()-(20+50));
    $('#networkView').width($('#networkViewContainer').width());
    // $('#edgedata').height(verge.viewportH()/2-50);
    // $('#graphdata').height(verge.viewportH()-(100+50+30));
    $('#edgedata').height(verge.viewportH()*(4/8)-135);
    $('#nodedata').height(verge.viewportH()*(4/8)-135);

}

function fill_sample() {
    var sampleEdgeData = [
        'node1,node2,arrow,label,text,color,width',
        'node1,node2,->,edge1,label of first edge,green,2',
        'node2,node3,--,edge2,label of second edge,"rgb(120,30,150)",10',
        'node3,node4,<->,edge3,,#47EAFF,5',
        'node4,node1,->'].join('\n');
    $('#edgedata').val(sampleEdgeData);

    var sampleNodeData = [
        'node,text,color,shape',
        'node1,first node,yellow,ellipse',
        'node2,second node,"rgb(0,200,50)",box',
        'node3,third node,orange,circle',
        'node4,,,text',
    ].join('\n');
    $('#nodedata').val(sampleNodeData);
}


// not OK for browsers <ES6
// function make_tooltip(title, text) {
//     var html = `
//     <div class="card text-wrap" style="width: 25rem;">
//       <div class="card-body">
//         <h5 class="card-title">${title}</h5>
//         <p class="card-text">${text}</p>
//       </div>
//     </div>
//     `;
//     return html;
// }

// function make_tooltip(title, text) {
//     var html = [
//         '<div class="card text-wrap" style="width: 25rem;">',
//         '<div class="card-body">',
//         '<h5 class="card-title">%s</h5>',
//         '<p class="card-text">%s</p>',
//         '</div></div>'].join('');
//     return vsprintf(html, [title, text]);
// }

function make_tooltip(title, text) {
    var wrapped = text.replace(/(?![^\n]{1,42}$)([^\n]{1,42})\s/g, '$1<br/>');
    // return title + '\n' + text;
    var html = [
        '<div class="customTooltip">',
        '%s',
        '</div>'].join('');
    return vsprintf(html, [wrapped]);
}

function wrap_text(text) {
    var wrapped = text.replace(/([^\n]{1,32})/g, '$1\n');
    if(wrapped.slice(-1) == '\n')
        wrapped = wrapped.slice(0,-1);
    return wrapped;
}


function releaseFreezeBtn() {
    if (eval($('#freezeBtn').attr('aria-pressed'))==true)
        $('#freezeBtn').click();
}

function freezeNodes(state){
    netviz.network.stopSimulation();
    netviz.nodes.forEach(function(node, id){
        netviz.nodes.update({id: id, fixed: state});
    });
    netviz.network.startSimulation();
}

function freeze() {
    if ($(this).hasClass('active')) {
        netviz.isFrozen = false;
        freezeNodes(false);
        $(this).text('freeze');
    }
    else {
        netviz.isFrozen = true;
        freezeNodes(true);
        $(this).text('release');
    }
}

$(window).resize(function () {
    scale();
});


function clear(){
    if (netviz.network != undefined) {
        // netviz.network.removeAllListeners();
        // netviz.network.destroy();
        // $('#myModal').modal('hide');
        // $('#myModalBody').text('');
        // $('#myModal').text('');

        if ($( "#myModal" ).text()) {
            $('#myModal').text('');
            $('#myModal').dialog('close');
        }
    }
}

function draw_graph() {
    releaseFreezeBtn();
    clear();

    var edgedata = Papa.parse($('#edgedata').val(), {header: true, skipEmptyLines: true});
    if (edgedata.meta.fields.indexOf('node1')==-1 || edgedata.meta.fields.indexOf('node2')==-1 || edgedata.meta.fields.indexOf('arrow')==-1) {
        var html = [
            '<h3>Error</h3>',
            '<h5>Edge data csv requires a valid header!</h5>',
            'mandatory columns:</br>',
            '<strong>node1,node2,arrow</strong></br>',
            'optional columns:</br>',
            '<strong>label,text,color,width</strong><br>',
            'Unknown columns are ignored.'].join('');
        vex.dialog.alert({unsafeMessage: html});
    }

    netviz.nodes = new vis.DataSet();
    netviz.edges = new vis.DataSet();
    edgedata.data.forEach(function(rowobj, index, array) {
        var fromNode = rowobj['node1'].trim();
        var toNode = rowobj['node2'].trim();
        var dir = rowobj['arrow'].trim();
        var arrows = '';
        if(dir=='->')
            arrows = 'to';
        else if(dir=='<-')
            arrows = 'from';
        else if(dir=='<->')
            arrows = 'from,to';
        else if(dir=='--')
            arrows = '';
        else
            arrows = '';

        var label = rowobj['label']!=undefined && rowobj['label'].trim()!='' ? rowobj['label'].trim() : undefined;
        var text = rowobj['text']!=undefined && rowobj['text'].trim()!='' ? make_tooltip('', rowobj['text'].trim()) : undefined;
        var color = rowobj['color']!=undefined && rowobj['color'].trim()!='' ? rowobj['color'].trim() : undefined;
        var width = rowobj['width']!=undefined && rowobj['width'].trim()!='' ? parseFloat(rowobj['width']) : 1;

        netviz.nodes.update({id: fromNode, label: wrap_text(fromNode)});
        netviz.nodes.update({id: toNode, label: wrap_text(toNode)});
        netviz.edges.add({id: index, from: fromNode, to: toNode, label: label, arrows: arrows, title: text, width: width, color: color, arrowStrikethrough:false});
    })


    var nodedata = Papa.parse($('#nodedata').val(), {header: true, skipEmptyLines: true});
    if (nodedata.meta.fields.length && nodedata.meta.fields.indexOf('node')==-1) {
        var html = [
            '<h3>Error</h3>',
            '<h5>If not empty, node csv data requires a valid header!</h5>',
            'mandatory columns:</br>',
            '<strong>node</strong></br>',
            'optional columns:</br>',
            '<strong>text,color,shape</strong></br>',
            'Unknown columns are ignored.'].join('');
        vex.dialog.alert({unsafeMessage: html});
    }

    nodedata.data.forEach(function(rowobj, index, array) {
        var node = rowobj['node']!=undefined && rowobj['node'].trim()!='' ? rowobj['node'].trim() : undefined;
        var text = rowobj['text']!=undefined && rowobj['text'].trim()!='' ? wrap_text(make_tooltip('', rowobj['text'].trim())) : undefined;
        var color = rowobj['color']!=undefined && rowobj['color'].trim()!='' ? rowobj['color'].trim() : undefined;
        var shape = rowobj['shape']!=undefined && rowobj['shape'].trim()!='' ? rowobj['shape'] : 'box';

        netviz.nodes.update({id: node, label: node, title: text, color: {background: color}, shape: shape});
    })


      // create a network
      var container = document.getElementById('networkView');

      // provide the data in the vis format
      var data = {
          nodes: netviz.nodes,
          edges: netviz.edges
      };

      // initialize network
      netviz.network = new vis.Network(container, data, netviz.options);
      netviz.network.on('dragStart', onDragStart);
      netviz.network.on('dragEnd', onDragEnd);
      // netviz.network.on('stabilizationProgress', function(obj){
      //     // console.log(obj);
      //     // netviz.network.redraw();
      // })
}


function onDragStart(obj) {
    if (obj.hasOwnProperty('nodes') && obj.nodes.length==1) {
        var nid = obj.nodes[0];
        netviz.nodes.update({id: nid, fixed: false});
    }

}

function onDragEnd(obj) {
    if (netviz.isFrozen==false)
        return
    var nid = obj.nodes;
    if (obj.hasOwnProperty('nodes') && obj.nodes.length==1) {
        var nid = obj.nodes[0];
        netviz.nodes.update({id: nid, fixed: true});
    }
}


function filterSettings(option, path) {
    var physicsOptions = [
        'gravitationalConstant',
        'centralGravity',
        'springLength',
        'springConstant',
        'damping',
        'avoidOverlap',
        'solver',
    ];
    var edgeOptions = [
        'type',
    ]

    if (path.indexOf('physics') !== -1) {
        return physicsOptions.indexOf(option) !== -1;
        // return true;
    }
    else if (path.indexOf('edges') !== -1) {
        if (path.indexOf('smooth') !== -1) {
            return edgeOptions.indexOf(option) !== -1;
        }
        else
            return false;
    }
    else {
        return false;
    }
}

function showSettings() {

    $( "#myModal" ).dialog('open');
    var options = {
        configure: {
            enabled: true,
            container: document.getElementById('myModal'),
            // filter: 'physics',
            filter: filterSettings,
            showButton: false
        }
    };
    netviz.network.setOptions(options);
    return;
}

function loadEdgeCSV(evt){
    $( "#myModal" ).dialog('close');
    var file = evt.target.files[0];
    if(!file)
        return;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
        $('#edgedata').val(event.target.result);
    };
    reader.onerror = function() {
        vex.dialog.alert('Error while reading ' + file.fileName);
    };
    var dname = evt.target.files[0].name;
    if (dname.length > 25)
        dname = dname.slice(0,25) + '...'
    $('#edgecsvfile').text(dname);
}


function loadNodeCSV(evt){
    $( "#myModal" ).dialog('close');
    var file = evt.target.files[0];
    if(!file)
        return;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
        $('#nodedata').val(event.target.result);
    };
    reader.onerror = function() {
        vex.dialog.alert('Error while reading ' + file.fileName);
    };
    var dname = evt.target.files[0].name;
    if (dname.length > 25)
        dname = dname.slice(0,25) + '...'
    $('#nodecsvfile').text(dname);
}


function createSettingsDialog() {
    $( "#myModal" ).dialog({
        position: 'left top',
    	width: '350px',
    	buttons: [
    		{
    			text: "close",
    			click: function() {
    				$( this ).dialog( "close" );
    			}
    		},
    	],
    });
}

function formatNodeInfoVex(nid) {
    var text = netviz.nodes.get(nid).title == undefined ? "No additional information is available" : netviz.nodes.get(nid).title;
    var title = netviz.nodes.get(nid).label == undefined ? String(nid) : netviz.nodes.get(nid).label;
    return vsprintf('<h5>%s</h5><p>%s</p>', [title, text]);
}

function formatEdgeInfoVex(eid) {
    var text = netviz.edges.get(eid).title == undefined ? "No additional information is available" : netviz.edges.get(eid).title;
    var title = netviz.edges.get(eid).label == undefined ? String(eid) : netviz.edges.get(eid).label;
    return vsprintf('<h5>%s</h5><p>%s</p>', [title, text]);
}


function initContextMenus() {
    var canvasMenu = {
        "stop": {name: "Stop simulation"},
        "start" : {name: "Start simulation"}
    };
    var nodeMenuFix = {
        "delete": {name: "Delete"},
        // "expand": {name: "Expand"},
        "fix": {name: "Fix position"},
        "info": {name: "Info"}
    };
    var nodeMenuRelease = {
        "delete": {name: "Delete"},
        // "expand": {name: "Expand"},
        "release": {name: "Release position"},
        "info": {name: "Info"}
    };
    var edgeMenu = {
        "delete": {name: "Delete"},
        "info": {name: "Info"}
    };

    $.contextMenu({
            selector: 'canvas',
            build: function($trigger, e) {
                // this callback is executed every time the menu is to be shown
                // its results are destroyed every time the menu is hidden
                // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)

                var hoveredEdge = undefined;
                var hoveredNode = undefined;
                if (!$.isEmptyObject(netviz.network.selectionHandler.hoverObj.nodes)) {
                    hoveredNode = netviz.network.selectionHandler.hoverObj.nodes[Object.keys(netviz.network.selectionHandler.hoverObj.nodes)[0]];
                }
                else {
                    hoveredNode = undefined;
                }
                if (!$.isEmptyObject(netviz.network.selectionHandler.hoverObj.edges)) {
                    hoveredEdge = netviz.network.selectionHandler.hoverObj.edges[Object.keys(netviz.network.selectionHandler.hoverObj.edges)[0]];
                }
                else {
                    hoveredEdge = undefined;
                }

                // ignore auto-highlighted edge(s) on node hover
                if (hoveredNode != undefined && hoveredEdge != undefined)
                    hoveredEdge = undefined;

                if (hoveredNode != undefined && hoveredEdge == undefined) {
                    return {
                        callback: function(key, options) {
                            if (key == "delete") {
                                netviz.nodes.remove(hoveredNode);
                            }
                            else if (key == "expand") {
                                vex.dialog.alert("Not yet implemented.");
                            }
                            else if (key == "fix") {
                                netviz.nodes.update({id: hoveredNode.id, fixed: true});
                            }
                            else if (key == "release") {
                                netviz.nodes.update({id: hoveredNode.id, fixed: false});
                            }
                            else if (key == "info") {
                                vex.dialog.alert({unsafeMessage: formatNodeInfoVex(hoveredNode.id)});
                            }
                        },
                        items: netviz.nodes.get(hoveredNode.id).fixed ? nodeMenuRelease : nodeMenuFix
                    };
                }
                else if (hoveredNode == undefined && hoveredEdge != undefined) {
                    return {
                        callback: function(key, options) {
                            if (key == "delete") {
                                netviz.edges.remove(hoveredEdge);
                            }
                            else if (key == "info") {
                                vex.dialog.alert({unsafeMessage: formatEdgeInfoVex(hoveredEdge.id)});
                            }
                        },
                        items: edgeMenu
                    };
                }
                else {
                    return {
                        callback: function(key, options) {
                            if (key == "stop") {
                                netviz.network.stopSimulation();
                                // netviz.edges.remove(hoveredEdge);
                            }
                            else if (key == "start") {
                                releaseFreezeBtn();
                                netviz.network.startSimulation();
                            }
                        },
                        items: canvasMenu
                    };

                }
            }
        });

}

$(document).ready(function () {
    $('#drawGraphButton').click(draw_graph)
    $('#freezeBtn').click(freeze);
    $('#configButton').click(showSettings);
    $('#clearEdgeDataButton').click(function(){$('#edgedata').val('')});
    $('#clearNodeDataButton').click(function(){
        $('#nodedata').val('');
        $('#edgecsvfile').val('');
    });
    $(document).on('change', '#edgecsvfileupload' , loadEdgeCSV);
    $(document).on('change', '#nodecsvfileupload' , loadNodeCSV);

    // create dialog and hide it
    createSettingsDialog();
    $( "#myModal" ).dialog('close');


    initContextMenus();

    scale();
    fill_sample();
    draw_graph();
})
