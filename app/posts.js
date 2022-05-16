const express = require('express');
const router = express.Router();
// get mongoose model
const Posts = require('./models/post'); 

const u = require('../utils/useful.js');

//Nota per le modifiche future:
//Lo schema delle collezione nel cloud
//deve concordare con quello di
//models/posts

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
    let posts = await Posts.find({});	
    posts = posts.map( (post) => {
		let s = '/api/v1/posts/' + post.toObject().app_id;
		let r = u.addProp(post,'location',s);		
        return r;
    });
    u.getResponse(posts,res);
});

/**
 * Delete not allowed
 */
router.delete('', async (req, res) => {
	u.notAllowed(res);
});

router.put('', async (req, res) => {
	u.notAllowed(res);
});

/**
 * Get single post by its id
 */
router.get('/:id', async (req, res) => {
	let condizione = u.isIdValid(req.params.id);
	if(!condizione){
		u.badRequest(res);
	}else{
		let query = {app_id : req.params.id};
		let post = await Posts.findOne(query).where('app_id').equals(query.app_id).exec().then((post)=>{
			u.getResponse(post,res);
		}).catch((e) => {
			u.notFound(res);
		});
	}
});

module.exports = router;
