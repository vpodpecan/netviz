
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
                    if (!data) {
                        return;
                    }
                    if (data.text == undefined)
                        data.text = '';
                    nodeData.label = data.label;
                    nodeData.title = make_tooltip(data.label, data.text);
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
                    if (!data) {
                        return;
                    }
                    edgeData.label = data.label;
                    edgeData.title = make_tooltip('', data.text);
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
        color: '#2B7CE9'

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
    $('#nodedata').height(verge.viewportH()-(100+50+30));
}

function fill_sample() {
    var sampleData = [
        'node1, term_node2, ->, first edge, Some info text for this edge.',
        'node1, node3, --, second edge, Some more text for this edge.',
        'node1, node4, <-, third edge',
        'term_node2, node4, <->, fourth edge',
        '',
        'node1, This is some text for node1.',
        'term_node2, This is some text for node2.'].join('\n');
    $('#nodedata').val(sampleData);
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

    var csvdata = Papa.parse($('#nodedata').val(), {skipEmptyLines: true});
    netviz.nodes = new vis.DataSet();
    netviz.edges = new vis.DataSet();

    csvdata.data.forEach(function(line, index, array) {
        if (line.length >= 4) {
            var fromNode = line[0].trim();
            var toNode = line[1].trim();
            var dir = line[2].trim();
            var label = line[3].trim();

            var parts = undefined;
            var fromNodeLabel = fromNode;
            var idx = fromNode.indexOf('_')
            if (idx != -1){
                fromNodeLabel = wrap_text(fromNode.slice(idx+1)) + '\n' + fromNode.slice(0,idx)
            }

            var toNodeLabel = toNode;
            var idx = toNode.indexOf('_')
            if (idx != -1){
                toNodeLabel = wrap_text(toNode.slice(idx+1)) + '\n' + toNode.slice(0,idx);
            }

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

            // netviz.nodes.update({id: fromNode, label: fromNodeLabel, title: make_tooltip(fromNode, '')});
            // netviz.nodes.update({id: toNode, label: toNodeLabel, title: make_tooltip(toNode, '')});
            netviz.nodes.update({id: fromNode, label: fromNodeLabel});
            netviz.nodes.update({id: toNode, label: toNodeLabel});

            if(line.length >= 5) {
                netviz.edges.add({id: index, from: fromNode, to: toNode, label: label, arrows: arrows, title: make_tooltip('', line[4].trim())});
            }
            else
                netviz.edges.add({id: index, from: fromNode, to: toNode, label: label, arrows: arrows})
        }
        else if (line.length == 2) {
            var nid = line[0].trim();
            var text = line[1].trim();
            netviz.nodes.update({id: nid, title: make_tooltip(nid, text)});
        }

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

function loadCSV(evt){
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
    $('#flab2').text(dname);
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
    return vsprintf('<h5>%s</h5><p>%s</p>', [netviz.nodes.get(nid).label, text]);
}

function formatEdgeInfoVex(eid) {
    var text = netviz.edges.get(eid).title == undefined ? "No additional information is available" : netviz.edges.get(eid).title;
    return vsprintf('<h5>%s</h5><p>%s</p>', [netviz.edges.get(eid).label, text]);
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
    $(document).on('change', '#csvfileupload' , loadCSV);
    // create dialog and hide it
    createSettingsDialog();
    $( "#myModal" ).dialog('close');


    initContextMenus();

    scale();
    fill_sample();
    draw_graph();
})
