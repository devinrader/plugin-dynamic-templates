const nock = require('nock');
const { expect } = require('@twilio/cli-test');
const Template = require('../../../src/entities/remote/template');

const id = '12345';
const data = {};

describe('remote-template', () => {
  describe('list', () => {
    const mock = nock('https://api.sendgrid.com').get('/v3/templates?generations=legacy,dynamic&page_size=200');
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await Template.list();
      expect(result).to.eql('foo');
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return Template.list().catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(404);
      });
    });
    it('unauthorized', async () => {
      mock.reply(401, function () {
        this.req.response.statusMessage = 'Unauthorized';
        return {
          status: 401,
          message: body
        };
      });
      return Template.list().catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });

  describe('fetch', () => {
    const mock = nock('https://api.sendgrid.com').get(`/v3/templates/${id}`);
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await Template.fetch(id);
      expect(result).to.eql({ result: 'foo' });
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return Template.fetch(id).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(404);
      });
    });
    it('unauthorized', async () => {
      mock.reply(401, function () {
        this.req.response.statusMessage = 'Unauthorized';
        return {
          status: 401,
          message: body
        };
      });
      return Template.fetch(id).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });

  describe('create', () => {
    const mock = nock('https://api.sendgrid.com').post('/v3/templates');
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await Template.create(data);
      expect(result[1]).to.eql(body);
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return Template.create(data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(404);
      });
    });
    it('unauthorized', async () => {
      mock.reply(401, function () {
        this.req.response.statusMessage = 'Unauthorized';
        return {
          status: 401,
          message: body
        };
      });
      return Template.create(data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });

  describe('update', () => {
    const mock = nock('https://api.sendgrid.com').patch(`/v3/templates/${id}`);
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await Template.update(id, data);
      expect(result).to.eql({ result: 'foo' });
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return Template.update(id, data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(404);
      });
    });
    it('unauthorized', async () => {
      mock.reply(401, function () {
        this.req.response.statusMessage = 'Unauthorized';
        return {
          status: 401,
          message: body
        };
      });
      return Template.update(id, data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });
});
