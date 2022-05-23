/** *******************
 *  UTILITY FUNCTIONS 
 ******************** */


const utils = {}; 

// enables the debug print when is setted to 1
const debug = 1;

/**
 * Debug print
 */
utils.printd = (string) => {
	if(debug)
		console.log(string);
};

/**
 * Verifies validity of an variable, if its not undefined or null
 */
utils.isValid = (value) => {	
	let res = true;
	if(value == undefined || value == null || value == NaN || value == "")
	{
		res = false;
		utils.printd('The value "' + value +'" is not valid');
	}
	else 
	{
		utils.printd('The value "' + value +'" is valid');
	}
	return res;
}

/** ***************
 *  STATUS CODES  
 **************** */

/**
 * Sets a 405 http response status, method not allowed
 */
 utils.notAllowed = (res, message) => {
	if(!utils.isValid(message)) 
		message = 'Method Not Allowed';
	utils.printd(message);
	res.status(405).json({status: 405, message: message});
};

/**
 * Sets a 400 http response status, bad request
 */
 utils.badRequest = (res, message) => {
	if(!utils.isValid(message)) 
		message = 'Bad Request';
	utils.printd(message);
	res.status(400).json({status: 400, message: message});
};

/**
 * Sets a 404 http response status, not found
 */
utils.notFound = (res, message) => {
	if(!utils.isValid(message)) 
		message = 'Not Found';
	utils.printd(message);
	res.status(404).json({status: 404, message: message});
};

/**
 * 
 * Sets a 402 http response status, wrong password
 */

utils.wrongPassword = (res, message) => {
	if(!utils.isValid(message))
		message = 'Wrong Password';
	utils.printd(message);
	res.status(402).json({status: 402, message: message});
}

/**
 * Sets a status, 200 ok or 404 Not found
 */
utils.setResponseStatus = (param,res) => {
	if(param) {
		utils.printd('Successful request');
		res.status(200).json({message: param});
	}
	else
		utils.notFound(res);
};

/**
 * Sets a 201 status code, resource created
 */
utils.created = (res, message) => {
	if(!utils.isValid(message)) 
		message = 'Created';
	utils.printd(message);
	res.status(201).json({status: 201, message: message});
};

/**
 * Sets a 409 status code, the resource already exists
 */
utils.alreadyExists = (res, message) => {
	if(!utils.isValid(message)) 
		message = 'The resource already exists';
	utils.printd(message);
	res.status(409).json({status: 409, message: message});
};


module.exports = utils;
