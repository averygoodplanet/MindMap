exports.show = function(req, res){
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  res.render('edit/index');
};