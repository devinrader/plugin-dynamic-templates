//const { promisify } = require('util');
const path = require('path');

const { promptForTemplateName } = require('./create/prompt');
const validateTemplateName = require('./create/validate-template-name');
const createGitignore = require('./create/create-gitignore');
const { createDirectory, createFile } = require('../io');
const { createRandomDirectoryName } = require('../utils');

const TemplateConfiguration = require('../entities/local/templateconfig');
const VersionConfiguration = require('../entities/local/versionconfig');

async function createDynamicTemplate(config) {
  const { valid, errors } = validateTemplateName(config.name);
  if (!valid) {
    const { name } = await promptForTemplateName(errors);
    config.name = name;
  }

  try {
    await createDirectory(config.path, config.name);
  } catch (e) {
    if (e.code === 'EEXIST') {
        console.log(`A directory called '${config.name}' already exists. Please create your function in a new directory.`);
    } else if (e.code === 'EACCES') {
        console.log(`You do not have permission to create files or directories in the path '${config.path}'.`)
    } else {
      console.log(e.message);
    }
    process.exitCode = 1;
    return;
  }

  const templateDir = path.join(config.path, config.name);
  const versionName = await createRandomDirectoryName(templateDir)
  const versionDir = path.join(templateDir, versionName);

  try {
    await createDirectory(templateDir, versionName);
  } catch (e) {
    if (e.code === 'EEXIST') {
        console.log(`A directory called '${config.name}' already exists. Please create your function in a new directory.`);
    } else if (e.code === 'EACCES') {
        console.log(`You do not have permission to create files or directories in the path '${config.path}'.`)
    } else {
      console.log(e.message);
    }
    process.exitCode = 1;
    return;
  }
  // Scaffold project
  await TemplateConfiguration.create(templateDir, config);
  await VersionConfiguration.create(versionDir, config);
  await createDirectory(versionDir, 'html');
  await createFile(path.join(versionDir, 'html', 'template.html'), '<html></html>')
  await createDirectory(versionDir, 'text');
  await createFile(path.join(versionDir, 'text', 'template.txt'), '')
  await createDirectory(versionDir, 'test');
  await createFile(path.join(versionDir, 'test', 'data.json'), '')
  await createDirectory(versionDir, 'img');

  // Download .gitignore file from https://github.com/github/gitignore/
  try {
    await createGitignore(templateDir);
  } catch (err) {
    return;
  }
}

module.exports = createDynamicTemplate;