const express = require('express');
const router = express.Router();
const Post = require('./models/post_v2'); 
const User = require('./models/user_v2');

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');


/**
 * Delete one post
 */
router.delete('/:uid/posts/:id', async (req, res) =>{
	let uid = req.params.uid;
	let id = req.params.id;
    let post = await Post.findById(id);
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
	if(!isValidObjectId(uid) || !isValidObjectId(id)){
		utils.badRequest(res,'Invalid parameters');
		return;
	}
    
    if (post.createdBy != req.params.uid) {
        return res.status(401).json({
            message: 'You can only delete your own posts'
        });
    }
    await Post.deleteOne(post);
    utils.printd("Post delete succesfully");
    //res.status(204).send();
    utils.setResponseStatus(post, res, 'Post deleted successfully');
})

/**
 * Modify published post
 */
router.put('/:uid/posts/:id', async (req, res) =>{
	let uid = req.params.uid;
	let id = req.params.id;
    let post = await Post.findById(id);
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
	if(!isValidObjectId(uid) || !isValidObjectId(id)){
		utils.badRequest(res,'Invalid parameters');
		return;
	}
    if (!isValid(req.body.title) || !isValid(req.body.description)) {
        utils.badRequest(res, 'Bad request: no modification info given');
        return;
    }
    if (post.createdBy != uid) {
        return res.status(401).json({
            message: 'You can only modify your own posts'
        });
    }
    return Post.updateOne(post, {
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