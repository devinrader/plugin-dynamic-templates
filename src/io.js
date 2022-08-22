const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const { COPYFILE_EXCL } = fs.constants;
const stat = promisify(fs.stat);

function createDirectory(pathName, dirName) {
  return mkdir(path.join(pathName, dirName));
}
  
function createFile(fullPath, content) {
  return writeFile(fullPath, content, { flag: 'w' });
}
  
function copyRecursively(src, dest) {
  return readdir(src).then((children) => {
    return Promise.all(
    children.map((child) =>
        stat(path.join(src, child)).then((stats) => {
        if (stats.isDirectory()) {
            return mkdir(path.join(dest, child)).then(() =>
            copyRecursively(path.join(src, child), path.join(dest, child))
            );
        }
        return copyFile(
            path.join(src, child),
            path.join(dest, child),
            COPYFILE_EXCL
        );
        })
    )
    );
  });
}

module.exports = {
    createDirectory,
    createFile,
    copyRecursively,
  };
  