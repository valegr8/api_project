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
	
	// find the user
	let user = await User.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!user) {
		//res.json({ success: false, message: 'Authentication failed. User not found.' });
		utils.notFound(res);
		console.log("utente non trovato");
		return;
	}
	
	// check if password matches
	if ( user != null && user.password != req.body.password) {
		//res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		utils.wrongPassword(res);
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

	res.status(200).json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		username: user.username,
		id: user._id,
	});

});

module.exports = router;
