const request = require('supertest');
const app     = require('../app');
/**
 * groups the tests of the v2/users route
 */
describe('v2/users', () => {
 
  let userSpyFindOne;
  let postSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {
    
    const User = require('../models/user_v2');

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
	//for testing rooms 
	const Post =  require('../models/post_v2');
	postSpyFindOne = jest.spyOn(Post, 'findOne').mockImplementation((query) => {
		let r;
		if(query._id === "6295b6e5a8f9e7c8aca31f14" &&
		query.createdBy === "62926a256236cd334360ac49"){
			r = {			
				"exec": () => {
					return {
						"_id":"6295b6e5a8f9e7c8aca31f14",
						"title": "Appartamento molto bello",
						"description": "Bello",
						"createdBy": "62926a256236cd334360ac49",
						"contract": "annuale",
						"phone": "1234 56789",
						"showPrice":"500",
						"rooms": 2,
						"email":"sonic@prova.com",
						"available": [
							{
								"id":"6295b6e5a8f9e7c8aca31f15",
								"name":"Stanza1",
								"price":300,
								"description":"Mmmm"
							},
							{
								"id":"6295b6e5a8f9e7c8aca31f16",
								"name":" Stanza2",
								"price": 200,
								"description" : "Mmmm"
							}
						],
						"where":"Via Marconi, 33",
						"save":() => {return;},
						"__v":0	
					};					
				}			
			};
		}else{
			r = {
				"_id":"6295b6e5a8f9e7c8aca31f14",
				"createdBy": "62926a256236cd334360ac49",
				"exec": () => {return {					
					"available":[]
				}}
			};			
		}
		return r;
    });
	
  });
  

  /**
   * Restore the mock functions after the test suite ends
   */
  afterAll(async () => {
    userSpyFindOne.mockRestore();
	postSpyFindOne.mockRestore();
  });

  /**
   * Test the POST method
   */

    

    

    
/*
 * Testing rooms
 */	
	describe('GET on /:uid/posts/:id/rooms/', () => {
		it('should return 200, successful request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "6295b6e5a8f9e7c8aca31f14";			
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
			  .expect('Content-Type', /json/)
			  .expect(200);
		});
	});
	
	describe('with an invalid user id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "ablimblonebucciadilimone";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with an invalid post id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "ablimblonebucciadilimone";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with mismatching ids', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "628a1d73fc4964ea27473f96";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "Post id and user id are mismatching"
				  });
		});		
	});
	
	describe('GET on /:uid/posts/:id/rooms/:rid', () => {
		it('should return 200, successful request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";			
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(200,{message:{
								"id":"6295b6e5a8f9e7c8aca31f16",
								"name":" Stanza2",
								"price": 200,
								"description" : "Mmmm"
							}});
		});
	});
	
	describe('with an invalid user id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "ablimblonebucciadilimone";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with an invalid post id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "ablimblonebucciadilimone";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with an invalid room id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "ablimblonebucciadilimone";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with mismatching user id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "628a1d73fc4964ea27473f96";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "Post id and user id are mismatching"
				  });
		});		
	});
	
	describe('DELETE on /:uid/posts/:id/rooms/:rid', () => {
		it('should return 200, successful request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(200,{message:[
								{
									"id":"6295b6e5a8f9e7c8aca31f15",
									"name":"Stanza1",
									"price":300,
									"description":"Mmmm"
								}
							]});
		});
	});
	
	describe('with mismatching user id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "628a1d73fc4964ea27473f96";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "Post id and user id are mismatching"
				  });
		});		
	});
	
	describe('with an invalid room id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "ablimblonebucciadilimone";
			await request(app)
			  .delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with an invalid user id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "ablimblonebucciadilimone";
			const postId = "6295b6e5a8f9e7c8aca31f14";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
	
	describe('with an invalid post id', () => {
		it('should return 400, Bad request', async () => {
			const ownerId = "62926a256236cd334360ac49";
			const postId = "ablimblonebucciadilimone";
			const roomId = "6295b6e5a8f9e7c8aca31f16";
			await request(app)
			  .delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
			  .expect('Content-Type', /json/)
			  .expect(400,{
				  status: 400,
				  message: "At least one id is not valid"
				  });
		});		
	});
});
 