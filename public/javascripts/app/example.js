//This helpful example is from https://github.com/ollieglass/jit-boilerplate.

// data
var json = [{
    id: "A",
    name: "A",
    adjacencies: ["B", "C", "D"]
}, {
    id: "B",
    name: "B",
    adjacencies: ["A", "C", "D"]
}, {
    id: "C",
    name: "C",
    adjacencies: ["A", "B", "D"]
}, {
    id: "D",
    name: "D",
    adjacencies: ["A", "B", "C"]
}];

// canvas / ie stuff
var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');

  //I'm setting this based on the fact that ExCanvas provides text support for IE and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

function init(){

    //init RGraph
    var rgraph = new $jit.RGraph({
        injectInto: 'infovis', // where to append the visualization

        // add navigation capabilities
        Navigation: {
          enable: true,
          panning: true,
          zooming: 10
        },

        // set Node and Edge styles.
        Node: {
            color: '#ddeeff'
        },

        Edge: {
          color: '#C17878',
        },

        // Add the name of the node in the correponding label and a click handler to move the graph.
        // This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id, {});
            };
        },

        // Change some label dom properties.
        // This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "0.8em";
                style.color = "#ccc";
            } else {
                style.fontSize = "0.7em";
                style.color = "#494949";
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    });

    // load JSON data
    rgraph.loadJSON(json);

    // trigger small animation to initialise graph layout
    rgraph.compute('end');

    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
}