const express = require('express');
const router = express.Router();
/**
 * Get post model
 */
const Post = require('./models/post'); 
const User = require('./models/user'); 

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');

/**
 * Get posts collection
 */
router.get('', async (req, res) => {
    let posts = await Post.find({}).exec();	
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
	//Now, a post can uploaded by someone
	//as long as they are a signed-up user.
	let user_email = req.body.email;
	let user = null;
	let query = {
		email : user_email
	};
	//checks whether the user is already signed up.
	user = await User.findOne(query).exec();
	
	if(user == null){
		//400
		printd('User does not exist');
		utils.badRequest(res);
		return;//the run ends here.
	}
		
	
	let post = new Post({
        title: req.body.title,
		description: req.body.description,
		createdBy: user.email,
		post_id: utils.generatePostId()
    });
    
	//Ho spostato il codice nella gestione
	//della promise. Await è stato rimosso
	//perché adesso sarebbe ridondante.
	post = post.save().then((savedPost) =>{
		let postId = post.post_id;
		printd('Post saved successfully');
		res.location("/api/v1/posts/" + postId);
		utils.created(post, res);
	}).catch((e) => {		
		//Gestiamo il fallimento di una post
		//rispondendo 404, come nel tutorial
		//alle API RESTful suggerito da Robol.
		printd('Post saving failed');
		utils.notFound(res);
	});
    
	
});

module.exports = router;
