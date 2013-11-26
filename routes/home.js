exports.index = function(req, res){
  res.render('home/index', {title: 'MindMap', user: res.locals.user});
};