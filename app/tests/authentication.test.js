const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { deleteOne } = require('../models/user_v2');

/**
 * groups the tests of the v1/authentications route
 */
describe('v1/authentications', () => {

  let userSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll(() => {
    const User = require('../models/user_v2');

    /* Mock the User.findOne method of mongoose */
    userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((data) => {
      if (data.email == "pippo@mail.com") {
        return {
          _id: "628a1d73fc4964ea27473f96",
          email: "pippo@mail.com",
          password: "1234",
          username: "pippo",
          __v: 0
        };
      }
      else
        return null;
    });
  });

  /* Restore the mock functions after the test suite ends */
  afterAll(async () => {
    userSpyFindOne.mockRestore();
  });

  /**
   * Test the POST method
   */
  describe('Login, POST on "/" route', () => {
    describe('with correct username and password', () => {
      it('should return 201, created', async () => {
        await request(app)
          .post(`/api/v1/authentications`)
          .send({
            email: "pippo@mail.com",
            password: "1234"
          })
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });

    describe('with an user that does not exist', () => {
      it('should return 404, not found', async () => {
        await request(app)
          .post(`/api/v1/authentications`)
          .send({
            email: "testa@email.com",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });

    describe('with a wrong password', () => {
      it('should return 401, unathorized', async () => {
        await request(app)
          .post(`/api/v1/authentications`)
          .send({
            email: "pippo@mail.com",
            password: "wrong_pwd"
          })
          .expect('Content-Type', /json/)
          .expect(401);
      });
    });

    describe('leaving the email field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/authentications`)
          .send({
            email: "",
            password: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('leaving the password field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/authentications`)
          .send({
            email: "pippo@mail.com",
            password: ""
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });
  });
});
