const fs = require('fs');
const path = require('path');

//const { create, update } = require('../remote/template');
const { createFile } = require('../../io');

module.exports = class TemplateConfiguration {
  static filename = '.templaterc';

  static async list(filepath="") {
    if (!filepath) { 
      filepath = process.cwd();
    }

    const localTemplateConfigurations = [];
    const directories = fs.readdirSync(filepath, { withFileTypes: true }).filter(entry=>entry.isDirectory());
    for (const directory of directories) {
      let versionpath = path.join(directory.name, this.filename);
      if (fs.existsSync(versionpath)) { //versionrc found - this must be a version folder
        let templateConfiguration = Template.read(versionpath);
  
        localTemplateConfigurations.push(templateConfiguration);
      }
    }
    return localTemplateConfigurations;
  }

  static async read(filepath="") {
    if (!filepath) { 
      filepath = process.cwd();
    }
    const configpath = path.join(filepath, this.filename);

    if (!fs.existsSync(configpath)) {
      throw new Error(
        `${this.filename} not found in path ${filepath}`,
      );
    }
  
    const buffer = fs.readFileSync(configpath);
    const config = JSON.parse(buffer);
    return config;
  }

  static async create(filepath, config) {
    return await this.update(filepath, config);
  }

  static async update(filepath="", config) {
    if (!filepath) { 
      filepath = process.cwd();
    }

    const configpath = path.join(filepath, this.filename);
    const content = JSON.stringify({
        tid: config.tid,
        generation: config.generation,
        'last-update': new Date()
    },  function(k, v) { return v === undefined ? '' : v; });

    return createFile(configpath, content);
  }
}