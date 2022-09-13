const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;

const {
  handler,
  describe
} = require('../../deploy/command');

class DynamicTemplatesDeploy extends BaseCommand {
  async run() {
    await super.run();

    if (!process.env.SENDGRID_API_KEY) {
      throw new TwilioCliError(
        'Make sure you have the environment variable SENDGRID_API_KEY set up with your Twilio SendGrid API key. ' +
        'Visit https://app.sendgrid.com/settings/api_keys to get an API key.'
      );
    }

    let { flags, args } = await this.parse(DynamicTemplatesDeploy);

    const opts = Object.assign({}, flags, args);
    opts.apikey =  process.env.SENDGRID_API_KEY;
    opts.path = process.cwd();
    opts.skipCredentials = true;

    return handler(opts);
  }
}

DynamicTemplatesDeploy.description = describe;

DynamicTemplatesDeploy.args = [];

// DynamicTemplatesDeploy.flags = Object.assign(
//   {},
//   { ...BaseCommand.flags }
// );

module.exports = DynamicTemplatesDeploy;
