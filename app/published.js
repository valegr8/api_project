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
    User.find({}).then(users => users.forEach( (user) => {
        console.log("sto analizzando i preferiti di "+user.email);
        let preferiti = user.favorite;
        let uid = user.id;
        //console.log(preferiti);
        preferiti.forEach( (annuncio) => {
            //console.log(annuncio+" vs "+post._id);
            if (annuncio == post._id) {
                //console.log("cancello dai preferiti");
                var index = preferiti.indexOf(annuncio);
                //console.log(index);
                if (index !== -1) {
                    preferiti.splice(index, 1);
                    //console.log("devo cercare l'utente con id: "+id);
                    User.updateOne({ _id: uid}, {
                        favorite: preferiti
                    });
                }
                //console.log("preferiti ora sono: "+user.favorite);
            }
        })
    }))
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
        utils.printd("Post non trovato","EDIT");
        return;
    }
	if(!isValidObjectId(uid) || !isValidObjectId(id)){
		utils.badRequest(res,'Invalid parameters');
        utils.printd("Invalid parameters","EDIT");
		return;
	}
    if (post.createdBy != uid) {
        return res.status(401).json({
            message: 'You can only modify your own posts'
        });
    }
    return Post.updateOne(post, {
        title: req.body.title,
		description: req.body.description,
		contract: req.body.contract,
		phone: req.body.phone,
		showPrice: req.body.showPrice,
		rooms: req.body.available.length,
		available: req.body.available,
		where: req.body.where
    }, {
        where : {
            id: req.params.id
        }
    }).then(function (post){
        if (post) {
            res.send(post);
        }
        else {
            utils.printd("Invalid parameters","EDIT");
            res.status(400).send('Error');
        }
    })
})

module.exports = router;