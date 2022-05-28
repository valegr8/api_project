const express = require('express');
const router = express.Router();
/**
 * get user mongoose model
 */
const User = require('./models/user'); 
/**
 * used to create, sign, and verify tokens
 */
const jwt = require('jsonwebtoken'); 
const utils = require('../utils/utils');

/**
 * route to authenticate and get a new token
 */
router.post('', async function(req, res) {
	utils.printd(req.body.email);

	//email not valid
	if(!utils.isValid(req.body.email)) {
		utils.badRequest(res, "Bad request, email not valid");
		return;
	}

	//password not valid
	if(!utils.isValid(req.body.password)) {
		utils.badRequest(res, "Bad request, inserted password not valid");
		return;
	}

	// find the user
	let user = await User.findOne({ email: req.body.email });

	utils.printd(user);
	
	// user not found
	if (!utils.isValid(user)) {
		utils.notFound(res, "User not found");
		return;
	}
	
	// check if password matches
	if (user != null && user.password != req.body.password) {
		utils.wrongPassword(res, "Password do not match");
		return;
	}
	
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

	// successful request
	res.status(201).json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		username: user.username,
		id: user._id,
		favorite: user.favorite
	});

});

module.exports = router;
