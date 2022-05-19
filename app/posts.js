const express = require('express');
const router = express.Router();
/**
 * Get post model
 */
const Post = require('./models/post'); 

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
    let posts = await Post.find({});	
    posts = posts.map( (post) => {
		let o = {
			title: post.title,
			description: post.description,
			createdBy: post.createdBy
		};
		let path = '/api/v1/posts/' + post.toObject().post_id;
		u.addProp(o,'self',path);
		
		return o;
    });
    utils.setResponseStatus(posts,res);
});

/**
 * Delete not allowed
 */
router.delete('', async (req, res) => {
	utils.notAllowed(res);
});

router.put('', async (req, res) => {
	utils.notAllowed(res);
});

/**
 * Get a single post by its id
 */
router.get('/:id', async (req, res) => {
	let condizione = utils.isIdValid(req.params.id);
	if(!condizione){
		utils.badRequest(res);
	}else{
		let query = {post_id : req.params.id};
		let post = Post.findOne(query).where('post_id').equals(query.post_id).exec().then((post)=>{
			utils.setResponseStatus(post,res);
		}).catch((e) => {
			utils.notFound(res);
		});
	}
});

/**
 * Create a new post
 */
router.post('', async (req, res) => {
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: req.body.email
    });
    
	post = await post.save();
    
    let postId = post.id;

    printd('Post saved successfully');

    res.location("/api/v1/posts/" + postId);
	utils.created(post, res);
	
});

module.exports = router;
