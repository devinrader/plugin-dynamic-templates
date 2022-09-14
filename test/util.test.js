const { tryFindUniqueName, createRandomDirectoryName } = require('../src/util');

describe('create-directory', () => {
  afterEach(() => {
    sinon.restore();
  });
});