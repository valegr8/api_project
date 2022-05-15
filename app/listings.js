const express = require('express');
const router = express.Router();
const Listing = require('./models/listing'); // get our mongoose model

const u = require('../utils/comode.js');

//get collezione di annunci
router.get('', async (req, res) => {
    let posts = await Listing.find({});
    posts = posts.map( (post) => {
        return {
            self: '/api/v1/posts/' + post.id,
            title: post.title
        };
    });
    u.rispondiGet(posts,res);
});

router.get('/:id', async (req, res) => {
    let post = await Listing.findById(req.params.id);
	
    u.rispondiGet({
        self: '/api/v1/posts/' + post.id,
        title: post.title
    },res);
});

//gli altri metodi verranno
//implementati più tardi


module.exports = router;
