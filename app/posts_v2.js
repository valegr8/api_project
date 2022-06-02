const express = require('express');
const router = express.Router();

/**
 * Get post model
 */
const Post = require('./models/post_v2'); 
const User = require('./models/user_v2'); 

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
	printd(req.query.maxp);		/* maximum price */
	printd(req.query.minp);		/* minimum price */
	printd(req.query.param);		/* title/description/location */
	printd(req.query.rooms);		/* room number */
	printd(req.query.contract);	/* contract type (e.g annual...) */

	let filter = {}; /* query */

	if (req.query.param) {
		// $regex = look for the word in the 'where' field, i = case insensivity
	  	filter.$or = [{ where: { $regex: req.query.param, $options: 'i' }},
		  			 { title: { $regex: req.query.param, $options: 'i'}},
					 { description: { $regex: req.query.param, $options: 'i'} },
					 { available: { $elemMatch: { name: { $regex: req.query.param, $options: 'i'} } } },
					 { available: { $elemMatch: { description: { $regex: req.query.param, $options: 'i'} } } }
					 ];
	}

	// filters on the price range
	if(req.query.maxp && req.query.minp) {
		filter.available =  { $elemMatch: { price: { $lte: req.query.maxp , $gte: req.query.minp } } };
	}
	else if(req.query.minp) {
		filter.available = { $elemMatch: { price: { $gte: req.query.minp } } };
	}
	else if(req.query.maxp) {
		filter.available =  { $elemMatch: { price: { $lte: req.query.maxp } } };
	}

	// filter on the number of rooms
	if(req.query.rooms) {
		filter.rooms = { $eq: req.query.rooms };
	}
	// filter on the contract type
	if(req.query.contract) {
		filter.contract = req.query.contract;
	}


	printd("query: " + JSON.stringify(filter));
	
	try{
		const posts = await Post.find(filter).exec();
		// const posts = await Post.find({ "available.price": { $lte: '400' }}).exec();
		// const posts = await Post.find({ "available": { $elemMatch: { price: { $lte: req.query.maxp } } } }).exec();
		utils.setResponseStatus(posts,res, 'Post collection retrieved correctly');
	}
	catch(e) {
		utils.internalServerError(res, e);
	}
});

/**
 * Delete not allowed
 */
router.delete('', async (req, res) => {
	utils.notAllowed(res);
});

/**
 * Put not allowed
 */
router.put('', async (req, res) => {
	utils.notAllowed(res);
});

/**
 * Get a single post by its id
 */
router.get('/:id', async (req, res) => {
	printd('id: ' + req.params.id);	
	if(!isValidObjectId(req.params.id)){
		utils.badRequest(res);
	}else{		
		let post = await Post.findById(req.params.id)
		utils.setResponseStatus(post,res, 'Post retieved successfully');
	}
});

/**
 * Create a new post
 */
router.post('', async (req, res) => {
	utils.notAllowed(res);
});

module.exports = router;
