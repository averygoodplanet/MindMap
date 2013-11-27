var mongoose = require('mongoose');
var Map = mongoose.model('Map');

exports.show = function(req, res){
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  res.render('edit/index');
};

exports.new = function(req, res){
  res.render('new/index');
};

exports.save = function(req, res){
  res.render('table/index');
};

//GET '/edit'
exports.edit = function(req, res){
  res.render('edit/index');
};

// POST '/create'
exports.create = function(req, res){
  req.body.user = res.locals.user;

  // save a new map to database
  new Map(req.body).save(function(err, map){
    // pass map object back to browser (static app.js)
    // then within static app.js you'll do a page change and
    // pass object
    console.log('*******in newMap, map: ');
    console.log(map);
    res.send(map);
    // res.render('edit/index', {map: map});
  });
};

exports.table = function(req, res){
  res.render('table/index');
};

exports.instructions = function(req, res){
  res.render('instructions/index');
};

exports.about = function(req, res){
  res.render('about/index');
};