const express = require('express');
const router = express.Router();
const Listing = require('./models/listing'); // get our mongoose model

router.get('', async (req, res) => {
    let listings = await Listing.find({});
    listings = listings.map( (listing) => {
        return {
            self: '/api/v1/listings/' + listing.id,
            title: listing.title
        };
    });
    res.status(200).json(listings);
});

router.get('/:id', async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/listings/' + listing.id,
        title: listing.title
    });
});

router.post('', async (req, res) => {

	let listing = new Listing({
        title: req.body.title
    });
    
	listing = await listing.save();
    
    let listingId = listing.id;

    console.log('Listing saved successfully');

    res.location("/api/v1/listings/" + listingId).status(201).send();
});


module.exports = router;
