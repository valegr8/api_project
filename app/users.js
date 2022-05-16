const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
/**
 * Get user model
 */
const User = require('./models/user'); 

/**
 * TODO: add description
 */
router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    let user = await User.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/users/' + user.id,
        email: user.email
    });
});

/**
 * TODO: add description
 */
router.get('', async (req, res) => {
    let users;

    if (req.query.email)
        users = await User.find({email: req.query.email}).exec();
    else
        users = await User.find().exec();

    users = users.map( (entry) => {
        return {
            self: '/api/v1/users/' + entry.id,
            email: entry.email
        }
    });

    res.status(200).json(users);
});

/**
 * TODO: add description
 */
router.post('', async (req, res) => {
    
	let user = new User({
        email: req.body.email,
        password: req.body.password
    });

    if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
	user = await user.save();
    
    let userId = user.id;

    res.location("/api/v1/users/" + userId).status(201).send();
});


/**
 * function for creating a new user
 */
 router.post('/register', async function(req,res) {

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



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
/**
 * TODO: add description
 */
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}




module.exports = router;
