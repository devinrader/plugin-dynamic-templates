const path = require('path');
const fs = require('fs');

// const { TwilioCliError } = require('@twilio/cli-core').services.error;
// const { logger } = require('@twilio/cli-core/src/services/messaging/logging');

const TemplateConfiguration = require('../entities/local/templateconfig');
const VersionConfiguration = require('../entities/local/versionconfig');
const Template = require('../entities/remote/template');
const TemplateVersion = require('../entities/remote/version');
const { diffLocalAndRemoteVersions } = require('../entities/versions-diff');

async function deployDynamicTemplate(commandOptions) {
  const localtemplateconfig = await TemplateConfiguration.read();
  const localversionconfigs = await VersionConfiguration.list(commandOptions.path);

  if (localtemplateconfig.tid) {
    // probably add try/catch here since this could fail and we need to let the user know
    let remoteTemplate = await Template.fetch(localtemplateconfig.tid); // throws error of the remote template does not exist
    const versionDeploymentConfigurations = diffLocalAndRemoteVersions(remoteTemplate.versions, localversionconfigs);

    remoteTemplate = await Template.update(localtemplateconfig.tid, buildTemplateUpdateData(path.basename(commandOptions.path), localtemplateconfig));
    const results = [];
    for (const versiondeploymentconfig of versionDeploymentConfigurations) {
      results.push(deployTemplateVersion(localtemplateconfig.tid, versiondeploymentconfig));
    }
    await Promise.all(results);
  } else {
    // no template id is found so consider this a new template and versions
    const remoteTemplate = await Template.create(buildTemplateCreationData(path.basename(commandOptions.path), localtemplateconfig));
    const versionDeploymentConfigurations = diffLocalAndRemoteVersions([], localversionconfigs);

    // update the template config with the newly created template ID
    localtemplateconfig.tid = remoteTemplate[1].id;
    TemplateConfiguration.update('', localtemplateconfig);

    const results = [];
    for (const versiondeploymentconfig of versionDeploymentConfigurations) {
      deployTemplateVersion(localtemplateconfig.tid, versiondeploymentconfig);
    }
    await Promise.all(results);
  }
}

function buildTemplateCreationData(templatename, localtemplateconfig) {
  const data = {
    name: templatename,
    generation: localtemplateconfig.generation
  };
  return data;
}

function buildTemplateUpdateData(templatename) {
  const data = {
    name: templatename
  };
  return data;
}

async function deployTemplateVersion(templateId, versiondeploymentconfig) {
  if (versiondeploymentconfig.action === 'CREATE') {
    let remoteVersion = await TemplateVersion.create(templateId, await buildTemplateVersionCreateRequestData(versiondeploymentconfig));
    versiondeploymentconfig.vid = remoteVersion.id;
    VersionConfiguration.update(versiondeploymentconfig.name, versiondeploymentconfig);
  } else if (versiondeploymentconfig.action === 'UPDATE') {
    let remoteVersion = await TemplateVersion.update(templateId, versiondeploymentconfig.vid, await buildTemplateVersionUpdateRequestData(versiondeploymentconfig));
    versiondeploymentconfig.vid = remoteVersion.id;
    VersionConfiguration.update(versiondeploymentconfig.name, versiondeploymentconfig);
  } else {

  }
}

async function buildTemplateVersionCreateRequestData(versiondeploymentconfig) {
  let data = {
    active: versiondeploymentconfig.version_config.config.active,
    name: versiondeploymentconfig.version_config.name,
    subject: versiondeploymentconfig.version_config.config.subject
  };

  const htmltemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  const plainautogeneratepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\autogenerate.txt');
  const plaintemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\template.txt');
  const testdatapath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'test\\data.json');

  if (fs.existsSync(htmltemplatepath)) {
    data.htmlContent = fs.readFileSync(htmltemplatepath, { encoding: 'utf8', flag: 'r' });
  }

  if (fs.existsSync(plainautogeneratepath)) {
    data.generatePlainContent = true;
  } else if (fs.existsSync(plaintemplatepath)) {
    data.generatePlainContent = false;
    const plainContent = fs.readFileSync(plaintemplatepath, { encoding: 'utf8', flag: 'r' });
    data.plainContent = plainContent;
  }

  if (fs.existsSync(htmltemplatepath)) {
    data.testData = fs.readFileSync(testdatapath, { encoding: 'utf8', flag: 'r' });
  }
  return data;
}

async function buildTemplateVersionUpdateRequestData(versiondeploymentconfig) {
  let data = {
    active: versiondeploymentconfig.version_config.config.active,
    name: versiondeploymentconfig.version_config.name,
    subject: versiondeploymentconfig.version_config.config.subject
  };

  const htmltemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  const plainautogeneratepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\autogenerate.txt');
  const plaintemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\template.txt');
  const testdatapath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'test\\data.json');

  if (fs.existsSync(htmltemplatepath)) {
    data.htmlContent = fs.readFileSync(htmltemplatepath, { encoding: 'utf8', flag: 'r' });
  }

  if (fs.existsSync(plainautogeneratepath)) {
    data.generatePlainContent = true;
  } else if (fs.existsSync(plaintemplatepath)) {
    data.generatePlainContent = false;
    const plainContent = fs.readFileSync(plaintemplatepath, { encoding: 'utf8', flag: 'r' });
    data.plainContent = plainContent;
  }

  if (fs.existsSync(htmltemplatepath)) {
    data.testData = fs.readFileSync(testdatapath, { encoding: 'utf8', flag: 'r' });
  }
  return data;
}

module.exports = deployDynamicTemplate;
