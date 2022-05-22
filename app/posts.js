const express = require('express');
const router = express.Router();
/**
 * Get post model
 */
const Post = require('./models/post'); 
const User = require('./models/user'); 

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
	// gets all posts
    let posts = await Post.find({}).exec();	
    utils.setResponseStatus(posts,res);
});

/**
 * Delete not allowed
 */
router.delete('', async (req, res) => {
	utils.notAllowed(res);
});

/**
 * Put not allowed
 */
router.put('', async (req, res) => {
	utils.notAllowed(res);
});

/**
 * Get a single post by its id
 */
router.get('/:id', async (req, res) => {
	printd('[GET/:id]ID: ' + req.params.id);
	if(!utils.isIdValid(req.params.id)){
		utils.badRequest(res);
	}else{		
		let query = { _id : req.params.id };
		Post.findOne(query).exec().then((post)=>{
			utils.setResponseStatus(post,res);
		}).catch((e) => {
			printd('Error: ' + e);
			utils.notFound(res);
		});
	}
});

/**
 * Create a new post
 */
router.post('', async (req, res) => {
	printd('Request email: ' + req.body.email);
	printd('Title: ' + req.body.title);
	//check if the request email is not null otherwise returns 400
	if(req.body.email == NaN || req.body.email == undefined) {
		printd('User email not correct!');
		utils.badRequest(res);	//return 400;
		return;
	}
	else {
		//A post can uploaded only by signed-up user.
		//Checks whether the user is already signed up.
		//'await' is used to stop the execution until the promise is fullfilled or rejected
		// find a user with the email in the request otherwise null
		let user = await User.findOne({ email : req.body.email }).exec();
		if(user == null){
			printd('User does not exist');
			utils.badRequest(res);	//return 400;
			return;//the run ends here.
		}
	}

	//check if the request title is not null
	if(req.body.title == NaN || req.body.title == undefined) {
		printd('User title not correct!');
		utils.badRequest(res);	//return 400;
		return;
	}
		
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: req.body.email
    });

	//save a new post
	post = post.save().then((savedPost) =>{
		// printd(savedPost._id);
		let postId = savedPost._id;
		if(postId==undefined) {
			printd('Post Id undefined');
			utils.notFound(res);
		}
		else {
			printd('Post saved successfully');
			res.location("/api/v1/posts/" + postId);
			utils.created(res);
		}
	}).catch((e) => {		
		// If the post fails we return 404 status code
		printd('Post saving failed');
		utils.notFound(res);
	});
});

module.exports = router;
