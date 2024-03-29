const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

/* To use the debug print */
const { printd } = require('../../utils/utils.js');

/**
 * groups the tests of the v1/posts route
 */
describe('v1/posts', () => {
  let postSpy;
  let postSpyFindById;
  let userSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll(() => {
    /* Set database connection */
    jest.setTimeout(8000); /** < Increments the timeout */
    jest.unmock('mongoose');
    // console.log('process.env.DB_URL');
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    printd('Database connected!');

    const Post = require('../models/post');
    const User = require('../models/user');

    /* Mock the Post.find method of mongoose */
    postSpy = jest.spyOn(Post, 'find').mockImplementation(() => {
      return {
        message: [
          {
            id: "628a1d99fc4964ea27473f9a",
            title: "Appartamento bellissimo",
            description: "Vicino a tutto",
            createdBy: "test@email.com"
          }
        ]
      };
    });

    /* Mock the Post.findById method of mongoose */
    postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
      if (id == "628a1d99fc4964ea27473f9a") {
        return {
          message: {
            _id: "628a1d99fc4964ea27473f9a",
            title: "Appartamento bellissimo",
            description: "Vicino a tutto",
            createdBy: "test@email.com",
            __v: 0
          }
        };
      }
      else
        return null;
    });

    /* Mock the Post.findOne method of mongoose */
    userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((data) => {
      if (data.email == "test@email.com") {
        return {
          _id: "628a1d73fc4964ea27473f96",
          email: "test@email.com",
          password: "test",
          username: "test",
          __v: 0
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
    postSpy.mockRestore();
    postSpyFindById.mockRestore();
    userSpyFindOne.mockRestore();

    mongoose.connection.close(true);
    printd("Database connection closed");
  });

  /**
   * Test suite of the GET "/id" method 
   */
  describe('GET "/id" route', () => {
    describe('with a correct id', () => {
      it('should return 200 and a json', async () => {
        const postId = "628a1d99fc4964ea27473f9a";
        await request(app)
          .get(`/api/v1/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });

    describe('with an id that does not exist', () => {
      it('should return 404, not found', async () => {
        const postId = "666666666666666666666666";
        await request(app)
          .get(`/api/v1/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });

    describe('with an id of the wrong format', () => {
      it('should return 400, bad request', async () => {
        const postId = "abc-id";
        await request(app)
          .get(`/api/v1/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });
  });

  /**
   * Test the GET method
   */
  describe('GET "/" route', () => {
    it('should return 200 and an array of posts', async () => {
      await request(app)
        .get(`/api/v1/posts`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  /**
   * Test the PUT method
   */
  describe('PUT on "/" route', () => {
    it('should return 405, method not allowed', async () => {
      await request(app)
        .put(`/api/v1/posts`)
        .expect('Content-Type', /json/)
        .expect(405);
    });
  });

  /**
   * Test the DELETE method
   */
  describe('DELETE on "/" route', () => {
    it('should return 405, method not allowed', async () => {
      await request(app)
        .delete(`/api/v1/posts`)
        .expect('Content-Type', /json/)
        .expect(405);
    });
  });

  /**
   * Test the POST method
   */
  describe('POST "/" route', () => {
    describe('with correct user', () => {
      it('should return 201, created', async () => {
        await request(app)
          .post(`/api/v1/posts`)
          .send({
            email: "test@email.com",
            title: "test",
            description: "test"
          })
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });

    describe('with a user that does not exist', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/posts`)
          .send({
            email: "pippo@email.com",
            title: "test",
            description: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('leaving the title field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/posts`)
          .send({
            email: "test@email.com",
            title: "",
            description: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('leaving the email field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/posts`)
          .send({
            email: "",
            title: "test",
            description: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });

    describe('with an email not in the correct format', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/posts`)
          .send({
            email: "test",
            title: "test",
            description: "test"
          })
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });
  });
});
