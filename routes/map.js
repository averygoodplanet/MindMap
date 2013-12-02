var mongoose = require('mongoose');
var Map = mongoose.model('Map');
var ObjectId = require('mongoose').Types.ObjectId;

// called by clickLoad's GET '/map'
exports.show = function(req, res){
  console.log('******in exports.show, req.query: ');
  console.log(req.query);
  console.log('******in exports.show, req.query.mapId: ');
  console.log(req.query.mapId);

  Map.findOne({_id: req.query.mapId}, function (err, map){
    console.log('found map: ');
    console.log(map);
    res.render('edit/index', {map: map});
  });
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
    // console.log('map after try assign graphData: ');
    // console.log(map);
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

    // console.log('*******in newMap, map: ');
    // console.log(map);
    res.render('edit/index', {map: map});
  });
};

exports.table = function(req, res){
  req.body.user = res.locals.user;
  var idString = req.body.user._id.toString();
   var user = new ObjectId(idString);
  // Map.find() see http://mongoosejs.com/docs/queries.html
  // find all maps by user
  Map.find({ "user": user}).select('title lastModified').exec(function (err, maps){
    console.log(maps);
    // passing back all maps by user
    // so their title can be displayed in table
    // so that their id can be stored in data-id
    // attribute
    res.render('table/index', {maps: maps});
  });
};

exports.instructions = function(req, res){
  res.render('instructions/index');
};

exports.about = function(req, res){
  res.render('about/index');
};