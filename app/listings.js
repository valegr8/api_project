const express = require('express');
const router = express.Router();
const Listing = require('./models/listing'); // get our mongoose model

const u = require('../utils/comode.js');

//Nota per le modifiche future:
//Lo schema delle collezione nel cloud
//deve concordare con quello di
//models/listings

//get collezione di annunci
router.get('', async (req, res) => {
    let posts = await Listing.find({});	
    posts = posts.map( (post) => {
		let s = '/api/v1/posts/' + post.toObject().app_id;
		let r = u.addProp(post,'location',s);		
        return r;
    });
    u.rispondiGet(posts,res);
});

//la cancellazione dell'intera
//collezione non è permessa.
router.delete('', async (req, res) => {
	u.notAllowed(res);
});

router.put('', async (req, res) => {
	u.notAllowed(res);
});

//-----------

//get singolo annuncio per id
router.get('/:id', async (req, res) => {
	let condizione = u.isIdValid(req.params.id);
	if(!condizione){
		u.badRequest(res);
	}else{
		let query = {app_id : req.params.id};
		let post = await Listing.findOne(query).where('app_id').equals(query.app_id).exec().then((post)=>{
			u.rispondiGet(post,res);
		}).catch((e) => {
			u.notFound(res);
		});
	}
});

//gli altri metodi verranno
//implementati più tardi


module.exports = router;
