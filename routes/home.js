var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('User');

exports.index = function(req, res){
  // passing back res.locals.user because
  // in nav.jade:
  // if user
  //    li.has-form: a#authentication-button.button.radius.alert(href="#", data-email=user.email)= user.email
  res.render('home/index', {title: 'Title', user: res.locals.user});
};