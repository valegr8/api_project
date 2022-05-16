// UTILITY FUNCTIONS
// const express = require('express');

const u = {};

/**
 * Sets a 405 http response status, method not allowed
 */
u.notAllowed = (res) => {
	res.status(405).json({status: 404, message: 'Method Not Allowed'});
};

/**
 * Sets a 400 http response status, bad request
 */
u.badRequest = (res) => {
	res.status(400).json({status: 404, message: 'Bad Request'});
};

/**
 * Sets a 404 http response status, not found
 */
u.notFound = (res) => {
	res.status(404).json({status: 404, message: 'Not Found'});
};

/**
 * Debug print
 */
u.printd = (a) => {
	console.log(a);
};

/**
 * Verifies validity of an id
 */
u.isIdValid = (id) => {
	let r = true;
	if(!id || (id && (isNaN(parseInt(id)))))
	{
		r = false;
	}
	return r;
}

/**
 * Useful to answer get requests
 */
u.addProp = (o,prop,value) => {
	let t = JSON.stringify(o);
	o = JSON.parse(t);
	o[prop] = value;
	return o;
};

/**
 * Sets a status, 200 ok or 404 Not found
 */
u.setResponseStatus = (param,res) => {
	if(param)
		res.status(200).json({message: param});
	else
		u.notFound(res);
};

/**
 * Sets a 201 status code resource created
 */
 u.created = (param,res) => {
	// if(param)
		res.status(201).json({status: 201, message: 'Created'});
	// else
	// 	u.notFound(res);
};

module.exports = u;
