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