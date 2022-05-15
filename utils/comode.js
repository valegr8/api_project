//qua metterò delle funzioni
const express = require('express');

const u = {};

//per risponder alle richieste get
u.rispondiGet = (o,res) => {
	if(o)
		res.status(200).json(o);
	else
		res.status(404).json('Not Found');
};

//invia una risposta http
//con codice di errore 405
u.notAllowed = (res) => {
	res.status(405).json('Method Not Allowed');
};

//invia una risposta http
//con codice di errore 400
u.badRequest = (res) => {
	res.status(400).json('Bad Request');
};

//invia una risposta http
//con codice di errore 404
u.notFound = (res) => {
	res.status(404).json('Not Found');
};

//comoda per il debugging
u.printd = (a) => {
	console.log(a);
};

//controlla la validità
//dei parametri :id
u.isIdValid = (id) => {
	let r = true;
	if(!id){
		r = false;
	}else if(id && (isNaN(parseInt(id)))){
		r = false;
	}
	return r;
}

//utile per le risposte alle
//richieste get
u.addProp = (o,prop,value) => {
	let t = JSON.stringify(o);
	o = JSON.parse(t);
	o[prop] = value;
	return o;
};



module.exports = u;