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
		//toObject() è necessario affinché
		//undefined non venga concatenato
		//il motivo è un'intricatezza di mongoose
		let path = '/api/v1/posts/' + post.toObject().post_id;
		//con questa funzione aggiungo
		//una nuova proprietà all'oggetto post
		//in modo tale da avere la conversione in JSON
		//che ci si asppetterebbe. La stanezza del codice
		//di implementazione è dovuta alle inticatezze delle
		//conversioni in JSON; sto usando un trucco che
		//ho trovato su stackOverFlow.
		//Potete trovare ulteriori dettagli in utils.js
		post = utils.addProp(post,'self',path);
		return post;
    });
    utils.setResponseStatus(posts,res);
	//Se volete modificare le get è bene parlarne con me
	//perché errori difficili da sistemare potrebbero
	//insinuarsi nel codice a causa delle intricatezze
	//di sopra.
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
		createdBy: req.body.email,
		post_id: utils.generatePostId()
    });
    
	post = await post.save();
    
    let postId = post.post_id;

    printd('Post saved successfully');

    res.location("/api/v1/posts/" + postId);
	utils.created(post, res);
	
});

module.exports = router;
