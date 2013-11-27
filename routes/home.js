var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('User');

exports.index = function(req, res){
  // console.log('*****************************');
  // console.log('in exports.index, res.locals: ');
  // console.log(res.locals); // a function
  // console.log('res: ');
  // console.log(res);
  // // console.log(res.user.email);  // was  undefined
  // //////////////////////////////////////
  // // res.locals.user = req.user.email;
  console.log('in ./routes/home/exports.index************res.locals.user');
  console.log(res.locals.user); // was undefined
  if(res.locals.user){
    console.log('in ./routes/home/exports.index***********res.locals.user.email');
    console.log(res.locals.user.email);
  }
  // console.log('***************req');
  // console.log(req);
  // console.log('*********req.params');
  // console.log(req.params); // []
  // console.log('************req.body')
  // console.log(req.body); // []
  // console.log('************req.query');
  // console.log(req.query); // []

  ////////////////////
  //req.session.userId is a cookie
  // // and is still available when not logged in
  // console.log('****************req.session.userId');
  // console.log(req.session.userId);
  // // req.session.user is undefined when initially
  // // go to home page and not-logged-in
  // console.log('****************req.session.user');
  // console.log(req.session.user);
  res.render('home/index', {title: 'MindMap', /* user: res.locals.user, */ mySession: req.session});
};