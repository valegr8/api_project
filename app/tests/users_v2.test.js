const request = require('supertest');
const app     = require('../app');
/**
 * groups the tests of the v2/users route
 */
describe('v2/users', () => {
 
  let userSpyFindOne;
  let userSpyUpdateOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {
    
    const User = require('../models/user_v2');

    /* Mock the User.findOne method of mongoose */
    userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((data) => {
      if (data.email=="exists@email.com" || data._id === "6295b6e5a8f9e7c8aca31f14") {
        return {
          _id:"6295b6e5a8f9e7c8aca31f14",
          email:"exists@email.com",
          password:"exists",
          username:"exists",
		  favorite: [],
		  exec: () => {
			  return {
			  _id:"6295b6e5a8f9e7c8aca31f14",
			  email:"exists@email.com",
              password:"exists",
			  username:"exists",
			  favorite: ["6298f80d3be4df0eb2790de6"]
			  };
			},
          __v:0
        };
      }
      else
        return {
			exec: () => {return null;}
		};
    });
	
	function findOne(query){
		let r;
		if(query._id === "6295b6e5a8f9e7c8aca31f14"){
			r = {
				_id:"6295b6e5a8f9e7c8aca31f14",
				email: "pippo@prova.com",
				password: "1234",
				favorite: []
			};
		}else{
			r = undefined;
		}
		return r;
	}
	
	userSpyUpdateOne = jest.spyOn(User,'updateOne').mockImplementation((query,update) => {
		let user = findOne(query);
		if(user){
			user.favorite = update.favorite;
		}
		return user;
	});
	
	
  });
  

  /**
   * Restore the mock functions after the test suite ends
   */
  afterAll(async () => {
    userSpyFindOne.mockRestore();	
	userSpyUpdateOne.mockRestore();
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
            password: "test",
			favorite: []
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
  
  
 describe('Favorites',() => {
	 describe('SetFavorite',() => {
		 describe('with correct input data',() => {
			 it('should return 200',async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 await request(app)				 
				   .post(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"628a1d73fc4964ea27473f96"
				   })
				   .expect('Content-Type', /json/)
				   .expect(201);
			 });
		 });
		 
		 describe('with invalid uid',() => {
			 it('should return Bad request, uid not valid', async () => {
				 const userId = "invalid";
				 await request(app)				 
				   .post(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"628a1d73fc4964ea27473f96"
				   })
				   .expect('Content-Type', /json/)
				   .expect(400,{
					   status: 400,
					   message: "Bad request, uid not valid"
				   });
			 });
		 });
		 
		 describe('with invalid post id',() => {
			 it('should return Bad request, postId not valid', async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 await request(app)
				   .post(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"invalid"
				   })
				   .expect('Content-Type', /json/)
				   .expect(400,{
					   status: 400,
					   message: "Bad request, postId not valid"
				   });
			 });
		 });
		 
		 describe('user does not exists',() => {
			 it('should return User not found', async () => {
				 const userId = "62926a256236cd334360ac49";
				 await request(app)
				   .post(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"628a1d73fc4964ea27473f96"
				   })
				   .expect('Content-Type', /json/)
				   .expect(404,{
					   status: 404,
					   message: "User not found"
				   });
			 });
		 });
		 
		 describe('The post is already in the list',() => {
			 it('should return 409', async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 const postId = "6298f80d3be4df0eb2790de6";
				 await request(app)
				   .post(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":postId
				   })
				   .expect('Content-Type', /json/)
				   .expect(409,{
					   status: 409,
					   message: `Post ${postId} already on Favorite List`
				   });
			 });
		 });
	 });
	 
	 describe('RemFavorite',() => {
		 describe('with correct input data',() => {
			 it('should return 200',async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 await request(app)
				  .delete(`/api/v2/users/${userId}/favorites`)				 
				  .send({
					 "id":"6298f80d3be4df0eb2790de6"
				  })
				  .expect('Content-Type', /json/)
				  .expect(200);
			 });
		 });
		 
		 describe('with invalid uid',() => {
			 it('should return Bad request, uid not valid', async () => {
				 const userId = "invalid";
				 await request(app)				 
				   .delete(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"6298f80d3be4df0eb2790de6"
				   })
				   .expect('Content-Type', /json/)
				   .expect(400,{
					   status: 400,
					   message: "Bad request, uid not valid"
				   });
			 });
		 });
		 
		 describe('with invalid post id',() => {
			 it('should return Bad request, postId not valid', async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 await request(app)
				 .delete(`/api/v2/users/${userId}/favorites`)
				 .send({
					 "id":"invalid"
				 })
				 .expect('Content-Type', /json/)
				 .expect(400,{
					   status: 400,
					   message: "Bad request, postId not valid"
				   });
			 });
		 });
		 
		  describe('user does not exists',() => {
			 it('should return User not found', async () => {
				 const userId = "62926a256236cd334360ac49";
				 await request(app)
				   .delete(`/api/v2/users/${userId}/favorites`)
				   .send({
					   "id":"628a1d73fc4964ea27473f96"
				   })
				   .expect('Content-Type', /json/)
				   .expect(404,{
					   status: 404,
					   message: "User not found"
				   });
			 });
		 });
		 
		 describe('The post is not in the list',() => {
			 it('should return 404', async () => {
				 const userId = "6295b6e5a8f9e7c8aca31f14";
				 const postId = "628a1d73fc4964ea27473f96";
				 await request(app)
				 .delete(`/api/v2/users/${userId}/favorites`)
				 .send({
					 "id":postId
				 })
				 .expect('Content-Type', /json/)
				 .expect(404,{
					   status: 404,
					   message: `Post ${postId} not found on Favorite List`
				   });
			 });
		 });
	 });
 });
});
 