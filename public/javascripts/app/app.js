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
  sendGenericAjaxRequest('/map', {}, 'GET', null, e, drawMap);
}

///////////////////////  HTML/CSS Changes //////////////////////////////////
function drawMap(AJAXdata){
  alert('in drawMap() function');
  console.log(dummyMapObject);
}

////////////////////////  <canvas> functions //////////////////////////////
function clickBlackFilledRectangle() {
  // console.log('in clickBlackFilledRectangle()');

}

function clickResetCanvas() {
  // console.log('in clickResetCanvas()');
}

function clickRedEmptyRectangle() {
  // console.log('in clickRedEmptyRectangle()');
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