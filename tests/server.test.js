var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../src/server/server');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    })
  });
});