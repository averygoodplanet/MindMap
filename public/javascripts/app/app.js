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
  // console.log(JSON.parse($('#mapdata').text()));
  checkForEditPage();
  // init(); //should call jit.js
  // alert('!{myVar}');
}

function checkForEditPage(){
  if(window.location.pathname === '/create'){
    console.log('in check for Edit Page if statement');
    var entireMapJSON = JSON.parse($('#mapdata').text());
    var graphData = entireMapJSON.graphData;
    console.log(graphData);
    /////// DUMMY DATA ////////////
    json = [
    {
      //node0
      "adjacencies": [
        {
          "nodeTo": "",
          "nodeFrom": "",
          "data": {}
        }
      ],
      "data":
        {
          "$color": "#0000FF",
          "$type": "star"
        },
      "id": "graphnode0",
      "name": "graphnode0 has text here"
    }];
    init(); //init uses global json variable.
  } else {
    console.log('went to checkforEditPage else statement.');
  }
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
  //User LOGIN-Register-Logout handlers
  $('#authentication-button').on('click', clickAuthenticationButton);
  $('#register').on('click', clickRegister);
  $('#login').on('click', clickLogin);
  $('#users input[type="checkbox"]').on('click', clickChangeAdmin);

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

  $('#save').on('click', clickSave);
}

///////////////////   Login-Register-Logout Handlers  ///////////////////////////////////

function clickRegister(e){
  var url = '/users';
  var data = $('form#authentication').serialize();
  sendAjaxRequest(url, data, 'post', null, e, function(data){
    console.log('callback from users.create');
    console.log(data);
    console.log('*****************');
    htmlRegisterComplete(data);
  });
}

function clickLogin(e){
  var url = '/login';
  // serialize takes email and password fields in form
  // and converts them to a string of parameters
  // e.g. data = "email=bob%40gmail.com&password=abc"
  var data = $('form#authentication').serialize();
  // uses altVerb to do a PUT to '/login'
  // which routes to users.login
  sendAjaxRequest(url, data, 'post', 'put', e, function(data){
    //e.g. data returns as {status: "ok", email: "charles@gmail.com"}
    htmlUpdateLoginStatus(data);
  });
}

function clickAuthenticationButton(e){
  var isAnonymous = $('#authentication-button[data-email="anonymous"]').length === 1;

  if(isAnonymous){
    $('form#authentication').toggleClass('hidden');
    $('input[name="email"]').focus();
  } else {
    var url = '/logout';
    sendAjaxRequest(url, {}, 'post', 'delete', null, function(data){
      htmlLogout(data);
    });
  }

  e.preventDefault();
}

function clickChangeAdmin(){
  var url = $(this).parent().next().find('form').attr('action');
  sendAjaxRequest(url, {}, 'post', 'put', null, function(data){
    console.log(data);
  });
}

function htmlRegisterComplete(result){
  //clear text from email and password input fields
  $('input[name="email"]').val('');
  $('input[name="password"]').val('');

  // if result.status (passed back from server in
  // in clickRegister() and users.create()),
  // then show hide login form.
  if(result.status === 'ok'){
    $('form#authentication').toggleClass('hidden');
  }
}

function htmlUpdateLoginStatus(result){
  console.log()
  //clear text from the input boxes
  $('input[name="email"]').val('');
  $('input[name="password"]').val('');

  // if result.status (which server passed back on clickRegister
  // in users.create) is 'ok', then:
  // - hide login form
  // - change text, data-email, style red the #authentication-button
  // in nav.jade  if (user) #authentication-button shows user.email
  // does a GET '/' request with window.location.href
  if(result.status === 'ok'){
    // e.g. result is {status: "ok", email: "charles@gmail.com"}
    // result.status = 'ok'
    $('form#authentication').toggleClass('hidden');
    $('#authentication-button').attr('data-email', result.email);
    $('#authentication-button').text(result.email);
    /////////////////////////////////////////////
    // here is where the login button changes red
    $('#authentication-button').addClass('alert');
    // #the-application is example of optional field could
    // display after someone is logged in
    //$('#the-application').removeClass('hidden');
    // Does a GET to '/table'--on login takes them to the table page.
    window.location.href = '/table';
  }
}

function htmlLogout(data){
  $('#authentication-button').attr('data-email', 'anonymous');
  $('#authentication-button').text('Login | Sign Up');
  $('#authentication-button').removeClass('alert');
  $('#the-application').addClass('hidden');
  window.location.href = '/';
}

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
function loadMap(map){
  // init(map); see example2.js;
  alert('in loadMap, map:');
}

function clickSave(e){
  // convert currently displayed graph to JSON
  var newGraphDataJSON = fd.toJSON('graph');

  // get current map's id from jade
  var originalMapJSON = JSON.parse($('#mapdata').text());
  var mapId = originalMapJSON._id;

  // send new graph JSON and original map ID to
  // server using a 'put' to '/save' --> map.save
  sendGenericAjaxRequest('/save', {mapId: mapId, graphData: newGraphDataJSON}, 'post', 'put', e, function(data){

  });
}

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
  idNumber -= 1;window.location.href
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
  // update json (fd.graph current state --> json)
  json = fd.toJSON("graph");
}

function changeText(event, oldThis){
  // get text from <textarea>, clear <textarea>, change node's label <span> in DOM to the new text
  var newText = $('#nodeTextBox').val();
  $('#nodeTextBox').val('');
  $(oldThis).text(newText);

  // change the actual node object's text within fd.graph
  var thisNodeId = event.target.parentNode.attributes[0].nodeValue;
  var thisNode = fd.graph.getNode(thisNodeId);
  thisNode.name = newText;
  // update json (fd.graph current state --> json)
  json = fd.toJSON("graph");
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
