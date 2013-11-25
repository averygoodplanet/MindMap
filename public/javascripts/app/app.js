/* global document, window, io */

$(document).ready(initialize);

var socket;

/////////  Dummy Global Objects (for development process)  ////////////////
var dummyMapObject = {name: 'map#1'};
var sampleText = 'fourfourfour';

function Circle(x, y, radius, color) {
  this.center = {x: x, y: y};
  this.radius = radius;
  this.color = color;
}

var circle1 = new Circle(200, 200, 20, "black");
var idNumber = 1000;
///////////////////////////////////////////////////////////////////////////

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  initializeEventHandlers();
  init(); //should call jit.js
}

function initializeSocketIO(){
  var port = window.location.port ? window.location.port : '80';
  var url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/app';

  socket = io.connect(url);
  socket.on('connected', socketConnected);
}

function socketConnected(data){
  console.log(data);
}

function initializeEventHandlers(){
  $('#devEdit').on('click', clickDevEdit);

  // example of passing a function to a function
  // this calls getCanvasThenNext which assigns canvas and context variables
  // then calls appropriate function (passing canvas and context) to handle the user's action.
  // using the getCanvasThenNext avoids having to assign canvas and context
  // separately within each of the different canvas functions (D.R.Y.)
  $('#blackFilledRectangle').on('click', function() {
    getCanvasThenNext(clickBlackFilledRectangle);});

  $('#resetCanvas').on('click', function() {
    getCanvasThenNext(clickResetCanvas);});

  $('#redEmptyRectangle').on('click', function() {
    getCanvasThenNext(clickRedEmptyRectangle);});

  $('#verticalLines').on('click', function() {
    getCanvasThenNext(clickVerticalLines);});

  $('#drawText').on('click', function() {
    getCanvasThenNext(clickDrawText);});

  $('#drawImageObject').on('click', function() {
    getCanvasThenNext(clickDrawImageObject);});

  $('#drawCircle').on('click', function(){
    getCanvasThenNext(clickDrawCircle, circle1)});

  $('#textCenteredCircle').on('click', function(){
    getCanvasThenNext(clickTextCenteredCircle, circle1, sampleText)});

  $('#addFreeNode').on('click', clickAddFreeNode);

  $('#connectNode0To999').on('click', clickConnectNode0To999);

  $('#createAndConnectNewNodeTo0').on('click', clickCreateAndConnectNewNodeTo0);

  $('#connectNewNodeToSelected').on('click', clickConnectNewNodeToSelected);

  //event handler rightClickAddNode is registered in Events property in example2.js
}

///////////////////   Event Handlers  ///////////////////////////////////
function clickDevEdit(e){
  //OPTION 1 (without AJAX, do window.location.href = '/map')
  window.location.href = '/map';
  ////////////////////////////////////

  //OPTION 2 (with AJAX; and in callback success function replace the
  // <body> with the <body> portion html returned from server)
  //sendGenericAjaxRequest('/map', {}, 'GET', null, e, drawMap);
  ////////////////////////////////////
}

///////////////////////  HTML/CSS Changes //////////////////////////////////
function drawMap(AJAXdata){
  ///////////// Option 2 (do not use)/////
  // console.dir(AJAXdata);
  // get body out of AJAXdata;
  // $('body').replaceWith(AJAXdataBody);
  /////////////// END Option 2///////////
}

////////////////////////  <canvas> functions //////////////////////////////
// I used these functions to teach myself <canvas> basics based on online tutorials.

function getCanvasThenNext(next, optional1, optional2){
  // regarding optionalObject see http://www.markhansen.co.nz/javascript-optional-parameters/
  // set canvas to variable
  var canvas = document.getElementById('canvas1');
  // set canvas context to variable
  // (the context has access to <canvas> methods and properties)
  var context = canvas.getContext('2d');
  // pass the canvas and context to the next function (e.g. to draw a circle)
  next(canvas, context, optional1, optional2);
}

function clickBlackFilledRectangle(canvas, context) {
  // draw a black rectangle using context.fillRect(x, y, w, h)
  // where x and y are coordinates of left-top corner of rectangle
  // w is width, h is height
  context.fillStyle = 'black';
  context.fillRect(0, 0, 100, 100);
}

function clickResetCanvas(canvas, context) {
  // setting the height or width of <canvas> resets (erases) it
  canvas.width = canvas.width;
}

function clickRedEmptyRectangle(canvas, context) {
  // change fillStyle to red
  context.strokeStyle = 'red';
  context.strokeRect(0, 0, 100, 100);
}

