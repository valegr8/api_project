/**
 * used to create, sign, and verify tokens
 */
const jwt = require('jsonwebtoken'); 

/**
 * function that verifies token
 */
const tokenChecker = function(req, res, next) {
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// if there is no token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});
	}

	// decode token, verifies secret and checks exp
	jwt.verify(token, 'admin1234', function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			req.loggedUser = decoded;
			next();
		}
	});
};

module.exports = tokenChecker;
