var express =require('express');
var router = express.Router();
var multer= require('multer');
var upload = multer({dest:'./uploads'});
var mongoose = require('mongoose');


var db = mongoose.connection;


router.get('/add', ensureAuthenticated, function(req, res, next){
	var categories = db.collection('categories');
	categories.find({}, function(err, categories){
		if(err) throw err;
	  res.render('addpost', {'title': 'Hey there!! Why dont you add post', 'categories':categories})	
	})
	
})

router.post('/add', ensureAuthenticated, upload.single('mainimage'), function(req, res, next){
	
	//get form values
	var title = req.body.title;
    var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

    // Check Image upload
	if(req.file){
     var mainimage = req.file.filename;
	}else{
		var mainimage = 'noimage.jpg';
	}

	//From Validation
	req.checkBody('title','Title field is required').notEmpty()
	req.checkBody('body','Body field is required').notEmpty()


	//Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('/addpost', {
			"errors":errors
		})
	}else{
		var collection = db.collection('posts');
		collection.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainimage":mainimage
		}, function(err, posts){
			if(err) throw err;

			req.flash('success', 'Post added');
			res.location('/');
			res.redirect('/');
		})
	}

	console.log(title);
})


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}


module.exports = router;