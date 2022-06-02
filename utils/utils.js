/** *******************
 *  UTILITY FUNCTIONS 
 ******************** */

const utils = {}; 

// enables the debug print when is setted to 1
const debug = 0;
const grcl = "\x1b[32m"; /**< green */
const rdcl = "\x1b[31m"; /**< red */
const rst = "\x1b[0m";   /**< no color */

/**
 * Debug print
 */
utils.printd = (text, info = "", color = grcl) => {
	if(debug)
		console.log((info == "") ? text : "["+ color + info + rst + "]" + text);
};

/**
 * Verifies validity of an variable, if its not undefined or null
 */
utils.isValid = (value) => {	
	let res = true;
	if(value == undefined || value == null || value == NaN || value == "")
	{
		res = false;
		// utils.printd('The value "' + value +'" is not valid');
	}
	else 
	{
		// utils.printd('The value "' + value +'" is valid');
	}
	return res;
}

/** ***************
 *  STATUS CODES  
 **************** */

/**
 * Sets a 405 http response status, method not allowed
 */
 utils.notAllowed = (res, message, info = "" ) => {
	if(!utils.isValid(message)) 
		message = 'Method Not Allowed';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(405).json({status: 405, message: message});
};

/**
 * Sets a 400 http response status, bad request
 */
 utils.badRequest = (res, message, info = "") => {
	if(!utils.isValid(message)) 
		message = 'Bad Request';
		utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(400).json({status: 400, message: message});
};

/**
 * Sets a 404 http response status, not found
 */
utils.notFound = (res, message, info = "") => {
	if(!utils.isValid(message)) 
		message = 'Not Found';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(404).json({status: 404, message: message});
};

/**
 * 
 * Sets a 401 http response status, Unathorized
 */
utils.wrongPassword = (res, message, info = "") => {
	if(!utils.isValid(message))
		message = 'Unathorized';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(401).json({status: 401, message: message});
}

/**
 * Sets a status, 200 ok or 404 Not found
 */
utils.setResponseStatus = (param, res, message, info = "") => {
	if(param) {
		if(!utils.isValid(message))
			utils.printd('Successful request');
		else
			utils.printd(message);
		res.status(200).json({message: param});
	}
	else
		utils.notFound(res);
};

/**
 * Sets a 201 status code, resource created
 */
utils.created = (res, message, info = "") => {
	if(!utils.isValid(message)) 
		message = 'Created';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(201).json({status: 201, message: message});
};

/**
 * Sets a 409 status code, the resource already exists
 */
utils.alreadyExists = (res, message, info = "") => {
	if(!utils.isValid(message)) 
		message = 'The resource already exists';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(409).json({status: 409, message: message});
};

/**
 * Sets a 500 status code, Internal Server Error
 */
 utils.internalServerError = (res, message, info = "") => {
	if(!utils.isValid(message)) 
		message = 'Internal Server Error';
	utils.printd((info == "") ? message : "["+ info +"]" + message);
	res.status(500).json({status: 500, message: message});
};

module.exports = utils;
