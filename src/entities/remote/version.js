const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class TemplateVersion {
  static async fetch(template_id, version_id) {
    const request = {
      url: `/v3/templates/${template_id}/versions/${version_id}`,
      method: 'GET',
      }
      return await sendGridClient.request(request);
  }

  static async create(template_id, data) {
    const req = {
      url: `/v3/templates/${template_id}/versions`,
      method: 'POST',
      body: data
    }
    try {
      const response = await client.request(req);
      return response[1];
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  static async update(template_id, version_id, data) {
    const req = {
      url: `/v3/templates/${template_id}/versions/${version_id}`,
      method: 'PATCH',
      body: data
    }
    try {
      const response = await client.request(req);
      return response[1];
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}