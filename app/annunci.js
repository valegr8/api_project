const express = require('express');
const router = express.Router();
const u = require('./libs/utile.js');

//questo è il gestore del get
//per l'intera collezione di
//annunci
router.get('', async (req, res) => {
    
    let annunci = await Annunci.find({});
    annunci = annunci.map( (a) => {
		a.dove = '/api/v1/annunci/' + a.id;
		return a;
	});

	u.rispondiGet(annunci);    
});