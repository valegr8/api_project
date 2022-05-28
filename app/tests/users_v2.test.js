const request = require('supertest');
const app     = require('../app');

/**
 * groups the tests of the v2/users route
 */
describe('v2/users', () => {
 
  let userSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {
    
    const User = require('../models/user');

    /* Mock the User.findOne method of mongoose */
    userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((data) => {
      if (data.email=="exists@email.com") {
        return {
          _id:"628a1d73fc4964ea27473f96",
          email:"exists@email.com",
          password:"exists",
          username:"exists",
          __v:0
        };
      }
      else
        return null;
    });
  });

  /**
   * Restore the mock functions after the test suite ends
   */
  afterAll(async () => {
    userSpyFindOne.mockRestore();
  });

  /**
   * Test the POST method
   */
  describe('POST on "/" route', () => {
    describe('with correct username and password', () => {
      it('should return 201, created', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "test@email.com",
            username: "test",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });

    describe('with an user that already exists', () => {
      it('should return 409', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "exists@email.com",
            username: "exists",
            password: "exists"
          })
          .expect('Content-Type', /json/)
          .expect(409);
      });
    });

    describe('leaving the username field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "test@email.com",
            username: "",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('leaving the email field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "",
            username: "test",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('with an email not in the correct format', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "test",
            username: "test",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('leaving the password field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v2/users`)
          .send({
            email: "test@email.com",
            username: "test",
            password: ""
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });
  });
});
 