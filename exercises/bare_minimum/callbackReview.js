/**
 * Implement these functions following the node style callback pattern
 */

const fs = require('fs');
const request = require('request');

// This function should retrieve the first line of the file at `filePath`
const pluckFirstLineFromFile = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, file) => {
    if(err){
      callback(err, null);
    } else {
      let firstLine = file.split('\n')[0]; // error first
      callback(null, firstLine);
    }
  });
};

// This function should retrieve the status code of a GET request to `url`
const getStatusCode = (url, callback) => {
  request(url, 'utf8', (err, response) => {
    if(err){
      callback(err);
    } else {
      callback(null, response.statusCode);
    }
  });
};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getStatusCode,
  pluckFirstLineFromFile,
};
