const fs = require('fs');
const path = require('path');

const camelCase = require('lodash.camelcase');
const { flags } = require('@oclif/command');

const { promisify } = require('util');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function convertYargsOptionsToOclifFlags(options) {
  const flagsResult = Object.keys(options).reduce((result, name) => {
    const opt = options[name];
    const flag = {
      description: opt.describe,
      default: opt.default,
      hidden: opt.hidden,
    };

    if (typeof opt.default !== 'undefined') {
      flag.default = opt.default;

      if (opt.type === 'boolean') {
        if (flag.default === true) {
          flag.allowNo = true;
        }
      }
    }

    if (opt.type === 'number') {
      opt.type = 'string';
      flag.parse = input => parseFloat(input);
    }

    if (opt.alias) {
      flag.char = opt.alias;
    }

    if (opt.requiresArg) {
      flag.required = opt.requiresArg;
    }

    result[name] = flags[opt.type](flag);
    return result;
  }, {});
  return flagsResult;
}

function normalizeFlags(flags) {
  const result = Object.keys(flags).reduce((current, name) => {
    if (name.includes('-')) {
      const normalizedName = camelCase(name);
      current[normalizedName] = flags[name];
    }
    return current;
  }, flags);
  const [, command, ...args] = process.argv;
  result.$0 = path.basename(command);
  result._ = args;
  return result;
}

function createExternalCliOptions(flags, twilioClient) {
  const profile = flags.profile;
  return {
    username: twilioClient.username,
    password: twilioClient.password,
    accountSid: twilioClient.accountSid,
    profile,
    logLevel: undefined,
    outputFormat: undefined,
  };
}

function getRegionAndEdge(flags, clientCommand) {
  const edge =
    flags.edge || process.env.TWILIO_EDGE || clientCommand.userConfig.edge;
  const region = flags.region || clientCommand.currentProfile.region;


  return { edge, region };
}

async function tryFindUniqueName(fn, maxTries=5) {
  try {
    return await fn();
  } catch (e) {
    if (maxTries > 0) {
      return tryFindUniqueName(fn, maxTries-1);
    }
    throw e;
  }
}

async function createRandomDirectoryName(filepath) {
  //find a new unique-to-this-template version name
  const randomName = await tryFindUniqueName(()=> {
    const randomName = uniqueNamesGenerator({ dictionaries: [colors, adjectives, animals] }); // big_red_donkey
    if (!fs.existsSync(path.join(filepath, randomName))) {
      return randomName;
    } else {
      throw e;
    }
  });

  return randomName;
}

module.exports = {
  convertYargsOptionsToOclifFlags,
  normalizeFlags,
  createExternalCliOptions,
  getRegionAndEdge,
  createRandomDirectoryName
};