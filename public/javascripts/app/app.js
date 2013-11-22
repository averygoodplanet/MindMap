/* global document, window, io */

$(document).ready(initialize);

var socket;

var dummyMapObject = {name: 'map#1'};

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  initializeEventHandlers();
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
  $('#blackFilledRectangle').on('click', clickBlackFilledRectangle);
  $('#resetCanvas').on('click', clickResetCanvas);
  $('#redEmptyRectangle').on('click', clickRedEmptyRectangle);
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
function getCanvasThenNext(next){
  // set canvas to variable
  var canvas = document.getElementById('canvas');
  // set canvas context to variable
  // (the context has access to <canvas> methods and properties)
  var context = canvas.getContext('2d');
  // pass the canvas and context to the next function (e.g. to draw a circle)
  next(canvas, context);
}

function clickBlackFilledRectangle() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  // draw a black rectangle using context.fillRect(x, y, w, h)
  // where x and y are coordinates of left-top corner of rectangle
  // w is width, h is height
  context.fillStyle = 'black';
  context.fillRect(0, 0, 100, 100);
}

function clickResetCanvas() {
  var canvas = document.getElementById('canvas');
  // setting the height or width of <canvas> resets it
  canvas.width = canvas.width;
}

function clickRedEmptyRectangle() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  // change fillStyle to red
  context.strokeStyle = 'red';
  context.strokeRect(0, 0, 100, 100);
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