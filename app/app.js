const express = require('express');
const app = express();

/**
 * Set public folder as static to access its content
 */
app.use(express.static(__dirname+'../../public'));

const users = require('./users.js');
const usersV2 = require('./users_v2.js');
const posts = require('./posts.js');
const postsV2 = require('./posts_v2.js');
const authentication = require('./authentication.js');
const published = require('./published.js');
const tokenChecker = require('./tokenChecker.js');
const user_posts = require('./users_posts.js');

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
app.use('/api/v2/published', tokenChecker);

/**
 * Resource routing
 */
 //version 1
app.use('/api/v1/posts/', posts);
app.use('/api/v1/users', users);

//version 2
app.use('/api/v2/users', usersV2);
app.use('/api/v2/users', user_posts);//it wouldn't work otherwise
app.use('/api/v2/published', published);
app.use('/api/v2/posts', postsV2);

/**
 * Default 404 handler 
 */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
