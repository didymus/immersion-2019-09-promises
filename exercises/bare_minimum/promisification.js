/**
 * Create the promise returning `Async` suffixed versions of the functions below,
 * Promisify them if you can, otherwise roll your own promise returning function
 */

const fs = require('fs');
const request = require('request');
const crypto = require('crypto');
const { promisify } = require('util');

// (1) Asynchronous HTTP request
const getGitHubProfile = (user, callback) => {
  const options = {
    url: `https://api.github.com/users/${user}`,
    headers: { 'User-Agent': 'request' },
    json: true, // will JSON.parse(body) for us
  };

  request.get(options, (err, res, body) => {
    if (err) {
      callback(err, null);
    } else if (body.message) {
      callback(new Error(`Failed to get GitHub profile: ${body.message}`), null);
    } else {
      callback(null, body);
    }
  });
};

const getGitHubProfileAsync = 'TODO';


// (2) Asynchronous token generation
const generateRandomToken = (callback) => {
  crypto.randomBytes(20, (err, buffer) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, buffer.toString('hex'));
  });
};

const generateRandomTokenAsync = 'TODO';


// (3) Asynchronous file manipulation
const readFileAndMakeItFunny = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, file) => {
    if (err) {
      return callback(err);
    }

    const funnyFile = file.split('\n')
      .map(line => line + ' lol')
      .join('\n');

    callback(funnyFile);
  });
};

const readFileAndMakeItFunnyAsync = 'TODO';

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getGitHubProfileAsync,
  generateRandomTokenAsync,
  readFileAndMakeItFunnyAsync,
};
