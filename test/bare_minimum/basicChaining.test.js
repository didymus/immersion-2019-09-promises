const fs = require('fs');
const nock = require('nock');
const { expect } = require('chai');

describe('Basic chaining', function() {
  const chaining = require('../../exercises/bare_minimum/basicChaining.js');

  describe('fetchProfileAndWriteToFile', function() {
    const { fetchProfileAndWriteToFile } = chaining;

    // These tests are tightly couples to the initial state of these files
    const fileWithGithubHandle = `${__dirname}/../files/github_handle.txt`;
    const fileToWriteTo = `${__dirname}/../files/file_to_write_to.txt`;

    before(function() {
      // Nock is a super cool library that makes it easy to test
      // functions that send HTTP requests. Nock intercepts all outgoing
      // requests and allows us to send back any response we want instead.
      // Since no actual requests is ever sent, our tests run faster
      // and we preserve our API rate limits.
      nock('https://api.github.com')
        .get('/users/danthareja')
        .times(2) // Send same response for both tests
        .reply(200, {
          id: 6980359,
          login: 'danthareja',
          name: 'Dan Thareja',
          company: 'Hack Reactor',
          location: 'United States',
        });
    });

    beforeEach(function() {
      fs.writeFileSync(fileToWriteTo, '');
    });

    it('should return the promise created by the entire chain', function() {
      // Make sure you return the chain! This will allow you to keep chaining promises
      // once the file has successfully been written
      expect(fetchProfileAndWriteToFile(fileWithGithubHandle, fileToWriteTo)).to.be.an.instanceOf(Promise);
    });

    it('should eventually write a GitHub profile to a file', function(done) {
      fetchProfileAndWriteToFile(fileWithGithubHandle, fileToWriteTo)
        .then(() => {
          const profile = JSON.parse(fs.readFileSync(fileToWriteTo, 'utf8'));
          expect(profile.id).to.equal(6980359);
          done();
        })
        .catch(done);
    });

    afterEach(function() {
      fs.writeFileSync(fileToWriteTo, '');
    });

    // Restore HTTP requests to their normal unmocked behavior
    after(function() {
      nock.cleanAll();
    });

  });

});
