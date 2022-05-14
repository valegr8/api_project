const express = require('express');
const router = express.Router();
const Listing = require('./models/listing'); // get our mongoose model

const u = require('../utils/comode.js');

//get collezione di annunci
router.get('', async (req, res) => {
    let listings = await Listing.find({});
    listings = listings.map( (listing) => {
        return {
            self: '/api/v1/posts/' + listing.id,
            title: listing.title
        };
    });
    u.rispondiGet(listings,res);
});

//gli altri metodi verranno dopo


module.exports = router;
