const express = require('express');
const app = express();

/**
 * Set public folder as static to access its content
 */
app.use(express.static(__dirname+'../../public'));

const users = require('./users.js');
const posts = require('./posts.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');
const register = require('./registration.js');


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
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);

/**
 * Authentication routing and middleware
 */
 app.use('/api/v1/register', register);

/**
 * Resource routing
 */
app.use('/api/v1/posts/', posts);
app.use('/api/v1/users', users);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
