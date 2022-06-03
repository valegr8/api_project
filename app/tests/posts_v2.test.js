const request = require('supertest');
const app     = require('../app');
const mongoose = require('mongoose');

/* To use the debug print */
const { printd } = require('../../utils/utils.js');

/**
 * groups the tests of the v2/posts route
 */
describe('v2/posts', () => {
 
  let postSpy;
  let postSpyFindById;

  /**
   * Set the mock implementations of mongoose methods before the tests start
   */
  beforeAll( () => {    
    const Post = require('../models/post_v2');

    /* Mock the Post.find method of mongoose */
    postSpy = jest.spyOn(Post, 'find').mockImplementation((data) => {
      console.log(JSON.stringify(data));

      // {"available":{"$elemMatch":{"price":{"$lte":"600","$gte":"500"}}}}
      let max_price;
      let min_price;

      if(data.available) {
        console.log("data.available");
        if(data.available.$elemMatch.price.$lte) {
          max_price = data.available.$elemMatch.price.$lte;
          console.log(JSON.stringify(data.available.$elemMatch.price.$lte)) 
        }
        if(data.available.$elemMatch.price.$gte) {
          min_price = data.available.$elemMatch.price.$gte;
          console.log(JSON.stringify(data.available.$elemMatch.price.$gte)) 
        }

        if(max_price && min_price) {
          return {
                      "_id": "629866c3b1ad8068d12d6072",
                      "title": "appartamento a 500€",
                      "description": "annuncio",
                      "createdBy": "6297b6f718c44ba5c3ae4d55",
                      "contract": "Mensile",
                      "phone": "",
                      "showPrice": "500",
                      "rooms": 1,
                      "email": "admin@mail.com",
                      "available": [
                          {
                              "name": "500€",
                              "price": 500,
                              "description": "",
                              "_id": "629866c3b1ad8068d12d6073"
                          }
                      ],
                      "where": "Trento - TRENTO[TN]",
                      "__v": 0
                  };
        }
      } 
      else {
        return { 
                "_id": "62973e83473efb79a0f68e03",
                "title": "Appartamento in centro con vista lago",
                "description": "Appartamento bellissimo ed economico solo per gente ricca",
                "createdBy": "628e267ec98047caa6ecd654",
                "contract": "Annuale",
                "phone": "3214562308",
                "showPrice": "50 - 375",
                "rooms": 5,
                "email": "officialCavedine@email.com",
                "available": [
                    {
                        "name": "Singola spaziosa",
                        "price": 375,
                        "description": "",
                        "_id": "62973e83473efb79a0f68e04"
                    }
                ],
                "where": "Borgo Santa Lucia 12 - TRENTO[TN]",
                "__v": 0
        };
      }
    });

    /* Mock the Post.findById method of mongoose */
    postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
      if (id=="629346eee4ffb99bc81af228") {
        return {
          message: {
            _id: "629346eee4ffb99bc81af228",
            title: "primo post nuovo",
            description: "ecco il primo",
            createdBy: "628a1d73fc4964ea27473f96",
            contract: "mono",
            phone: "0425404040",
            where: "lontano",
            __v: 0
            }
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
  });

  /**
   * Test suite of the GET "/id" method 
   */
  describe('GET "/id" route', () => {
    describe('with a correct id', () => {
      it('should return 200 and a json', async () => {
        const postId = "629346eee4ffb99bc81af228";
        await request(app)
          .get(`/api/v2/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });

    describe('with an id that does not exist', () => {
      it('should return 404, not found', async () => {
        const postId = "666666666666666666666666";
        await request(app)
          .get(`/api/v2/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(404);
      });
    });

    describe('with an id of the wrong format', () => {
      it('should return 400, bad request', async () => {
        const postId = "abc-id";
        await request(app)
          .get(`/api/v2/posts/${postId}`)
          .expect('Content-Type', /json/)
          .expect(400);
      });
    });
  });

  /**
   * Test the GET method
   */
  describe('GET "/" route', () => {
    describe('without query parameters', () => {
      it('should return 200 and an array of posts', async () => {
        jest.setTimeout(8000); /** < Increments the timeout */
        await request(app)
          .get(`/api/v2/posts`)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });

    describe('with query parameter: price between 500 & 600', () => {
      it('should return 200 and an array of posts that match the constraint', async () => {
        jest.setTimeout(8000); /** < Increments the timeout */
        await request(app).get(`/api/v2/posts?minp=500&maxp=600`)
        .expect(200,{
          "message": {
                "_id": "629866c3b1ad8068d12d6072",
                "title": "appartamento a 500€",
                "description": "annuncio",
                "createdBy": "6297b6f718c44ba5c3ae4d55",
                "contract": "Mensile",
                "phone": "",
                "showPrice": "500",
                "rooms": 1,
                "email": "admin@mail.com",
                "available": [
                    {
                        "name": "500€",
                        "price": 500,
                        "description": "",
                        "_id": "629866c3b1ad8068d12d6073"
                    }
                ],
                "where": "Trento - TRENTO[TN]",
                "__v": 0
            }
				  });
      });
    });  
  });

  /**
   * Test the PUT method
   */
  describe('PUT on "/" route', () => {
    it('should return 405, method not allowed', async () => {
      await request(app)
        .put(`/api/v2/posts`)
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
        .delete(`/api/v2/posts`)
        .expect('Content-Type', /json/)
        .expect(405);
    });
  });

  /**
   * Test the POST method
   */
   describe('POST on "/" route', () => {
    it('should return 405, method not allowed', async () => {
      await request(app)
        .post(`/api/v2/posts`)
        .expect('Content-Type', /json/)
        .expect(405);
    });
  });
});
 