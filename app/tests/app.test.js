/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app = require('../app');

/**
 * Test if the app module has been defined
 */
test('app module should be defined', () => {
  expect(app).toBeDefined();
});

/**
 * Test the route "/" of the web service
 */
describe('GET /', () => {
  it('should return 200', () => {
    return request(app)
      .get('/')
      .expect(200);
  });
});
