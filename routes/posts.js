var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var db = mongoose.connection;

var collection = db.collection('posts');

router.get('/post', ensureAuthenticated, function(req, res, next){
    collection.find({}).toArray(function(err, posts){
    	console.log(posts)
    	res.render('post',{posts:posts});
    });
     
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}


module.exports = router;