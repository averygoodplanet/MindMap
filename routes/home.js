exports.index = function(req, res){
  console.log('*****************************');
  console.log('in exports.index, res.locals: ');
  console.log(res.locals);
  console.log('res.locals.user');
  console.log(res.locals.user);

  res.render('home/index', {title: 'MindMap', user: res.locals.user});
};