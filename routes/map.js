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

exports.create = function(req, res){
  res.render('edit/index');
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