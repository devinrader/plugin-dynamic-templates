const fs = require('fs');
const path = require('path');

function createDirectory(pathName, dirName) {
  return fs.mkdirSync(path.join(pathName, dirName));
}

function createFile(fullPath, content) {
  return fs.writeFileSync(fullPath, content, { flag: 'w' });
}

module.exports = {
  createDirectory,
  createFile
};

