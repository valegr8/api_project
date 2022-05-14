const express = require('express');
const app = express();
// const bodyParser = require('body-parser');

const users = require('./users.js');
const listings = require('./listings.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Serve front-end static files
 */
app.use('/', express.static('static'));


/**
 * Resource routing
 */
 //api per la collezione
 //di annunci
app.use('/api/v1/posts/', listings);


app.use('/api/v1/users', users);


/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
