const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
// const { promisify } = require('util');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

// const mkdir = promisify(fs.mkdir);
// const writeFile = promisify(fs.writeFile);
// const readdir = promisify(fs.readdir);
// const copyFile = promisify(fs.copyFile);
// const { COPYFILE_EXCL } = fs.constants;
// const stat = promisify(fs.stat);

function createDirectory(pathName, dirName) {
  return fsp.mkdir(path.join(pathName, dirName));
}

async function createFile(fullPath, content) {
  return fsp.writeFile(fullPath, content, { flag: 'wx' });
}

// function copyRecursively(src, dest) {
//   return fsp.readdir(src).then(children => {
//     return Promise.all(
//       children.map(child =>
//         stat(path.join(src, child)).then(stats => {
//           if (stats.isDirectory()) {
//             return fsp.mkdir(path.join(dest, child)).then(() =>
//               copyRecursively(path.join(src, child), path.join(dest, child))
//             );
//           }
//           return copyFile(
//             path.join(src, child),
//             path.join(dest, child),
//             COPYFILE_EXCL
//           );
//         })
//       )
//     );
//   });
// }

function createTemplateConfigFile(pathName, config) {
  const fullPath = path.join(pathName, '.templaterc');
  const content = JSON.stringify({
    tid: '',
    generation: config.generation
  });
  return fsp.createFile(fullPath, content);
}

function createVersionConfigFile(pathName) {
  const fullPath = path.join(pathName, '.versionrc');
  const content = JSON.stringify({
    vid: '{{TO-BE-CREATED}}',
    active: false,
    'generate-plain-content': false,
    subject: '',
    'test-data': ''
  });
  return fsp.createFile(fullPath, content);
}

function createTemplateDeploymentConfigFile() {
}

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

async function createTemplateVersionFileStructure(pathName) {
  // find a new unique-to-this-template version name
  const randomName = await tryFindUniqueName(() => {
    const randomName = uniqueNamesGenerator({ dictionaries: [colors, adjectives, animals] }); // big_red_donkey
    if (!fsp.existsSync('./{randomName}')) {
      return randomName;
    }
    throw new Error('Error finding unique name');
  });

  await createDirectory(pathName, randomName);

  pathName = path.join(pathName, randomName);
  await createVersionConfigFile(pathName);
  await createDirectory(pathName, 'html');
  await createFile(path.join(pathName, 'html', 'template.html'), '<html></html>');
  await createDirectory(pathName, 'text');
  await createFile(path.join(pathName, 'text', 'template.txt'), '');
}

module.exports = {
  createDirectory,
  createTemplateConfigFile,
  createTemplateVersionFileStructure,
  createTemplateDeploymentConfigFile
};
