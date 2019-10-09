// This file represents a generic async library. All methods are completely
// contrived and do nothing but delay time to simulate asynchronicity.

// You could imagine that a real promise aware library would actually
// be performing work during this time.

const colors = require('colors');

// The core helper function in this module. A complete time waster
const delay = (time, value) => {
  return new Promise((resolve, reject) => {
    if (time > 10000) {
      reject(new Error('Delay for value ' + value + ' is too long'));
      return;
    }
    setTimeout(() => {
      resolve(value);
    }, time || 10);
  });
};

const logResolvedValues = (resolvedFromPromiseDotAll) => {
  console.log([
    '',
    'Promise.all has fulfilled!'.magenta,
    'Here are the results inside of ' + 'logResolvedValues'.green,
    JSON.stringify(resolvedFromPromiseDotAll, null, 2), // Pretty print our object
    'We\'re guaranteed all the async work in our collection is done now!!'.magenta,
  ].join('\n'));

  return delay(5000)
    .then(() => {
      console.log([
        '',
        '*********************************************************************',
        'IMPORTANT:'.red + ' Notice that the ' + 'resolved values are in the same order'.cyan,
        'with respect to their promise counterparts'.cyan + ' even though each promise',
        'might have resolved at a different time!',
        '(resolve times are random, it\'s a concidence if they line up)',
        '*********************************************************************',
      ].join('\n'));
      return delay(10000);
    })
    .then(() => {
      console.log('\nContinuing on to ' + 'filterValuesFromCollection'.green);
      return resolvedFromPromiseDotAll;
    });
};

const filterValuesFromCollection = (collection) => {
  // You can return non promises in a .then block too!
  console.log('Filtering values...');
  console.log('This is a synchronous option so it should be quick');
  return collection.filter((obj) => {
    return obj.shouldPassFilter;
  });
};

const doMoreAsyncWorkWithFilteredValues = (collection) => {
  console.log([
    '',
    'Done filtering!'.magenta,
    'Here are the results inside of ' + 'doMoreAsyncWorkWithFilteredValues'.green,
    JSON.stringify(collection, null, 2),  // Pretty print our object
    'We could continue on and do more async work as needed...'.magenta
  ].join('\n'));

  return delay(5000)
    .then(() => {
      console.log([
        '',
        'Run this example again and/or',
        'play around until you understand Promise.all',
        'enough to continue on to the exercises!',
      ].join('\n').blue);
    });
};

module.exports = {
  delay, // also used in tests
  logResolvedValues,
  filterValuesFromCollection,
  doMoreAsyncWorkWithFilteredValues,
};

// Dynamically export getValueA, getValueB, getValueC, getValueD
['A', 'B', 'C', 'D'].forEach((value) => {
  module.exports['getValue' + value] = () => {
    console.log(`Getting ${colors.yellow('value ' + value)} from ${colors.green('getValue' + value + '()...')}`);
    const timeToResolve = Math.random() * 4000 + 1000;
    const obj = {
      value,
      timeToResolve,
      shouldPassFilter: Math.random() > 0.5,
    };

    return delay(timeToResolve, obj)
      .then((data) => {
        console.log(`Got ${colors.yellow('value ' + data.value)} after ${data.timeToResolve}ms`);
        return data;
      });
  };
});

