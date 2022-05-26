const express = require('express');
const router = express.Router();
const Post = require('./models/post_v2'); 
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

router.delete('/:id', async (req, res) =>{
    let post = await Post.findById(req.params.id).exec();
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
    if (post.createdBy != req.body.createdBy) {
        return res.status(401).json({
            message: 'You can only delete your own posts'
        });
    }
    await post.deleteOne();
    //console.log('post removed');
    //res.status(204).send();
    utils.setDeleteStatus(post, res);
})

/**
 * Modify published post
 */
router.put('/:id', async (req, res) =>{
    let post = await Post.findById(req.params.id).exec();
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
    if (!isValidObjectId(req.body.title) || !isValidObjectId(req.body.description)) {
        utils.badRequest(res, 'Bad request: no modification info given');
    }
    return post.update({
        title: req.body.title,
        description: req.body.description
    }, {
        where : {
            id: req.params.id
        }
    }).then(function (post){
        if (post) {
            res.send(post);
        }
        else {
            res.status(400).send('Error');
        }
    })
})

module.exports = router;