// const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
// const { TwilioCliError } = require('@twilio/cli-core').services.error;

// const {
//   handler,
//   cliInfo,
//   describe,
// } = require('../../delete/command')

// const {
//   convertYargsOptionsToOclifFlags,
//   normalizeFlags,
// } = require('../../utils');

class DynamicTemplatesDelete extends BaseCommand {
  async run() {
    await super.run();

    //     if (!process.env.SENDGRID_API_KEY) {
    //       throw new TwilioCliError(
    //         'Make sure you have the environment variable SENDGRID_API_KEY set up with your Twilio SendGrid API key. ' +
    //         'Visit https://app.sendgrid.com/settings/api_keys to get an API key.',
    //       );
    //     }

    //     let { flags, args } = this.parse(DynamicTemplatesInit);
    //     flags = normalizeFlags(flags);

    //     const opts = Object.assign({}, flags, args);
    //     opts.api_key =  process.env.SENDGRID_API_KEY;
    //     opts.path = process.cwd();
    //     opts.skipCredentials = true;

    //     return handler(opts);
  }
}

// DynamicTemplatesDelete.description = describe;

// DynamicTemplatesDelete.args = [
//   {
//     name:'name',
//     required:true,
//     description:
//       'The name for the transactional template',
//   },
// ];

// DynamicTemplatesDelete.flags = Object.assign(
//   {},
//   convertYargsOptionsToOclifFlags(cliInfo.options),
//   {...BaseCommand.flags},
// );

module.exports = DynamicTemplatesDelete;
