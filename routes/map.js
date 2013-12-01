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
  // find the map
  Map.findOne({_id: req.body.mapId}, function (err, map) {
    // assign new graphData to map
    // (model was modified so that graphData is initialized as an empty array)
    map.graphData = req.body.graphData;
    console.log('map after try assign graphData: ');
    console.log(map);
    // save the map
    map.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
        res.end(); // res.end() seems necessary for callback's window.location.href to work
        // per http://stackoverflow.com/questions/11570301/res-redirect-from-post
        // to redirect after a POST, you need to change
        // url in static javascript not server-side.
    });
  });
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

    // modify graphData (on brand-new graph only) to have 2 points.
    map.graphData = [
    {   "id" : "graphnode0",  "name" : "START",
      "data" : {  "$type" : "star",
      "$color" : "#0000FF",
      "$alpha" : "1",   "$dim" : "7" },
      "adjacencies" : [   {   "nodeTo" : "graphnode999",
                              "data" : {  "$alpha" : "1",
                                          "$lineWidth" : "0.4",
                                          "$color" : "#23a4ff" } } ]
    },
    {   "id" : "graphnode999",
        "name" : "next",
        "data" : {  "$alpha" : "1", "$dim" : "7" }
    }];

    console.log('*******in newMap, map: ');
    console.log(map);
    res.render('edit/index', {map: map});
  });
};

exports.table = function(req, res){
  // find all maps by user

  // passing back all maps by user
  // so their title can be displayed in table
  // so that their id can be stored in data-id
  // attribute
  res.render('table/index');
};

exports.instructions = function(req, res){
  res.render('instructions/index');
};

exports.about = function(req, res){
  res.render('about/index');
};