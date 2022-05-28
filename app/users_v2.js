const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');

/**
 * Get user model
 */
const User = require('./models/user_v2');

/**
 * Get post model
 */
//I need this
const Post = require('./models/post_v2'); //the new version

/**
 * function for creating a new user
 */
router.post('', async function(req,res) {	
    printd('Email: ' + req.body.email);
    printd('Username: ' + req.body.username);
    printd('Password: ' + req.body.password);		

    if(!isValid(req.body.email)) {
        utils.badRequest(res, "Bad request, email not valid");
        return;
    }

    //search if there is already a user with the same email
    let user = await User.findOne({ email: req.body.email});
    
    //if user already exist, return error and a 409 status code
    if(user != null) { 		
        utils.alreadyExists(res, "User already exists");
        return;
    }

    //if the email is not a string returns a bed request status code
    if(!checkIfEmailInString(req.body.email)) {
        utils.badRequest(res, "Bad request, email not in the correct format");
        return;
    }

    //check if the username and the password are valid, if not returns a bad request status code
    if(!utils.isValid(req.body.username) || !utils.isValid(req.body.password)) {
        utils.badRequest(res, "Bad request, username or password not valid");
        return;
    }

	//create new user
    user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        favorite: req.body.favorite
    });
	
    user.save(function(err){});

    // if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id
    // other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, 'admin1234', options);

    //return value
	res.status(201).json({
		success: true,
		message: 'User created!',
		token: token,
		email: user.email,
        username: user.username,
		id: user._id,
        favorite: user.favorite
	});
});

/**
 * This function check if the pattern of an email is correct
 * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 */
 function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var res = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(text);
}

//work in progress
//uid = user id
router.post('/:uid/posts/', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById(uid);
	
	if(!user){
		utils.badRequest(res);
		return;
	}		
	

	//check if the request title is not null
	if(!utils.isValid(req.body.title)) {
		utils.badRequest(res, 'User title not valid');	//return 400;
		return;
	}
	
	if(!isValidObjectId(req.body.uid)){
		utils.badRequest(res, 'User title not valid');	//return 400;
		return;
	}
	
	
		
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: req.body.uid,
		contract: req.body.contract,
		phone: req.body.phone,
		rooms: req.body.rooms,
		available: req.body.available,
		where: req.body.where
    });

	//save a new post
	post = post.save().then((savedPost) =>{
		// printd(savedPost._id);
		let postId = savedPost._id;
		if(!isValidObjectId(postId)) {
			utils.notFound(res, 'Post id not valid');
		}
		else {
			res.location("/api/v2/users/"+ uid + "/posts/" + postId);
			utils.created(res, 'Post saved successfully');
		}
	}).catch((e) => {		
		// If the post fails we return 404 status code
		utils.notFound(res,'Post saving failed');
	});
});

/**
 * Get all posts published by a user
 */
 //uid = user id 
router.get('/:uid/posts/', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById(uid);
	
	if(!user){
		utils.badRequest(res);
		return;
	}else{		
		Post.find({}).where('createdBy').equals(uid).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved correctly');
		}).catch((e) => {
			printd('Error: ' + e);
			utils.notFound(res);
		});
	}
});

/**
 * Get a single post published by a user
 */
 //uid = user id
router.get('/:uid/posts/:id', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById(uid).exec();
	let id = req.params.id;
	
	if(!user || !isValidObjectId(id)){
		utils.badRequest(res);
		return;
	}else{
		Post.findOne({ _id : id }).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved successfully');
		}).catch((e) => {
			printd('Error: ' + e);
			utils.notFound(res);
		});
	}
	
});

module.exports = router;
