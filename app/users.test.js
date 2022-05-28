const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');

/**
 * groups the tests of the v1/users route
 */
describe('v1/users', () => {
 
  let userSpy;
  let userSpyFindById;
  let userSpyFindOne;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {
    
    const User = require('./models/user');

    /**
     * Mock the User.find method of mongoose
     */
    userSpy = jest.spyOn(User, 'find').mockImplementation(() => {
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

    /**
     * Mock the User.findById method of mongoose
     */
    userSpyFindById = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id=="628a1d99fc4964ea27473f9a") {
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

    /**
     * Mock the User.findOne method of mongoose
     */
    userSpyFindOne = jest.spyOn(User, 'findOne').mockImplementation((email) => {
      if (email=="exists@email.com") {
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
    userSpy.mockRestore();
    userSpyFindById.mockRestore();
    userSpyFindOne.mockRestore();
  });
  // let connection;
  // /**
  //  * Set database connection
  //  */
  // beforeAll( async () => {
  //   jest.setTimeout(8000);
  //   jest.unmock('mongoose');
  //   connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
  //   console.log('Database connected!');
  //   //return connection; // Need to return the Promise db connection?
  // });

  // /**
  //  * End database connection
  //  */
  // afterAll( () => {
  //   mongoose.connection.close(true);
  //   console.log("Database connection closed");
  // });

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

    describe('with an user that already exists', () => {
      it('should return 409', async () => {
        await request(app)
          .post(`/api/v1/users`)
          .send({
            email: "exists@email.com",
            username: "exists",
            password: "exists"
          })
          .expect('Content-Type', /json/)
          .expect(201);
      });
    });

    describe('leaving the username field empty', () => {
      it('should return 400, bad request', async () => {
        await request(app)
          .post(`/api/v1/users`)
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
          .post(`/api/v1/users`)
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
          .post(`/api/v1/users`)
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
          .post(`/api/v1/users`)
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
 