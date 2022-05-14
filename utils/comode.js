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

//comoda per il debugging
u.printd = (a) => {
	console.log(a);//da migliorare
};



module.exports = u;