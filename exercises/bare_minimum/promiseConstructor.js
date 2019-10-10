/**
 * Implement these promise-returning functions.
 * Any successful value should be made available in the next `then` block chained
 * to the function invocation, while errors should be available in the `catch` block
 */

const fs = require('fs');
const request = require('request');

// This function should retrieve the first line of the file at `filePath`
const pluckFirstLineFromFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, file) => {
      if(err){
        reject(err);
      } else {
        let firstLine = file.split('\n')[0];
        resolve(firstLine);
      }
    });
  });
};

// This function should retrieve the status code of a GET request to `url`
const getStatusCodeAsync = (url) => {
  // TODO
};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getStatusCodeAsync,
  pluckFirstLineFromFileAsync,
};
