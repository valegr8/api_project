const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
/**
 * Get user model
 */
const User = require('./models/user'); 

/**
 * function for creating a new user
 */
router.post('', async function(req,res) {

    let uEmail = req.body.email;
    let uPassword = req.body.password;
    let uUsername = req.body.username;

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
        password: uPassword,
        username: uUsername
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
        username: user.username,
		id: user._id,
	});
});

module.exports = router;
