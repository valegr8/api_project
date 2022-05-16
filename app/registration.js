const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const u = require('../utils/comode');


/**
 * function for creating a new user
 */
router.post('', async function(req,res) {

    let uEmail = req.body.email;
    let uPassword = req.body.password;

    //search if there is already a user with the same email
    let user = await User.findOne({ email: req.body.email}).exec();

    //if user already exist, return error

    if(user != null) { 		
        res.json({ success: false, message: 'Authentication failed. Email already in use.' });
        console.log("user already existing");
        return;
    }
	//create new user
    user = new User({
        email: uEmail,
        password: uPassword
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

	res.json({
		success: true,
		message: 'User created!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});


});


module.exports = router;