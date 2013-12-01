var express = require('express');
var path = require('path');
var less = require('express-less');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('User');


exports.initialize = function(app, RedisStore){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon()); // favicon
  app.use(express.logger('dev')); // logs stuff
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/less', less(__dirname + '/less', { compress: true })); //using less files
  app.use(express.cookieParser()); // lets read cookies
  app.use(express.session({
    store : new RedisStore({host: 'localhost', port: 6379}),
    secret: 'change-this-to-a-super-secret-message',
    cookie: { maxAge: 60 * 60 * 1000 }
  }));
  /////////////////////////////////
  app.use(function(req, res, next){
    if(req.session.userId){//if you haven't logged in yet of course there's no user id.
     //take the req.session.userId and use it to
     // retrieve user from mongoose database
      User.findById(req.session.userId, function(err, user){
        if(user){//if you've found the user put him in the pipeline so he can be used downstream:
          res.locals.user = user;
          // console.log('****in app.use, found user: ');
          // console.log(user);
          // console.log('and res.locals.user');
          // console.log(res.locals.user);
          // next() is important because it lets the next
          // function in middleware process run.
          next();
        }
      });
    } else {
      // console.log('****in app.use, did not find user by id');
      next();
    }
  });
  ///////////////////////////

  app.use(app.router); // identifies routes section in app.js

  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }
};
