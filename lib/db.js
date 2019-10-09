// No real database here, just time wasters to simulate asynchronicity

const colors = require('colors');

const findUserInDatabase = (user, callback) => {
  console.log(`Searching for user ${user.name.yellow} from ${'findUserInDatabase'.green}`);
  setTimeout(() => {
    // Randomize the fate of our mock async function
    const state = Math.random();

    if (state < 0.8) {
      console.log(`Found ${'0'.yellow} ${record(s)}`);
      callback(null, null);
    } else if (state < 0.9) {
      console.log(`Found ${'1'.yellow} ${record(s)}`);
      callback(null, user);
    } else {
      console.log('Error searching for user!'.red);
      callback('Error searching for user', null);
    }
  }, Math.random() * 1000 + 1000);
};

const hashPassword = (user, callback) => {
  console.log(`Hashing ${user.name.yellow}'s password ${user.password.yellow} in ${'hashPassword'.green}`);
  setTimeout(() => {

    const state = Math.random();

    if (state < 0.8) {
      user.password = '10101010101'; // super secure
      console.log(`Done hashing! Hashed password: ${user.password.yellow}`);
      callback(null, user);
    } else {
      console.log('Error hashing password'.red);
      callback('Error searching for user', null);
    }

  }, Math.random() * 1000 + 1000);
};

const createAndSaveUser = (user, callback) => {
  console.log(`Saving secured user ${user.name.yellow} with hashed password ${user.password.yellow} in ${'createAndSaveUser'.green}`);
  setTimeout(() => {
    const state = Math.random();

    if (state < 0.8) {
      console.log(`Successfully created and saved user ${user.name.yellow}`);
      callback(null, user);
    } else {
      console.log('Error creating and saving user'.red);
      callback('Error searching for user', null);
    }
  }, Math.random() * 1000 + 1000);
};

module.exports = {
  findUserInDatabase,
  hashPassword,
  createAndSaveUser,
};
