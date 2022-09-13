const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class TemplateVersion {
  static async fetch(templateId, versionId) {
    const request = {
      url: `/v3/templates/${templateId}/versions/${versionId}`,
      method: 'GET'
    };
    return client.request(request);
  }

  static async create(templateId, data) {
    const req = {
      url: `/v3/templates/${templateId}/versions`,
      method: 'POST',
      body: data
    };
    return client.request(req);
  }

  static async update(templateId, versionId, data) {
    const req = {
      url: `/v3/templates/${templateId}/versions/${versionId}`,
      method: 'PATCH',
      body: data
    };
    return client.request(req);
  }
};
