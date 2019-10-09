require('dotenv').config();
const nock = require('nock');
const { expect } = require('chai');

const harveyPredictData = {}; // require('../../data/clarifai/imagePredictionResponse_harvey.json');
const hallePredictData = {}; // require('../../data/clarifai/imagePredictionResponse_hallebot.json');
const danPredictData = {}; // require('../../data/clarifai/imagePredictionResponse.json');
const cainPredictData = {}; // require('../../data/clarifai/imagePredictionResponse_cain.json');

// NOTE: These tests don't use mocks of any kind
// If test speed or API rate limits become an issue,
// refactor the tests to use mocks, following previous
// `nock` utilizing tests

describe('Advanced chaining', function() {
  const chaining = require('../../exercises/advanced/advancedChaining.js');

  describe('searchCommonConceptsFromGitHubProfiles', function() {
    const generalModelId = 'aaa03c23b3724a16a56b629203edc62c';
    const predictEndpoint = `/v2/models/${generalModelId}/outputs`;
    const predictData = {
      danthareja: danPredictData,
      cainwatson: cainPredictData,
      harveysanders: harveyPredictData,
      hallebot: hallePredictData,
    };
    const userIds = {
      danthareja: '6980359',
      cainwatson: '23223956',
      harveysanders: '9354822',
      hallebot: '42619351'
    };

    const clarifyAPI = nock('https://api.clarifai.com');
    const githubApi = nock('https://api.github.com');

    const { searchCommonConceptsFromGitHubProfiles } = chaining;

    it('should return a promise', function() {
      const username = 'danthareja';
      githubApi.get(`/users/${username}`)
        .reply(200, { id: userIds[username] });

      clarifyAPI.post(predictEndpoint, body => body)
        .reply(200, predictData[username]);
      expect(searchCommonConceptsFromGitHubProfiles([username])).to.be.an.instanceOf(Promise);
    });

    it('should resolve to an array of tags', function(done) {
      const username = 'cainwatson';
      githubApi.get(`/users/${username}`)
        .reply(200, { id: userIds[username] });

      clarifyAPI.post(predictEndpoint, body => body)
        .reply(200, predictData[username]);

      searchCommonConceptsFromGitHubProfiles([username])
        .then((tags) => {
          expect(tags).to.be.an.instanceOf(Array);
          done();
        })
        .catch(done);
    });

    it('should not have duplicate adjectives in the array of tags', function(done) {
      const usernames = ['danthareja', 'harveysanders'];
      usernames.forEach((username) => {
        githubApi.get(`/users/${username}`).reply(200, { id: userIds[username] });
        clarifyAPI.post(predictEndpoint, body => body).reply(200, predictData[username]);
      });

      searchCommonConceptsFromGitHubProfiles(usernames)
        .then((tags) => {
          const uniques = Object.keys(
            tags.reduce((hash, tag) => {
              hash[tag] = tag;
              return hash;
            }, {})
          );

          expect(uniques.length).to.equal(tags.length);
          done();
        })
        .catch(done);
    });

    it('should contain the correct tags', function(done) {
      const usernames = ['hallebot', 'harveysanders'];
      usernames.forEach((username) => {
        githubApi.get(`/users/${username}`).reply(200, { id: userIds[username] });
        clarifyAPI.post(predictEndpoint, body => body).reply(200, predictData[username]);
      });
      searchCommonConceptsFromGitHubProfiles(usernames)
        .then((tags) => {
          expect(tags).to.contain('man');
          done();
        })
        .catch(done);
    });

    after(function () {
      nock.cleanAll();
    });

  });

});
