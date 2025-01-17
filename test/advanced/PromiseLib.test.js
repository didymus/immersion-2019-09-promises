const fs = require('fs');
const { expect } = require('chai');

const { delay } = require('../../lib/asyncLib.js');

describe('PromiseLib', function() {
  const PromiseLib = require('../../exercises/advanced/PromiseLib.js');

  describe('Promise.promisify', function() {
    it('should return a promise-aware function', function() {
      const readFileAsync = PromiseLib.promisify(fs.readFile);
      expect(readFileAsync).to.be.a.Function;
    });

    it('should make file content available in the `then` block', function(done) {
      const readFileAsync = PromiseLib.promisify(fs.readFile);
      const filePath = `${__dirname}/../files/file_to_read.txt`;

      readFileAsync(filePath)
        .then((content) => {
          expect(content.toString()).to.contain('This is a file to read');
          done();
        })
        .catch(done);
    });

    it('should make file content available in the `catch` block', function(done) {
      const readFileAsync = PromiseLib.promisify(fs.readFile);
      const filePath = `${__dirname}/../files/nonexistent_file.txt`;

      readFileAsync(filePath)
        .catch((err) => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('Promise.all', function() {

    it('should return a promise', function() {
      // delay comes from lib/asyncLib.js
      const arrayOfPromises = ['a', 'b', 'c'].map(delay);

      expect(PromiseLib.all(arrayOfPromises)).to.be.an.instanceOf(Promise);
    });

    it('should return a promise that resolves to an array of values', function(done) {
      const arrayOfPromises = ['a', 'b', 'c'].map(delay);

      PromiseLib.all(arrayOfPromises)
        .then((values) => {
          expect(values).to.be.an.instanceOf(Array);
          done();
        })
        .catch(done);
    });

    it('should resolve to an array of values that exist at the same index as their promise counterparts', function(done) {
      const arrayOfPromises = [
        delay(25, 'a'), // will fulfill to 'a' after 25ms
        delay(10, 'b'), // will fulfill to 'b' after 10ms
        delay(50, 'c'), // will fulfill to 'c' after 50ms
      ];

      PromiseLib.all(arrayOfPromises)
        .then((values) => {
          expect(values).to.deep.equal(['a', 'b', 'c']); // order matters
          done();
        })
        .catch(done);
    });

    it('should reject the returned promise if any promise in the input array is rejected', function(done) {
      const arrayOfPromises = [
        delay(25, 'a'), // will fulfill to 'a' after 25ms
        delay(10, 'b'), // will fulfill to 'b' after 10ms
        delay(10001, 'c'), // will reject immediately
      ];

      PromiseLib.all(arrayOfPromises)
        .catch((err) => {
          expect(err.message).to.equal('Delay for value c is too long');
          done();
        });
    });
  });

  describe('Promise.race', function() {

    it('should return a promise', function() {
      // delay comes from lib/asyncLib.js
      const arrayOfPromises = ['a', 'b', 'c'].map(delay);

      expect(PromiseLib.race(arrayOfPromises)).to.be.an.instanceOf(Promise);
    });

    it('should resolve with a single value', function(done) {
      const arrayOfPromises = [
        delay(25, 'a'), // will fulfill to 'a' after 25ms
        delay(10, 'b'), // will fulfill to 'b' after 10ms
        delay(50, 'c'), // will fulfill to 'c' after 50ms
      ];

      PromiseLib.race(arrayOfPromises)
        .then((value) => {
          expect(value).to.be.a.String;
          done();
        })
        .catch(done);
    });

    it('should fulfill with the value if the first resolved promise is fulfilled', function(done) {
      const arrayOfPromises = [
        delay(25, 'a'), // will fulfill to 'a' after 25ms
        delay(10, 'b'), // will fulfill to 'b' after 10ms
        delay(50, 'c'), // will fulfill to 'c' after 50ms
      ];

      PromiseLib.race(arrayOfPromises)
        .then((value) => {
          expect(value).to.equal('b');
          done();
        });
    });

    it('should reject with the error if the first resolved promise is rejected', function(done) {
      const arrayOfPromises = [
        delay(25, 'a'), // will fulfill to 'a' after 25ms
        delay(10, 'b'), // will fulfill to 'b' after 10ms
        delay(10001, 'c'), // will reject immediately
      ];

      PromiseLib.race(arrayOfPromises)
        .catch((err) => {
          expect(err.message).to.equal('Delay for value c is too long');
          done();
        });
    });

  });

});
