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

<<<<<<< Updated upstream
/**
 * Verifies validity of an variable, if its not undefined or null
 */
utils.isValid = (variable) => {	
	let res = true;
	if(variable == undefined || variable == null || variable == NaN || variable == "")
	{
		res = false;
		utils.printd(variable +' is not valid');
	}
	utils.printd(variable +' is valid');
	return res;
}
=======

>>>>>>> Stashed changes

/** ***************
 *  STATUS CODES  
 **************** */

/**
 * Sets a 405 http response status, method not allowed
 */
 utils.notAllowed = (res) => {
	utils.printd('Method Not Allowed');
	res.status(405).json({status: 405, message: 'Method Not Allowed'});
};

/**
 * Sets a 400 http response status, bad request
 */
 utils.badRequest = (res) => {
	utils.printd('Bad Request');
	res.status(400).json({status: 400, message: 'Bad Request'});
};

/**
 * Sets a 404 http response status, not found
 */
utils.notFound = (res) => {
	utils.printd('Not Found');
	res.status(404).json({status: 404, message: 'Not Found'});
};

/**
 * Sets a status, 200 ok or 404 Not found
 */
utils.setResponseStatus = (param,res) => {
	if(param) {
		utils.printd('Success');
		res.status(200).json({message: param});
	}
	else
		utils.notFound(res);
};

/**
 * Sets a 201 status code resource created
 */
utils.created = (res) => {
	utils.printd('Created');
	res.status(201).json({status: 201, message: 'Created'});
};

module.exports = utils;
