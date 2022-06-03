const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const { default: mongoose } = require('mongoose');
//const mongoose = require('mongoose');

//const { printd } = require('../../utils/utils.js');
//const { deleteOne } = require('../models/post_V2');

describe('DELETE /api/v2/published/:uid/posts/:id', () =>{

    let postSpyDeleteOne;
    let postSpyFindById;
    /**
     * Set database connection
     */
    beforeAll( async () => {

      const Post = require('../models/post_v2');
      
      /**
     * Mock the Post.findById method of mongoose
     */
    postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
      if (id == "629346eee4ffb99bc81af228") {
        let mock_post = new Post ({
          _id : "629346eee4ffb99bc81af228",
          title: "primo post nuovo",
          description: "ecco il primo",
          createdBy: "628a1d73fc4964ea27473f96",
          contract: "mono",
          phone: "0425404040",
		  showPrice:"500",
		  rooms: 2,
		  email:"sonic@prova.com",
          where: "lontano",
          available: [
		    {
				name:"Stanza1",
				price:500,
				description:"Stanza"
			}
		  ],
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
        const postId = "629346eee4ffb99bc81af228";
        await request(app)
          .delete(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=`+token)
          .expect(200);
      });
    });

    describe('with a wrong token', () => {
      it('should respond with a 403 status code', async () => {
        const postId = "629346eee4ffb99bc81af228";
        await request(app)
          .delete(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=wrong`)
          .expect(403);
      });
    });

    describe('without token', () => {
      it('should respond with a 401 status code', async () => {
        const postId = "629346eee4ffb99bc81af228";
		const userId = "62926a256236cd334360ac49";		
        await request(app)
          .delete(`/api/v2/published/${userId}/posts/${postId}`)
		  .expect('Content-Type', /json/)
          .expect(401,{
            success: false, message: 'No token provided.'
        });
      });
    });

    describe('with non-existing id', () => {
      it('should respond with a 404 status code', async () => {
        const postId = "629346eee4ffb99bc81af228";		
        await request(app)
          .delete(`/api/v2/users/published/628a1d73fc4964ea27473f96/posts/000000000000000000000000?token=`+token)
          .expect(404);
      });
    });
    
});

describe('PUT /api/v2/published/:uid/posts/:id', () => {

  beforeAll(async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb+srv://admin:admin1234@cluster0.deuin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
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
      const postId = "6298c834772da176771d7373";
      await request(app)
        .put(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=`+token)
        .send({
          title: "casa modificata",
          description: "descrizione modificata",
          contract: "mensile",
          phone: 2222222222,
          showPrice: 400,
          rooms: 1,
          email: "pippo@mail.com",
          available: [
            {
              name: "stanza di pippo",
              price: 210,
              description: "una piccola stanzetta"
            }
          ],
          where: "Via Pippis - GESSOPALENA[KR]"
        })
        .expect(200);
    });
  });

  describe('with no title', () => {
    it('should respond with a 400 status code', async () => {
      const postId = "6298c834772da176771d7373";
      await request(app)
        .put(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=`+token)
        .send({
          title: "",
          description: "descrizione modificata",
          contract: "mensile",
          phone: 2222222222,
          showPrice: 400,
          rooms: 1,
          email: "pippo@mail.com",
          available: [
            {
              name: "stanza di pippo",
              price: 210,
              description: "una piccola stanzetta"
            }
          ],
          where: "Via Pippis - GESSOPALENA[KR]"
        })
        .expect(400);
    });
  });

  describe('with no description', () => {
    it('should respond with a 400 status code', async () => {
      const postId = "6298c834772da176771d7373";
      await request(app)
        .put(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=`+token)
        .send({
          title: "casa modificata",
          description: "",
          contract: "mensile",
          phone: 2222222222,
          showPrice: 400,
          rooms: 1,
          email: "pippo@mail.com",
          available: [
            {
              name: "stanza di pippo",
              price: 210,
              description: "una piccola stanzetta"
            }
          ],
          where: "Via Pippis - GESSOPALENA[KR]"
        })
        .expect(400);
    });
  });

  describe('without token', () => {
    it('should respond with a 401 status code', async () => {
      const postId = "6298c834772da176771d7373";
      await request(app)
        .put(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}`)
        .send({
          title: "casa modificata",
          description: "descrizione modificata",
          contract: "mensile",
          phone: 2222222222,
          showPrice: 400,
          rooms: 1,
          email: "pippo@mail.com",
          available: [
            {
              name: "stanza di pippo",
              price: 210,
              description: "una piccola stanzetta"
            }
          ],
          where: "Via Pippis - GESSOPALENA[KR]"
        })
        .expect(401);
    });
  });

  describe('with wrong token', () => {
    it('should respond with a 403 status code', async () => {
      const postId = "6298c834772da176771d7373";
      await request(app)
        .put(`/api/v2/published/628a1d73fc4964ea27473f96/posts/${postId}?token=wrong`)
        .send({
          title: "casa modificata",
          description: "descrizione modificata",
          contract: "mensile",
          phone: 2222222222,
          showPrice: 400,
          rooms: 1,
          email: "pippo@mail.com",
          available: [
            {
              name: "stanza di pippo",
              price: 210,
              description: "una piccola stanzetta"
            }
          ],
          where: "Via Pippis - GESSOPALENA[KR]"
        })
        .expect(403);
    });
  });
});
