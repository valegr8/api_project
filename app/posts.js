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
		return {
            self: '/api/v1/posts/' + post.id,
            title: post.title
        };
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
		let query = {_id : req.params.id};
		let post = await Post.findOne(query).where('_id').equals(query._id).exec().then((post)=>{
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
        title: req.body.title
    });
    
	post = await post.save();
    
    let postId = post.id;

    printd('Post saved successfully');

    res.location("/api/v1/posts/" + postId);
	utils.created(post, res);
	
});

module.exports = router;
