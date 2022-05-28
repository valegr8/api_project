const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

const { printd } = require('../utils/utils.js');

describe('GET /api/v2/published/:createdBy', () =>{

    beforeAll( async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await  mongoose.connect('mongodb+srv://admin:admin1234@cluster0.deuin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
        printd('Database connected!');
        //return connection; // Need to return the Promise db connection?
      });
    
      afterAll( () => {
        mongoose.connection.close(true);
        printd("Database connection closed");
      });
      
      // create a valid token
      var token = jwt.sign(
        {email: 'pippo@mail.com'},
        'admin1234',
        {expiresIn: 86400}
      );

    test('GET /api/v2/published/:createdBy?token=<valid> should respond with array of json', async () => {
        return request(app)
        .get('/api/v2/published/pippo@mail.com?token='+token)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    test('GET /api/v2/published/:createdBy should respond with error 401, no token provided', async () => {
        return request(app)
        .get('/api/v2/published/pippo@mail.com')
        .expect('Content-Type', /json/)
        .expect(401);
    });

    test('GET /api/v2/published/:createdBy?token=<valid> with no createdBy provided', async () => {
        return request(app)
        .get('/api/v2/published/?token='+token)
        .expect('Content-Type', /json/)
        .expect(404);
    });

    test('GET /api/v2/published/:createdBy?token=<valid> with wrong token', async () => {
        return request(app)
        .get('/api/v2/published/pippo@mail.com?token='+'wrong')
        .expect('Content-Type', /json/)
        .expect(403);
    })
});