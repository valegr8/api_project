const request = require('supertest');
const app = require('../app');

const mongoose = require('mongoose');
const { printd } = require('../../utils/utils.js');

/**
 * groups the tests of the v2/users route
 */
describe('v2/users/.../posts/', () => {


	let userSpyFindById;
	let postSpyFindOne;

	/**
	 * Set the mock implementations of mongoose methods before the tests start
	 */
	beforeAll(() => {
		done();
		const User = require('../models/user_v2');

		userSpyFindById = jest.spyOn(User, 'findById').mockImplementation((data) => {
			let r;
			if (data._id === "62926a256236cd334360ac49") {
				r = {
					_id: "62926a256236cd334360ac49",
					email: "sonic@prova.com",
					username: "pippo",
					favorite: []
				};
			} else {
				r = undefined;
			}
			return r;
		});

		//for testing rooms 
		const Post = require('../models/post_v2');
		postSpyFindOne = jest.spyOn(Post, 'findOne').mockImplementation((query) => {
			let r;
			if (query._id === "6298f80d3be4df0eb2790de6" &&
				query.createdBy === "62926a256236cd334360ac49") {
				r = {
					"exec": () => {
						return {
							"_id": "6298f80d3be4df0eb2790de6",
							"title": "Appartamento molto bello",
							"description": "Bello",
							"createdBy": "62926a256236cd334360ac49",
							"contract": "annuale",
							"phone": "1234 56789",
							"showPrice": "500",
							"rooms": 2,
							"email": "sonic@prova.com",
							"available": [
								{
									"id": "6295b6e5a8f9e7c8aca31f15",
									"name": "Stanza1",
									"price": 300,
									"description": "Mmmm"
								},
								{
									"id": "6295b6e5a8f9e7c8aca31f16",
									"name": " Stanza2",
									"price": 200,
									"description": "Mmmm"
								}
							],
							"where": "Via Marconi, 33",
							"save": () => { return; },
							"__v": 0
						};
					}
				};
			} else {
				r = {
					"_id": "6298f80d3be4df0eb2790de6",
					"createdBy": "62926a256236cd334360ac49",
					"exec": () => {
						return {
							"available": []
						}
					}
				};
			}
			return r;
		});

	});

	/**
	 * Restore the mock functions after the test suite ends
	 */
	afterAll(async () => {
		userSpyFindById.mockRestore();
		postSpyFindOne.mockRestore();
		done();
	});

	jest.setTimeout(30000);

	/**
	 * Test the POST method
	 */
	describe('POST', () => {
		describe('with correct user', () => {
			it('should return 201, created', async () => {
				jest.setTimeout(8000);
				jest.unmock('mongoose');
				connection = await mongoose.connect('mongodb+srv://admin:admin1234@cluster0.deuin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
				printd('Database connected!');

				const ownerId = "62926a256236cd334360ac49";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({
						"title": "Appartamento molto bello",
						"description": "Bello",
						"createdBy": "62926a256236cd334360ac49",
						"contract": "annuale",
						"phone": "1234 56789",
						"showPrice": "500",
						"rooms": 2,
						"email": "sonic@prova.com",
						"available": [
							{
								"id": "6295b6e5a8f9e7c8aca31f15",
								"name": "Stanza1",
								"price": 300,
								"description": "Mmmm"
							},
							{
								"id": "6295b6e5a8f9e7c8aca31f16",
								"name": " Stanza2",
								"price": 200,
								"description": "Mmmm"
							}
						],
						"where": "Via Marconi, 33"
					})
					.expect('Content-Type', /json/)
					// .expect(function (res) {
					// 	if (!res.hasOwnProperty('location')) throw new Error("No location");
					// })
					.expect(201, {
						status: 201,
						message: "Post saved successfully"
					});
				mongoose.connection.close(true);
				printd("Database connection closed");
			});
		});
		describe('with a user that does not exist', () => {
			it('should return 400, bad request', async () => {
				const ownerId = "628a1d73fc4964ea27473f96";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({})
					.expect('Content-Type', /json/)
					.expect(400, {
						status: 400,
						message: "Bad Request"
					});
			});
		});

		describe('with an invalid user id', () => {
			it('should return 400, User id not valid', async () => {
				const ownerId = "ablimblonebucciadilimone";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({})
					.expect('Content-Type', /json/)
					.expect(400, {
						status: 400,
						message: "User id not valid"
					});
			});
		});

		describe('leaving the title field empty', () => {
			it('should return 400, Title not valid', async () => {
				const ownerId = "62926a256236cd334360ac49";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({
						title: ""
					})
					.expect('Content-Type', /json/)
					.expect(400, {
						status: 400,
						message: "Title not valid"
					});
			});
		});


		describe('leaving the email field empty', () => {
			it('should return 400, Email not valid', async () => {
				const ownerId = "62926a256236cd334360ac49";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({
						title: "Appartamento Bello",
						email: ""
					})
					.expect('Content-Type', /json/)
					.expect(400, {
						status: 400,
						message: "Email not valid"
					});
			});
		});

		describe('with an email not in the correct format', () => {
			it('should return 400, Email not valid', async () => {
				const ownerId = "62926a256236cd334360ac49";
				await request(app)
					.post(`/api/v2/users/${ownerId}/posts/`)
					.send({
						email: "test",
						title: "test",
						description: "test"
					})
					.expect('Content-Type', /json/)
					.expect(400, {
						status: 400,
						message: "Email not valid"
					});
			});
		});
	});

	/*
	*Testing rooms
	*/	
	describe('Testing rooms', () => {
		describe('GET', () => {
			describe('GET on /:uid/posts/:id/rooms/', () => {
				it('should return 200, successful request', async () => {
					const ownerId = "62926a256236cd334360ac49";
					const postId = "6298f80d3be4df0eb2790de6";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
						.expect('Content-Type', /json/)
						.expect(200);
				});
			});

			describe('with an invalid user id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "ablimblonebucciadilimone";
					const postId = "6298f80d3be4df0eb2790de6";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
						.expect('Content-Type', /json/)
						.expect(400, {
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
						.expect(400, {
							status: 400,
							message: "At least one id is not valid"
						});
				});
			});

			describe('with mismatching ids', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "628a1d73fc4964ea27473f96";
					const postId = "6298f80d3be4df0eb2790de6";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/`)
						.expect('Content-Type', /json/)
						.expect(400, {
							status: 400,
							message: "Post id and user id are mismatching"
						});
				});
			});

			describe('GET on /:uid/posts/:id/rooms/:rid', () => {
				it('should return 200, successful request', async () => {
					const ownerId = "62926a256236cd334360ac49";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(200, {
							message: {
								"id": "6295b6e5a8f9e7c8aca31f16",
								"name": " Stanza2",
								"price": 200,
								"description": "Mmmm"
							}
						});
				});
			});

			describe('with an invalid user id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "ablimblonebucciadilimone";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
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
						.expect(400, {
							status: 400,
							message: "At least one id is not valid"
						});
				});
			});

			describe('with an invalid room id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "62926a256236cd334360ac49";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "ablimblonebucciadilimone";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
							status: 400,
							message: "At least one id is not valid"
						});
				});
			});

			describe('with mismatching user id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "628a1d73fc4964ea27473f96";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.get(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
							status: 400,
							message: "Post id and user id are mismatching"
						});
				});
			});
		});

		describe('DELETE', () => {

			describe('DELETE on /:uid/posts/:id/rooms/:rid', () => {
				it('should return 200, successful request', async () => {
					const ownerId = "62926a256236cd334360ac49";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(200, {
							message: [
								{
									"id": "6295b6e5a8f9e7c8aca31f15",
									"name": "Stanza1",
									"price": 300,
									"description": "Mmmm"
								}
							]
						});
				});
			});

			describe('with mismatching user id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "628a1d73fc4964ea27473f96";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
							status: 400,
							message: "Post id and user id are mismatching"
						});
				});
			});

			describe('with an invalid room id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "62926a256236cd334360ac49";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "ablimblonebucciadilimone";
					await request(app)
						.delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
							status: 400,
							message: "At least one id is not valid"
						});
				});
			});

			describe('with an invalid user id', () => {
				it('should return 400, Bad request', async () => {
					const ownerId = "ablimblonebucciadilimone";
					const postId = "6298f80d3be4df0eb2790de6";
					const roomId = "6295b6e5a8f9e7c8aca31f16";
					await request(app)
						.delete(`/api/v2/users/${ownerId}/posts/${postId}/rooms/${roomId}`)
						.expect('Content-Type', /json/)
						.expect(400, {
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
						.expect(400, {
							status: 400,
							message: "At least one id is not valid"
						});
				});
			});
		});
	});
});