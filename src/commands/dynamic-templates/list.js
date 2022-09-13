const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const {
  handler,
  describe
} = require('../../list/command');

class DynamicTemplatesList extends BaseCommand {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage);

    this.showHeaders = true;
  }

  async run() {
    await super.run();

    if (!process.env.SENDGRID_API_KEY) {
      throw new TwilioCliError(
        'Make sure you have the environment variable SENDGRID_API_KEY set up with your Twilio SendGrid API key. ' +
        'Visit https://app.sendgrid.com/settings/api_keys to get an API key.'
      );
    }

    let { flags, args } = await this.parse(DynamicTemplatesList);

    const opts = Object.assign({}, flags, args);
    opts.path = process.cwd();
    opts.skipCredentials = true;

    const templates = await handler(opts);
    if (templates.length > 0) {
      this.output(templates, this.flags.properties, { showHeaders: this.showHeaders });
      this.showHeaders = false;
    }
  }
}

DynamicTemplatesList.description = describe;

// DynamicTemplatesList.flags = Object.assign(
//   {
//     properties: flags.string({
//       default: 'action, name, hasLocal, hasRemote, tid',
//       description:
//         'The event properties you would like to display (JSON output always shows all properties)'
//     })
//   },
//   { ...BaseCommand.flags }
// );

module.exports = DynamicTemplatesList;
