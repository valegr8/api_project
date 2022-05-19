// UTILITY FUNCTIONS
// const express = require('express');

const u = {};

/**
 * Sets a 405 http response status, method not allowed
 */
u.notAllowed = (res) => {
	res.status(405).json({status: 405, message: 'Method Not Allowed'});
};

/**
 * Sets a 400 http response status, bad request
 */
u.badRequest = (res) => {
	res.status(400).json({status: 400, message: 'Bad Request'});
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
	let p = parseInt(id);
	if(!id || (id && (isNaN(p))) || p <= 0)
	{
		r = false;
	}
	return r;
}

/**
 * Useful to answer get requests
 */
u.addProp = (o,prop,value) => {
	//Le prime due righe di codice sono
	//importanti dunque non cancellatele
	//pensando che siano ridondanti.
	//In poche parole, il loro ruolo è
	//quello di cambiare il metodo con cui
	//il parametro verrà convertito in JSON.
	let t = JSON.stringify(o);
	o = JSON.parse(t);
	o[prop] = value;//semplicemente aggiunge la proprietà.
	return o;//è importante.
};

//Non è l'ottimo ma fa' il suo
//lavoro.
//Ovviamente se spegni il server
//riparte da questo valore.
//per le prove mettete il valore che volete
let last_post_id = 0; 
//Provides an id for a new post.
u.generatePostId = () => {
	last_post_id++;
	return last_post_id;
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
