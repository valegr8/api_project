const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');

/**
 * Get user model
 */
const User = require('./models/user');

/**
 * Get post model
 */
const Post = require('./models/post'); 

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
    let user = await User.findOne({ email: req.body.email}).exec();
    
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
        favorite: {}
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
	res.status(200).json({
		success: true,
		message: 'User created!',
		token: token,
		email: user.email,
        username: user.username,
		id: user._id,
        favorite: favorite
	});
});


/**
 * This function updates a specific username
 */
 router.post('/updateUsername', async function(req,res) {
	const email = req.body.email;
    const username = req.body.username;
    if(!isValid(req.body.email)) {utils.badRequest(res, "Bad request, email not valid");return;}
    if(!isValid(req.body.username)) {utils.badRequest(res, "Bad request, username not valid");return;}
	const user = await User.findOne({ email: email}).exec();
    if(user == null) {utils.notFound(res,"Utente non trovato"); return;}
    
	await User.updateOne({ email: email}, {
		username: username
	});
	res.status(200).json({
		success: true,
		message: 'username changed',
		email: user.email,
		username: user.username
	});
	return;
 });


/**
 * This function sets a specific post as "favorite"
 */
 router.post('/setFavorite', async function(req,res) {
	const postId = req.body.id;
	const email = req.body.email;
	const user = await User.findOne({ email: email}).exec();
	let favList = user.favorite;

    if (favList.indexOf(postId) !== -1) {
        utils.alreadyExists(res, `Post ${postId} already on Favorite List`); return;
    }
    favList.push(postId);
	await User.updateOne({ email: email}, {
		favorite: favList
	});
	res.status(200).json({
		success: true,
		message: 'Post addedd to your favorites!',
		email: user.email,
		id: postId,
        favorite: favList
	});
    printd("Fav added. Post id: " + postId);
	return;
 });

 /**
 * This function remove a specific post as "favorite"
 */
  router.post('/remFavorite', async function(req,res) {
	const postId = req.body.id;
	printd("Post id: " + postId);
	const email = req.body.email;
	printd("Email: " + email);
	const user = await User.findOne({ email: email}).exec();
	var favList = user.favorite;
    var index = favList.indexOf(postId);
    if (index !== -1) {
        favList.splice(index, 1);
    }
    else{
        utils.notFound(res, `Post ${postId} not found on Favorite List`); return;
    }	
	await User.updateOne({ email: email}, {
		favorite: favList
	});
	res.status(200).json({
		success: true,
		message: 'Post removed from your favorites!',
		email: user.email,
		id: postId,
        favorite: favList
	});
    printd("Fav removed. Post id: " + postId);
	return;
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

module.exports = router;
