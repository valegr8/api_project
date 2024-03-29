const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');
const info = "User";

/**
 * Get user model
 */
const User = require('./models/user_v2');

/**
 * Get post model
 */
const Post = require('./models/post_v2');

/**
 * This function check if the pattern of an email is correct
 * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 */
 function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var res = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(text);
}


//work in progress
//uid = user id
router.post('/:uid/posts/', async function(req,res) {
	let uid = req.params.uid;
	
	
	if(!isValidObjectId(uid)){
		utils.badRequest(res, 'User id not valid');	//return 400;
		return;
	}
	
	let user = await User.findById({_id: uid});
	
	if(!user){
		utils.badRequest(res);
		return;
	}		
	
	//check if the request title is not null
	if(!utils.isValid(req.body.title)) {
		utils.badRequest(res, 'Title not valid');	//return 400;
		return;
	}
	
	if(!utils.isValid(req.body.email) || !checkIfEmailInString(req.body.email)){
		utils.badRequest(res, 'Email not valid');	//return 400;
		return;
	}
	

	
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: uid,
		contract: req.body.contract,
		phone: req.body.phone,
		showPrice: req.body.showPrice,
		email: req.body.email,
		rooms: req.body.available.length,
		available: req.body.available,
		where: req.body.where
    });
	//save a new post
	post = post.save().then((savedPost) =>{
		// printd(savedPost._id);
		let postId = savedPost._id;
		if(!isValidObjectId(postId)) {
			utils.notFound(res, 'Post id not valid');
		}
		else {
			res.location("/api/v2/users/"+ uid + "/posts/" + postId);
			utils.created(res, 'Post saved successfully');
		}
	}).catch((e) => {		
		// If the post fails we return 404 status code
		utils.notFound(res,'Post saving failed, '+ e);
	});
});

/**
 * Get all posts published by a user, uid = user id
 */
router.get('/:uid/posts/', async function(req,res) {
	let uid = req.params.uid;
	
	if(!isValidObjectId(uid)){
		utils.badRequest(res, 'User id not valid');	//return 400;
		return;
	}
	
	let user = await User.findById({_id: uid});		
	if(!user){
		utils.badRequest(res);
		return;
	}else{		
		Post.find({createdBy : user._id }).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved correctly');
		}).catch((e) => {
			printd('Error: ' + e,info);
			utils.notFound(res);
		});
	}
});

/**
 * Get a single post published by a user, uid = user id
 */
router.get('/:uid/posts/:id', async function(req,res) {
	let uid = req.params.uid;
	let user = await User.findById(uid).exec();
	let id = req.params.id;
	
	if(!user || !isValidObjectId(id)){
		utils.badRequest(res);
		return;
	}else{
		Post.findOne({ _id : id }).exec().then((post)=>{
			utils.setResponseStatus(post,res, 'Post published retrieved successfully');
		}).catch((e) => {
			printd('Error: ' + e);
			utils.notFound(res);
		});
	}
	
});

/**
 * returns the array containing all the rooms
 */
router.get('/:uid/posts/:id/rooms/', async function(req,res) {
	let uid = req.params.uid;
	let id = req.params.id;
	if(!isValidObjectId(uid) || !isValidObjectId(id)){
		utils.badRequest(res, 'At least one id is not valid');	//return 400;
		return;
	}
	
	let query = {
		"_id": id,
		"createdBy": uid
	};
	
	let post = await Post.findOne(query).exec();
	
	if(post.createdBy != uid){
		utils.badRequest(res, 'Post id and user id are mismatching');	//return 400;
		return;
	}
	utils.setResponseStatus(post.available,res);
});

/**
 * returns the room with id equal to rid, rid = room id
 */
router.get('/:uid/posts/:id/rooms/:rid', async function(req,res) {
	let uid = req.params.uid;
	let id = req.params.id;
	let name = req.params.name;
	let rid = req.params.rid;
	
	if(!isValidObjectId(uid) || !isValidObjectId(id) || !isValidObjectId(rid)){
		utils.badRequest(res, 'At least one id is not valid', info);	//return 400;
		return;
	}
	
	let query = {
		"_id": id,
		"createdBy": uid,		
	};
	
	let post = await Post.findOne(query).exec();
	
	if(post.createdBy != uid){
		utils.badRequest(res, 'Post id and user id are mismatching');	//return 400;
		return;
	}
	
	let room = post.available.find((v) => {
		let r = false;
		if(v.id === rid)
			r = true;
		return r;
	});
	utils.setResponseStatus(room,res);
});


/**
 * removes from the array the room with id equal to rid, rid = room id
 */
router.delete('/:uid/posts/:id/rooms/:rid', async function(req,res) {
	let uid = req.params.uid;
	let id = req.params.id;
	let rid = req.params.rid;
	
	if(!isValidObjectId(uid) || !isValidObjectId(id) || !isValidObjectId(rid)){
		utils.badRequest(res, 'At least one id is not valid', info);	//return 400;
		return;
	}
	
	let query = {
		"_id": id,
		"createdBy": uid,		
	};
	
	let post = await Post.findOne(query).exec();
	
	if(post.createdBy != uid){
		utils.badRequest(res, 'Post id and user id are mismatching');	//return 400;
		return;
	}
	
	let index = post.available.findIndex((v) => {
		let r = false;
		if(v.id === rid)
			r = true;
		return r;
	});	
	let a = post.available.splice(index,1);
	post.rooms--;
	await post.save();	
	utils.setResponseStatus(post.available,res, 'Post removed correctly');
});

router.put('/:uid/posts/:id/rooms', async function(req,res) {
	utils.notAllowed(res);
});

router.put('/:uid/posts/:id/rooms/:rid', async function(req,res) {
	utils.notAllowed(res);
});

module.exports = router;
