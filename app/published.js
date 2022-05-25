const express = require('express');
const router = express.Router();
const Post = require('./models/post'); 
const User = require('./models/user');

const utils = require('../utils/utils.js');
const { printd } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');


/**
 * Get all post created by an user
 */
 router.get('/:createdBy', async (req, res) => {
	printd('[GET/:email]EMAIL: ' + req.params.createdBy);		
	Post.find({ createdBy: req.params.createdBy }).exec().then((post)=>{
	    utils.setResponseStatus(post,res);
	}).catch((e) => {
		printd('Error: ' + e);
		utils.notFound(res);
	});
});

/**
 * Delete one post
 */

router.delete('/:id/:createdBy', async (req, res) =>{
    let post = await Post.findById(req.params.id).exec();
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
    if (post.createdBy != req.params.createdBy) {
        return res.status(401).json({
            message: 'You can only delete your own posts'
        });
    }
    await post.deleteOne();
    //console.log('post removed');
    //res.status(204).send();
    utils.setDeleteStatus(post, res);
})

module.exports = router;