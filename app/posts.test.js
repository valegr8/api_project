const request = require('supertest');
const app     = require('./app');

/**
 * groups the tests of the v1/posts route
 */
describe('v1/posts', () => {
 
  let postSpy;
  let postSpyFindById;
  let postSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {
    
    const Post = require('./models/post');

    /**
     * Mock the Post.find method of mongoose
     */
    postSpy = jest.spyOn(Post, 'find').mockImplementation(() => {
      return {
        message: [
          {
            id: "628662fbf3ff1e92d70116f2",
            title: "Appartamento bellissimo",
            description: "Vicino a tutto",
            createdBy: "BenedettoBenedetti@email.com"
          }
        ]
      };
    });

    /**
     * Mock the Post.findById method of mongoose
     */
    postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
      if (id=="628a1d99fc4964ea27473f9a") {
        return {
          message: {
            _id: "628a1d99fc4964ea27473f9a",
            title: "appartamento di Pippo",
            description: "questo è un bell'appartamento",
            createdBy: "pippo@mail.com",
            __v: 0
            }
        };
      }
      else
        return null;
    });

    /**
     * Mock the Post.findOne method of mongoose
     */
    postSpyFindOne = jest.spyOn(Post, 'findOne').mockImplementation((email) => {
      if (email=="pippo@mail.com") {
        return {
          _id:"628a1d73fc4964ea27473f96",
          email:"pippo@mail.com",
          password:"1234",
          username:"pippo",
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
    postSpy.mockRestore();
    postSpyFindById.mockRestore();
    postSpyFindOne.mockRestore();
  });

  /**
   * Test suite of the GET "/id" method 
   */
  describe('GET "/id" route', () => {

    /**
     * Correct post test
     */
    describe('with a correct id', () => {
      it('should return 200 and a json', async () => {
        const postId = "628a1d99fc4964ea27473f9a";
        await request(app)
          .get(`/api/v1/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });

    /**
     * Wrong id test
     */
    describe('with an id that does not exist', () => {
      it('should return 404, not found', async () => {
        const postId = "666666666666666666666666";
        await request(app)
          .get(`/api/v1/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });

    /**
     * Wrong id format
     */
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
    it('should return an array of posts', async () => {
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
  // describe('POST "/" route', () => {
  //   it('should return 201, created', async () => {
  //     body = {};
  //     await request(app)
  //       .post(`/api/v1/posts`)
  //       .send(body)
  //       .expect('Content-Type', /json/)
  //       .expect(201);
  //   });
  // });
});
 