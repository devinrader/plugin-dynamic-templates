const path = require('path');

const { diffLocalAndRemoteTemplates } = require('../entities/templates-diff');

const TemplateConfiguration = require('../entities/local/templateconfig');
const Template = require('../entities/remote/template');

async function listDynamicTemplate(config) {
    const remoteTemplates = await Template.list();
    const localTemplates = await TemplateConfiguration.list();
    return diffLocalAndRemoteTemplates(remoteTemplates, localTemplates);
}

module.exports = listDynamicTemplate;