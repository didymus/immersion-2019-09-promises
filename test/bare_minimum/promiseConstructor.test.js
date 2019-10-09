const nock = require('nock');
const { expect } = require('chai');

describe('Promise constructor', function() {
  const promiseConstructor = require('../../exercises/bare_minimum/promiseConstructor.js');

  describe('pluckFirstLineFromFileAsync', function() {
    const { pluckFirstLineFromFileAsync } = promiseConstructor;

    it('should return a promise', function() {
      expect(pluckFirstLineFromFileAsync(`${__dirname}/../files/file_to_read.txt`)).to.be.an.instanceOf(Promise);
    });

    it('should resolve to a string', function(done) {
      pluckFirstLineFromFileAsync(`${__dirname}/../files/file_to_read.txt`)
        .then((firstLine) => {
          expect(firstLine).to.be.a('string');
          done();
        })
        .catch(done);
    });

    it('should make the first line of a file available in the `then` block', function(done) {
      pluckFirstLineFromFileAsync(`${__dirname}/../files/file_to_read.txt`)
        .then((firstLine) => {
          expect(firstLine).to.equal('This is a file to read');
          done();
        })
        .catch(done);
    });

    it('should make any errors available in the `catch` block', function(done) {
      pluckFirstLineFromFileAsync(`${__dirname}/../files/nonexistent_file.txt`)
        .catch((err) => {
          expect(err.code).to.equal('ENOENT');
          done();
        });
    });

  });

  describe('getStatusCodeAsync', function() {
    const { getStatusCodeAsync } = promiseConstructor;

    // Nock is a super cool library that makes it easy to test
    // functions that send HTTP requests. Nock intercepts all outgoing
    // requests and allows us to send back any response we want instead.
    // Since no actual requests is ever sent, our tests run faster
    // and we preserve our API rate limits.
    const google = nock('https://google.com');
    const someNonExistantWebsite = nock('https::///thisIsNoUrl.comedy');

    it('should return a promise', function() {
      google.get('/').reply(200);

      expect(getStatusCodeAsync('https://google.com')).to.be.an.instanceOf(Promise);
    });

    it('should resolve to a number', function(done) {
      google.get('/').reply(200);

      getStatusCodeAsync('https://google.com')
        .then((statusCode) => {
          expect(statusCode).to.be.a('number');
          done();
        })
        .catch(done);
    });

    it('should make the status code available in the `then` block', function(done) {
      google.get('/').reply(200);

      getStatusCodeAsync('https://google.com')
        .then((statusCode) => {
          expect(statusCode).to.equal(200);
          done();
        })
        .catch(done);
    });

    it('should make any errors available in the `catch` block', function(done) {
      someNonExistantWebsite.get('/').reply(404);

      getStatusCodeAsync('https::///thisIsNoUrl.comedy')
        .catch((err) => {
          expect(err.message).to.contain('Invalid URI');
          done();
        });
    });

    // Restore HTTP requests to their normal unmocked behavior
    after(function() {
      nock.cleanAll();
    });

  });

});