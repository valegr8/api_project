const express = require('express');
const router = express.Router();
const u = require('./libs/utile.js');

router.get('', async (req, res) => {
    
    let annunci = await Annunci.find({}).catch(u.fallimento);
    annunci = annunci.map( (a) => {
		return a.singolo;
	});
//        return {
//            self: '/api/v1/annunci/' + a.id,
//        };
//    });
	u.rispondiGet(annunci);    
});