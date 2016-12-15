var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var jwt = require('express-jwt');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.get('/posts', function(req, res, next) {
        Post.find(function(err, posts){
         if(err){ return next(err); }

         res.json(posts);
         });
});

router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;
    post.datetime = getDateTime();

    post.save(function(err, post){
        if(err){ return next(err); }

        res.json(post);
    });
});

router.get('/posts/:post', function(req, res) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(req.payload, function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
    req.post.downvote(req.payload, function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;
    comment.datetime=getDateTime();

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    req.comment.upvote(req.payload, function(err, comment){
        if (err) { return next(err); }

        res.json(comment);
    });
});

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
    req.comment.downvote(req.payload, function(err, comment){
        if (err) { return next(err); }

        res.json(comment);
    });
});


router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day +"/"+month+"/"+year+" "+hour+":"+min;

}

module.exports = router;
