const nock = require('nock');
const { expect } = require('@twilio/cli-test');
const TemplateVersion = require('../../../src/entities/remote/version');

const templateid = '12345';
const versionid = 'abcde';
const data = {};

describe('remote-version', () => {
  describe('fetch', () => {
    const mock = nock('https://api.sendgrid.com').get(`/v3/templates/${templateid}/versions/${versionid}`);
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await TemplateVersion.fetch(templateid, versionid);
      expect(result[1]).to.eql({ result: 'foo' });
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return TemplateVersion.fetch(templateid, versionid).catch(error => {
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
      return TemplateVersion.fetch(templateid, versionid).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });

  describe('create', () => {
    const mock = nock('https://api.sendgrid.com').post(`/v3/templates/${templateid}/versions`);
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await TemplateVersion.create(templateid, data);
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
      return TemplateVersion.create(templateid, data).catch(error => {
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
      return TemplateVersion.create(templateid, data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });

  describe('update', () => {
    const mock = nock('https://api.sendgrid.com').patch(`/v3/templates/${templateid}/versions/${versionid}`);
    let body = { result: 'foo' };

    it('ok', async () => {
      mock.reply(200, body);
      let result = await TemplateVersion.update(templateid, versionid, data);
      expect(result[1]).to.eql({ result: 'foo' });
    });
    it('notfound', async () => {
      mock.reply(404, function () {
        this.req.response.statusMessage = 'Not Found';
        return {
          status: 404,
          message: body
        };
      });
      return TemplateVersion.update(templateid, versionid, data).catch(error => {
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
      return TemplateVersion.update(templateid, versionid, data).catch(error => {
        expect(error instanceof Error);
        expect(error.code).to.eql(401);
      });
    });
  });
});
