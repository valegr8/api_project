const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');

/**
 * groups the tests of the v1/users route
 */
describe('v1/users', () => {
 
  let connection;
 
  /**
   * Set database connection
   */
  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  /**
   * End database connection
   */
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  /**
   * Test the POST method
   */
  describe('POST on "/" route', () => {
    describe('with correct username and password', () => {
      it('should return 201, created', async () => {
        await request(app)
          .post(`/api/v1/users`)
          .send({
            email: "test@email.com",
            username: "test",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });
  });
});
 