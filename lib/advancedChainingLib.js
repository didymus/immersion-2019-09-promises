const Clarifai = require('clarifai');
const request = require('request');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY || 'YOUR_API_KEY_HERE',
});

/*
 * getIntersection(arrays) =>
 *   @param {Array} arrays - an array of arrays, each containing a set of values
 *   @return {Array} - a single array with the intersection of values from all arrays
 */
const getIntersection = (arrays) => {
  if (!arrays.length) return [];
  return arrays.shift().filter((v) => {
    return arrays.every((a) => {
      return a.indexOf(v) !== -1;
    });
  });
};

/**
 * getGitHubProfile(user) =>
 *   @param {String} user - the handle of a GitHub user
 *   @return {Promise} - resolves with the user's profile in the following format:
 *     {
 *       handle: 'danthareja',
 *       name: 'Dan Thareja',
 *       avatarUrl: 'https://avatars.githubusercontent.com/u/6980359?v=3.jpg'
 *     }
 */
const getGitHubProfile = (user) => {
  const options = {
    url: `https://api.github.com/users/${user}`,
    headers: { 'User-Agent': 'request' },
    json: true, // will JSON.parse(body) for us
  };

  return new Promise((resolve, reject) => {
    request.get(options, (err, data, body) => {
      if (err) {
        return reject(err);
      }

      const simpleProfile = {
        handle: body.login,
        name: body.name,
        avatarUrl: `${body.avatar_url}.jpg`, // extension necessary for image tagger
      };
      resolve(simpleProfile);
    });
  });
};


/**
 * predictImage(imageUrl) =>
 *   @param {String} imageUrl - the url of the image you want to tag
 *   @return {Promise} - resolves with an array of tags
 */
const predictImage = (imageUrl) => {
  if (clarifaiApp._config.apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('You must add your API key before you can predict an image');
  }

  return clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, imageUrl)
    .then((response) => {
      const { concepts } = response.outputs[0].data;
      return concepts.map(concept => concept.name);
    })
};


module.exports = {
  predictImage,
  getIntersection,
  getGitHubProfile,
};