function clickVerticalLines(canvas, context) {
  // use beginPath() for new path (e.g. a path that is a different color)
  // lets canvas know this is a separate path.
  context.beginPath();
  for(var x = 0.5; x < 600; x += 10){
    //moveTo (0.5, 0), (10.5, 0) ...
    // use 0.5 to keep 1px width
    context.moveTo(x, 0);
    //lineTo (x, HEIGHT);
    context.lineTo(x, 600);
    //should 'pencil-trace' lines:
    // (0.5, 0) to (0.5, 600), (10.5, 0) to (10.5, 600), ...
  }
  context.strokeStyle = 'green';
  // 'ink in' the path that was created in 'pencil-trace'
  context.stroke();
}

function clickDrawText(canvas, context) {
  context.font = "bold 12px sans-serif";
  //drawing text normally:
  context.fillText('Sample TextI', 120, 120);
  //drawing text to be offset from bottom right-corner
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.fillText("2nd Sample", 590, 590);
}

function clickDrawImageObject(canvas, context) {
  // make new Image object
  var head = new Image();
  //provide image source
  head.src = "../../images/head.jpg";
  //draw image using .onload
  // at point (x, y) = (200, 200)
  // scaled to 50 x 50
  head.onload = function(){
    context.drawImage(head, 200, 200, 50, 50);
  };
}

function clickDrawCircle(canvas, context, circle){
  context.beginPath();
  //see http://www.w3schools.com/tags/canvas_arc.asp
  //context.arc(x-of-center, y-of-center, radius, startingAngle,endingAngle, counterclockwiseBoolean);
  //starting angle for 3 o'clock position is (0*Math.PI) in radians
  //ending angle for 3 o'clock position is (2*Math.PI) in radians
  context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2*Math.PI, false);
  context.strokeStyle = circle.color;
  context.stroke();
}

function clickTextCenteredCircle(canvas, context, circle, text){
  // see http://jsfiddle.net/2varh/1/
  // seehttp://stackoverflow.com/questions/10260176/filling-a-canvas-shape-with-text
  // WHAT THIS FUNCTION DOES:
  // Takes text and draws it centered within a circle
  // the font-size is scaled to circle radius.
  // The middle four characters of text fit within the circle,
  // even as circle size varies. (If >4 characters, these characters are
  // to the left and right of circle.)

  // draw the circle
  clickDrawCircle(canvas, context, circle);

  // set text font-size, and drawing color
  var font = "bold " + circle.radius +"px serif";
  context.font = font;
  context.fillStyle = "black";
  // measure text width and estimated height (true text height property not available)
  var textWidth = context.measureText(text).width;
  var textHeight = context.measureText("w").width; // this is a GUESS of height
  // DRAW TEXT centered by drawing at location below-center by 1/2 text height
  // and left-of-center by half the text (estimated) width
  context.fillText(text, circle.center.x - (textWidth/2) , circle.center.y + (textHeight/2));
}

////////////////////  InfoVis Affecting Functions //////////////////////////////////
function clickAddFreeNode() {
  //*Issues (tabling for now as this function is just a learning/example function; not a function for the actual program)
  // (1) creating a node with this method, you need to generate a unique id for each new node
  // (2) new nodes are created in the same place and overlap each other
  // (3) node isn't connected to the graph (mindmaps have all nodes connected to the graph with at least one edge)

  // create unique id by decrementing global variable idNumber (initialized to 1,000).
  idNumber -= 1;
  fd.graph.addNode({ id: "graphnode"+idNumber, name: 'your text here', data: {}});
  //REDRAW/UPDATE the graph
  fd.plot();
}

function clickConnectNode0To999() {
  // Goal: Create adjacence (connection) from pre-existing graphnode0
  // to pre-existing graphnode999 (made with AddFreeNode button).

  // get nodes by id
  var fromId = "graphnode0";
  var toId = "graphnode999";
  var fromNode = fd.graph.getNode(fromId);
  var toNode = fd.graph.getNode(toId);
  // create connection using addAdjacence graph method
  var adjacence = fd.graph.addAdjacence(fromNode, toNode);
  // REDRAW graph
  fd.plot();
}

