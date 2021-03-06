var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});


router.get('/users', function(req, res, next) {
    User.find(function(err, users){
        if(err){ return next(err); }

        res.json(users);
    });
});


router.get('/users/:user', function(req, res) {
        res.json(req.user);
});


router.param("user", function(request, response, next, id) {
    var query = User.findById(id);

    query.exec(function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(new Error("can't find user"));
        }

        request.user = user;
        return next();
    });
});


module.exports = router;
