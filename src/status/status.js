// const { TwilioCliError } = require('@twilio/cli-core').services.error;
// const { logger } = require('@twilio/cli-core/src/services/messaging/logging');
const { diffLocalAndRemoteTemplate } = require('../entities/templates-diff');
const { diffLocalAndRemoteVersions } = require('../entities/versions-diff');

const TemplateConfiguration = require('../entities/local/templateconfig');
const VersionConfiguration = require('../entities/local/versionconfig');
const Template = require('../entities/remote/template');

async function DynamicTemplateStatus(config) {
  const localtemplateconfig = await TemplateConfiguration.read();
  const localversionconfigs = await VersionConfiguration.list(config.path);
  let remoteTemplate = null;

  if (localtemplateconfig.tid) {
    // probably add try/catch here since this could fail and we need to let the user know
    remoteTemplate = await Template.fetch(localtemplateconfig.tid); // throws error of the remote template does not exist
    const templateDeploymentConfiguration = {
      template: diffLocalAndRemoteTemplate(remoteTemplate, localtemplateconfig),
      versions: diffLocalAndRemoteVersions(remoteTemplate.versions, localversionconfigs)
    };
    return templateDeploymentConfiguration;
  }

  // no template id is found so consider this a new template and versions
  const templateDeploymentConfiguration = {
    template: diffLocalAndRemoteTemplate(remoteTemplate, localtemplateconfig),
    versions: diffLocalAndRemoteVersions([], localversionconfigs)
  };
  return templateDeploymentConfiguration;
}

module.exports = DynamicTemplateStatus;
