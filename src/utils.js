const fs = require('fs');
const path = require('path');

// const camelCase = require('lodash.camelcase');
// const { flags } = require('@oclif/command');

// const { promisify } = require('util');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

async function tryFindUniqueName(fn, maxTries = 5) {
  try {
    return await fn();
  } catch (error) {
    if (maxTries > 0) {
      return tryFindUniqueName(fn, maxTries - 1);
    }
    throw error;
  }
}

async function createRandomDirectoryName(filepath) {
  // find a new unique-to-this-template version name
  const randomName = await tryFindUniqueName(() => {
    const randomName = uniqueNamesGenerator({ dictionaries: [colors, adjectives, animals] }); // big_red_donkey
    if (!fs.existsSync(path.join(filepath, randomName))) {
      return randomName;
    }
  });

  return randomName;
}

module.exports = {
  createRandomDirectoryName
};
