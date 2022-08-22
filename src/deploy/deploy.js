const path = require('path');
const fs = require('fs');

const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { logger } = require('@twilio/cli-core/src/services/messaging/logging');

const TemplateConfiguration = require('../entities/local/templateconfig');
const VersionConfiguration = require('../entities/local/versionconfig');
const Template = require('../entities/remote/template');
const TemplateVersion = require('../entities/remote/version');
const { diffLocalAndRemoteVersions } = require('../entities/versions-diff');

async function deployDynamicTemplate(commandOptions) {
  const localtemplateconfig = await TemplateConfiguration.read();
  const localversionconfigs = await VersionConfiguration.list(commandOptions.path);
  
  if (localtemplateconfig.tid) {
    //console.log(`TID FOUND ${localtemplateconfig.tid}`);
    //probably add try/catch here since this could fail and we need to let the user know
    let remoteTemplate = await Template.fetch(localtemplateconfig.tid); //throws error of the remote template does not exist
    const versionDeploymentConfigurations = diffLocalAndRemoteVersions(remoteTemplate.versions, localversionconfigs);

    remoteTemplate = await Template.update(localtemplateconfig.tid, buildTemplateUpdateData(path.basename(commandOptions.path), localtemplateconfig));
    for(const versiondeploymentconfig of versionDeploymentConfigurations) {
      await deployTemplateVersion(localtemplateconfig.tid, versiondeploymentconfig);
    }
  } else {
    console.log(`TID NOT FOUND`);
    //no template id is found so consider this a new template and versions
    const remoteTemplate = await Template.create(buildTemplateCreationData(path.basename(commandOptions.path), localtemplateconfig));
    const versionDeploymentConfigurations = diffLocalAndRemoteVersions([], localversionconfigs);
    
    //update the template config with the newly created template ID
    localtemplateconfig.tid = remoteTemplate[1].id;
    console.log(`TID CREATED ${localtemplateconfig.tid}`);
    TemplateConfiguration.update('', localtemplateconfig);
    console.log(`TEMPLATE CONFDIGURATION SAVED`);

    for(const versiondeploymentconfig of versionDeploymentConfigurations) {
      console.log(`DEPLOYING VERSION TEMPLATE`);
      await deployTemplateVersion(localtemplateconfig.tid, versiondeploymentconfig);
    }
  }
  return;
}

function buildTemplateCreationData(templatename, localtemplateconfig) {
  return data = {
    name: templatename,
    generation: localtemplateconfig.generation
  }
}

function buildTemplateUpdateData(templatename, localtemplateconfig) {
  return data = {    
    name: templatename
  }
}

async function deployTemplateVersion(template_id, versiondeploymentconfig) {

  if (versiondeploymentconfig.action === 'CREATE') {
    var remoteVersion = await TemplateVersion.create(template_id, buildTemplateVersionCreationData(versiondeploymentconfig));
    versiondeploymentconfig.vid = remoteVersion.id;
    VersionConfiguration.update(versiondeploymentconfig.name, versiondeploymentconfig)
  } else if (versiondeploymentconfig.action === 'UPDATE') {
    var remoteVersion = await TemplateVersion.update(template_id, versiondeploymentconfig.vid, buildTemplateVersionUpdateData(versiondeploymentconfig));
    versiondeploymentconfig.vid = remoteVersion.id;
    VersionConfiguration.update(versiondeploymentconfig.name, versiondeploymentconfig)
  } else {

  }
}

function buildTemplateVersionCreationData(versiondeploymentconfig) {

  // let htmlContent = '';
  // const htmltemplate = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  // if (fs.existsSync(htmltemplate)) {
  //   htmlContent = fs.readFileSync(htmltemplate, {encoding:'utf8', flag:'r'});
  // }

  // let plainContent = '';
  // const plaintemplate = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  // if (fs.existsSync(plaintemplate)) {
  //   plainContent = fs.readFileSync(htmltemplate, {encoding:'utf8', flag:'r'});
  // }

  // return data = { 
  //   active: versiondeploymentconfig.version_config.config.active,
  //   name: versiondeploymentconfig.version_config.name,
  //   generate_plain_content: versiondeploymentconfig.version_config.config['generate-plain-content'],
  //   subject: versiondeploymentconfig.version_config.config.subject,
  //   html_content: htmlContent,
  //   plain_content: plainContent,
  // };
  let data = { 
    active: versiondeploymentconfig.version_config.config.active,
    name: versiondeploymentconfig.version_config.name,
    subject: versiondeploymentconfig.version_config.config.subject,
  }

  const htmltemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  const plainautogeneratepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\autogenerate.txt');
  const plaintemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\template.txt');
  const testdatapath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'test\\data.json');

  if (fs.existsSync(htmltemplatepath)) {
    data.html_content = fs.readFileSync(htmltemplatepath, {encoding:'utf8', flag:'r'});
  }

  if (fs.existsSync(plainautogeneratepath)) {
    data.generate_plain_content = true;
  } else if (fs.existsSync(plaintemplatepath)) {
    data.generate_plain_content = false;
    const plainContent = fs.readFileSync(plaintemplatepath, {encoding:'utf8', flag:'r'});
    data.plain_content = plainContent;
  }

  if (fs.existsSync(htmltemplatepath)) {
    data.test_data = fs.readFileSync(testdatapath, {encoding:'utf8', flag:'r'});
  }
  return data;
}

function buildTemplateVersionUpdateData(versiondeploymentconfig) {

  let data = { 
    active: versiondeploymentconfig.version_config.config.active,
    name: versiondeploymentconfig.version_config.name,
    subject: versiondeploymentconfig.version_config.config.subject,
  }

  const htmltemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'html\\template.html');
  const plainautogeneratepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\autogenerate.txt');
  const plaintemplatepath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'text\\template.txt');
  const testdatapath = path.join(process.cwd(), versiondeploymentconfig.version_config.name, 'test\\data.json');

  if (fs.existsSync(htmltemplatepath)) {
    data.html_content = fs.readFileSync(htmltemplatepath, {encoding:'utf8', flag:'r'});
  }

  if (fs.existsSync(plainautogeneratepath)) {
    data.generate_plain_content = true;
  } else if (fs.existsSync(plaintemplatepath)) {
    data.generate_plain_content = false;
    const plainContent = fs.readFileSync(plaintemplatepath, {encoding:'utf8', flag:'r'});
    data.plain_content = plainContent;
  }

  if (fs.existsSync(htmltemplatepath)) {
    data.test_data = fs.readFileSync(testdatapath, {encoding:'utf8', flag:'r'});
  }
  return data;
}

module.exports = deployDynamicTemplate;