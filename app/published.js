const express = require('express');
const router = express.Router();
const Post = require('./models/post_v2'); 
const User = require('./models/user');

const utils = require('../utils/utils.js');
const { printd, isValid } = require('../utils/utils.js');
const { isValidObjectId } = require('mongoose');


/**
 * Delete one post
 */

router.delete('/:email/posts/:id', async (req, res) =>{
    let post = await Post.findById(req.params.id).exec();
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
    if (post.createdBy != req.params.email) {
        return res.status(401).json({
            message: 'You can only delete your own posts'
        });
    }
    await post.deleteOne();
    //console.log('post removed');
    //res.status(204).send();
    let message = "Post deleted correctly";
    utils.setResponseStatus(post, res, message);
})

/**
 * Modify published post
 */
router.put('/:email/posts/:id', async (req, res) =>{
    let post = await Post.findById(req.params.id).exec();
    if (!post) {
        res.status(404).send();
        console.log('post not found');
        return;
    }
    if (!isValid(req.body.title) || !isValid(req.body.description)) {
        utils.badRequest(res, 'Bad request: no modification info given');
        return;
    }
    if (post.createdBy != req.params.email) {
        return res.status(401).json({
            message: 'You can only modify your own posts'
        });
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