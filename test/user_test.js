var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');

var agent = request.agent(app);

describe('GET /users', function() {
    it('should respond with 200 in case of valid request', function(done) {
        agent.get('/users')
            .send()
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var fetchedData = JSON.parse(res.text);
                expect(fetchedData).to.be.an('array');
                expect(fetchedData).to.not.empty;

                var user = fetchedData[0];
                if (user) {
                    expect(user).to.have.all.keys('_id', '__v', 'username', 'hash', 'salt');
                }
                done();
            });
    });
});