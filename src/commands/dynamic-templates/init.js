const { Flags } = require('@oclif/core');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const {
  handler,
  cliInfo,
  describe
} = require('../../create/command');

class DynamicTemplatesInit extends BaseCommand {
  async run() {
    await super.run();

    if (!process.env.SENDGRID_API_KEY) {
      throw new TwilioCliError(
        'Make sure you have the environment variable SENDGRID_API_KEY set up with your Twilio SendGrid API key. ' +
        'Visit https://app.sendgrid.com/settings/api_keys to get an API key.'
      );
    }

    let { flags, args } = await this.parse(DynamicTemplatesInit);

    const opts = Object.assign({}, flags, args);
    opts.apikey =  process.env.SENDGRID_API_KEY;
    opts.path = process.cwd();
    opts.skipCredentials = true;

    return handler(opts);
  }
}

DynamicTemplatesInit.description = describe;

DynamicTemplatesInit.args = [
  {
    name: 'name',
    required: true,
    description:
      'The name for the transactional template'
  }
];

DynamicTemplatesInit.flags = Object.assign(
  {
    generation: Flags.enum({
      options: ['dynamic', 'legacy'],
      description: 'Defines the generation of the template',
      default: 'dynamic'
    })
  },
  cliInfo.options,
  { ...BaseCommand.flags }
);

module.exports = DynamicTemplatesInit;
