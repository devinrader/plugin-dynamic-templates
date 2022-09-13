const fs = require('fs');
const path = require('path');

const { createFile } = require('../../io');

module.exports = class TemplateConfiguration {
  static filename = '.templaterc';

  static async list(filepath = '') {
    if (!filepath) {
      filepath = process.cwd();
    }

    const localTemplateConfigurations = [];
    const entries = fs.readdirSync(filepath, { withFileTypes: true });
    console.log(`Foo ${filepath}`);
    console.log(`Foo ${entries}`);
    const directories = entries.filter(entry => entry.isDirectory());

    for (const directory of directories) {
      let templatepath = path.join(directory.name);// , TemplateConfiguration.filename);
      if (fs.existsSync(templatepath)) { // versionrc found - this must be a version folder
        let templateConfiguration = await this.read(templatepath);

        localTemplateConfigurations.push(templateConfiguration);
      }
    }
    return localTemplateConfigurations;
  }

  static async read(filepath = '') {
    if (!filepath) {
      filepath = process.cwd();
    }
    const configpath = path.join(filepath, TemplateConfiguration.filename);

    if (!fs.existsSync(configpath)) {
      throw new Error(
        `${this.filename} not found in path ${filepath}`
      );
    }

    const buffer = fs.readFileSync(configpath);
    const config = JSON.parse(buffer);
    return config;
  }

  static async create(filepath, config) {
    return this.update(filepath, config);
  }

  static async update(config, filepath = '') {
    if (!filepath) {
      filepath = process.cwd();
    }

    const configpath = path.join(filepath, TemplateConfiguration.filename);
    const content = JSON.stringify({
      tid: config.tid,
      generation: config.generation,
      'last-update': new Date()
    },  function (k, v) {
      return v === undefined ? '' : v;
    });

    return createFile(configpath, content);
  }
};
