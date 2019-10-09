const nock = require('nock');
const { expect } = require('chai');

describe('Callback review', function() {
  const callbackReview = require('../../exercises/bare_minimum/callbackReview.js');

  describe('pluckFirstLineFromFile', function() {
    const { pluckFirstLineFromFile } = callbackReview;

    it('should accept a callback as its last argument', function(done) {
      pluckFirstLineFromFile(`${__dirname}/../files/file_to_read.txt`, () => {
        // If this assertion gets called, the callback was invoked correctly
        // Otherwise, this test will timeout after 2000ms
        expect(true).to.equal(true);
        done();
      });
    });

    it('should invoke the callback with an error as the first argument', function(done) {
      pluckFirstLineFromFile(`${__dirname}/../files/nonexistent_file.txt`, (err, firstLine) => {
        expect(err.code).to.equal('ENOENT');
        expect(firstLine).to.not.exist;
        done();
      });
    });

    it('should invoke the callback with the first line as the second argument', function(done) {
      pluckFirstLineFromFile(`${__dirname}/../files/file_to_read.txt`, (err, firstLine) => {
        expect(firstLine).to.equal('This is a file to read');
        expect(err).to.not.exist;
        done();
      });
    });

  });

  describe('getStatusCode', function() {
    const { getStatusCode } = callbackReview;

    // Nock is a super cool library that makes it easy to test
    // functions that send HTTP requests. Nock intercepts all outgoing
    // requests and allows us to send back any response we want instead.
    // Since no actual requests is ever sent, our tests run faster
    // and we preserve our API rate limits.
    const google = nock('https://google.com');
    const someNonExistantWebsite = nock('https::///thisIsNoUrl.comedy');

    it('should accept a callback as its last argument', function(done) {
      google.get('/').reply(200);

      getStatusCode('https://google.com', () => {
        // If this assertion gets called, the callback was invoked correctly
        // Otherwise, this test will timeout after 2000ms
        expect(true).to.equal(true);
        done();
      });
    });

    it('should invoke the callback with an error as the first argument', function(done) {
      someNonExistantWebsite.get('/').reply(404);

      getStatusCode('https::///thisIsNoUrl.comedy', (err, statusCode) => {
        expect(err.message).to.contain('Invalid URI');
        expect(statusCode).to.not.exist;
        done();
      });
    });

    it('should invoke the callback with the status code as the second argument', function(done) {
      google.get('/').reply(200);

      getStatusCode('https://google.com', (err, statusCode) => {
        expect(statusCode).to.equal(200);
        expect(err).to.not.exist;
        done();
      });
    });

    // Restore HTTP requests to their normal unmocked behavior
    after(function() {
      nock.cleanAll();
    });

  });

});