var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('User');

exports.create = function(req, res){
  // create new mongoose User model
  // and set the user email from the email in the request
  var user = new User();
  user.email = req.body.email;

  // convert password --> to hash
  //bcrypt.hash(provided-password, salt, callback)
  bcrypt.hash(req.body.password, 10, function(err, hash){
    //save the hash (not the password) in user.password
    user.password = hash;
    //save the user to mongoose
    user.save(function(err, user){
      if(err){
        res.send({status: 'error'});
      } else {
        // if saved successfully, send back status: 'ok';
        res.send({status: 'ok'});
      }
    });
  });
};

exports.login = function(req, res){
  User.findOne({email: req.body.email}, function(err, user){
    if(user){
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
          req.session.regenerate(function(err){
            //saves userId to session in redis
            req.session.userId = user.id;
            req.session.save(function(err){
              res.send({status: 'ok', email: user.email});
            });
          });
        } else {
          req.session.destroy(function(err){
            res.send({status: 'error'});
          });
        }
      });
    } else {
      res.send({status: 'error'});
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(err){
    res.send({status: 'ok'});
  });
};

exports.makeMeAnAdmin = function(req, res){
  if(req.query.password === '12345'){
    res.locals.user.isAdmin = true;
    res.locals.user.save(function(err, user){
      res.send(user);
    });
  } else {
    res.send('sorry!');
  }
};

exports.admin = function(req, res){
  User.find(function(err, users){
    res.render('users/admin', {title: 'Express', users: users});
  });
};

exports.delete = function(req, res){
  User.findByIdAndRemove(req.params.id, function(err, user){
    res.redirect('/admin');
  });
};

exports.update = function(req, res){
  User.findById(req.params.id, function(err, user){
    user.isAdmin = !user.isAdmin;
    user.save(function(err, user){
      res.send({});
    });
  });
};