const fs = require('fs');
const path = require('path');
//const { create } = require('../remote/template');
const { createFile } = require('../../io');

module.exports = class TemplateConfiguration {
  static filename = '.versionrc';

  static async list(filePath) {
  
    const localVersionConfigurations = [];
    const directories = fs.readdirSync(filePath, { withFileTypes: true }).filter(entry=>entry.isDirectory());
  
    for (const directory of directories) {
      let versionpath = path.join(directory.name, this.filename);
      if (fs.existsSync(versionpath)) { //versionrc found - this must be a version folder
        let buffer = fs.readFileSync(versionpath);
        let config = JSON.parse(buffer);
  
        localVersionConfigurations.push({
          name: directory.name,
          config: config
        });
      }
    }
    return localVersionConfigurations;
  }

  static async create(filepath, config) {
    return await this.update(filepath, config);
  }

  static async update(filepath, config) {
    const configpath = path.join(filepath, this.filename);
    const content = JSON.stringify({
      vid: config.vid,
      active: false,
      subject:'',
      'last-update': new Date()
    },  function(k, v) { return v === undefined ? '' : v; });

    return createFile(configpath, content);
  }
}