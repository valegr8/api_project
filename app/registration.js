const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


/**
 * function for creating a new user
 */
router.post('', async function(req,res) {

    //search if there is already a user with the same email
    let user = await User.findOne({ email: req.body.email}).exec();

    if(!user) ;


})