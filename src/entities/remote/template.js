const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Template {
  static async list() {
    let req = {
      url: '/v3/templates',
      method: 'GET',
      qs: {
        generations: 'legacy,dynamic',
        page_size: 200
      }
    };
    const response = await client.request(req);
    return response[1].result;
  }

  static async fetch(id) {
    let req = {
      url: `/v3/templates/${id}`,
      method: 'GET'
    };
    const response = await client.request(req);
    return response[1];
  }

  static async create(data) {
    const request = {
      url: '/v3/templates',
      method: 'POST',
      body: data
    };
    return client.request(request);
  }

  static async update(id, data) {
    const req = {
      url: `/v3/templates/${id}`,
      method: 'PATCH',
      body: data
    };
    const response = await client.request(req);
    return response[1];
  }
};
