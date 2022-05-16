// UTILITY FUNCTIONS
const express = require('express');

const u = {};

/**
 * To send a status after a get request, 200 ok or 404 Not found
 */
u.getResponse = (o,res) => {
	if(o)
		res.status(200).json(o);
	else
		res.status(404).json('Not Found');
};

/**
 * Sends a 405 http response status, method not allowed
 */
u.notAllowed = (res) => {
	res.status(405).json('Method Not Allowed');
};

/**
 * Sends a 400 http response status, bad request
 */
u.badRequest = (res) => {
	res.status(400).json('Bad Request');
};

/**
 * Sends a 404 http response status, not found
 */
u.notFound = (res) => {
	res.status(404).json('Not Found');
};

/**
 * debug print
 */
u.printd = (a) => {
	console.log(a);
};

/**
 * verifies validity of an id
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

module.exports = u;
