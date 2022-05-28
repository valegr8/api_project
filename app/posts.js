const express = require('express');
const router = express.Router();

/**
 * Get post model
 */
const Post = require('./models/post');
const User = require('./models/user'); 

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
	// gets all posts
    let posts = await Post.find({});	
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
	printd('id: ' + req.params.id);	
	if(!isValidObjectId(req.params.id)){
		utils.badRequest(res);
	}else{		
		let post = await Post.findById(req.params.id);
		utils.setResponseStatus(post,res);
	}
});

/**
 * Create a new post
 */
router.post('', async (req, res) => {
	printd('Request email: ' + req.body.email);
	printd('Title: ' + req.body.title);
	//check if the request email is not null otherwise returns 400
	if(!utils.isValid(req.body.email)) {
		utils.badRequest(res,'User email not valid');	//return 400;
		return;
	}
	else {
		//A post can uploaded only by signed-up user.
		//Checks whether the user is already signed up.
		//'await' is used to stop the execution until the promise is fullfilled or rejected
		// find a user with the email in the request otherwise null
		let user = await User.findOne({ email : req.body.email });
		if(user == null){
			utils.badRequest(res, 'User does not exist');	//return 400;
			return;//the run ends here.
		}
	}

	//check if the request title is not null
	if(!utils.isValid(req.body.title)) {
		utils.badRequest(res, 'User title not valid');	//return 400;
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
		if(!isValidObjectId(postId)) {
			utils.notFound(res, 'Post id not valid');
		}
		else {
			res.location("/api/v1/posts/" + postId);
			utils.created(res, 'Post saved successfully');
		}
	}).catch((e) => {		
		// If the post fails we return 500 status code, Internal server error
		utils.internalServerError(res,'Post saving failed');
	});
});

module.exports = router;