function clickCreateAndConnectNewNodeTo0() {
  // add new node (with new id) to graph
  idNumber -= 1;
  var newNodeId = "graphnode" + idNumber;
  fd.graph.addNode({ id: newNodeId, name: 'your text here', data: {}});

  // get nodes by id
  var fromId = "graphnode0"; // in improved function, on node dblclick I'll pass fromId into function
  var toId = newNodeId;
  var fromNode = fd.graph.getNode(fromId);
  var toNode = fd.graph.getNode(toId);
  // create connection using addAdjacence graph method
  var adjacence = fd.graph.addAdjacence(fromNode, toNode);
  // REDRAW graph
  fd.plot();
}

function clickConnectNewNodeToSelected(){
  // iterate through all nodes to find which (if any) node is selected
  var selectedNodeId = null;
  fd.graph.eachNode(function(node) {
    if(node.selected){
      selectedNodeId = node.id;
      // create a new node and connect it to the selected node:
      // add new node (with new id) to graph
      idNumber -= 1;
      var newNodeId = "graphnode" + idNumber;
      fd.graph.addNode({ id: newNodeId, name: 'your text here', data: {}});

      // get nodes by id
      var fromId = selectedNodeId;
      var toId = newNodeId;
      var fromNode = fd.graph.getNode(fromId);
      var toNode = fd.graph.getNode(toId);
      // make new Node's initial (before animation) starting position
      // be directly below the fromNode
      toNode.pos.x = fromNode.pos.x;
      toNode.pos.y = fromNode.pos.y + 100;

      // create connection using addAdjacence graph method
      var adjacence = fd.graph.addAdjacence(fromNode, toNode);
      // Fancy REDRAW of graph
      // This redraw method is taken from docs at http://philogb.github.io/jit/static/v20/Docs/files/Visualizations/ForceDirected-js.html
      // When I previously used just fd.plot(), new nodes were being placed on top of one another and edges weren't
      // repositioned aesthetically. This new method calculates new force directed conformation and then
      // animates the graph to the new conformation.
      fd.computeIncremental({
        iter: 20,
        property: 'end',
        onStep: function(perc) {
          Log.write("loading " + perc + "%");
        },
        onComplete: function() {
          Log.write("done");
          //////////fd.plot();
          fd.animate();
        }
      });
    }
  });
}

function rightClickAddNode(node, eventInfo, e){
  // create new node and add to graph
  idNumber -= 1;
  var newNodeId = "graphnode" + idNumber;
  fd.graph.addNode({ id: newNodeId, name: 'your text here', data: {}});

  // get nodes by id
  var fromId = node.id;
  var toId = newNodeId;
  var fromNode = fd.graph.getNode(fromId);
  var toNode = fd.graph.getNode(toId);
  // make new Node's initial (before animation) starting position
  // be directly below the fromNode
  toNode.pos.x = fromNode.pos.x;
  toNode.pos.y = fromNode.pos.y + 100;

  // create connection using addAdjacence graph method
  var adjacence = fd.graph.addAdjacence(fromNode, toNode);
  // Fancy REDRAW of graph
  // This redraw method is taken from docs at http://philogb.github.io/jit/static/v20/Docs/files/Visualizations/ForceDirected-js.html
  // When I previously used just fd.plot(), new nodes were being placed on top of one another and edges weren't
  // repositioned aesthetically. This new method calculates new force directed conformation and then
  // animates the graph to the new conformation.
  fd.computeIncremental({
    iter: 20,
    property: 'end',
    onStep: function(perc) {
      Log.write("loading " + perc + "%");
    },
    onComplete: function() {
      Log.write("done");
      //////////fd.plot();
      fd.animate();
    }
  });
}

function changeText(event, oldThis){
  console.log('////////In changeText()');
  console.log(event);
  console.log(event.which);
  console.log(oldThis);
  $(oldThis).text('new text (hard-coded)');
  /////// Probably will just modify text within displayed graph, then on Save use loader.js to
  // do a toJSON (graph--> JSON) and save to database; then on load use loadJSON and then init() function;
  console.log(json);
}

///////////////////    AJAX     //////////////////////////////////////////////////
function submitAjaxForm(event, form, fn) {
  // debugger;
  // console.log(event);
  // console.log(form);
  var url = $(form).attr('action');
  var data = $(form).serialize();

  var options = {};
  options.url = url;
  options.type = 'POST';
  options.data = data;
  console.log('data = ' + options.data);
  options.success = function(data, status, jqXHR){
    console.log('success');
    fn(data, form);
  };
  options.error = function(jqXHR, status, error){
    console.log(error);
  };
  $.ajax(options);

  event.preventDefault();
}

function sendGenericAjaxRequest(url, data, verb, altVerb, event, fn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = function(data, status, jqXHR){
    fn(data);
  };
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}
