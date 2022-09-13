const fs = require('fs');
const { Dirent, constants } = require('fs');
const path = require('path');
const sinon = require('sinon');
const { expect } = require('@twilio/cli-test');
const TemplateConfiguration = require('../../../src/entities/local/templateconfig');

// const id = '12345';
// const data = {};

describe('local-template', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('read', () => {
    it('ok-default-directory-config-found', async () => {
      const configpath = path.join(process.cwd(), '.templaterc');
      const content = '{"tid":"","generation":"dynamic","last-update":"2022-09-07T17:06:13.360Z"}';

      sinon.stub(fs, 'existsSync').withArgs(configpath).returns(true);
      sinon
        .stub(fs, 'readFileSync')
        .withArgs(configpath)
        .returns(content);

      let result = await TemplateConfiguration.read();
      expect(result).to.eql(JSON.parse(content));
    });

    it('ok-directory-config-found', async () => {
      const configpath = 'C:\\foo';
      const content = '{"tid":"","generation":"dynamic","last-update":"2022-09-07T17:06:13.360Z"}';

      sinon.stub(fs, 'existsSync').withArgs(path.join(configpath, '.templaterc')).returns(true);
      sinon
        .stub(fs, 'readFileSync')
        .withArgs(path.join(configpath, '.templaterc'))
        .returns(content);

      let result = await TemplateConfiguration.read(configpath);
      expect(result).to.eql(JSON.parse(content));
    });

    it('default-directory-config-not-found', async () => {
      const configpath = path.join(process.cwd(), '.templaterc');

      sinon.stub(fs, 'existsSync').withArgs(configpath).returns(false);

      return TemplateConfiguration.read().catch(error => {
        expect(error instanceof Error);
      });
    });

    it('directory-config-not-found', async () => {
      const configpath = 'C:\\foo';

      sinon.stub(fs, 'existsSync').withArgs(path.join(configpath, '.templaterc')).returns(false);

      return TemplateConfiguration.read(path.join(configpath, '.templaterc')).catch(error => {
        expect(error instanceof Error);
      });
    });
  });

  describe('list', () => {
    it('default-no-directories-found', async () => {
      sinon.stub(fs, 'readdirSync').returns([]);

      let result = await TemplateConfiguration.list();
      expect(result).to.eql([]);
    });

    it('default-no-configurations-found', async () => {
      const configpath = 'c:\\foo';
      const directory = new Dirent('directory', constants.UV_DIRENT_DIR);

      sinon.stub(fs, 'readdirSync').returns([directory]);
      sinon.stub(fs, 'existsSync').withArgs(path.join(configpath, 'directory', '.templaterc')).returns(false);

      let result = await TemplateConfiguration.list();
      expect(result).to.eql([]);
    });

    it('default-single-configuration-found', async () => {
      const content = '{"tid":"","generation":"dynamic","last-update":"2022-09-07T17:06:13.360Z"}';
      const directory = new Dirent('directory', constants.UV_DIRENT_DIR);

      sinon.stub(fs, 'readdirSync').returns([directory]);
      sinon.stub(fs, 'existsSync').returns(true);
      sinon
        .stub(fs, 'readFileSync')
        .withArgs(path.join('directory', '.templaterc'))
        .returns(content);

      let result = await TemplateConfiguration.list();
      expect(result).to.eql([JSON.parse(content)]);
    });
  });

  describe('create', () => {
    it('ok-default-null', async () => {
      const config = JSON.parse('{"tid":"","generation":"dynamic","last-update":"2022-09-07T17:06:13.360Z"}');
      sinon.stub(fs, 'writeFileSync');

      let result = await TemplateConfiguration.create(config);
      expect(result).to.eql(undefined);
    });
  });

  describe('update', () => {
    it('ok-default-null', async () => {
      const config = JSON.parse('{"tid":"faketid","generation":"dynamic","last-update":"2022-09-07T17:06:13.360Z"}');
      sinon.stub(fs, 'writeFileSync');

      let result = await TemplateConfiguration.update(config);
      expect(result).to.eql(undefined);
    });
  });
});
