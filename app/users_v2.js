const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');
const info = "User";

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
    printd('Email: ' + req.body.email, info);
    printd('Username: ' + req.body.username, info);
    printd('Password: ' + req.body.password,info);		

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
router.post('/:uid/posts', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById({_id: uid});
	
	if(!user){
		utils.badRequest(res,info);
		return;
	}		
	

	//check if the request title is not null
	if(!utils.isValid(req.body.title)) {
		utils.badRequest(res, 'User title not valid', info);	//return 400;
		return;
	}
	
	if(!isValidObjectId(uid)){
		utils.badRequest(res, 'User title not valid', info);	//return 400;
		return;
	}
	
	
		
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: uid,
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
			utils.notFound(res, 'Post id not valid',info);
		}
		else {
			res.location("/api/v2/users/"+ uid + "/posts/" + postId);
			utils.created(res, 'Post saved successfully',info);
		}
	}).catch((e) => {		
		// If the post fails we return 404 status code
		utils.notFound(res,'Post saving failed',info);
	});
});

/**
 * Get all posts published by a user
 */
 //uid = user id 
router.get('/:uid/postsCr', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById({_id: uid});
	
	if(!user){
		utils.badRequest(res);
		return;
	}else{		
		Post.find({createdBy : user.email }).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved correctly',info);
		}).catch((e) => {
			printd('Error: ' + e,info);
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
		utils.badRequest(res,info);
		return;
	}else{
		Post.findOne({ _id : id }).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved successfully',info);
		}).catch((e) => {
			printd('Error: ' + e);
			utils.notFound(res);
		});
	}
	
});


/**
 * This function sets a specific post as "favorite"
 */
 router.post('/:uid/setFavorite', async function(req,res) {
	const postId = req.body.id;
	if(!isValid(postId)) {utils.badRequest(res, "Bad request, postId not valid");return;}
	const uid = req.params.uid;
	if(!isValid(uid)) {utils.badRequest(res, "Bad request, uid not valid");return;}
	utils.printd("PostId: " + postId,"AddFav");
	utils.printd("UserId: " + uid,"AddFav");
	const user = await User.findOne({ _id: uid}).exec();
	if(user == null){utils.notFound(res, "User not found"); return;}
	let favList = user.favorite;

    if (favList.indexOf(postId) !== -1) {
        utils.alreadyExists(res, `Post ${postId} already on Favorite List`,info); return;
    }
    favList.push(postId);
	await User.updateOne({ _id: uid}, {
		favorite: favList
	});
	res.status(200).json({
		success: true,
		message: 'Post addedd to your favorites!',
		uid: uid,
		id: postId,
        favorite: favList
	});
    printd("Fav added. Post id: " + postId,info);
	return;
 });

 /**
 * This function remove a specific post as "favorite"
 */
  router.post('/:uid/remFavorite', async function(req,res) {
	const postId = req.body.id;
	if(!isValid(postId)) {utils.badRequest(res, "Bad request, postId not valid",info);return;}
	const uid = req.params.uid;
	if(!isValid(uid)) {utils.badRequest(res, "Bad request, uid not valid",info);return;}
	utils.printd("PostId: " + postId,"RemFav");
	utils.printd("UserId: " + uid,"RemFav");
	const user = await User.findOne({ _id: uid}).exec();
	if(user == null){utils.notFound(res, "User not found"); return;}
	var favList = user.favorite;
    var index = favList.indexOf(postId);
    if (index !== -1) {
        favList.splice(index, 1);
    }
    else{
        utils.notFound(res, `Post ${postId} not found on Favorite List`,info); return;
    }	
	await User.updateOne({ _id: uid}, {
		favorite: favList
	});
	res.status(200).json({
		success: true,
		message: 'Post removed from your favorites!',
		uid: uid,
		id: postId,
        favorite: favList
	});
    printd("Fav removed. Post id: " + postId,info);
	return;
 });


 /**
 * This function updates a specific username
 */
  router.post('/:uid/updateUsername', async function(req,res) {
	const uid = req.params.uid;
	utils.printd(uid);
	if(!isValid(uid)) {utils.badRequest(res, "Bad request, uid not valid");return;}
    const nusername = req.body.username;
    if(!isValid(nusername)) {utils.badRequest(res, "Bad request, username not valid");return;}
	utils.printd("Username: " + nusername,"UsrnameUpd");
	utils.printd("UserId: " + uid,"UsrnameUpd");
	const user = await User.findOne({ _id: uid}).exec();
    if(user == null) {utils.notFound(res,"Utente non trovato"); return;}
    
	await User.updateOne({ _id: uid}, {
		username: nusername
	});
	res.status(200).json({
		success: true,
		message: 'username changed',
		uid: uid,
		email: user.email,
		username: nusername
	});
	return;
 });

module.exports = router;
