const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

//const { printd } = require('../../utils/utils.js');
//const { deleteOne } = require('../models/post_V2');

describe('DELETE /api/v2/users/published/:email/posts/:id', () =>{

    let postSpyDeleteOne;
    let postSpyFindById;
    /**
     * Set database connection
     */
    beforeAll( async () => {

      const Post = require('../models/post_V2');
      
      /**
     * Mock the Post.findById method of mongoose
     */
    postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
      if (id == "629227cbf7b170de7ebff2ac") {
        let mock_post = new Post ({
          _id : "629227cbf7b170de7ebff2ac",
          title: "jester",
          description: "jester",
          createdBy: "pippo@mail.com",
          available: [],
          __v : 0
        })
        return mock_post;
      }
      else 
        return null;
    });

    /**
     * Mock the Post.deleteOne method of mongoose
     */
     postSpyDeleteOne = jest.spyOn(Post, 'deleteOne').mockImplementation(() => {
       return;
    });
        //jest.setTimeout(30000); /** < Increments the timeout */
        //jest.unmock('mongoose');
        //await  mongoose.connect('mongodb+srv://admin:admin1234@cluster0.deuin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
        //printd('Database connected!');
      });
      
      /**
       * End database connection
       */
      afterAll( () => {
        //mongoose.connection.close(true);
        //printd("Database connection closed");
        postSpyFindById.mockRestore();
        postSpyDeleteOne.mockRestore();
      });
      
  // create a valid token
  var token = jwt.sign(
    {email: 'pippo@mail.com'},
    'admin1234',
    {expiresIn: 86400}
  );

    describe('with a correct token and id', () => {
      it('should respond with a 200 status code', async () => {
        const postId = "629227cbf7b170de7ebff2ac";
        await request(app)
          .delete(`/api/v2/users/published/pippo@mail.com/posts/${postId}?token=`+token)
          .expect(200);
      });
    });

    describe('with a wrong token', () => {
      it('should respond with a 403 status code', async () => {
        const postId = "629227cbf7b170de7ebff2ac";
        await request(app)
          .delete(`/api/v2/users/published/pippo@mail.com/posts/${postId}?token=wrong`)
          .expect(403);
      });
    });

    describe('without token', () => {
      it('should respond with a 401 status code', async () => {
        const postId = "629227cbf7b170de7ebff2ac";
        await request(app)
          .delete(`/api/v2/users/published/pippo@mail.com/posts/${postId}`)
          .expect(401);
      });
    });

    describe('with non-existing id', () => {
      it('should respond with a 404 status code', async () => {
        const postId = "629227cbf7b170de7ebff2ac";
        await request(app)
          .delete(`/api/v2/users/published/pippo@mail.com/posts/000000000000000000000000?token=`+token)
          .expect(404);
      });
    });
    
});

describe('PUT /api/v2/users/published/:email/posts/:id', () => {

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://admin:admin1234@cluster0.deuin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  // create a valid token
  var token = jwt.sign(
    {email: 'pippo@mail.com'},
    'admin1234',
    {expiresIn: 86400}
  );

  describe('with correct info', () => {
    it('should respond with a 200 status code', async () => {
      const postId = "629227cbf7b170de7ebff2ac";
      await request(app)
        .put(`/api/v2/users/published/pippo@mail.com/posts/629227cbf7b170de7ebff2ac?token=`+token)
        .send({
          title: "jester",
          description: "jester",
          createdBy: "pippo@mail.com",
          available: [],
          __v: 0
        })
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('with no title', () => {
    it('should respond with a 400 status code', async () => {
      const postId = "629227cbf7b170de7ebff2ac";
      await request(app)
        .put(`/api/v2/users/published/pippo@mail.com/posts/629227cbf7b170de7ebff2ac?token=`+token)
        .send({
          title: "",
          description: "jester",
          createdBy: "pippo@mail.com",
          available: [],
          __v: 0
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('with no description', () => {
    it('should respond with a 400 status code', async () => {
      const postId = "629227cbf7b170de7ebff2ac";
      await request(app)
        .put(`/api/v2/users/published/pippo@mail.com/posts/629227cbf7b170de7ebff2ac?token=`+token)
        .send({
          title: "jester",
          description: "",
          createdBy: "pippo@mail.com",
          available: [],
          __v: 0
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('without token', () => {
    it('should respond with a 401 status code', async () => {
      const postId = "629227cbf7b170de7ebff2ac";
      await request(app)
        .put(`/api/v2/users/published/pippo@mail.com/posts/629227cbf7b170de7ebff2ac`)
        .send({
          title: "jester",
          description: "jester",
          createdBy: "pippo@mail.com",
          available: [],
          __v: 0
        })
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('with wrong token', () => {
    it('should respond with a 403 status code', async () => {
      const postId = "629227cbf7b170de7ebff2ac";
      await request(app)
        .put(`/api/v2/users/published/pippo@mail.com/posts/629227cbf7b170de7ebff2ac?token=wrong`)
        .send({
          title: "jester",
          description: "jester",
          createdBy: "pippo@mail.com",
          available: [],
          __v: 0
        })
        .expect('Content-Type', /json/)
        .expect(403);
    });
  });
});