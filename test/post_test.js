var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');

var agent = request.agent(app);

describe('GET /posts', function() {
    it('should respond with 200 in case of valid request', function(done) {
        agent.get('/posts')
            .send()
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var fetchedData = JSON.parse(res.text);
                expect(fetchedData).to.be.an('array');
                expect(fetchedData).to.not.empty;

                var post = fetchedData[0];
                if (post) {
                    expect(post).to.have.all.keys('_id','__v', 'comments', 'upvotes', 'userswhoupvoted', 'userswhodownvoted','title', 'link', 'author', 'datetime');
                    expect(post.comments).to.be.an('array');
                    expect(post.usersWhoDownvoted).to.be.an('array');
                    expect(post.usersWhoUpvoted).to.be.an('array');
                    expect(post.upvotes).to.be.a('number');

                }
                done();
            });
    });
});


