const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Template {
  static async list() {
    let req = {
      url: `/v3/templates`,
      method: 'GET',
      qs: { 
        generations:'legacy,dynamic',
        page_size: 200 
      }
    }
    try {
      const response = await client.request(req);
      return response[1].result;
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  static async fetch(id) {
    let req = {
      url: `/v3/templates/${id}`,
      method: 'GET',
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

  static async create(data) {
    const request = {
    url: `/v3/templates`,
      method: 'POST',
      body: data
    }
    return client.request(request);
  }

  static async update(id, data) {
    const req = {
      url: `/v3/templates/${id}`,
      method: 'PATCH',
      body: data
    }
    
    try {
      const response = await client.request(req);
      console.log(response[0].statusCode)
      return response[1];
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }

  }
}